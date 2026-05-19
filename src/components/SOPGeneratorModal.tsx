import React, { useState, useEffect } from 'react';
import type { Category } from '../lib/mockData';
import { generateAIsop, generateAIsopReal } from '../lib/ai';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { Sparkles, X, Check, Copy, FileText, Loader, BarChart2, Video, Search, UserPlus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SOPGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onSopCreated: () => void;
}

const mockContexts: Record<string, string> = {
  'reporting-mensuel': "Client: Ecocup (Gobelets personnalisés réutilisables). Budget global: 15 000€/mois. Le client souhaite surveiller le blended ROAS et la part de budget allouée à TikTok Ads. Recommandation IA : Augmenter de 15% le budget Meta Ads suite au lancement du catalogue été.",
  'brief-crea-meta': "Client: Motoblouz. Produit: Casque modulable de milieu de gamme. USP: Double homologation P/J et insonorisation renforcée. Ton: Dynamique et passionné. Cible: Commuteurs et motards touring.",
  'strategie-seo': "Client: BioShop. Objectif: Optimisation de la collection 'Savons solides bio'. Cible: Acheteurs éco-sensibles. Mot-clé principal: 'savon bio artisanal'.",
  'onboarding-client': "Client: L'Atelier Français. Objectif: Accès Shopify en lecture seule, validation du setup pixel Meta par GTM et programmation de la réunion de cadrage.",
};

