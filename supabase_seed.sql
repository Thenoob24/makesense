-- Make Sense OS: Supabase Database Seed Script
-- Run this in your Supabase SQL Editor to populate the database with demo accounts, categories, clients, and SOPs.

-- 1. ENABLE EXTENSIONS
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- 2. SEED AUTH USERS & IDENTITIES
-- Seed Admin User (admin@makesense.agency / password123)
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

-- Seed Consultant User (consultant@makesense.agency / password123)
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

-- 3. SEED PUBLIC PROFILES (Fallback in case handles_new_user trigger did not run)
INSERT INTO public.profiles (id, email, name, role, avatar_url)
VALUES 
  ('de305d54-75b4-431b-adb2-5bc6e987c123', 'admin@makesense.agency', 'Alexandre Le Grand (Admin)', 'admin', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'),
  ('e6403d52-9b2f-4889-8d19-4cb5f987d456', 'consultant@makesense.agency', 'Sophie Dupont', 'consultant', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- 4. SEED CATEGORIES
-- Clean up categories with auto-generated IDs to prevent unique constraint conflicts on slug
DELETE FROM public.categories WHERE slug IN ('acquisition', 'seo', 'crm-emailing', 'creative', 'reporting', 'onboarding') AND id NOT IN (
  'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
  'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
  'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
  'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
  'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
  'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6'
);

INSERT INTO public.categories (id, name, slug, description, icon) VALUES
  ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Acquisition (Paid Ads)', 'acquisition', 'Guidelines pour Facebook, Google, TikTok Ads et gestion des budgets.', 'TrendingUp'),
  ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'SEO & Contenu', 'seo', 'Optimisation pour les moteurs de recherche et stratégie de contenu.', 'Search'),
  ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'CRM & Emailing', 'crm-emailing', 'Rétention, relances paniers et newsletters e-commerce.', 'Mail'),
  ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Creative & Studio', 'creative', 'Processus créatifs, briefs vidéos UGC et chartes graphiques.', 'Video'),
  ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Reporting & Data', 'reporting', 'Création de dashboards et rapports de performance.', 'BarChart2'),
  ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Onboarding Client', 'onboarding', 'Intégration des nouveaux clients et transfert d''accès.', 'UserPlus')
ON CONFLICT (id) DO NOTHING;

-- 5. SEED CLIENTS
DELETE FROM public.clients WHERE slug IN ('ecocup', 'motoblouz', 'maison-lepage') AND id NOT IN (
  '11111111-1111-1111-1111-111111111111',
  '22222222-2222-2222-2222-222222222222',
  '33333333-3333-3333-3333-333333333333'
);

