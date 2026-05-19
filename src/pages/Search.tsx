import React, { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import type { SOP, Category } from '../lib/mockData';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { Search as SearchIcon, FileText, ChevronRight, Percent, Calendar, User, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { getVectorEmbedding, cosineSimilarity, SEMANTIC_DIMENSIONS } from '../lib/vectorSearch';

interface SearchResult {
  sop: SOP;
  score: number;
  snippet: string;
  concept?: string;
}

export const Search: React.FC = () => {
  const [sops, setSops] = useState<SOP[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({});
  
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  
  // Drawer state
  const [activeSop, setActiveSop] = useState<SOP | null>(null);

  useEffect(() => {
    const loadData = async () => {
      const allSops = await db.sops.list();
      const allCats = await db.categories.list();
      const allProfiles = await db.auth.getProfiles();
      
      setSops(allSops);
      setCategories(allCats);
      
      const profMap: Record<string, string> = {};
      allProfiles.forEach((p) => {
        profMap[p.id] = p.name;
      });
      setProfiles(profMap);
    };
    loadData();
  }, []);

  // Vector-based Semantic Search Algorithm
  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      return;
    }

    const calculated: SearchResult[] = [];
    const queryVec = getVectorEmbedding(query);

    sops.forEach((sop) => {
      const contentLower = sop.content.toLowerCase();
      
      const sopVec = sop.embedding || getVectorEmbedding(sop.title + " " + sop.content, sop.tags);
      const similarity = cosineSimilarity(queryVec, sopVec);
      
      // Filter out SOPs with low semantic correlation
      if (similarity > 0.05) {
        // Calculate similarity percentage
        const similarityPct = Math.round(similarity * 100);
        
        // Generate Highlighted Snippet based on search tokens if any
        let snippet = '';
        const searchTokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 1);
        let matchIdx = -1;
        let matchedToken = '';
        
        for (const token of searchTokens) {
          const idx = contentLower.indexOf(token);
          if (idx !== -1) {
            matchIdx = idx;
            matchedToken = token;
            break;
          }
        }
        
        if (matchIdx !== -1 && matchedToken) {
          const start = Math.max(0, matchIdx - 60);
          const end = Math.min(sop.content.length, matchIdx + 100);
          let rawSnippet = sop.content.slice(start, end);
          if (start > 0) rawSnippet = '...' + rawSnippet;
          if (end < sop.content.length) rawSnippet = rawSnippet + '...';
          
          snippet = highlightText(rawSnippet, searchTokens);
        } else {
          // Grab first 120 characters if no direct content token match
          snippet = sop.content.slice(0, 120) + '...';
        }

        // Find primary matched dimension
        let topDimIndex = -1;
        let maxVal = 0;
        
        // Find dimension where both query and SOP overlap
        for (let i = 0; i < queryVec.length; i++) {
          const overlap = queryVec[i] * sopVec[i];
          if (overlap > maxVal) {
            maxVal = overlap;
            topDimIndex = i;
          }
        }
        
        // Fallback to SOP's own top dimension if no overlap is pronounced
        if (topDimIndex === -1) {
          maxVal = 0;
          for (let i = 0; i < sopVec.length; i++) {
            if (sopVec[i] > maxVal) {
              maxVal = sopVec[i];
              topDimIndex = i;
            }
          }
        }

        const matchedConcept = topDimIndex !== -1 ? SEMANTIC_DIMENSIONS[topDimIndex] : undefined;

        calculated.push({
          sop,
          score: similarityPct,
          snippet,
          concept: matchedConcept
        });
      }
    });

    // Sort by cosine similarity descending
    calculated.sort((a, b) => b.score - a.score);
    setResults(calculated);
  }, [query, sops]);

  const escapeRegExp = (string: string) => {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  };

  const highlightText = (text: string, tokens: string[]) => {
    let highlighted = text;
    tokens.forEach((token) => {
      // Regex search case-insensitive, wrap in mark
      const regex = new RegExp(`(${escapeRegExp(token)})`, 'gi');
      highlighted = highlighted.replace(regex, '<mark class="bg-accent/30 text-accent font-semibold px-0.5 rounded">$1</mark>');
    });
    return highlighted;
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Recherche Avancée & Sémantique
        </h1>
        <p className="text-text-secondary text-sm md:text-base mt-1">
          Explorez l'ensemble des processus de l'agence via recherche vectorielle par similarité de cosinus.
        </p>
      </div>

      {/* Large Input Area */}
      <div className="glass-panel rounded-2xl p-6 md:p-8 space-y-4">
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-text-muted pointer-events-none">
            <SearchIcon className="w-6 h-6" />
          </span>
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Saisissez vos mots-clés... (ex: 'structuration Meta Ads CBO' ou 'flux Merchant')"
            className="w-full pl-12 pr-4 py-4 bg-[#090D1A] border border-border-dark rounded-xl text-lg text-white placeholder-text-muted focus:border-accent focus:outline-none transition-all focus:ring-1 focus:ring-accent"
            autoFocus
          />
        </div>
      </div>

      {/* Search results container */}
      <div className="space-y-4">
        {query.trim() && (
          <div className="flex items-center justify-between text-xs text-text-secondary px-2">
            <span>Résultats de recherche pour "{query}"</span>
            <span>{results.length} documents correspondants</span>
          </div>
        )}

        <div className="space-y-4">
          {results.map(({ sop, score, snippet, concept }) => {
            const cat = categories.find((c) => c.id === sop.category_id);
            
            const CONCEPT_LABELS: Record<string, string> = {
              'meta-ads': 'Meta Ads',
              'google-ads': 'Google Ads',
              'seo': 'SEO & Content',
              'crm-email': 'CRM & Retention',
              'ugc-creative': 'UGC & Script Video',
              'data-reporting': 'Data & Reporting',
              'client-onboarding': 'Onboarding Client',
              'technical': 'Technique & Tracking',
              'creative': 'Design & Créa',
              'strategy': 'Stratégie & Scale',
              'retention': 'Fidélisation client',
              'finance': 'Finance & Marges'
            };

            return (
              <motion.div
                key={sop.id}
                layoutId={`search-result-${sop.id}`}
                onClick={() => setActiveSop(sop)}
                className="glass-panel rounded-2xl p-5 hover:border-accent/40 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 text-left"
              >
                <div className="space-y-2 flex-1">
                  {/* Category and score */}
                  <div className="flex flex-wrap items-center gap-2">
                    {cat && (
                      <span className="text-xs bg-secondary/50 border border-border-dark text-text-secondary px-2.5 py-0.5 rounded-md font-semibold">
                        {cat.name}
                      </span>
                    )}

                    {concept && CONCEPT_LABELS[concept] && (
                      <span className="text-xs bg-accent-light/10 border border-accent/20 text-accent px-2.5 py-0.5 rounded-md font-semibold">
                        Concept : {CONCEPT_LABELS[concept]}
                      </span>
                    )}
                    
                    <div className="flex items-center gap-1 text-emerald-400 text-xs font-semibold bg-emerald-950/20 border border-emerald-900/30 px-2 py-0.5 rounded-md">
                      <Percent className="w-3 h-3" />
                      <span>Similarité : {score}%</span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-base font-bold text-white hover:text-accent transition-colors flex items-center gap-2">
                    <FileText className="w-4 h-4 text-text-muted" />
                    <span>{sop.title}</span>
                  </h3>

                  {/* Snippet text */}
                  <p
                    className="text-xs text-text-secondary font-mono leading-relaxed bg-[#060913]/40 p-2.5 rounded-lg border border-border-dark/40"
                    dangerouslySetInnerHTML={{ __html: snippet }}
                  />
                </div>

                <div className="flex items-center self-end md:self-auto text-text-secondary group-hover:text-accent transition-colors text-xs font-semibold gap-1">
                  <span>Consulter</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </motion.div>
            );
          })}

          {query.trim() && results.length === 0 && (
            <div className="glass-panel rounded-2xl p-12 text-center text-text-muted border border-dashed border-border-dark flex flex-col items-center">
              <SearchIcon className="w-12 h-12 mb-3 opacity-30" />
              <h4 className="text-white font-bold mb-1">Aucun résultat</h4>
              <p className="text-xs">
                Nous n'avons trouvé aucune SOP correspondant à votre recherche. Essayez des termes plus généraux.
              </p>
            </div>
          )}

          {!query.trim() && (
            <div className="glass-panel rounded-2xl p-12 text-center text-text-muted border border-dashed border-border-dark flex flex-col items-center">
              <SearchIcon className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">
                Saisissez des mots-clés ci-dessus pour lancer la recherche vectorielle sémantique.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Slide-over SOP detail view (copying KB detail view) */}
      <AnimatePresence>
        {activeSop && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveSop(null)}
              className="fixed inset-0 bg-black z-40"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 bottom-0 w-full max-w-2xl bg-surface-dark border-l border-border-dark z-50 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="px-6 py-4 border-b border-border-dark flex items-center justify-between bg-secondary/15">
                <span className="text-xs font-semibold text-text-secondary font-mono">
                  Résultat de Recherche
                </span>
                <button
                  onClick={() => setActiveSop(null)}
                  className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-secondary/40 transition-colors focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Content body */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
                <div>
                  <div className="flex flex-wrap gap-1.5">
                    {activeSop.tags.map((t, idx) => (
                      <span
                        key={idx}
                        className="text-xs bg-secondary/50 border border-border-dark text-text-secondary px-2.5 py-0.5 rounded-full"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-3">
                    {activeSop.title}
                  </h1>
                  <div className="flex flex-wrap gap-4 text-xs text-text-secondary border-b border-border-dark py-4 mt-1">
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-accent" />
                      <span>Mise à jour : {new Date(activeSop.updated_at).toLocaleDateString('fr-FR')}</span>
                    </span>
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-accent" />
                      <span>Auteur : {profiles[activeSop.author_id] || 'Expert Agence'}</span>
                    </span>
                  </div>
                </div>

                <div className="pb-8">
                  <MarkdownRenderer content={activeSop.content} />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};
