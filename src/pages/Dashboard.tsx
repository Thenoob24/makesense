import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../lib/supabase';
import type { Client, SOP } from '../lib/mockData';
import {
  TrendingUp,
  Euro,
  Users,
  Sparkles,
  Search,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { motion } from 'framer-motion';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  CartesianGrid
} from 'recharts';

// Base data per client — KPIs scale with client count
const BASE_ROAS = 2.8;
const BASE_CAC = 22;
const BASE_REVENUE_PER_CLIENT = 20000;
const BASE_SPEND_PER_CLIENT = 5500;

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [clients, setClients] = useState<Client[]>([]);
  const [sops, setSops] = useState<SOP[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch live data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const [clientList, sopList] = await Promise.all([
        db.clients.list(),
        db.sops.list(),
      ]);
      setClients(clientList);
      setSops(sopList);
      setLoading(false);
    };
    fetchData();
  }, []);

  // Derived KPIs — scale with number of clients
  const clientCount = clients.length;
  const scaleFactor = Math.max(clientCount, 1);

  // ROAS improves slightly with more clients (economies of scale)
  const currentROAS = parseFloat((BASE_ROAS + clientCount * 0.08).toFixed(1));
  // CAC decreases with more clients
  const currentCAC = parseFloat(Math.max(BASE_CAC - clientCount * 0.6, 8).toFixed(2));
  // Revenue scales linearly
  const currentRevenue = BASE_REVENUE_PER_CLIENT * scaleFactor;
  // Total spend
  const currentSpend = BASE_SPEND_PER_CLIENT * scaleFactor;

  // Generate dynamic trend data based on current values
  const roasTrendData = [
    { month: 'Dec', ROAS: parseFloat((currentROAS * 0.82).toFixed(1)), spend: Math.round(currentSpend * 0.49), revenue: Math.round(currentRevenue * 0.40) },
    { month: 'Jan', ROAS: parseFloat((currentROAS * 0.87).toFixed(1)), spend: Math.round(currentSpend * 0.57), revenue: Math.round(currentRevenue * 0.50) },
    { month: 'Feb', ROAS: parseFloat((currentROAS * 0.84).toFixed(1)), spend: Math.round(currentSpend * 0.63), revenue: Math.round(currentRevenue * 0.53) },
    { month: 'Mar', ROAS: parseFloat((currentROAS * 0.92).toFixed(1)), spend: Math.round(currentSpend * 0.73), revenue: Math.round(currentRevenue * 0.68) },
    { month: 'Avr', ROAS: parseFloat((currentROAS * 0.97).toFixed(1)), spend: Math.round(currentSpend * 0.86), revenue: Math.round(currentRevenue * 0.83) },
    { month: 'Mai', ROAS: currentROAS, spend: currentSpend, revenue: currentRevenue },
  ];

  // Channel breakdown (percentages stay the same)
  const channelData = [
    { name: 'Meta Ads', value: 55, color: '#14B8A6' },
    { name: 'Google Ads', value: 25, color: '#3B82F6' },
    { name: 'TikTok Ads', value: 12, color: '#EC4899' },
    { name: 'Klaviyo CRM', value: 8, color: '#8B5CF6' },
  ];

  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return 'Bonjour';
    if (hrs < 18) return 'Bon après-midi';
    return 'Bonsoir';
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.2 } },
  };

  // Format number with french locale
  const formatEuro = (n: number) => n.toLocaleString('fr-FR');

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const dataPoint = payload[0].payload;
      return (
        <div className="bg-surface-card border border-border-dark p-3 rounded-lg shadow-xl">
          <p className="text-xs font-semibold text-text-secondary mb-1">Performance Blended</p>
          <p className="text-sm font-bold text-accent">ROAS: {payload[0].value}x</p>
          <p className="text-[11px] text-text-muted mt-1">
            Budget dépensé: {formatEuro(dataPoint.spend)} €
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-10 h-10 border-4 border-accent/20 border-t-accent rounded-full"
        />
      </div>
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight">
            {getGreeting()}, {user?.name.split(' ')[0]} 👋
          </h1>
          <p className="text-text-secondary text-sm md:text-base mt-1">
            Voici les performances e-commerce globales de l'agence pour ce mois-ci.
          </p>
        </div>
        
        {/* Quick Date Display */}
        <div className="text-xs font-semibold text-text-secondary bg-surface-card border border-border-dark px-4 py-2 rounded-xl flex items-center gap-2 self-start md:self-auto">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          Mise à jour : En direct ({new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })})
        </div>
      </motion.div>

      {/* KPI Cards Grid */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: ROAS */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">ROAS Moyen Blended</span>
            <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-accent" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight glow-text-teal">{currentROAS}x</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+{Math.round((currentROAS / (currentROAS * 0.97) - 1) * 100)}% vs mois-1</span>
            </div>
          </div>
        </div>

        {/* Card 2: CAC */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">CAC Moyen</span>
            <div className="w-9 h-9 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
              <Euro className="w-5 h-5 text-emerald-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{currentCAC}€</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-{Math.round((1 - currentCAC / BASE_CAC) * 100)}% (Amélioration)</span>
            </div>
          </div>
        </div>

        {/* Card 3: Monthly Revenue */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">CA Publicitaire (Mois)</span>
            <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
              <Euro className="w-5 h-5 text-blue-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{formatEuro(currentRevenue)}€</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+18% vs mois-1</span>
            </div>
          </div>
        </div>

        {/* Card 4: Active Clients */}
        <div className="glass-card rounded-2xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Clients Actifs</span>
            <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <div className="mt-4">
            <span className="text-3xl font-bold text-white tracking-tight">{clientCount} client{clientCount > 1 ? 's' : ''}</span>
            <p className="text-[11px] text-text-muted mt-1.5">
              {sops.length} SOPs dans la base de connaissances
            </p>
          </div>
        </div>
      </motion.div>

      {/* Analytics Charts */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Area Chart - ROAS 6 Months */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 lg:col-span-2 flex flex-col">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-white">Trajectoire du ROAS Blended</h3>
            <p className="text-xs text-text-secondary">Évolution de l'efficacité publicitaire globale moyenne</p>
          </div>
          <div className="h-72 w-full mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={roasTrendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="roasGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#14B8A6" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#14B8A6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="month" stroke="#64748B" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#64748B" fontSize={11} domain={['auto', 'auto']} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="ROAS"
                  stroke="#14B8A6"
                  strokeWidth={3}
                  fillOpacity={1}
                  fill="url(#roasGradient)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Pie Chart - Acquisition Share */}
        <div className="glass-panel rounded-2xl p-5 md:p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-white">Canaux d'Acquisition</h3>
            <p className="text-xs text-text-secondary">Répartition moyenne des dépenses publicitaires</p>
          </div>
          <div className="h-56 w-full relative flex items-center justify-center mt-2">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={channelData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {channelData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
            
            {/* Center Text inside Donut */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
              <span className="text-xs text-text-muted">Total Budget</span>
              <span className="text-lg font-bold text-white">{formatEuro(currentSpend)}€</span>
            </div>
          </div>

          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-2 mt-4 text-xs">
            {channelData.map((chan, idx) => (
              <div key={idx} className="flex items-center gap-1.5 text-text-secondary">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: chan.color }} />
                <span>{chan.name} ({chan.value}%)</span>
              </div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Quick Resources Cards Grid */}
      <motion.div variants={itemVariants} className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white">Ressources & Accès rapides</h3>
          <p className="text-xs text-text-secondary">Raccourcis vers vos workflows quotidiens</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1 */}
          <div
            onClick={() => navigate('/knowledge-base?generate=true')}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-accent/10 border border-accent/20 flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted hover:text-accent" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Générer avec IA</h4>
              <p className="text-xs text-text-secondary mt-1">Créez des briefs et SOPs e-commerce via templates.</p>
            </div>
          </div>

          {/* Card 2 */}
          <div
            onClick={() => navigate('/search')}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Search className="w-5 h-5 text-blue-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Recherche Globale</h4>
              <p className="text-xs text-text-secondary mt-1">Recherchez instantanément parmi vos {sops.length} SOPs.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => navigate('/knowledge-base')}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Base de connaissances</h4>
              <p className="text-xs text-text-secondary mt-1">Accédez à toutes les SOPs et guidelines.</p>
            </div>
          </div>

          {/* Card 4 */}
          <div
            onClick={() => navigate('/clients')}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-amber-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Fichiers Clients</h4>
              <p className="text-xs text-text-secondary mt-1">{clientCount} client{clientCount > 1 ? 's' : ''} — briefs, accès, comptes-rendus.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
