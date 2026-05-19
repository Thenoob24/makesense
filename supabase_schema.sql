-- Make Sense OS: Supabase Schema Setup

-- 1. PROFILES TABLE (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email TEXT NOT NULL,
  name TEXT,
  role TEXT DEFAULT 'consultant' CHECK (role IN ('admin', 'consultant')),
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- Trigger to automatically create a profile entry when a new user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name, role, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'consultant'),
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


-- 1.1 SEED DEFAULT AUTH USERS AND IDENTITIES (Admin and Consultant)
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Seed Admin User
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at, confirmation_token, email_change, 
  email_change_token_new, recovery_token
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'de305d54-75b4-431b-adb2-5bc6e987c123',
  'authenticated',
  'authenticated',
  'admin@makesense.agency',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Alexandre Le Grand (Admin)","role":"admin","avatar_url":"https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'de305d54-75b4-431b-adb2-5bc6e987c123' OR email = 'admin@makesense.agency'
);

-- Seed Admin Identity
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
SELECT 
  'de305d54-75b4-431b-adb2-5bc6e987c123',
  'de305d54-75b4-431b-adb2-5bc6e987c123',
  jsonb_build_object('sub', 'de305d54-75b4-431b-adb2-5bc6e987c123', 'email', 'admin@makesense.agency'),
  'email',
  'de305d54-75b4-431b-adb2-5bc6e987c123',
  NULL,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'de305d54-75b4-431b-adb2-5bc6e987c123' AND provider = 'email'
);

-- Seed Consultant User
INSERT INTO auth.users (
  instance_id, id, aud, role, email, encrypted_password, 
  email_confirmed_at, raw_app_meta_data, raw_user_meta_data, 
  created_at, updated_at, confirmation_token, email_change, 
  email_change_token_new, recovery_token
)
SELECT 
  '00000000-0000-0000-0000-000000000000',
  'e6403d52-9b2f-4889-8d19-4cb5f987d456',
  'authenticated',
  'authenticated',
  'consultant@makesense.agency',
  crypt('password123', gen_salt('bf')),
  now(),
  '{"provider":"email","providers":["email"]}',
  '{"name":"Sophie Dupont","role":"consultant","avatar_url":"https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80"}',
  now(),
  now(),
  '',
  '',
  '',
  ''
WHERE NOT EXISTS (
  SELECT 1 FROM auth.users WHERE id = 'e6403d52-9b2f-4889-8d19-4cb5f987d456' OR email = 'consultant@makesense.agency'
);

-- Seed Consultant Identity
INSERT INTO auth.identities (
  id, user_id, identity_data, provider, provider_id,
  last_sign_in_at, created_at, updated_at
)
SELECT 
  'e6403d52-9b2f-4889-8d19-4cb5f987d456',
  'e6403d52-9b2f-4889-8d19-4cb5f987d456',
  jsonb_build_object('sub', 'e6403d52-9b2f-4889-8d19-4cb5f987d456', 'email', 'consultant@makesense.agency'),
  'email',
  'e6403d52-9b2f-4889-8d19-4cb5f987d456',
  NULL,
  now(),
  now()
WHERE NOT EXISTS (
  SELECT 1 FROM auth.identities WHERE id = 'e6403d52-9b2f-4889-8d19-4cb5f987d456' AND provider = 'email'
);



-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT, -- Lucide icon name (e.g. 'Globe', 'Search', 'Layers')
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories viewable by everyone" 
ON public.categories FOR SELECT 
USING (true);

CREATE POLICY "Categories manageable by admin" 
ON public.categories FOR ALL 
USING (
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


-- 3. SOPS TABLE (Standard Operating Procedures)
CREATE TABLE IF NOT EXISTS public.sops (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  content TEXT NOT NULL, -- Markdown content
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE,
  tags TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for SOPs
ALTER TABLE public.sops ENABLE ROW LEVEL SECURITY;

CREATE POLICY "SOPs viewable by everyone" 
ON public.sops FOR SELECT 
USING (true);

CREATE POLICY "SOPs insertable by authenticated users" 
ON public.sops FOR INSERT 
WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "SOPs editable by author or admin" 
ON public.sops FOR UPDATE 
USING (
  auth.uid() = author_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);

CREATE POLICY "SOPs deletable by admin or author" 
ON public.sops FOR DELETE 
USING (
  auth.uid() = author_id OR 
  EXISTS (
    SELECT 1 FROM public.profiles 
    WHERE profiles.id = auth.uid() AND profiles.role = 'admin'
  )
);


-- 4. CLIENTS TABLE
CREATE TABLE IF NOT EXISTS public.clients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  logo_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Clients
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients viewable by everyone" 
ON public.clients FOR SELECT 
USING (true);

CREATE POLICY "Clients manageable by authenticated users" 
ON public.clients FOR ALL 
USING (auth.uid() IS NOT NULL);


-- 5. CLIENT ASSETS TABLE (Briefs, credentials, documents, notes)
CREATE TABLE IF NOT EXISTS public.client_assets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('brief', 'doc', 'credential', 'note')),
  content TEXT NOT NULL, -- Holds credential keys/passwords, links, or note markdown
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS for Client Assets
ALTER TABLE public.client_assets ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Client assets viewable by everyone" 
ON public.client_assets FOR SELECT 
USING (true);

CREATE POLICY "Client assets manageable by authenticated users" 
ON public.client_assets FOR ALL 
USING (auth.uid() IS NOT NULL);


-- 6. POPULATE INITIAL CATEGORIES
INSERT INTO public.categories (name, slug, description, icon) VALUES
('Acquisition (Paid Ads)', 'acquisition', 'Guidelines pour Facebook, Google, TikTok Ads et budgets.', 'TrendingUp'),
('SEO & Contenu', 'seo', 'Optimisation pour les moteurs de recherche et stratégie de contenu.', 'Search'),
('CRM & Emailing', 'crm-emailing', 'Rétention, relances paniers et newsletters e-commerce.', 'Mail'),
('Creative & Studio', 'creative', 'Processus créatifs, briefs vidéos UGC et chartes graphiques.', 'Video'),
('Reporting & Data', 'reporting', 'Création de dashboards et rapports de performance.', 'BarChart2'),
('Onboarding Client', 'onboarding', 'Intégration des nouveaux clients et transfert d''accès.', 'UserPlus')
ON CONFLICT (slug) DO NOTHING;
