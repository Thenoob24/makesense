import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Layout } from './components/Layout';
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { KnowledgeBase } from './pages/KnowledgeBase';
import { Clients } from './pages/Clients';
import { Search } from './pages/Search';
import { AdminSettings } from './pages/AdminSettings';
import { useEffect } from 'react';
import { isDemoMode, supabase } from './lib/supabase';
import { resetLocalDatabase } from './lib/mockData';
import './App.css';

function App() {
  useEffect(() => {
    const runDailyResetCheck = async () => {
      if (isDemoMode) {
        const lastReset = localStorage.getItem('makesense_os_last_reset');
        const oneDay = 24 * 60 * 60 * 1000;
        if (!lastReset || Date.now() - new Date(lastReset).getTime() > oneDay) {
          try {
            resetLocalDatabase();
            localStorage.setItem('makesense_os_last_reset', new Date().toISOString());
            console.log("Demo LocalStorage successfully reset.");
          } catch (e) {
            console.error("Failed to reset LocalStorage:", e);
          }
        }
      } else if (supabase) {
        try {
          const { error } = await supabase.rpc('check_and_reset_database_daily');
          if (error) {
            console.error("Daily database reset trigger error:", error);
          } else {
            console.log("Supabase daily database reset check completed.");
          }
        } catch (e) {
          console.error("Failed to call check_and_reset_database_daily:", e);
        }
      }
    };

    runDailyResetCheck();
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            
            {/* Guarded routes via Layout */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/knowledge-base" element={<KnowledgeBase />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/search" element={<Search />} />
            <Route path="/admin" element={<AdminSettings />} />
            
            {/* Fallback routing */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Layout>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
