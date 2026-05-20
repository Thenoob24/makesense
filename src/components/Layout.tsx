import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from './Sidebar';
import { isDemoMode } from '../lib/supabase';
import { Menu, X, Terminal, Database, Bell, LayoutDashboard, BookOpen, Users, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Route guarding
  useEffect(() => {
    if (!loading && !user && location.pathname !== '/login') {
      navigate('/login');
    }
  }, [user, loading, location.pathname, navigate]);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg-dark flex flex-col items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.2, ease: "linear" }}
          className="w-12 h-12 border-4 border-accent/20 border-t-accent rounded-full mb-4"
        />
        <p className="text-text-secondary text-sm font-medium tracking-wide animate-pulse">
          Chargement de Make Sense OS...
        </p>
      </div>
    );
  }

  // If we are on the login page, just render children directly without sidebar
  if (location.pathname === '/login') {
    return <>{children}</>;
  }

  // Bottom nav items
  const bottomNavItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'SOPs', path: '/knowledge-base', icon: BookOpen },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Recherche', path: '/search', icon: Search },
  ];

  return (
    <div className="min-h-screen bg-bg-dark text-text-primary flex">
      {/* Desktop Sidebar (visible on lg+) */}
      <div className="hidden lg:block">
        <Sidebar isCollapsed={isCollapsed} setIsCollapsed={setIsCollapsed} />
      </div>

      {/* Mobile Drawer Navigation */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="fixed inset-0 bg-black z-40 lg:hidden"
            />
            {/* Drawer */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 left-0 bottom-0 w-72 bg-surface-dark z-50 lg:hidden"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary/40 focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <Sidebar isCollapsed={false} setIsCollapsed={() => {}} />
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content Workspace */}
      <div
        className={`flex-1 flex flex-col min-w-0 transition-all duration-300 ${
          location.pathname === '/login' ? 'pl-0' : 'lg:pl-64'
        } ${isCollapsed && location.pathname !== '/login' ? 'lg:pl-20' : ''}`}
      >
        {/* Top Header / Navbar */}
        <header className="h-14 lg:h-16 border-b border-border-dark bg-surface-dark/50 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 lg:px-6">
          <div className="flex items-center gap-3">
            {/* Mobile Burger Trigger */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary/30 transition-colors focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            {/* Page Context Badge */}
            <div className="hidden sm:flex items-center gap-2 text-xs font-mono text-text-secondary bg-secondary/20 border border-border-dark px-2.5 py-1 rounded-full">
              <Terminal className="w-3.5 h-3.5 text-accent" />
              <span>makesense_node_v1.0.0</span>
            </div>
          </div>

          <div className="flex items-center gap-3 lg:gap-4">
            {/* Demo Mode Badge */}
            {isDemoMode && (
              <div className="flex items-center gap-1.5 px-2 lg:px-3 py-1 rounded-full text-[10px] lg:text-xs font-semibold bg-amber-950/40 text-amber-300 border border-amber-800/40 animate-pulse">
                <Database className="w-3 lg:w-3.5 h-3 lg:h-3.5" />
                <span className="hidden sm:inline">Mode Démo Actif</span>
                <span className="sm:hidden">Démo</span>
              </div>
            )}

            {/* Notification Icon */}
            <button className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-secondary/30 transition-colors relative cursor-pointer focus:outline-none min-w-[44px] min-h-[44px] flex items-center justify-center">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-accent rounded-full" />
            </button>
          </div>
        </header>

        {/* Inner Content Area */}
        <main className="flex-1 p-4 pb-24 lg:p-8 lg:pb-8 max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>

      {/* Bottom Navigation - Mobile & Tablet only */}
      <nav className="fixed bottom-0 left-0 right-0 lg:hidden z-30 bg-surface-dark/95 backdrop-blur-md border-t border-border-dark safe-area-bottom">
        <div className="flex items-center justify-around h-16">
          {bottomNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            const IconComp = item.icon;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center justify-center gap-1 min-w-[64px] min-h-[44px] rounded-lg transition-colors focus:outline-none ${
                  isActive ? 'text-accent' : 'text-text-secondary active:text-text-primary'
                }`}
              >
                <IconComp className={`w-5 h-5 ${isActive ? 'drop-shadow-[0_0_6px_rgba(20,184,166,0.4)]' : ''}`} />
                <span className="text-[10px] font-semibold">{item.name}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
};
