-- Make Sense OS: Daily Automatic Database Reset SQL Script
-- Execute this script in your Supabase SQL Editor.

-- 1. Create system_settings table to track metadata like last reset
CREATE TABLE IF NOT EXISTS public.system_settings (
  key TEXT PRIMARY KEY,
  value TEXT
);

-- 2. Enable row level security on settings, but allow SELECT
ALTER TABLE public.system_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone" 
ON public.system_settings FOR SELECT 
USING (true);

-- 2.1 SEED DEFAULT AUTH USERS AND IDENTITIES (Admin and Consultant)
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

-- 3. Main database reset function (using SECURITY DEFINER to bypass RLS policies)
CREATE OR REPLACE FUNCTION public.reset_database_to_initial()
RETURNS void AS $$
BEGIN
  -- Clean up existing data in correct dependency order
  DELETE FROM public.client_assets;
  DELETE FROM public.clients;
  DELETE FROM public.sops;
  DELETE FROM public.categories;

  -- Seed categories
  INSERT INTO public.categories (id, name, slug, description, icon) VALUES
    ('a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1', 'Acquisition (Paid Ads)', 'acquisition', 'Guidelines pour Facebook, Google, TikTok Ads et gestion des budgets.', 'TrendingUp'),
    ('b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2', 'SEO & Contenu', 'seo', 'Optimisation pour les moteurs de recherche et stratégie de contenu.', 'Search'),
    ('c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3', 'CRM & Emailing', 'crm-emailing', 'Rétention, relances paniers et newsletters e-commerce.', 'Mail'),
    ('d4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', 'Creative & Studio', 'creative', 'Processus créatifs, briefs vidéos UGC et chartes graphiques.', 'Video'),
    ('e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', 'Reporting & Data', 'reporting', 'Création de dashboards et rapports de performance.', 'BarChart2'),
    ('f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6', 'Onboarding Client', 'onboarding', 'Intégration des nouveaux clients et transfert d''accès.', 'UserPlus');

  -- Seed clients
  INSERT INTO public.clients (id, name, slug, logo_url, description, created_at) VALUES
    ('11111111-1111-1111-1111-111111111111', 'Ecocup', 'ecocup', 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=100&auto=format&fit=crop&q=80', 'Leader français du gobelet réutilisable personnalisé. Accompagnement sur Meta Ads, Google Ads et CRM retention.', '2025-01-10T08:00:00.000Z'),
    ('22222222-2222-2222-2222-222222222222', 'Motoblouz', 'motoblouz', 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80', 'N°1 de la vente en ligne d’équipements moto en France. Optimisation du catalogue produit Google Shopping et campagnes Search.', '2025-03-15T09:00:00.000Z'),
    ('33333333-3333-3333-3333-333333333333', 'Maison Lepage', 'maison-lepage', 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80', 'Horlogerie et Joaillerie de luxe depuis 1922. Campagnes Social Ads haut de gamme et newsletters de fidélisation clients VIP.', '2025-06-20T10:00:00.000Z');

  -- Seed SOPs
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
*   **Sujet** : Tester l''utilisation d''émojis dans les objets vs des objets ultra-minimalistes (ex: *Panier abandonné ?*).
*   **Incentive** : Tester Livraison Offerte vs -10% de réduction pour voir l''impact sur la marge globale.', 'e6403d52-9b2f-4889-8d19-4cb5f987d456', '2026-05-04T12:00:00.000Z', '2026-05-15T09:15:00.000Z'),

    ('66666666-6666-6666-6666-666666666666', 'Creation de Briefing UGC (User Generated Content)', 'creation-briefing-ugc', 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4', ARRAY['ugc', 'creative', 'tiktok-ads', 'brief'], '# Guide de Création de Briefing UGC (User Generated Content)

Cette SOP détaille comment structurer un brief pour un créateur de contenu UGC afin de garantir un livrable performant pour Meta Ads et TikTok Ads.

## 1. Le Framework de la Vidéo UGC (Le Modèle AIDA)

Chaque vidéo UGC de 15 à 30 secondes doit suivre cette structure de script :

| Section | Durée | Objectif | Exemples de Scripts |
| :--- | :--- | :--- | :--- |
| **Hook (Accroche)** | 0 - 3 sec | Arrêter le scroll de l''utilisateur. | "Pourquoi tout le monde parle de ce produit...", "Ne faites pas cette erreur avec..." |
| **Problem (Problème)** | 3 - 8 sec | Créer de l''empathie et identifier le point de douleur. | "J''avais toujours la peau sèche en hiver...", "Mes matinées étaient un enfer..." |
| **Solution (Produit)** | 8 - 18 sec | Présenter le produit en action (bénéfices et non caractéristiques). | "J''ai testé ce baume et en 3 jours...", "Ce gadget a changé ma routine..." |
| **Call To Action** | 18 - 25 sec | Inciter à l''action immédiate. | "Profitez de -15% aujourd''hui avec le code...", "Lien en bio pour commander." |

## 2. Spécifications Techniques à inclure
*   **Format** : Vertical 9:16 (1080x1920).
*   **Résolution** : 1080p, 30 ou 60 FPS. Éclairage naturel obligatoire.
*   **Son** : Voix off claire, pas de bruit de fond. Fournir le script brut sans musique (nous gérons la musique en post-prod).
*   **Livrable** : Envoyer la vidéo montée finale + tous les rushs bruts (B-roll) pour nous permettre de tester d''autres accroches.

## 3. Consignes d''Attitude pour le Créateur
*   S''adresser directement à la caméra (comme à un ami).
*   Parler avec enthousiasme naturel, éviter le ton "télé-achat".
*   Montrer des gros plans du produit (textures, packaging, application).', 'de305d54-75b4-431b-adb2-5bc6e987c123', '2026-05-08T08:00:00.000Z', '2026-05-12T14:20:00.000Z'),

    ('77777777-7777-7777-7777-777777777777', 'Calcul et Suivi du MER (Marketing Efficiency Ratio)', 'calcul-suivi-mer-reporting', 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5', ARRAY['reporting', 'analytics', 'mer', 'data'], '# Calcul et Suivi du MER (Marketing Efficiency Ratio)

Avec la perte de précision des pixels (iOS14+), le ROAS des plateformes est souvent biaisé. Cette SOP explique comment calculer et piloter les performances d''un client e-commerce via le MER (ou Blended ROAS).

## 1. Définitions & Formule
Le **MER** mesure l''efficacité globale de vos dépenses publicitaires sur le chiffre d''affaires total généré.

**Formule :**
$$\text{MER} = \frac{\text{Chiffre d''Affaires Total (HT)}}{\text{Dépenses Publicitaires Globales}}$$

Où :
*   **Chiffre d''Affaires Total (HT)** = CA Shopify / WooCommerce (hors taxes et frais de livraison).
*   **Dépenses Publicitaires Globales** = Dépenses Meta + Dépenses Google + Dépenses TikTok + Dépenses Pinterest, etc.

## 2. Grille de Lecture des Performances (Benchmarks)

*   **MER < 3.0** : Zone Rouge. L''acquisition publicitaire consomme trop de marge. Sauf si le client est en phase de lancement agressif, il faut couper ou restructurer.
*   **MER 3.0 - 4.5** : Zone Stable / Rentable. Bon équilibre. Permet de maintenir l''activité et de dégager des profits modérés.
*   **MER > 5.0** : Excellente Rentabilité. Zone de Scaling. Le client a de l''espace pour augmenter ses budgets d''acquisition.

## 3. Fréquence de calcul
Le MER doit être renseigné dans le dashboard agence à 3 fréquences :
1.  **Hebdomadaire (Chaque lundi)** : Pour piloter les budgets de la semaine en cours.
2.  **Mensuel (Le 2 de chaque mois)** : Analyse stratégique globale.
3.  **Trimestriel (QBR)** : Pour analyser la saisonnalité et l''évolution de la LTV.', 'e6403d52-9b2f-4889-8d19-4cb5f987d456', '2026-05-10T11:00:00.000Z', '2026-05-10T11:00:00.000Z');

  -- Seed client assets
  INSERT INTO public.client_assets (id, client_id, title, type, content, created_at) VALUES
    ('88888888-8888-8888-8888-888888888888', '11111111-1111-1111-1111-111111111111', 'Brief Campagne Festivals Été 2026', 'brief', '## Brief Campagne Festivals Été 2026 - Ecocup

### 1. Objectifs
Générer des commandes de gobelets personnalisés pour les festivals, mariages, et événements d''été.
*   **Target CPA** : 18.00€
*   **Budget mensuel alloué** : 15 000€ sur Meta, 5 000€ sur Google Search.

### 2. Ciblage Meta
*   **Ad Set 1 (Broad)** : B2B et Particuliers, France entière, 18-50 ans.
*   **Ad Set 2 (Intérêts)** : Event planners, Organisateurs de festivals, Wedding planners.

### 3. Angles Créatifs requis
1.  **Angle B2C Mariage** : "Personnalisez vos gobelets pour le plus beau jour de votre vie (livraison rapide)".
2.  **Angle B2B Pro** : "Festivals, associations : passez au vert avec vos gobelets consignés imprimés en France".', '2026-05-10T09:00:00.000Z'),

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
*   **Sélection produits** : Bracelets or 18 carats et colliers diamants.', '2026-05-10T09:00:00.000Z');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create function that evaluates if a reset is needed (more than 24h since last reset)
CREATE OR REPLACE FUNCTION public.check_and_reset_database_daily()
RETURNS void AS $$
DECLARE
  last_reset timestamp;
BEGIN
  -- Retrieve last reset date
  SELECT CAST(value AS timestamp) INTO last_reset 
  FROM public.system_settings 
  WHERE key = 'last_db_reset';
  
  -- If empty or >24 hours ago, run the reset
  IF last_reset IS NULL OR last_reset < now() - INTERVAL '1 day' THEN
    PERFORM public.reset_database_to_initial();
    
    -- Insert/Update setting key
    INSERT INTO public.system_settings (key, value)
    VALUES ('last_db_reset', CAST(now() AS TEXT))
    ON CONFLICT (key) DO UPDATE SET value = CAST(now() AS TEXT);
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 5. Optional pg_cron setup (if supported/activated on your Supabase instance)
-- SELECT cron.schedule('daily-db-reset', '0 0 * * *', 'SELECT public.check_and_reset_database_daily()');