export const SOPGeneratorModal: React.FC<SOPGeneratorModalProps> = ({
  isOpen,
  onClose,
  categories,
  onSopCreated
}) => {
  const { user } = useAuth();
  
  const [selectedTemplate, setSelectedTemplate] = useState('reporting-mensuel');
  const [additionalContext, setAdditionalContext] = useState('');
  
  const [generating, setGenerating] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<string | null>(null);
  
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [saveTitle, setSaveTitle] = useState('');
  const [saveCategoryId, setSaveCategoryId] = useState('');

  const templatesList = [
    { id: 'reporting-mensuel', name: 'Reporting mensuel', desc: 'Rapports et analyses de performance mensuels.', icon: BarChart2 },
    { id: 'brief-crea-meta', name: 'Brief créa Meta', desc: 'Brief créateur UGC et consignes créatives Facebook Ads.', icon: Video },
    { id: 'strategie-seo', name: 'Stratégie SEO', desc: 'Audits techniques et planning de contenu SEO.', icon: Search },
    { id: 'onboarding-client', name: 'Onboarding client', desc: 'Process d\'intégration technique et de kickoff de client.', icon: UserPlus },
  ];

  // Set default save values when template changes
  useEffect(() => {
    setGeneratedContent(null);
    setSaved(false);
    setSaveTitle('');
    // Try to auto-select a matching category
    let matchedCat = categories[0]?.id || '';
    if (selectedTemplate === 'reporting-mensuel') {
      const cat = categories.find(c => c.slug === 'reporting');
      if (cat) matchedCat = cat.id;
    } else if (selectedTemplate === 'brief-crea-meta') {
      const cat = categories.find(c => c.slug === 'acquisition');
      if (cat) matchedCat = cat.id;
    } else if (selectedTemplate === 'strategie-seo') {
      const cat = categories.find(c => c.slug === 'seo');
      if (cat) matchedCat = cat.id;
    } else if (selectedTemplate === 'onboarding-client') {
      const cat = categories.find(c => c.slug === 'onboarding');
      if (cat) matchedCat = cat.id;
    }
    setSaveCategoryId(matchedCat);
  }, [selectedTemplate, categories]);

  const handleGenerate = async () => {
    setGenerating(true);
    setGeneratedContent(null);
    setSaved(false);
    
    // Simulate AI model latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    const result = await generateAIsopReal(selectedTemplate, additionalContext);
    setGeneratedContent(result);
    setGenerating(false);
    
    const templateObj = templatesList.find(t => t.id === selectedTemplate);
    setSaveTitle(`SOP ${templateObj?.name || 'Généré'} - IA`);
  };

  const handleCopy = () => {
    if (generatedContent) {
      navigator.clipboard.writeText(generatedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleSaveToKB = async () => {
    if (!generatedContent || !saveTitle || !saveCategoryId || !user) return;
    
    const category = categories.find(c => c.id === saveCategoryId);
    const tags = category ? [category.slug, 'ai-generated', 'structured'] : ['ai-generated', 'structured'];
    
    await db.sops.create({
      title: saveTitle,
      slug: '', // Auto-generated
      content: generatedContent,
      category_id: saveCategoryId,
      tags,
      author_id: user.id
    });
    
    setSaved(true);
    onSopCreated();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black"
        />

        {/* Modal Panel */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-4xl bg-surface-card border border-border-dark rounded-2xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-dark bg-secondary/10">
            <div className="flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-accent animate-pulse" />
              <h3 className="text-lg font-bold text-white">Générer un SOP avec IA</h3>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-secondary/40 transition-colors focus:outline-none"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="md:col-span-2 space-y-6">
              {/* Template Card Selection */}
              <div className="space-y-2">
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  1. Template de SOP
                </label>
                <div className="grid grid-cols-1 gap-2.5">
                  {templatesList.map((tpl) => {
                    const isSelected = selectedTemplate === tpl.id;
                    const IconComponent = tpl.icon;
                    return (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => setSelectedTemplate(tpl.id)}
                        className={`p-3 rounded-xl border text-left transition-all cursor-pointer focus:outline-none flex items-start gap-3 ${
                          isSelected
                            ? 'bg-accent/10 border-accent/60 shadow-lg shadow-accent/5'
                            : 'bg-secondary/10 border-border-dark hover:border-accent/30 hover:bg-secondary/20'
                        }`}
                      >
                        <div className={`p-2 rounded-lg flex-shrink-0 ${
                          isSelected ? 'bg-accent text-primary' : 'bg-secondary/40 text-text-secondary'
                        }`}>
                          <IconComponent className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-xs font-bold ${isSelected ? 'text-accent' : 'text-white'}`}>
                            {tpl.name}
                          </p>
                          <p className="text-[10px] text-text-muted mt-1 leading-relaxed line-clamp-2">
                            {tpl.desc}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Additional Context Field */}
              <div>
                <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                  2. Contexte additionnel
                </label>
                <textarea
                  value={additionalContext}
                  onChange={(e) => setAdditionalContext(e.target.value)}
                  placeholder="Renseignez le nom du client, les objectifs spécifiques, les contraintes, ou toute information utile pour l'IA..."
                  rows={4}
                  className="w-full px-3.5 py-3 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all resize-none"
                />
              </div>

              {/* Generate Trigger */}
              <button
                onClick={handleGenerate}
                disabled={generating}
                className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover disabled:opacity-40 disabled:hover:bg-accent disabled:cursor-not-allowed transition-all shadow-lg shadow-accent/15 cursor-pointer focus:outline-none flex items-center justify-center gap-2"
              >
                {generating ? (
                  <>
                    <Loader className="w-4 h-4 animate-spin" />
                    <span>Structure du SOP en cours...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Lancer la génération IA</span>
                  </>
                )}
              </button>
            </div>

            {/* Right Column: Preview and Save controls */}
            <div className="md:col-span-3 border border-border-dark rounded-xl bg-secondary/5 overflow-hidden flex flex-col min-h-[350px] md:min-h-0">
              <div className="px-4 py-2 border-b border-border-dark bg-secondary/20 flex items-center justify-between text-xs text-text-secondary font-mono">
                <span>preview_sop.md</span>
                {generatedContent && (
                  <button
                    onClick={handleCopy}
                    className="p-1 rounded hover:bg-secondary/40 text-text-secondary hover:text-white flex items-center gap-1 transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copié' : 'Copier'}</span>
                  </button>
                )}
              </div>

              <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-text-secondary leading-relaxed bg-[#060913] selection:bg-accent/30 selection:text-white">
                {generating && (
                  <div className="h-full flex flex-col items-center justify-center text-center space-y-3">
                    <Loader className="w-8 h-8 text-accent animate-spin" />
                    <p className="text-text-muted animate-pulse">
                      L'IA de Make Sense structure votre document (Objectif, Étapes, Outils, KPIs, Exemples)...
                    </p>
                  </div>
                )}

                {!generating && !generatedContent && (
                  <div className="space-y-4 text-left">
                    <div className="p-3 bg-accent/10 border border-accent/20 rounded-lg flex items-start gap-2.5">
                      <Sparkles className="w-4 h-4 text-accent mt-0.5 flex-shrink-0 animate-pulse" />
                      <div className="text-xs text-text-primary">
                        <span className="font-bold text-accent">💡 Aperçu du modèle :</span> Voici la structure type de la SOP pour le template <span className="font-bold">"{templatesList.find(t => t.id === selectedTemplate)?.name}"</span> pré-remplie avec des données simulées.
                      </div>
                    </div>
                    
                    <div className="border border-border-dark/60 bg-[#060913]/30 p-4 rounded-xl">
                      <pre className="whitespace-pre-wrap font-sans text-xs text-slate-400 select-none">
                        {generateAIsop(selectedTemplate, mockContexts[selectedTemplate] || "")}
                      </pre>
                    </div>
                  </div>
                )}

                {!generating && generatedContent && (
                  <pre className="whitespace-pre-wrap font-sans text-sm text-slate-100">{generatedContent}</pre>
                )}
              </div>

              {/* Save Panel if Generated */}
              {generatedContent && (
                <div className="p-4 border-t border-border-dark bg-secondary/20 space-y-3">
                  <h4 className="text-xs font-semibold text-text-primary uppercase tracking-wider">
                    Enregistrer comme SOP officielle
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[10px] text-text-muted mb-1 font-semibold uppercase">Titre du SOP</label>
                      <input
                        type="text"
                        value={saveTitle}
                        onChange={(e) => setSaveTitle(e.target.value)}
                        placeholder="Titre de la SOP"
                        className="w-full px-3 py-2 bg-secondary/30 border border-border-dark rounded-xl text-xs text-white placeholder-text-muted focus:border-accent focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-text-muted mb-1 font-semibold uppercase">Catégorie</label>
                      <select
                        value={saveCategoryId}
                        onChange={(e) => setSaveCategoryId(e.target.value)}
                        className="w-full px-3 py-2 bg-[#090D1A] border border-border-dark rounded-xl text-xs text-text-primary focus:border-accent focus:outline-none"
                      >
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={handleSaveToKB}
                    disabled={saved || !saveTitle || !saveCategoryId}
                    className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:bg-emerald-800 disabled:cursor-not-allowed text-primary font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {saved ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>SOP Enregistrée avec succès !</span>
                      </>
                    ) : (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>Enregistrer dans la base de connaissances</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
