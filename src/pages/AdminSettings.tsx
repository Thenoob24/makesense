import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/supabase';
import type { Profile, Category, SOP } from '../lib/mockData';
import {
  Users,
  Grid,
  Trash2,
  FileText,
  UserCheck,
  ShieldCheck,
  Check
} from 'lucide-react';
import { motion } from 'framer-motion';

export const AdminSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();
  
  // Guard page for admins only
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/');
    }
  }, [user, navigate]);

  const [activeSubTab, setActiveSubTab] = useState<'users' | 'categories' | 'sops'>('users');
  
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);

  // Category Form
  const [newCatName, setNewCatName] = useState('');
  const [newCatDesc, setNewCatDesc] = useState('');
  const [newCatIcon, setNewCatIcon] = useState('BookOpen');

  // Success indicator
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const loadData = async () => {
    const listProfiles = await db.auth.getProfiles();
    const listCategories = await db.categories.list();
    const listSops = await db.sops.list();

    setProfiles(listProfiles);
    setCategories(listCategories);
    setSops(listSops);
  };

  useEffect(() => {
    loadData();
  }, []);

  const triggerSuccess = (msg: string) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(null), 3000);
  };

  const handleRoleChange = async (targetUserId: string, newRole: 'admin' | 'consultant') => {
    const updated = await db.auth.updateProfileRole(targetUserId, newRole);
    if (updated) {
      setProfiles(profiles.map(p => p.id === targetUserId ? updated : p));
      triggerSuccess(`Rôle mis à jour avec succès en ${newRole}.`);
      if (user?.id === targetUserId) {
        // Refresh local auth context if updating own role
        await refreshUser();
      }
    }
  };

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatName || !newCatDesc) return;

    const newCat = await db.categories.create(newCatName, newCatDesc, newCatIcon);
    if (newCat) {
      setCategories([...categories, newCat]);
      setNewCatName('');
      setNewCatDesc('');
      setNewCatIcon('BookOpen');
      triggerSuccess(`Catégorie "${newCat.name}" ajoutée.`);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    const defaultSlugs = ['acquisition', 'seo', 'crm-emailing', 'creative', 'reporting', 'onboarding'];
    const targetCat = categories.find(c => c.id === id);
    if (targetCat && defaultSlugs.includes(targetCat.slug)) {
      alert("Impossible de supprimer une catégorie par défaut essentielle au système.");
      return;
    }

    if (confirm("Voulez-vous supprimer cette catégorie ? Toutes les SOPs associées seront conservées ou déplacées.")) {
      const success = await db.categories.delete(id);
      if (success) {
        setCategories(categories.filter(c => c.id !== id));
        triggerSuccess("Catégorie supprimée.");
      }
    }
  };

  const handleDeleteSop = async (id: string) => {
    if (confirm("Voulez-vous forcer la suppression de cette SOP en tant qu'administrateur ?")) {
      const success = await db.sops.delete(id);
      if (success) {
        setSops(sops.filter(s => s.id !== id));
        triggerSuccess("SOP supprimée avec succès.");
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Title */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
          Console d'Administration
        </h1>
        <p className="text-text-secondary text-sm md:text-base mt-1">
          Gestion des membres de l'agence, des catégories de SOP et audits de documents.
        </p>
      </div>

      {/* Success notification banner */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="p-3 bg-emerald-950/40 border border-emerald-800/40 text-emerald-300 text-sm font-semibold rounded-xl flex items-center gap-2"
        >
          <Check className="w-4 h-4 text-emerald-400" />
          <span>{successMsg}</span>
        </motion.div>
      )}

      {/* Administrative selector tabs */}
      <div className="flex border-b border-border-dark gap-2">
        <button
          onClick={() => setActiveSubTab('users')}
          className={`px-4 py-2.5 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${
            activeSubTab === 'users' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Membres Consultants</span>
        </button>

        <button
          onClick={() => setActiveSubTab('categories')}
          className={`px-4 py-2.5 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${
            activeSubTab === 'categories' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <Grid className="w-4 h-4" />
          <span>Catégories</span>
        </button>

        <button
          onClick={() => setActiveSubTab('sops')}
          className={`px-4 py-2.5 border-b-2 font-semibold text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${
            activeSubTab === 'sops' ? 'border-accent text-accent' : 'border-transparent text-text-secondary hover:text-text-primary'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Toutes les SOPs</span>
        </button>
      </div>

      {/* SUB PANELS CONTENT */}
      <div>
        {activeSubTab === 'users' && (
          /* MANAGING CONSULTANTS / USERS */
          <div className="glass-panel rounded-2xl p-6 border border-border-dark overflow-x-auto">
            <h3 className="text-lg font-bold text-white mb-4">Membres de l'agence (10 consultants)</h3>
            <table className="min-w-full divide-y divide-border-dark text-left text-sm">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="px-4 py-3 font-semibold text-white">Nom</th>
                  <th className="px-4 py-3 font-semibold text-white">Email</th>
                  <th className="px-4 py-3 font-semibold text-white">Inscrit le</th>
                  <th className="px-4 py-3 font-semibold text-white">Rôle Actuel</th>
                  <th className="px-4 py-3 font-semibold text-white text-right">Actions de Rôle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark bg-secondary/5">
                {profiles.map((profile) => (
                  <tr key={profile.id} className="hover:bg-secondary/10 transition-colors">
                    <td className="px-4 py-3 text-white font-medium flex items-center gap-2.5">
                      {profile.avatar_url ? (
                        <img
                          src={profile.avatar_url}
                          alt={profile.name}
                          className="w-8 h-8 rounded-full border border-border-dark object-cover"
                        />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center text-accent text-xs font-bold border border-border-dark">
                          {profile.name.charAt(0)}
                        </div>
                      )}
                      <span>{profile.name}</span>
                    </td>
                    <td className="px-4 py-3 text-text-secondary">{profile.email}</td>
                    <td className="px-4 py-3 text-text-muted">
                      {new Date(profile.created_at).toLocaleDateString('fr-FR')}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-semibold uppercase ${
                        profile.role === 'admin'
                          ? 'bg-accent/10 border border-accent/30 text-accent'
                          : 'bg-secondary/60 border border-border-dark text-text-secondary'
                      }`}>
                        {profile.role === 'admin' ? <ShieldCheck className="w-3.5 h-3.5" /> : <UserCheck className="w-3.5 h-3.5" />}
                        <span>{profile.role}</span>
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      {profile.role === 'admin' ? (
                        <button
                          onClick={() => handleRoleChange(profile.id, 'consultant')}
                          className="text-xs text-text-secondary bg-[#090D1A] border border-border-dark px-3 py-1.5 rounded-lg hover:border-text-muted transition-colors cursor-pointer"
                        >
                          Passer Consultant
                        </button>
                      ) : (
                        <button
                          onClick={() => handleRoleChange(profile.id, 'admin')}
                          className="text-xs text-accent bg-accent-light border border-accent/20 px-3 py-1.5 rounded-lg hover:bg-accent/20 transition-colors cursor-pointer"
                        >
                          Passer Admin
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeSubTab === 'categories' && (
          /* MANAGING CATEGORIES */
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* List */}
            <div className="md:col-span-2 glass-panel rounded-2xl p-6 border border-border-dark space-y-4">
              <h3 className="text-lg font-bold text-white">Catégories Enregistrées</h3>
              <div className="space-y-3">
                {categories.map((cat) => (
                  <div key={cat.id} className="p-4 bg-secondary/10 border border-border-dark rounded-xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm flex items-center gap-2">
                        <span>{cat.name}</span>
                        <span className="text-xs text-text-muted font-mono font-normal">({cat.slug})</span>
                      </h4>
                      <p className="text-xs text-text-secondary mt-1">{cat.description}</p>
                    </div>
                    <button
                      onClick={() => handleDeleteCategory(cat.id)}
                      className="p-2 rounded text-text-secondary hover:text-rose-400 hover:bg-rose-950/20 transition-all cursor-pointer focus:outline-none"
                    >
                      <Trash2 className="w-4.5 h-4.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Create Form */}
            <div className="glass-panel rounded-2xl p-6 border border-border-dark h-fit">
              <h3 className="text-base font-bold text-white mb-4">Créer une catégorie</h3>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Nom</label>
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="ex: Emailing / CRM"
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Description</label>
                  <textarea
                    value={newCatDesc}
                    onChange={(e) => setNewCatDesc(e.target.value)}
                    placeholder="ex: Processus CRM e-commerce et e-mails transactionnels..."
                    rows={3}
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5">Nom d'icône Lucide</label>
                  <select
                    value={newCatIcon}
                    onChange={(e) => setNewCatIcon(e.target.value)}
                    className="w-full px-3.5 py-2 bg-[#090D1A] border border-border-dark rounded-xl text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="TrendingUp">TrendingUp (Acquisition)</option>
                    <option value="Search">Search (SEO)</option>
                    <option value="Mail">Mail (CRM)</option>
                    <option value="Video">Video (Creative)</option>
                    <option value="BarChart2">BarChart (Analytics)</option>
                    <option value="UserPlus">UserPlus (Onboarding)</option>
                    <option value="BookOpen">BookOpen (Standard)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  Ajouter la catégorie
                </button>
              </form>
            </div>
          </div>
        )}

        {activeSubTab === 'sops' && (
          /* AUDITING ALL SOPS */
          <div className="glass-panel rounded-2xl p-6 border border-border-dark overflow-x-auto">
            <h3 className="text-lg font-bold text-white mb-4">Audit des SOPs globales ({sops.length} fiches)</h3>
            <table className="min-w-full divide-y divide-border-dark text-left text-sm">
              <thead className="bg-secondary/20">
                <tr>
                  <th className="px-4 py-3 font-semibold text-white">Titre de la SOP</th>
                  <th className="px-4 py-3 font-semibold text-white">Catégorie</th>
                  <th className="px-4 py-3 font-semibold text-white">Dernière modification</th>
                  <th className="px-4 py-3 font-semibold text-white text-right">Audit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-dark bg-secondary/5">
                {sops.map((sop) => {
                  const cat = categories.find(c => c.id === sop.category_id);
                  return (
                    <tr key={sop.id} className="hover:bg-secondary/10 transition-colors">
                      <td className="px-4 py-3 text-white font-semibold flex items-center gap-2">
                        <FileText className="w-4 h-4 text-text-muted" />
                        <span>{sop.title}</span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-secondary/40 border border-border-dark text-text-secondary px-2 py-0.5 rounded">
                          {cat ? cat.name : 'Inconnue'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-text-muted">
                        {new Date(sop.updated_at).toLocaleDateString('fr-FR')}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => handleDeleteSop(sop.id)}
                          className="p-1.5 rounded text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 transition-all cursor-pointer focus:outline-none"
                        >
                          <Trash2 className="w-4.5 h-4.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
