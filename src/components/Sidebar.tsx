import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  BookOpen,
  Users,
  Search,
  Settings,
  LogOut,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  Shield
} from 'lucide-react';

interface SidebarProps {
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isCollapsed, setIsCollapsed }) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Knowledge Base', path: '/knowledge-base', icon: BookOpen },
    { name: 'Clients', path: '/clients', icon: Users },
    { name: 'Recherche SOP', path: '/search', icon: Search },
  ];

  // Add Admin page if user is an admin
  if (user?.role === 'admin') {
    menuItems.push({ name: 'Admin Console', path: '/admin', icon: Settings });
  }

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase();
  };

  return (
    <aside
      className={`fixed top-0 left-0 z-40 h-screen transition-all duration-300 border-r border-border-dark bg-surface-dark flex flex-col justify-between ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div>
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-dark">
          {!isCollapsed && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => navigate('/')}
            >
              <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center shadow-lg shadow-accent/20">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <span className="font-bold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-accent bg-clip-text text-transparent glow-text-teal">
                Make Sense OS
              </span>
            </motion.div>
          )}

          {isCollapsed && (
            <div
              className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center mx-auto cursor-pointer"
              onClick={() => navigate('/')}
            >
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          )}

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 rounded-md text-text-secondary hover:text-accent hover:bg-secondary/40 transition-colors focus:outline-none"
          >
            {isCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation Menu */}
        <nav className="mt-6 px-3 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`relative w-full flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors group cursor-pointer focus:outline-none ${
                  isActive
                    ? 'text-accent'
                    : 'text-text-secondary hover:text-text-primary hover:bg-secondary/20'
                }`}
              >
                {/* Active Indicator Pill background */}
                {isActive && (
                  <motion.div
                    layoutId="active-nav-pill"
                    className="absolute inset-0 bg-accent-light border border-accent/20 rounded-lg -z-10"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                <item.icon
                  className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-accent' : 'text-text-muted group-hover:text-text-secondary'
                  }`}
                />

                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="truncate"
                  >
                    {item.name}
                  </motion.span>
                )}

                {/* Collapsed Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-16 scale-0 rounded bg-primary border border-border-dark px-2 py-1 text-xs text-text-primary group-hover:scale-100 transition-all duration-100 origin-left z-50 shadow-xl">
                    {item.name}
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Profile & Logout */}
      <div className="p-3 border-t border-border-dark space-y-3 bg-secondary/10">
        {user && (
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : 'px-1'}`}>
            {user.avatar_url ? (
              <img
                src={user.avatar_url}
                alt={user.name}
                className="w-10 h-10 rounded-full border border-accent/20 object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-accent border border-accent/20 font-bold flex-shrink-0">
                {getInitials(user.name)}
              </div>
            )}

            {!isCollapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-text-primary truncate">{user.name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  {user.role === 'admin' ? (
                    <Shield className="w-3. h-3 text-accent" />
                  ) : null}
                  <span className="text-xs text-text-secondary capitalize truncate bg-secondary/50 px-1.5 py-0.5 rounded">
                    {user.role}
                  </span>
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={handleLogout}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/20 cursor-pointer transition-colors focus:outline-none ${
            isCollapsed ? 'justify-center' : ''
          }`}
        >
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span>Déconnexion</span>}

          {isCollapsed && (
            <div className="absolute left-16 scale-0 rounded bg-rose-950 border border-rose-800/40 px-2 py-1 text-xs text-rose-200 group-hover:scale-100 transition-all duration-100 origin-left z-50 shadow-xl">
              Déconnexion
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
