import { createClient } from '@supabase/supabase-js';
import * as mock from './mockData';
import { getVectorEmbedding } from './vectorSearch';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isDemoMode = !supabaseUrl || !supabaseAnonKey;

if (isDemoMode) {
  console.warn(
    'Make Sense OS is running in DEMO MODE (Local Storage Fallback). Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env to connect to your live database.'
  );
}

export const supabase = !isDemoMode ? createClient(supabaseUrl, supabaseAnonKey) : null;

// Helper to simulate slow network in demo mode (makes UI transitions feel natural)
const delay = (ms = 300) => new Promise((resolve) => setTimeout(resolve, ms));

export const db = {
  // --- AUTH OPERATIONS ---
  auth: {
    async getCurrentUser(): Promise<mock.Profile | null> {
      if (isDemoMode) {
        await delay(100);
        const storedUser = localStorage.getItem('makesense_os_current_user');
        if (storedUser) return JSON.parse(storedUser);
        return null;
      }

      if (!supabase) return null;
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      return profile as mock.Profile || null;
    },

    async signIn(email: string, password: string): Promise<{ user: mock.Profile | null; error: Error | null }> {
      if (isDemoMode) {
        await delay(500);
        const profiles = mock.getLocalStorageData('profiles', mock.initialProfiles);
        // Special demo logins
        const user = profiles.find((p) => p.email.toLowerCase() === email.toLowerCase());
        if (user) {
          localStorage.setItem('makesense_os_current_user', JSON.stringify(user));
          return { user, error: null };
        }
        
        // If password is dummy and user doesn't exist, create a temporary consultant
        if (email.includes('@')) {
          const newUser: mock.Profile = {
            id: `usr-${Date.now()}`,
            email: email.toLowerCase(),
            name: email.split('@')[0].split('.').map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(' '),
            role: email.startsWith('admin') ? 'admin' : 'consultant',
            created_at: new Date().toISOString()
          };
          profiles.push(newUser);
          mock.saveLocalStorageData('profiles', profiles);
          localStorage.setItem('makesense_os_current_user', JSON.stringify(newUser));
          return { user: newUser, error: null };
        }

        return { user: null, error: new Error('Identifiants invalides en mode Démo. Utilisez n\'importe quel e-mail contenant un @.') };
      }

      if (!supabase) return { user: null, error: new Error('Supabase non configuré') };
      
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { user: null, error };

      if (data.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', data.user.id)
          .single();
        return { user: profile as mock.Profile, error: null };
      }
      return { user: null, error: new Error('Utilisateur non trouvé') };
    },

    async signOut(): Promise<void> {
      if (isDemoMode) {
        localStorage.removeItem('makesense_os_current_user');
        return;
      }
      if (supabase) {
        await supabase.auth.signOut();
      }
    },

    async getProfiles(): Promise<mock.Profile[]> {
      if (isDemoMode) {
        await delay(200);
        return mock.getLocalStorageData('profiles', mock.initialProfiles);
      }
      if (!supabase) return [];
      const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: true });
      return (data as mock.Profile[]) || [];
    },

    async updateProfileRole(id: string, role: 'admin' | 'consultant'): Promise<mock.Profile | null> {
      if (isDemoMode) {
        await delay(200);
        const profiles = mock.getLocalStorageData('profiles', mock.initialProfiles);
        const updated = profiles.map((p) => (p.id === id ? { ...p, role } : p));
        mock.saveLocalStorageData('profiles', updated);
        
        // Update current user if role changed
        const current = localStorage.getItem('makesense_os_current_user');
        if (current) {
          const currentUserObj = JSON.parse(current);
          if (currentUserObj.id === id) {
            currentUserObj.role = role;
            localStorage.setItem('makesense_os_current_user', JSON.stringify(currentUserObj));
          }
        }
        return updated.find(p => p.id === id) || null;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('profiles').update({ role }).eq('id', id).select().single();
      return data as mock.Profile;
    }
  },

  // --- CATEGORIES OPERATIONS ---
  categories: {
    async list(): Promise<mock.Category[]> {
      if (isDemoMode) {
        await delay(100);
        return mock.getLocalStorageData('categories', mock.initialCategories);
      }
      if (!supabase) return [];
      const { data } = await supabase.from('categories').select('*').order('name', { ascending: true });
      return (data as mock.Category[]) || [];
    },

    async create(name: string, description: string, icon: string): Promise<mock.Category | null> {
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      if (isDemoMode) {
        await delay(200);
        const categories = mock.getLocalStorageData('categories', mock.initialCategories);
        const newCat: mock.Category = { id: `cat-${Date.now()}`, name, slug, description, icon };
        categories.push(newCat);
        mock.saveLocalStorageData('categories', categories);
        return newCat;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('categories').insert({ name, slug, description, icon }).select().single();
      return data as mock.Category;
    },

    async delete(id: string): Promise<boolean> {
      if (isDemoMode) {
        await delay(200);
        const categories = mock.getLocalStorageData('categories', mock.initialCategories);
        const filtered = categories.filter((c) => c.id !== id);
        mock.saveLocalStorageData('categories', filtered);
        return true;
      }
      if (!supabase) return false;
      const { error } = await supabase.from('categories').delete().eq('id', id);
      return !error;
    }
  },

  // --- SOPS OPERATIONS ---
  sops: {
    async list(): Promise<mock.SOP[]> {
      if (isDemoMode) {
        await delay(200);
        const rawSops = mock.getLocalStorageData('sops', mock.initialSOPs);
        return rawSops.map(sop => ({
          ...sop,
          embedding: sop.embedding || getVectorEmbedding(sop.title + " " + sop.content, sop.tags)
        }));
      }
      if (!supabase) return [];
      const { data } = await supabase.from('sops').select('*').order('updated_at', { ascending: false });
      const rawSops = (data as mock.SOP[]) || [];
      return rawSops.map(sop => ({
        ...sop,
        embedding: sop.embedding || getVectorEmbedding(sop.title + " " + sop.content, sop.tags)
      }));
    },

    async create(sopData: Omit<mock.SOP, 'id' | 'created_at' | 'updated_at'>): Promise<mock.SOP | null> {
      const slug = sopData.title.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const timestamp = new Date().toISOString();
      const embedding = getVectorEmbedding(sopData.title + " " + sopData.content, sopData.tags);
      if (isDemoMode) {
        await delay(300);
        const sops = mock.getLocalStorageData('sops', mock.initialSOPs);
        const newSop: mock.SOP = {
          ...sopData,
          id: `sop-${Date.now()}`,
          slug: `${slug}-${Math.floor(Math.random() * 1000)}`,
          created_at: timestamp,
          updated_at: timestamp,
          embedding
        };
        sops.unshift(newSop);
        mock.saveLocalStorageData('sops', sops);
        return newSop;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('sops').insert({ ...sopData, slug, embedding }).select().single();
      const createdSop = data as mock.SOP;
      if (createdSop) {
        createdSop.embedding = createdSop.embedding || embedding;
      }
      return createdSop;
    },

    async update(id: string, sopData: Partial<Omit<mock.SOP, 'id' | 'created_at' | 'updated_at'>>): Promise<mock.SOP | null> {
      const timestamp = new Date().toISOString();
      if (isDemoMode) {
        await delay(300);
        const sops = mock.getLocalStorageData('sops', mock.initialSOPs);
        const updated = sops.map((s) => {
          if (s.id === id) {
            const merged = { ...s, ...sopData, updated_at: timestamp };
            merged.embedding = getVectorEmbedding(merged.title + " " + merged.content, merged.tags);
            return merged;
          }
          return s;
        });
        mock.saveLocalStorageData('sops', updated);
        return updated.find((s) => s.id === id) || null;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('sops').update({ ...sopData, updated_at: timestamp }).eq('id', id).select().single();
      const updatedSop = data as mock.SOP;
      if (updatedSop) {
        updatedSop.embedding = updatedSop.embedding || getVectorEmbedding(updatedSop.title + " " + updatedSop.content, updatedSop.tags);
      }
      return updatedSop;
    },

    async delete(id: string): Promise<boolean> {
      if (isDemoMode) {
        await delay(200);
        const sops = mock.getLocalStorageData('sops', mock.initialSOPs);
        const filtered = sops.filter((s) => s.id !== id);
        mock.saveLocalStorageData('sops', filtered);
        return true;
      }
      if (!supabase) return false;
      const { error } = await supabase.from('sops').delete().eq('id', id);
      return !error;
    }
  },

  // --- CLIENTS OPERATIONS ---
  clients: {
    async list(): Promise<mock.Client[]> {
      if (isDemoMode) {
        await delay(150);
        return mock.getLocalStorageData('clients', mock.initialClients);
      }
      if (!supabase) return [];
      const { data } = await supabase.from('clients').select('*').order('name', { ascending: true });
      return (data as mock.Client[]) || [];
    },

    async create(name: string, description: string, logo_url?: string): Promise<mock.Client | null> {
      const slug = name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const timestamp = new Date().toISOString();
      if (isDemoMode) {
        await delay(250);
        const clients = mock.getLocalStorageData('clients', mock.initialClients);
        const newClient: mock.Client = {
          id: `cli-${Date.now()}`,
          name,
          slug,
          logo_url: logo_url || `https://images.unsplash.com/photo-1572021335469-31706a17aaef?w=100&auto=format&fit=crop&q=80`,
          description,
          created_at: timestamp
        };
        clients.push(newClient);
        mock.saveLocalStorageData('clients', clients);
        return newClient;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('clients').insert({ name, slug, description, logo_url }).select().single();
      return data as mock.Client;
    },

    async delete(id: string): Promise<boolean> {
      if (isDemoMode) {
        await delay(200);
        const clients = mock.getLocalStorageData('clients', mock.initialClients);
        const filtered = clients.filter((c) => c.id !== id);
        mock.saveLocalStorageData('clients', filtered);
        
        // Cascade delete assets
        const assets = mock.getLocalStorageData('assets', mock.initialClientAssets);
        const filteredAssets = assets.filter((a) => a.client_id !== id);
        mock.saveLocalStorageData('assets', filteredAssets);
        return true;
      }
      if (!supabase) return false;
      const { error } = await supabase.from('clients').delete().eq('id', id);
      return !error;
    }
  },

  // --- CLIENT ASSETS OPERATIONS ---
  assets: {
    async listByClient(clientId: string): Promise<mock.ClientAsset[]> {
      if (isDemoMode) {
        await delay(100);
        const assets = mock.getLocalStorageData('assets', mock.initialClientAssets);
        return assets.filter((a) => a.client_id === clientId);
      }
      if (!supabase) return [];
      const { data } = await supabase.from('client_assets').select('*').eq('client_id', clientId).order('created_at', { ascending: false });
      return (data as mock.ClientAsset[]) || [];
    },

    async create(assetData: Omit<mock.ClientAsset, 'id' | 'created_at'>): Promise<mock.ClientAsset | null> {
      const timestamp = new Date().toISOString();
      if (isDemoMode) {
        await delay(200);
        const assets = mock.getLocalStorageData('assets', mock.initialClientAssets);
        const newAsset: mock.ClientAsset = {
          ...assetData,
          id: `ast-${Date.now()}`,
          created_at: timestamp
        };
        assets.unshift(newAsset);
        mock.saveLocalStorageData('assets', assets);
        return newAsset;
      }
      if (!supabase) return null;
      const { data } = await supabase.from('client_assets').insert(assetData).select().single();
      return data as mock.ClientAsset;
    },

    async delete(id: string): Promise<boolean> {
      if (isDemoMode) {
        await delay(150);
        const assets = mock.getLocalStorageData('assets', mock.initialClientAssets);
        const filtered = assets.filter((a) => a.id !== id);
        mock.saveLocalStorageData('assets', filtered);
        return true;
      }
      if (!supabase) return false;
      const { error } = await supabase.from('client_assets').delete().eq('id', id);
      return !error;
    }
  }
};
