import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
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

// Fictional monthly data for blended ROAS over 6 months
const roasTrendData = [
  { month: 'Dec', ROAS: 3.1, spend: 120000, revenue: 372000 },
  { month: 'Jan', ROAS: 3.3, spend: 140000, revenue: 462000 },
  { month: 'Feb', ROAS: 3.2, spend: 155000, revenue: 496000 },
  { month: 'Mar', ROAS: 3.5, spend: 180000, revenue: 630000 },
  { month: 'Apr', ROAS: 3.7, spend: 210000, revenue: 777000 },
  { month: 'May', ROAS: 3.8, spend: 245680, revenue: 933580 }
];

// Fictional breakdown of advertising spend by channel
const channelData = [
  { name: 'Meta Ads', value: 55, color: '#14B8A6' },
  { name: 'Google Ads', value: 25, color: '#3B82F6' },
  { name: 'TikTok Ads', value: 12, color: '#EC4899' },
  { name: 'Klaviyo CRM', value: 8, color: '#8B5CF6' }
];

export const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

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
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    show: { opacity: 1, y: 0, transition: { type: 'spring' as const, bounce: 0.2 } }
  };

  // Custom tooltips for Recharts
  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-surface-card border border-border-dark p-3 rounded-lg shadow-xl">
          <p className="text-xs font-semibold text-text-secondary mb-1">Performance Blended</p>
          <p className="text-sm font-bold text-accent">ROAS: {payload[0].value}x</p>
          <p className="text-[11px] text-text-muted mt-1">
            Budget dépensé: {roasTrendData.find(d => d.month === payload[0].payload.month)?.spend.toLocaleString('fr-FR')} €
          </p>
        </div>
      );
    }
    return null;
  };

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
          Mise à jour : En direct (19 mai 2026)
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
            <span className="text-3xl font-bold text-white tracking-tight glow-text-teal">3.8x</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-medium">
              <ArrowUpRight className="w-3.5 h-3.5" />
              <span>+12% vs mois-1</span>
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
            <span className="text-3xl font-bold text-white tracking-tight">14.50€</span>
            <div className="flex items-center gap-1 mt-1 text-emerald-400 text-xs font-medium">
              <ArrowDownRight className="w-3.5 h-3.5" />
              <span>-4% (Amélioration)</span>
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
            <span className="text-3xl font-bold text-white tracking-tight">245 680€</span>
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
            <span className="text-3xl font-bold text-white tracking-tight">12 clients</span>
            <p className="text-[11px] text-text-muted mt-1.5">
              +1 nouveau client signé cette semaine
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
                <YAxis stroke="#64748B" fontSize={11} domain={[2, 4.5]} tickLine={false} axisLine={false} />
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
              <span className="text-lg font-bold text-white">245k€</span>
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
              <p className="text-xs text-text-secondary mt-1">Recherchez instantanément parmi nos 50+ SOPs.</p>
            </div>
          </div>

          {/* Card 3 */}
          <div
            onClick={() => navigate('/knowledge-base?sop=structuration-compte-meta-ads')}
            className="glass-card rounded-2xl p-5 cursor-pointer flex flex-col justify-between h-36"
          >
            <div className="flex items-start justify-between">
              <div className="w-9 h-9 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-purple-400" />
              </div>
              <ArrowUpRight className="w-4 h-4 text-text-muted" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">SOP Compte Meta Ads</h4>
              <p className="text-xs text-text-secondary mt-1">Accédez à notre framework de scaling Meta Ads.</p>
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
              <p className="text-xs text-text-secondary mt-1">Briefs, accès, comptes-rendus clients.</p>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
