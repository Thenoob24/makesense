import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { isDemoMode } from '../lib/supabase';
import { Shield, User, Lock, Mail, TrendingUp, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export const Login: React.FC = () => {
  const { signIn, user } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirect to dashboard if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await signIn(email, password);
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  const handleQuickLogin = async (presetEmail: string) => {
    setError(null);
    setLoading(true);
    const result = await signIn(presetEmail, 'password123');
    setLoading(false);
    if (result.success) {
      navigate('/');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background grid/gradients */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md relative z-10"
      >
        {/* Brand Logo Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent flex items-center justify-center shadow-lg shadow-accent/25 mb-3">
            <TrendingUp className="w-7 h-7 text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-white mb-1">Make Sense OS</h1>
          <p className="text-sm text-text-secondary">OS Interne / Performance Marketing Agency</p>
        </div>

        {/* Login Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Connexion à votre espace</h2>

          {error && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-5 p-3 rounded-lg bg-rose-950/40 border border-rose-800/40 text-rose-300 text-sm flex gap-2 items-start"
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Adresse Email
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
                  <Mail className="w-4 h-4" />
                </span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nom@makesense.agency"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border-dark rounded-xl text-white placeholder-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text-secondary uppercase tracking-wider mb-2">
                Mot de passe
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-text-muted pointer-events-none">
                  <Lock className="w-4 h-4" />
                </span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 bg-secondary/20 border border-border-dark rounded-xl text-white placeholder-text-muted focus:border-accent focus:ring-1 focus:ring-accent focus:outline-none transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-accent text-primary font-bold rounded-xl hover:bg-accent-hover transition-colors shadow-lg shadow-accent/15 cursor-pointer focus:outline-none flex items-center justify-center"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Quick Preset Accounts (for local/demo testing) */}
          <div className="mt-8 pt-6 border-t border-border-dark">
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider text-center mb-4">
              Comptes Démo Rapides
            </p>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => handleQuickLogin('admin@makesense.agency')}
                disabled={loading}
                className="px-3 py-2 bg-secondary/30 border border-border-dark hover:border-accent/40 rounded-xl text-xs font-medium text-text-primary transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
              >
                <Shield className="w-4 h-4 text-accent" />
                <span>Admin</span>
              </button>
              <button
                onClick={() => handleQuickLogin('consultant@makesense.agency')}
                disabled={loading}
                className="px-3 py-2 bg-secondary/30 border border-border-dark hover:border-accent/40 rounded-xl text-xs font-medium text-text-primary transition-all flex flex-col items-center gap-1 cursor-pointer focus:outline-none"
              >
                <User className="w-4 h-4 text-text-secondary" />
                <span>Consultant</span>
              </button>
            </div>
            <p className="text-[10px] text-text-muted text-center mt-3 leading-relaxed">
              {isDemoMode 
                ? "* En mode Démo, n'importe quel e-mail et mot de passe fonctionne."
                : "* En mode Supabase, assurez-vous que ces comptes existent avec le mot de passe \"password123\"."}
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
