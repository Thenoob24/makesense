import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { SOP, Category } from '../lib/mockData';
import { MarkdownRenderer } from '../components/MarkdownRenderer';
import { SOPGeneratorModal } from '../components/SOPGeneratorModal';
import {
  Search,
  Sparkles,
  BookOpen,
  Plus,
  Calendar,
  User,
  Edit,
  Trash2,
  X,
  Save,
  Grid,
  TrendingUp,
  Mail,
  Video,
  UserPlus,
  BarChart2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Helper to map icon string to Lucide component
const CategoryIcon: React.FC<{ name: string; className?: string }> = ({ name, className }) => {
  const icons: Record<string, any> = {
    TrendingUp,
    Search,
    Mail,
    Video,
    BarChart2,
    UserPlus,
    BookOpen
  };
  const IconComponent = icons[name] || BookOpen;
  return <IconComponent className={className} />;
};

export const KnowledgeBase: React.FC = () => {
  const { user } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [sops, setSops] = useState<SOP[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [profiles, setProfiles] = useState<Record<string, string>>({}); // id -> name mapping
  
  const [selectedCategorySlug, setSelectedCategorySlug] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Drawer states
  const [activeSop, setActiveSop] = useState<SOP | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  // Modal states
  const [aiModalOpen, setAiModalOpen] = useState(false);

  // Form states (manually create/edit)
  const [formTitle, setFormTitle] = useState('');
  const [formContent, setFormContent] = useState('');
  const [formCategoryId, setFormCategoryId] = useState('');
  const [formTags, setFormTags] = useState('');

  // Fetch initial data
  const fetchData = async () => {
    const listSops = await db.sops.list();
    const listCategories = await db.categories.list();
    const listProfiles = await db.auth.getProfiles();
    
    setSops(listSops);
    setCategories(listCategories);
    
    const profMap: Record<string, string> = {};
    listProfiles.forEach((p) => {
      profMap[p.id] = p.name;
    });
    setProfiles(profMap);

    // Deep link validation (from dashboard search or shortcuts)
    const sopSlug = searchParams.get('sop');
    if (sopSlug) {
      const match = listSops.find((s) => s.slug === sopSlug);
      if (match) setActiveSop(match);
    }
  };

  useEffect(() => {
    fetchData();
  }, [searchParams]);

  // Handle opening AI Generator via URL query
  useEffect(() => {
    if (searchParams.get('generate') === 'true') {
      setAiModalOpen(true);
      // Remove query param without reload
      setSearchParams({});
    }
  }, [searchParams]);

  // Filters logic
  const filteredSops = sops.filter((sop) => {
    const matchesCategory =
      selectedCategorySlug === 'all' ||
      (() => {
        const cat = categories.find((c) => c.slug === selectedCategorySlug);
        return cat ? sop.category_id === cat.id : false;
      })();

    const matchesSearch =
      sop.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sop.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  const handleOpenSopDetail = (sop: SOP) => {
    setActiveSop(sop);
    setIsEditing(false);
    setIsCreating(false);
    setSearchParams({ sop: sop.slug });
  };

  const handleCloseDetail = () => {
    setActiveSop(null);
    setIsEditing(false);
    setIsCreating(false);
    setSearchParams({});
  };

  const handleStartEdit = () => {
    if (!activeSop) return;
    setFormTitle(activeSop.title);
    setFormContent(activeSop.content);
    setFormCategoryId(activeSop.category_id);
    setFormTags(activeSop.tags.join(', '));
    setIsEditing(true);
  };

  const handleStartCreate = () => {
    setFormTitle('');
    setFormContent(
      `# Nouvelle SOP\n\nIntroduction de la procédure...\n\n## 1. Première Étape\nDescription...\n\n## 2. Deuxième Étape\nDescription...`
    );
    setFormCategoryId(categories[0]?.id || '');
    setFormTags('marketing, performance');
    setIsCreating(true);
    setIsEditing(false);
  };

  const handleSaveSOP = async () => {
    if (!formTitle || !formCategoryId || !user) return;
    const tagArray = formTags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => t.length > 0);

    if (isCreating) {
      const newSop = await db.sops.create({
        title: formTitle,
        slug: '', // Handled by backend
        content: formContent,
        category_id: formCategoryId,
        tags: tagArray,
        author_id: user.id
      });
      if (newSop) {
        setSops([newSop, ...sops]);
        setIsCreating(false);
        setActiveSop(newSop);
      }
    } else if (isEditing && activeSop) {
      const updatedSop = await db.sops.update(activeSop.id, {
        title: formTitle,
        content: formContent,
        category_id: formCategoryId,
        tags: tagArray
      });
      if (updatedSop) {
        setSops(sops.map((s) => (s.id === activeSop.id ? updatedSop : s)));
        setActiveSop(updatedSop);
        setIsEditing(false);
      }
    }
  };

  const handleDeleteSOP = async (id: string) => {
    if (confirm('Voulez-vous vraiment supprimer cette SOP ?')) {
      const success = await db.sops.delete(id);
      if (success) {
        setSops(sops.filter((s) => s.id !== id));
        handleCloseDetail();
      }
    }
  };

  const canManageSop = (sop: SOP) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    return sop.author_id === user.id;
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            Base de Connaissances & SOPs
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-1">
            Centralisez et structurez les processus opérationnels de l'agence.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setAiModalOpen(true)}
            className="px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 cursor-pointer focus:outline-none flex items-center gap-2 text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>Générer avec IA</span>
          </button>
          
          <button
            onClick={handleStartCreate}
            className="px-4 py-2.5 bg-secondary/60 hover:bg-secondary/80 border border-border-dark text-white font-semibold rounded-xl transition-colors cursor-pointer focus:outline-none flex items-center gap-2 text-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Rédiger une SOP</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Section */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative w-full md:w-96">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted pointer-events-none">
            <Search className="w-4 h-4" />
          </span>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher par titre, tag ou contenu..."
            className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none transition-all"
          />
        </div>

        {/* Mobile Horizontal category scroll */}
        <div className="flex md:hidden w-full overflow-x-auto gap-2 pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
              selectedCategorySlug === 'all'
                ? 'bg-accent/10 border-accent text-accent'
                : 'bg-secondary/20 border-border-dark text-text-secondary'
            }`}
          >
            Toutes
          </button>
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategorySlug(cat.slug)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border ${
                selectedCategorySlug === cat.slug
                  ? 'bg-accent/10 border-accent text-accent'
                  : 'bg-secondary/20 border-border-dark text-text-secondary'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Workspaces */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Left Categories Sidebar (visible on md+) */}
        <div className="hidden md:block space-y-2">
          <h3 className="text-xs font-semibold text-text-muted uppercase tracking-wider px-3 mb-3">
            Catégories
          </h3>
          <button
            onClick={() => setSelectedCategorySlug('all')}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors focus:outline-none cursor-pointer ${
              selectedCategorySlug === 'all'
                ? 'bg-secondary text-accent font-semibold border border-border-dark'
                : 'text-text-secondary hover:text-text-primary hover:bg-secondary/30'
            }`}
          >
            <Grid className="w-4 h-4" />
            <span>Toutes les SOPs</span>
            <span className="ml-auto text-xs bg-secondary/50 px-2 py-0.5 rounded text-text-muted font-bold">
              {sops.length}
            </span>
          </button>

          {categories.map((cat) => {
            const count = sops.filter((s) => s.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategorySlug(cat.slug)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-colors focus:outline-none cursor-pointer ${
                  selectedCategorySlug === cat.slug
                    ? 'bg-secondary text-accent font-semibold border border-border-dark'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary/30'
                }`}
              >
                <CategoryIcon name={cat.icon} className="w-4 h-4" />
                <span className="truncate">{cat.name}</span>
                <span className="ml-auto text-xs bg-secondary/50 px-2 py-0.5 rounded text-text-muted font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right SOPs Grid Cards */}
        <div className="md:col-span-3">
          {filteredSops.length === 0 ? (
            <div className="glass-panel rounded-2xl p-12 text-center text-text-muted border border-dashed border-border-dark flex flex-col items-center">
              <BookOpen className="w-12 h-12 mb-3 opacity-30" />
              <h4 className="text-white font-bold mb-1">Aucune SOP trouvée</h4>
              <p className="text-xs">Essayez un autre mot-clé ou filtrez par catégorie.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {filteredSops.map((sop) => {
                const cat = categories.find((c) => c.id === sop.category_id);
                return (
                  <motion.div
                    key={sop.id}
                    layoutId={`sop-card-${sop.id}`}
                    onClick={() => handleOpenSopDetail(sop)}
                    className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-48 group text-left"
                  >
                    <div>
                      {/* Meta info */}
                      <div className="flex items-center gap-2 text-xs mb-2.5">
                        {cat && (
                          <span className="px-2 py-0.5 bg-accent/10 border border-accent/20 rounded-md text-accent font-medium flex items-center gap-1">
                            <CategoryIcon name={cat.icon} className="w-3 h-3" />
                            {cat.name}
                          </span>
                        )}
                        <span className="text-text-muted">
                          {new Date(sop.updated_at).toLocaleDateString('fr-FR')}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-base font-bold text-white group-hover:text-accent transition-colors line-clamp-2">
                        {sop.title}
                      </h3>
                    </div>

                    <div>
                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-4">
                        {sop.tags.slice(0, 3).map((t, idx) => (
                          <span
                            key={idx}
                            className="text-[10px] bg-secondary/50 border border-border-dark text-text-secondary px-2 py-0.5 rounded-full"
                          >
                            #{t}
                          </span>
                        ))}
                        {sop.tags.length > 3 && (
                          <span className="text-[10px] text-text-muted px-1.5 py-0.5">
                            +{sop.tags.length - 3}
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Sidebar slide-over Drawer Panel */}
      <AnimatePresence>
        {(activeSop || isCreating) && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="fixed inset-0 bg-black z-40"
            />

            {/* Slider Drawer Panel */}
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
                  {isCreating ? 'Nouveau Document' : 'Procédure Opérationnelle'}
                </span>
                
                <div className="flex items-center gap-3">
                  {!isCreating && activeSop && canManageSop(activeSop) && !isEditing && (
                    <button
                      onClick={handleStartEdit}
                      className="p-1.5 rounded-lg text-text-secondary hover:text-white hover:bg-secondary/40 transition-all focus:outline-none"
                    >
                      <Edit className="w-4.5 h-4.5" />
                    </button>
                  )}

                  {!isCreating && activeSop && canManageSop(activeSop) && (
                    <button
                      onClick={() => handleDeleteSOP(activeSop.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all focus:outline-none"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  )}

                  <button
                    onClick={handleCloseDetail}
                    className="p-1 rounded-lg text-text-secondary hover:text-white hover:bg-secondary/40 transition-colors focus:outline-none"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Body Content */}
              <div className="flex-1 overflow-y-auto p-6 md:p-8">
                {isEditing || isCreating ? (
                  /* EDITOR MODE */
                  <div className="space-y-5">
                    <div>
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                        Titre du document
                      </label>
                      <input
                        type="text"
                        value={formTitle}
                        onChange={(e) => setFormTitle(e.target.value)}
                        placeholder="ex: Structuration de Compte Meta Ads..."
                        className="w-full px-4 py-2.5 bg-secondary/20 border border-border-dark rounded-xl text-white placeholder-text-muted focus:border-accent focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                          Catégorie
                        </label>
                        <select
                          value={formCategoryId}
                          onChange={(e) => setFormCategoryId(e.target.value)}
                          className="w-full px-4 py-2.5 bg-[#090D1A] border border-border-dark rounded-xl text-sm text-white focus:border-accent focus:outline-none"
                        >
                          {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                              {cat.name}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                          Tags (séparés par virgule)
                        </label>
                        <input
                          type="text"
                          value={formTags}
                          onChange={(e) => setFormTags(e.target.value)}
                          placeholder="ex: meta, acquisition, budget"
                          className="w-full px-4 py-2.5 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold text-text-secondary uppercase mb-2">
                        Contenu (Markdown supporté)
                      </label>
                      <textarea
                        value={formContent}
                        onChange={(e) => setFormContent(e.target.value)}
                        rows={16}
                        className="w-full p-4 bg-[#060913] border border-border-dark rounded-xl text-sm text-white font-mono placeholder-text-muted focus:border-accent focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleSaveSOP}
                      disabled={!formTitle || !formContent}
                      className="w-full py-3 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-primary font-bold rounded-xl text-sm flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>Enregistrer les modifications</span>
                    </button>
                  </div>
                ) : (
                  /* VIEWER MODE */
                  activeSop && (
                    <div className="space-y-6">
                      <div>
                        {/* Tags */}
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
                        
                        {/* Title */}
                        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight mt-3">
                          {activeSop.title}
                        </h1>

                        {/* Metadata row */}
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

                      {/* Rendered content */}
                      <div className="pb-8 selection:bg-accent/25 selection:text-white">
                        <MarkdownRenderer content={activeSop.content} />
                      </div>
                    </div>
                  )
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* AI SOP / Brief Generator Modal */}
      <SOPGeneratorModal
        isOpen={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        categories={categories}
        onSopCreated={fetchData}
      />
    </div>
  );
};