INSERT INTO public.clients (id, name, slug, logo_url, description, created_at) VALUES
  ('11111111-1111-1111-1111-111111111111', 'Ecocup', 'ecocup', 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=100&auto=format&fit=crop&q=80', 'Leader français du gobelet réutilisable personnalisé. Accompagnement sur Meta Ads, Google Ads et CRM retention.', '2025-01-10T08:00:00.000Z'),
  ('22222222-2222-2222-2222-222222222222', 'Motoblouz', 'motoblouz', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80', 'N°1 de la vente en ligne d’équipements moto en France. Optimisation du catalogue produit Google Shopping et campagnes Search.', '2025-03-15T09:00:00.000Z'),
  ('33333333-3333-3333-3333-333333333333', 'Maison Lepage', 'maison-lepage', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80', 'Horlogerie et Joaillerie de luxe depuis 1922. Campagnes Social Ads haut de gamme et newsletters de fidélisation clients VIP.', '2025-06-20T10:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 6. SEED SOPS
INSERT INTO public.sops (id, title, slug, category_id, tags, content, author_id, created_at, updated_at) VALUES
  ('44444444-4444-4444-4444-444444444444', 'Structuration de Compte Meta Ads (Scale & Consolidation)', 'structuration-compte-meta-ads', 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', ARRAY['meta-ads', 'acquisition', 'scaling', 'performance'], '# Structuration de Compte Meta Ads (Scale & Consolidation)

Cette SOP définit la structure de compte recommandée par l''agence Make Sense pour maximiser l''efficacité de l''algorithme de Meta et scaler les budgets de manière prévisible.

## 1. Principes Fondamentaux
*   **Consolidation du signal** : Moins de campagnes et d''ensembles de publicités = plus de data par ad set = sortie rapide de la phase d''apprentissage.
*   **Targeting large (Broad)** : Utiliser le ciblage sans intérêt ni Lookalike pour laisser l''algorithme trouver les meilleures opportunités basé sur la créative.
*   **CBO (Campaign Budget Optimization)** activé par défaut.

## 2. Structure du Compte (Le "3-Campagnes Framework")

### Campagne 1 : TOFU - Acquisition Main (CBO)
*   **Objectif** : Ventes (Conversion) - Optimisé pour l''achat.
*   **Budget** : 70-80% du budget global.
*   **Ad Sets** :
    1.  **Broad (100% Large)** : Hommes/Femmes 18-65+, aucun intérêt, aucune Lookalike. Exclusion des acheteurs 180j.
    2.  **ASC+ (Advantage+ Shopping Campaign)** : Campagne automatisée Meta avec 100% de budget sur les nouveaux clients.
    3.  **Creative Sandbox** : Ad set dédié au test de nouveaux concepts créatifs (budget restreint).
*   **Exclusions** : Acheteurs 180 jours (appliquées dans les paramètres du compte ou directement dans l''Ad Set Broad).', 'de305d54-75b4-431b-adb2-5bc6e987c123', '2026-05-01T10:00:00.000Z', '2026-05-18T16:30:00.000Z'),

  ('55555555-5555-5555-5555-555555555555', 'Sequence de Paniers Abandonnes sur Klaviyo', 'sequence-paniers-abandonnes-klaviyo', 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', ARRAY['klaviyo', 'crm', 'retention', 'emailing'], '# Séquence de Paniers Abandonnés (CRM Klaviyo)

Le panier abandonné est le flux d''emailing e-commerce le plus rentable. Cette SOP décrit la structure en 3 étapes validée par l''agence pour générer entre 8% et 15% de CA additionnel.

## 1. Déclencheurs (Triggers) & Filtres
*   **Trigger** : `Checkout Started` (ou `Added to Cart` si l''intégration le permet).
*   **Filtres de flux** :
    *   `Placed Order` zero times since starting this flow.
    *   `Has not been in this flow in the last 14 days`.

## 2. Structure de la Séquence (3 Emails)

### Email 1 : Le Rappel Amical (Pas de promotion)
*   **Délai** : 30 minutes après l''abandon.
*   **Objet** : *Oups... Vous avez oublié quelque chose ?* ou *Votre panier vous attend chez [Nom du Client]*
*   **Contenu** :
    *   Dynamic product block (affiche les articles oubliés).
    *   Témoignage client rassurant sous le panier.
    *   Bouton d''appel à l''action (CTA) clair : "Finaliser ma commande".
*   **Objectif** : Convertir les utilisateurs qui ont eu une distraction technique ou un manque de temps.

### Email 2 : La Réassurance & FAQ (Pas de promotion)
*   **Délai** : 24 heures après l''Email 1.
*   **Objet** : *Une question sur votre commande ?* ou *Besoin d''aide pour finaliser ?*
*   **Contenu** :
    *   Mise en avant des garanties : Livraison gratuite, retours faciles sous 30 jours, paiement en 3x.
    *   FAQ simple (3-4 questions fréquentes sur les tailles, livraison, etc.).
    *   Accès direct au support client par chat ou email.

### Email 3 : L''Incentive de Fin (Code Promo Exclusif)
*   **Délai** : 48 heures après l''Email 2.
*   **Objet** : *10% offerts sur votre panier (valable 48h)* ou *Dernière chance pour récupérer votre panier*
*   **Contenu** :
    *   Code promotionnel dynamique à durée limitée (-10% ou livraison offerte).
    *   Compte à rebours de 48h pour ajouter un sentiment d''urgence.
    *   Avertissement que le panier sera vidé passé ce délai.

## 3. AB Testing Recommandé
*   **Sujet** : Tester l''utilisation d''émojis dans les objets vs des objets ultra-minimalistes (ex: *Panier abandonné ?*).', 'e6403d52-9b2f-4889-8d19-4cb5f987d456', '2026-05-14T09:00:00.000Z', '2026-05-18T10:00:00.000Z')
ON CONFLICT (id) DO NOTHING;

-- 7. SEED CLIENT ASSETS
INSERT INTO public.client_assets (id, client_id, title, type, content, created_at) VALUES
  ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Brief Campagne Festivals Été 2026', 'brief', '## Brief Campagne Festivals Été 2026 - Ecocup
*   **Créateur** : Profil étudiant / fêtard.
*   **Hook** : "Pourquoi j''ai arrêté d''acheter des gobelets en plastique jetables..."
*   **Corps** : Démonstration de la solidité et des designs colorés d''Ecocup en situation de soirée.
*   **CTA** : Visiter le site et commander son pack personnalisé.', '2026-05-15T10:00:00.000Z'),

  ('99999999-9999-9999-9999-999999999999', '11111111-1111-1111-1111-111111111111', 'Accès Plateformes', 'credential', '*   **Meta Business Manager ID** : 874920384729103
*   **Shopify Admin** : https://ecocup-france.myshopify.com/admin
*   **Identifiant Shopify** : partner-dev@makesense.agency
*   **Mot de passe** : [Masqué] Contacter Alexandre (Admin) pour la clé d''accès.', '2026-05-01T08:00:00.000Z'),

  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '11111111-1111-1111-1111-111111111111', 'Compte-rendu Kickoff Q2', 'note', '### Décisions de la réunion du 12 Avril 2026 :
1.  **Focus Marges** : Réduire le budget sur les gobelets à faible marge (modèles unis) pour pousser les gobelets imprimés en quadrichromie.
2.  **Taux de conversion** : Lancer un audit de l''entonnoir d''achat Shopify car le taux de conversion mobile a chuté de 2.1% à 1.6% le mois dernier.', '2026-04-12T14:00:00.000Z'),

  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '22222222-2222-2222-2222-222222222222', 'Identifiants Google Ads & GMC', 'credential', '*   **Google Ads CID** : 492-384-0192
*   **Google Merchant Center ID** : 12948203
*   **Feed Manager** : Lengow (Accès via SSO de l''agence)', '2026-05-02T10:00:00.000Z'),

  ('cccccccc-cccc-cccc-cccc-cccccccccccc', '22222222-2222-2222-2222-222222222222', 'Notes Optimisation Shopping', 'note', '*   **Action** : Ajouter la marque et la taille des casques de moto dans les titres des produits du flux Google Shopping.
*   **Résultat attendu** : +20% de clics qualifiés sur les recherches spécifiques.', '2026-05-14T11:00:00.000Z'),

  ('dddddddd-dddd-dddd-dddd-dddddddddddd', '33333333-3333-3333-3333-333333333333', 'Brief Fête des Mères 2026', 'brief', '## Brief Campagne Fête des Mères - Maison Lepage
*   **Période** : 10 mai au 25 mai 2026.
*   **Budget** : 10 000€ Meta Ads.
*   **Sélection produits** : Bracelets or 18 carats et colliers diamants.', '2026-05-10T09:00:00.000Z')
ON CONFLICT (id) DO NOTHING;
