import React, { useState, useEffect } from 'react';
import { db } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import type { Client, ClientAsset } from '../lib/mockData';
import {
  Building,
  Plus,
  Search,
  Key,
  FileText,
  Bookmark,
  Eye,
  EyeOff,
  Copy,
  Check,
  Trash2,
  X,
  ChevronLeft,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';


export const Clients: React.FC = () => {
  const { user } = useAuth();


  const [confirmDeleteClientId, setConfirmDeleteClientId] = useState<string | null>(null);
  const [confirmDeleteAssetId, setConfirmDeleteAssetId] = useState<string | null>(null);

  const [clients, setClients] = useState<Client[]>([]);
  const [activeClient, setActiveClient] = useState<Client | null>(null);
  const [assets, setAssets] = useState<ClientAsset[]>([]);
  const [activeTab, setActiveTab] = useState<'brief' | 'credential' | 'note'>('brief');

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Modals / forms state
  const [isCreatingClient, setIsCreatingClient] = useState(false);
  const [clientName, setClientName] = useState('');
  const [clientDesc, setClientDesc] = useState('');
  const [clientLogoUrl, setClientLogoUrl] = useState('');

  const [isCreatingAsset, setIsCreatingAsset] = useState(false);
  const [assetTitle, setAssetTitle] = useState('');
  const [assetContent, setAssetContent] = useState('');
  const [assetType, setAssetType] = useState<'brief' | 'credential' | 'note'>('brief');

  // Copy indicator states
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [showPasswordMap, setShowPasswordMap] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    const list = await db.clients.list();
    setClients(list);
  };

  const fetchAssets = async (clientId: string) => {
    const list = await db.assets.listByClient(clientId);
    setAssets(list);
  };

  const handleSelectClient = (client: Client) => {
    setActiveClient(client);
    fetchAssets(client.id);
    setActiveTab('brief');
  };

  const handleCreateClient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!clientName || !clientDesc) return;

    const newClient = await db.clients.create(clientName, clientDesc, clientLogoUrl || undefined);
    if (newClient) {
      setClients([...clients, newClient]);
      setIsCreatingClient(false);
      setClientName('');
      setClientDesc('');
      setClientLogoUrl('');
      handleSelectClient(newClient);
    }
  };

  const handleDeleteClient = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setConfirmDeleteClientId(id);
  };

  const confirmDeleteClient = async () => {
    if (!confirmDeleteClientId) return;
    const success = await db.clients.delete(confirmDeleteClientId);
    if (success) {
      setClients(clients.filter((c) => c.id !== confirmDeleteClientId));
      if (activeClient?.id === confirmDeleteClientId) {
        setActiveClient(null);
        setAssets([]);
      }
    }
    setConfirmDeleteClientId(null);
  };

  const handleCreateAsset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeClient || !assetTitle || !assetContent) return;

    const newAsset = await db.assets.create({
      client_id: activeClient.id,
      title: assetTitle,
      type: assetType,
      content: assetContent
    });

    if (newAsset) {
      setAssets([newAsset, ...assets]);
      setIsCreatingAsset(false);
      setAssetTitle('');
      setAssetContent('');
    }
  };

  const handleDeleteAsset = (id: string) => {
    setConfirmDeleteAssetId(id);
  };

  const confirmDeleteAsset = async () => {
    if (!confirmDeleteAssetId) return;
    const success = await db.assets.delete(confirmDeleteAssetId);
    if (success) {
      setAssets(assets.filter((a) => a.id !== confirmDeleteAssetId));
    }
    setConfirmDeleteAssetId(null);
  };

  const handleCopyText = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const togglePasswordVisibility = (id: string) => {
    setShowPasswordMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  // Filter clients
  const filteredClients = clients.filter((c) =>
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    c.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredAssets = assets.filter((a) => a.type === activeTab);

  return (
    <div className="space-y-8">
      {/* Detail client Mode */}
      {activeClient ? (
        <div className="space-y-6">
          {/* Back Navigation Bar */}
          <button
            onClick={() => setActiveClient(null)}
            className="flex items-center gap-1.5 text-sm font-semibold text-text-secondary hover:text-accent transition-colors focus:outline-none cursor-pointer"
          >
            <ChevronLeft className="w-5 h-5" />
            <span>Retour à la liste des clients</span>
          </button>

          {/* Client Header Info */}
          <div className="glass-panel rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              {activeClient.logo_url ? (
                <img
                  src={activeClient.logo_url}
                  alt={activeClient.name}
                  className="w-16 h-16 rounded-2xl object-cover border border-border-dark shadow-lg"
                />
              ) : (
                <div className="w-16 h-16 rounded-2xl bg-secondary flex items-center justify-center text-accent border border-border-dark">
                  <Building className="w-8 h-8" />
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                  {activeClient.name}
                </h1>
                <p className="text-sm text-text-secondary max-w-xl mt-1 leading-relaxed">
                  {activeClient.description}
                </p>
              </div>
            </div>

            {/* Quick add asset button */}
            <button
              onClick={() => {
                setAssetType(activeTab);
                setIsCreatingAsset(true);
              }}
              className="px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 cursor-pointer focus:outline-none flex items-center gap-2 text-sm self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau document</span>
            </button>
          </div>

          {/* Folder tabs selectors */}
          <div className="flex border-b border-border-dark">
            <button
              onClick={() => setActiveTab('brief')}
              className={`px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${activeTab === 'brief'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              <FileText className="w-4 h-4" />
              <span>Briefs Créas / Stratégies</span>
            </button>

            <button
              onClick={() => setActiveTab('credential')}
              className={`px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${activeTab === 'credential'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              <Key className="w-4 h-4" />
              <span>Accès & Credentials</span>
            </button>

            <button
              onClick={() => setActiveTab('note')}
              className={`px-6 py-3 border-b-2 font-medium text-sm flex items-center gap-2 transition-colors focus:outline-none cursor-pointer ${activeTab === 'note'
                ? 'border-accent text-accent'
                : 'border-transparent text-text-secondary hover:text-text-primary'
                }`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Notes & Comptes-rendus</span>
            </button>
          </div>

          {/* Folder Content Display */}
          <div className="space-y-6">
            {filteredAssets.length === 0 ? (
              <div className="glass-panel rounded-2xl p-12 text-center text-text-muted border border-dashed border-border-dark flex flex-col items-center">
                {activeTab === 'brief' && <FileText className="w-10 h-10 mb-2 opacity-30" />}
                {activeTab === 'credential' && <Key className="w-10 h-10 mb-2 opacity-30" />}
                {activeTab === 'note' && <Bookmark className="w-10 h-10 mb-2 opacity-30" />}
                <p className="text-sm">Aucun élément dans ce dossier pour l'instant.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {filteredAssets.map((asset) => (
                  <motion.div
                    key={asset.id}
                    layoutId={`asset-${asset.id}`}
                    className="glass-panel rounded-2xl p-6 relative group border border-border-dark"
                  >
                    {/* Header bar */}
                    <div className="flex items-center justify-between border-b border-border-dark pb-3 mb-4">
                      <div className="flex items-center gap-2">
                        {asset.type === 'brief' && <FileText className="w-4.5 h-4.5 text-accent" />}
                        {asset.type === 'credential' && <Key className="w-4.5 h-4.5 text-yellow-400" />}
                        {asset.type === 'note' && <Bookmark className="w-4.5 h-4.5 text-blue-400" />}
                        <h3 className="font-bold text-white text-base">{asset.title}</h3>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs text-text-muted">
                          Ajouté le : {new Date(asset.created_at).toLocaleDateString('fr-FR')}
                        </span>

                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="p-1 rounded text-text-secondary hover:text-rose-400 hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer focus:outline-none"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Body content */}
                    {asset.type === 'credential' ? (
                      /* Credentials details layout (with show/hide and copy option) */
                      <div className="bg-[#060913] border border-border-dark p-4 rounded-xl font-mono text-xs text-slate-300 relative">
                        <div className="absolute top-3 right-3 flex gap-2">
                          <button
                            onClick={() => togglePasswordVisibility(asset.id)}
                            className="p-1 rounded bg-secondary/50 hover:bg-secondary text-text-secondary hover:text-white transition-colors cursor-pointer"
                          >
                            {showPasswordMap[asset.id] ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => handleCopyText(asset.content, asset.id)}
                            className="p-1 rounded bg-secondary/50 hover:bg-secondary text-text-secondary hover:text-white transition-colors cursor-pointer flex items-center gap-1"
                          >
                            {copiedId === asset.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <pre className="whitespace-pre-wrap font-mono leading-relaxed pr-12">
                          {showPasswordMap[asset.id]
                            ? asset.content
                            : asset.content.replace(/password\s*:\s*.*|mot de passe\s*:\s*.*/gi, (match) => {
                              const parts = match.split(':');
                              return `${parts[0]}: •••••••• (cliquez sur l'oeil pour afficher)`;
                            })}
                        </pre>
                      </div>
                    ) : (
                      /* Brief and Notes formatted markdown layout */
                      <div className="text-slate-300 text-sm leading-relaxed prose prose-invert max-w-none">
                        <pre className="whitespace-pre-wrap font-sans leading-relaxed">{asset.content}</pre>
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Grid List of Clients */
        <div className="space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
                Portefeuille Clients
              </h1>
              <p className="text-text-secondary text-sm md:text-base mt-1">
                Fiches d'identité clients, briefs de campagnes opérationnels et codes d'accès.
              </p>
            </div>

            <button
              onClick={() => setIsCreatingClient(true)}
              className="px-4 py-2.5 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 cursor-pointer focus:outline-none flex items-center gap-2 text-sm self-start md:self-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Nouveau Client</span>
            </button>
          </div>

          {/* Search bar */}
          <div className="relative w-full md:w-96">
            <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-text-muted pointer-events-none">
              <Search className="w-4 h-4" />
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Rechercher un client..."
              className="w-full pl-10 pr-4 py-2.5 bg-surface-card border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none transition-all"
            />
          </div>

          {/* Clients Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredClients.map((client) => (
              <motion.div
                key={client.id}
                layoutId={`client-card-${client.id}`}
                onClick={() => handleSelectClient(client)}
                className="glass-card rounded-2xl p-6 cursor-pointer flex flex-col justify-between h-56 text-left relative group"
              >
                <div>
                  <div className="flex justify-between items-start">
                    {client.logo_url ? (
                      <img
                        src={client.logo_url}
                        alt={client.name}
                        className="w-12 h-12 rounded-xl object-cover border border-border-dark"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-accent border border-border-dark font-bold text-lg">
                        {client.name.charAt(0)}
                      </div>
                    )}

                    {user?.role === 'admin' && (
                      <button
                        onClick={(e) => handleDeleteClient(client.id, e)}
                        className="p-1 rounded text-text-muted hover:text-rose-400 hover:bg-rose-950/20 opacity-0 group-hover:opacity-100 transition-all cursor-pointer focus:outline-none"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <h3 className="text-lg font-bold text-white mt-4 group-hover:text-accent transition-colors">
                    {client.name}
                  </h3>

                  <p className="text-xs text-text-secondary mt-1.5 line-clamp-3 leading-normal">
                    {client.description}
                  </p>
                </div>

                <div className="text-[10px] text-text-muted font-mono pt-4 border-t border-border-dark/50 mt-4 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-accent" />
                  <span>Actif depuis : {new Date(client.created_at).toLocaleDateString('fr-FR')}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* MODAL: CREATE CLIENT */}
      <AnimatePresence>
        {isCreatingClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingClient(false)}
              className="fixed inset-0 bg-black"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-md bg-surface-card border border-border-dark rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border-dark pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <Building className="w-5 h-5 text-accent" />
                  <span>Créer une fiche client</span>
                </h3>
                <button
                  onClick={() => setIsCreatingClient(false)}
                  className="p-1 rounded-lg text-text-secondary hover:text-white focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateClient} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Nom du client
                  </label>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="ex: Ecocup"
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Description / Description du mandat
                  </label>
                  <textarea
                    value={clientDesc}
                    onChange={(e) => setClientDesc(e.target.value)}
                    placeholder="ex: Leader français du gobelet réutilisable. Mandat d'acquisition Facebook et Google Ads..."
                    rows={3}
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    URL du Logo / Image (Optionnel)
                  </label>
                  <input
                    type="text"
                    value={clientLogoUrl}
                    onChange={(e) => setClientLogoUrl(e.target.value)}
                    placeholder="https://images.unsplash.com/... (ou laisser vide)"
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  Enregistrer le client
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CREATE CLIENT ASSET */}
      <AnimatePresence>
        {isCreatingAsset && activeClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreatingAsset(false)}
              className="fixed inset-0 bg-black"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-lg bg-surface-card border border-border-dark rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <div className="flex items-center justify-between border-b border-border-dark pb-3">
                <h3 className="text-base font-bold text-white flex items-center gap-2">
                  <FileText className="w-5 h-5 text-accent" />
                  <span>Ajouter un document pour {activeClient.name}</span>
                </h3>
                <button
                  onClick={() => setIsCreatingAsset(false)}
                  className="p-1 rounded-lg text-text-secondary hover:text-white focus:outline-none"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateAsset} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Titre du document
                  </label>
                  <input
                    type="text"
                    value={assetTitle}
                    onChange={(e) => setAssetTitle(e.target.value)}
                    placeholder="ex: Identifiants Google Ads, Brief créatif Q2..."
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Type de document
                  </label>
                  <select
                    value={assetType}
                    onChange={(e) => setAssetType(e.target.value as any)}
                    className="w-full px-3.5 py-2 bg-[#090D1A] border border-border-dark rounded-xl text-sm text-white focus:border-accent focus:outline-none"
                  >
                    <option value="brief">Brief / Stratégie</option>
                    <option value="credential">Accès / Credential</option>
                    <option value="note">Note / Compte-rendu</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-1.5">
                    Contenu
                  </label>
                  <textarea
                    value={assetContent}
                    onChange={(e) => setAssetContent(e.target.value)}
                    placeholder={
                      assetType === 'credential'
                        ? 'Ajoutez vos identifiants...\nNom: admin\nMot de passe: 1234\nLien: ...'
                        : 'Structurez le texte ou collez le brief...'
                    }
                    rows={8}
                    className="w-full px-3.5 py-2 bg-secondary/20 border border-border-dark rounded-xl text-sm text-white font-mono placeholder-text-muted focus:border-accent focus:outline-none"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-accent text-primary font-bold rounded-xl text-sm hover:bg-accent-hover transition-colors cursor-pointer"
                >
                  Enregistrer le document
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* MODAL: CONFIRM DELETE CLIENT */}
      <AnimatePresence>
        {confirmDeleteClientId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteClientId(null)}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-surface-card border border-border-dark rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-base font-bold text-white">Supprimer ce client ?</h3>
              <p className="text-sm text-text-secondary">
                Cette action est irréversible et supprimera tous les documents associés.
              </p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteClientId(null)}
                  className="flex-1 py-2 rounded-xl border border-border-dark text-sm text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteClient}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL: CONFIRM DELETE ASSET */}
      <AnimatePresence>
        {confirmDeleteAssetId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} exit={{ opacity: 0 }}
              onClick={() => setConfirmDeleteAssetId(null)}
              className="fixed inset-0 bg-black"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-sm bg-surface-card border border-border-dark rounded-2xl p-6 shadow-2xl z-10 space-y-4"
            >
              <h3 className="text-base font-bold text-white">Supprimer ce document ?</h3>
              <p className="text-sm text-text-secondary">Cette action est irréversible.</p>
              <div className="flex gap-3 pt-2">
                <button
                  onClick={() => setConfirmDeleteAssetId(null)}
                  className="flex-1 py-2 rounded-xl border border-border-dark text-sm text-text-secondary hover:text-white transition-colors cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  onClick={confirmDeleteAsset}
                  className="flex-1 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-sm transition-colors cursor-pointer"
                >
                  Supprimer
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
