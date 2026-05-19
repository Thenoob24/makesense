export interface Profile {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'consultant';
  avatar_url?: string;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
}

export interface SOP {
  id: string;
  title: string;
  slug: string;
  content: string;
  category_id: string;
  tags: string[];
  author_id: string;
  created_at: string;
  updated_at: string;
  embedding?: number[];
}

export interface Client {
  id: string;
  name: string;
  slug: string;
  logo_url?: string;
  description: string;
  created_at: string;
}

export interface ClientAsset {
  id: string;
  client_id: string;
  title: string;
  type: 'brief' | 'doc' | 'credential' | 'note';
  content: string;
  created_at: string;
}

export interface AITemplate {
  id: string;
  name: string;
  description: string;
  prompt_template: string;
  category: string;
  variables: { name: string; label: string; placeholder: string; type: string }[];
}

export const initialProfiles: Profile[] = [
  {
    id: 'de305d54-75b4-431b-adb2-5bc6e987c123',
    email: 'admin@makesense.agency',
    name: 'Alexandre Le Grand (Admin)',
    role: 'admin',
    avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  },
  {
    id: 'e6403d52-9b2f-4889-8d19-4cb5f987d456',
    email: 'consultant@makesense.agency',
    name: 'Sophie Dupont',
    role: 'consultant',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&auto=format&fit=crop&q=80',
    created_at: new Date().toISOString()
  }
];

export const initialCategories: Category[] = [
  {
    id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    name: 'Acquisition (Paid Ads)',
    slug: 'acquisition',
    description: 'Guidelines pour Facebook, Google, TikTok Ads et gestion des budgets.',
    icon: 'TrendingUp'
  },
  {
    id: 'b2b2b2b2-b2b2-b2b2-b2b2-b2b2b2b2b2b2',
    name: 'SEO & Contenu',
    slug: 'seo',
    description: 'Optimisation pour les moteurs de recherche et stratégie de contenu.',
    icon: 'Search'
  },
  {
    id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    name: 'CRM & Emailing',
    slug: 'crm-emailing',
    description: 'Rétention, relances paniers et newsletters e-commerce.',
    icon: 'Mail'
  },
  {
    id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
    name: 'Creative & Studio',
    slug: 'creative',
    description: 'Processus créatifs, briefs vidéos UGC et chartes graphiques.',
    icon: 'Video'
  },
  {
    id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    name: 'Reporting & Data',
    slug: 'reporting',
    description: 'Création de dashboards et rapports de performance.',
    icon: 'BarChart2'
  },
  {
    id: 'f6f6f6f6-f6f6-f6f6-f6f6-f6f6f6f6f6f6',
    name: 'Onboarding Client',
    slug: 'onboarding',
    description: "Intégration des nouveaux clients et transfert d'accès.",
    icon: 'UserPlus'
  }
];

export const initialSOPs: SOP[] = [
  {
    id: '44444444-4444-4444-4444-444444444444',
    title: 'Structuration de Compte Meta Ads (Scale & Consolidation)',
    slug: 'structuration-compte-meta-ads',
    category_id: 'a1a1a1a1-a1a1-a1a1-a1a1-a1a1a1a1a1a1',
    tags: ['meta-ads', 'acquisition', 'scaling', 'performance'],
    author_id: 'de305d54-75b4-431b-adb2-5bc6e987c123',
    created_at: '2026-05-01T10:00:00.000Z',
    updated_at: '2026-05-18T16:30:00.000Z',
    content: `# Structuration de Compte Meta Ads (Scale & Consolidation)

Cette SOP définit la structure de compte recommandée par l'agence Make Sense pour maximiser l'efficacité de l'algorithme de Meta et scaler les budgets de manière prévisible.

## 1. Principes Fondamentaux
*   **Consolidation du signal** : Moins de campagnes et d'ensembles de publicités = plus de data par ad set = sortie rapide de la phase d'apprentissage.
*   **Targeting large (Broad)** : Utiliser le ciblage sans intérêt ni Lookalike pour laisser l'algorithme trouver les meilleures opportunités basé sur la créative.
*   **CBO (Campaign Budget Optimization)** activé par défaut.

## 2. Structure du Compte (Le "3-Campagnes Framework")

### Campagne 1 : TOFU - Acquisition Main (CBO)
*   **Objectif** : Ventes (Conversion) - Optimisé pour l'achat.
*   **Budget** : 70-80% du budget global.
*   **Ad Sets** :
    1.  **Broad (100% Large)** : Hommes/Femmes 18-65+, aucun intérêt, aucune Lookalike. Exclusion des acheteurs 180j.
    2.  **ASC+ (Advantage+ Shopping Campaign)** : Campagne automatisée Meta avec 100% de budget sur les nouveaux clients.
    3.  **Creative Sandbox** : Ad set dédié au test de nouveaux concepts créatifs (budget restreint).
*   **Exclusions** : Acheteurs 180 jours (appliquées dans les paramètres du compte ou directement dans l'Ad Set Broad).

### Campagne 2 : Retargeting (BOFU) - Optionnel
*   **Objectif** : Ventes (Conversion) - Optimisé pour l'achat.
*   **Budget** : 5-10% maximum (uniquement si la base d'audience personnalisée est > 10 000 personnes).
*   **Ad Set** : Visiteurs 30j + Ajouts au panier 30j. Exclusion des acheteurs 180j.
*   **Contenu** : Preuve sociale, avis clients, FAQ, offre de bienvenue.

### Campagne 3 : Retention (LTV)
*   **Objectif** : Ventes - Acheteurs Existants.
*   **Budget** : 5% du budget global.
*   **Ad Set** : Acheteurs 180 jours.
*   **Contenu** : Nouveaux lancements, offres privilèges, parrainage.

## 3. Nomenclature (Naming Convention)
Respecter scrupuleusement la nomenclature suivante pour faciliter le reporting automatique :
\`\`\`
[STAGE] - [PLATFORM] - [CAMPAIGN_TYPE] - [CREATIVE_FOCUS]
Exemple: TOFU - META - CBO_BROAD - UGC_PROMO
\`\`\`

## 4. Routine d'Optimisation Hebdomadaire
1.  **Lundi** : Analyse des performances à J-7. Si le CPA est inférieur à la cible de 15% et la phase d'apprentissage est complétée, augmenter le budget de la campagne de 20%.
2.  **Mercredi** : Analyse des créas de la Sandbox. Si une créa surpasse le CPA cible avec au moins 3x le budget de conversion dépensé, la transférer dans la campagne TOFU Main.
3.  **Vendredi** : Nettoyage des publicités sous-performantes. Couper uniquement si le CPA > 1.3x la cible sur les 7 derniers jours.`
  },
  {
    id: '55555555-5555-5555-5555-555555555555',
    title: 'Sequence de Paniers Abandonnes sur Klaviyo',
    slug: 'sequence-paniers-abandonnes-klaviyo',
    category_id: 'c3c3c3c3-c3c3-c3c3-c3c3-c3c3c3c3c3c3',
    tags: ['klaviyo', 'crm', 'retention', 'emailing'],
    author_id: 'e6403d52-9b2f-4889-8d19-4cb5f987d456',
    created_at: '2026-05-04T12:00:00.000Z',
    updated_at: '2026-05-15T09:15:00.000Z',
    content: `# Séquence de Paniers Abandonnés (CRM Klaviyo)

Le panier abandonné est le flux d'emailing e-commerce le plus rentable. Cette SOP décrit la structure en 3 étapes validée par l'agence pour générer entre 8% et 15% de CA additionnel.

## 1. Déclencheurs (Triggers) & Filtres
*   **Trigger** : \`Checkout Started\` (ou \`Added to Cart\` si l'intégration le permet).
*   **Filtres de flux** :
    *   \`Placed Order\` zero times since starting this flow.
    *   \`Has not been in this flow in the last 14 days\`.

## 2. Structure de la Séquence (3 Emails)

### Email 1 : Le Rappel Amical (Pas de promotion)
*   **Délai** : 30 minutes après l'abandon.
*   **Objet** : *Oups... Vous avez oublié quelque chose ?* ou *Votre panier vous attend chez [Nom du Client]*
*   **Contenu** :
    *   Dynamic product block (affiche les articles oubliés).
    *   Témoignage client rassurant sous le panier.
    *   Bouton d'appel à l'action (CTA) clair : "Finaliser ma commande".
*   **Objectif** : Convertir les utilisateurs qui ont eu une distraction technique ou un manque de temps.

### Email 2 : La Réassurance & FAQ (Pas de promotion)
*   **Délai** : 24 heures après l'Email 1.
*   **Objet** : *Une question sur votre commande ?* ou *Besoin d'aide pour finaliser ?*
*   **Contenu** :
    *   Mise en avant des garanties : Livraison gratuite, retours faciles sous 30 jours, paiement en 3x.
    *   FAQ simple (3-4 questions fréquentes sur les tailles, livraison, etc.).
    *   Accès direct au support client par chat ou email.

### Email 3 : L'Incentive de Fin (Code Promo Exclusif)
*   **Délai** : 48 heures après l'Email 2.
*   **Objet** : *10% offerts sur votre panier (valable 48h)* ou *Dernière chance pour récupérer votre panier*
*   **Contenu** :
    *   Code promotionnel dynamique à durée limitée (-10% ou livraison offerte).
    *   Compte à rebours de 48h pour ajouter un sentiment d'urgence.
    *   Avertissement que le panier sera vidé passé ce délai.

## 3. AB Testing Recommandé
*   **Sujet** : Tester l'utilisation d'émojis dans les objets vs des objets ultra-minimalistes (ex: *Panier abandonné ?*).
*   **Incentive** : Tester Livraison Offerte vs -10% de réduction pour voir l'impact sur la marge globale.`
  },
  {
    id: '66666666-6666-6666-6666-666666666666',
    title: 'Creation de Briefing UGC (User Generated Content)',
    slug: 'creation-briefing-ugc',
    category_id: 'd4d4d4d4-d4d4-d4d4-d4d4-d4d4d4d4d4d4',
    tags: ['ugc', 'creative', 'tiktok-ads', 'brief'],
    author_id: 'de305d54-75b4-431b-adb2-5bc6e987c123',
    created_at: '2026-05-08T08:00:00.000Z',
    updated_at: '2026-05-12T14:20:00.000Z',
    content: `# Guide de Création de Briefing UGC (User Generated Content)

Cette SOP détaille comment structurer un brief pour un créateur de contenu UGC afin de garantir un livrable performant pour Meta Ads et TikTok Ads.

## 1. Le Framework de la Vidéo UGC (Le Modèle AIDA)

Chaque vidéo UGC de 15 à 30 secondes doit suivre cette structure de script :

| Section | Durée | Objectif | Exemples de Scripts |
| :--- | :--- | :--- | :--- |
| **Hook (Accroche)** | 0 - 3 sec | Arrêter le scroll de l'utilisateur. | "Pourquoi tout le monde parle de ce produit...", "Ne faites pas cette erreur avec..." |
| **Problem (Problème)** | 3 - 8 sec | Créer de l'empathie et identifier le point de douleur. | "J'avais toujours la peau sèche en hiver...", "Mes matinées étaient un enfer..." |
| **Solution (Produit)** | 8 - 18 sec | Présenter le produit en action (bénéfices et non caractéristiques). | "J'ai testé ce baume et en 3 jours...", "Ce gadget a changé ma routine..." |
| **Call To Action** | 18 - 25 sec | Inciter à l'action immédiate. | "Profitez de -15% aujourd'hui avec le code...", "Lien en bio pour commander." |

## 2. Spécifications Techniques à inclure
*   **Format** : Vertical 9:16 (1080x1920).
*   **Résolution** : 1080p, 30 ou 60 FPS. Éclairage naturel obligatoire.
*   **Son** : Voix off claire, pas de bruit de fond. Fournir le script brut sans musique (nous gérons la musique en post-prod).
*   **Livrable** : Envoyer la vidéo montée finale + tous les rushs bruts (B-roll) pour nous permettre de tester d'autres accroches.

## 3. Consignes d'Attitude pour le Créateur
*   S'adresser directement à la caméra (comme à un ami).
*   Parler avec enthousiasme naturel, éviter le ton "télé-achat".
*   Montrer des gros plans du produit (textures, packaging, application).`
  },
  {
    id: '77777777-7777-7777-7777-777777777777',
    title: 'Calcul et Suivi du MER (Marketing Efficiency Ratio)',
    slug: 'calcul-suivi-mer-reporting',
    category_id: 'e5e5e5e5-e5e5-e5e5-e5e5-e5e5e5e5e5e5',
    tags: ['reporting', 'analytics', 'mer', 'data'],
    author_id: 'e6403d52-9b2f-4889-8d19-4cb5f987d456',
    created_at: '2026-05-10T11:00:00.000Z',
    updated_at: '2026-05-10T11:00:00.000Z',
    content: `# Calcul et Suivi du MER (Marketing Efficiency Ratio)

Avec la perte de précision des pixels (iOS14+), le ROAS des plateformes est souvent biaisé. Cette SOP explique comment calculer et piloter les performances d'un client e-commerce via le MER (ou Blended ROAS).

## 1. Définitions & Formule
Le **MER** mesure l'efficacité globale de vos dépenses publicitaires sur le chiffre d'affaires total généré.

**Formule :**
$$\text{MER} = \frac{\text{Chiffre d'Affaires Total (HT)}}{\text{Dépenses Publicitaires Globales}}$$

Où :
*   **Chiffre d'Affaires Total (HT)** = CA Shopify / WooCommerce (hors taxes et frais de livraison).
*   **Dépenses Publicitaires Globales** = Dépenses Meta + Dépenses Google + Dépenses TikTok + Dépenses Pinterest, etc.

## 2. Grille de Lecture des Performances (Benchmarks)

*   **MER < 3.0** : Zone Rouge. L'acquisition publicitaire consomme trop de marge. Sauf si le client est en phase de lancement agressif, il faut couper ou restructurer.
*   **MER 3.0 - 4.5** : Zone Stable / Rentable. Bon équilibre. Permet de maintenir l'activité et de dégager des profits modérés.
*   **MER > 5.0** : Excellente Rentabilité. Zone de Scaling. Le client a de l'espace pour augmenter ses budgets d'acquisition.

## 3. Fréquence de calcul
Le MER doit être renseigné dans le dashboard agence à 3 fréquences :
1.  **Hebdomadaire (Chaque lundi)** : Pour piloter les budgets de la semaine en cours.
2.  **Mensuel (Le 2 de chaque mois)** : Analyse stratégique globale.
3.  **Trimestriel (QBR)** : Pour analyser la saisonnalité et l'évolution de la LTV.`
  }
];

export const initialClients: Client[] = [
  {
    id: '11111111-1111-1111-1111-111111111111',
    name: 'Ecocup',
    slug: 'ecocup',
    logo_url: 'https://images.unsplash.com/photo-1517256064527-09c53b2d0bc6?w=100&auto=format&fit=crop&q=80',
    description: 'Leader français du gobelet réutilisable personnalisé. Accompagnement sur Meta Ads, Google Ads et CRM retention.',
    created_at: '2025-01-10T08:00:00.000Z'
  },
  {
    id: '22222222-2222-2222-2222-222222222222',
    name: 'Motoblouz',
    slug: 'motoblouz',
    logo_url: 'https://images.unsplash.com/photo-1558981806-ec527fa84c39?w=100&auto=format&fit=crop&q=80',
    description: 'N°1 de la vente en ligne d’équipements moto en France. Optimisation du catalogue produit Google Shopping et campagnes Search.',
    created_at: '2025-03-15T09:00:00.000Z'
  },
  {
    id: '33333333-3333-3333-3333-333333333333',
    name: 'Maison Lepage',
    slug: 'maison-lepage',
    logo_url: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=100&auto=format&fit=crop&q=80',
    description: 'Horlogerie et Joaillerie de luxe depuis 1922. Campagnes Social Ads haut de gamme et newsletters de fidélisation clients VIP.',
    created_at: '2025-06-20T10:00:00.000Z'
  }
];

export const initialClientAssets: ClientAsset[] = [
  // Ecocup assets
  {
    id: '88888888-8888-8888-8888-888888888888',
    client_id: '11111111-1111-1111-1111-111111111111',
    title: 'Brief Campagne Festivals Été 2026',
    type: 'brief',
    content: `## Brief Campagne Festivals Été 2026 - Ecocup

### 1. Objectifs
Générer des commandes de gobelets personnalisés pour les festivals, mariages, et événements d'été.
*   **Target CPA** : 18.00€
*   **Budget mensuel alloué** : 15 000€ sur Meta, 5 000€ sur Google Search.

### 2. Ciblage Meta
*   **Ad Set 1 (Broad)** : B2B et Particuliers, France entière, 18-50 ans.
*   **Ad Set 2 (Intérêts)** : Event planners, Organisateurs de festivals, Wedding planners.

### 3. Angles Créatifs requis
1.  **Angle B2C Mariage** : "Personnalisez vos gobelets pour le plus beau jour de votre vie (livraison rapide)".
2.  **Angle B2B Pro** : "Festivals, associations : passez au vert avec vos gobelets consignés imprimés en France".`,
    created_at: '2026-05-10T09:00:00.000Z'
  },
  {
    id: '99999999-9999-9999-9999-999999999999',
    client_id: '11111111-1111-1111-1111-111111111111',
    title: 'Accès Plateformes',
    type: 'credential',
    content: `*   **Meta Business Manager ID** : 874920384729103
*   **Shopify Admin** : https://ecocup-france.myshopify.com/admin
*   **Identifiant Shopify** : partner-dev@makesense.agency
*   **Mot de passe** : [Masqué] Contacter Alexandre (Admin) pour la clé d'accès.`,
    created_at: '2026-05-01T08:00:00.000Z'
  },
  {
    id: 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
    client_id: '11111111-1111-1111-1111-111111111111',
    title: 'Compte-rendu Kickoff Q2',
    type: 'note',
    content: `### Décisions de la réunion du 12 Avril 2026 :
1.  **Focus Marges** : Réduire le budget sur les gobelets à faible marge (modèles unis) pour pousser les gobelets imprimés en quadrichromie.
2.  **Taux de conversion** : Lancer un audit de l'entonnoir d'achat Shopify car le taux de conversion mobile a chuté de 2.1% à 1.6% le mois dernier.`,
    created_at: '2026-04-12T14:00:00.000Z'
  },
  
  // Motoblouz assets
  {
    id: 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
    client_id: '22222222-2222-2222-2222-222222222222',
    title: 'Identifiants Google Ads & GMC',
    type: 'credential',
    content: `*   **Google Ads CID** : 492-384-0192
*   **Google Merchant Center ID** : 12948203
*   **Feed Manager** : Lengow (Accès via SSO de l'agence)`,
    created_at: '2026-05-02T10:00:00.000Z'
  },
  {
    id: 'cccccccc-cccc-cccc-cccc-cccccccccccc',
    client_id: '22222222-2222-2222-2222-222222222222',
    title: 'Notes Optimisation Shopping',
    type: 'note',
    content: `*   **Action** : Ajouter la marque et la taille des casques de moto dans les titres des produits du flux Google Shopping.
*   **Résultat attendu** : +20% de clics qualifiés sur les recherches spécifiques.`,
    created_at: '2026-05-14T11:00:00.000Z'
  },

  // Maison Lepage assets
  {
    id: 'dddddddd-dddd-dddd-dddd-dddddddddddd',
    client_id: '33333333-3333-3333-3333-333333333333',
    title: 'Brief Fête des Mères 2026',
    type: 'brief',
    content: `## Brief Campagne Fête des Mères - Maison Lepage
*   **Période** : 10 mai au 25 mai 2026.
*   **Budget** : 10 000€ Meta Ads.
*   **Sélection produits** : Bracelets or 18 carats et colliers diamants.
*   **Ciblage** : Acheteurs de bijoux de luxe, CSP+, Hommes cherchant des cadeaux de fête des mères.`,
    created_at: '2026-05-05T09:00:00.000Z'
  }
];

export const initialAITemplates: AITemplate[] = [
  {
    id: 'tpl-meta-ads',
    name: 'SOP Campagne Meta Ads',
    description: 'Génère une SOP structurée pour le lancement ou le scale de campagnes publicitaires Meta Ads.',
    category: 'Acquisition (Paid Ads)',
    variables: [
      { name: 'clientName', label: 'Nom du Client / Marque', placeholder: 'ex: Ecocup', type: 'text' },
      { name: 'productType', label: 'Type de Produit', placeholder: 'ex: Gobelets réutilisables', type: 'text' },
      { name: 'budget', label: 'Budget Mensuel (€)', placeholder: 'ex: 15000', type: 'number' },
      { name: 'mainUSP', label: 'Proposition Unique de Vente (USP)', placeholder: 'ex: Personnalisation rapide en France', type: 'text' },
      { name: 'targetAudience', label: 'Audience Cible principale', placeholder: 'ex: Organisateurs d\'événements et mariages', type: 'text' }
    ],
    prompt_template: `Rédige une SOP de campagne Meta Ads ultra-détaillée pour la marque **{clientName}** qui vend des **{productType}**. 
Le budget est de **{budget}€/mois** avec un focus sur la cible : **{targetAudience}**. 
La proposition de valeur principale est : **{mainUSP}**.
Structure le document avec des sections claires : Stratégie d'audience, Répartition du budget par entonnoir, Consignes de création visuelle et copywriting, et KPIs clés à surveiller quotidiennement. Utilise un ton professionnel d'agence de marketing.`
  },
  {
    id: 'tpl-ugc-brief',
    name: 'Brief Créatif Créateur UGC',
    description: 'Génère un brief complet prêt à envoyer à des créateurs de contenu UGC pour TikTok ou Reels.',
    category: 'Creative & Studio',
    variables: [
      { name: 'brandName', label: 'Nom de la Marque', placeholder: 'ex: Motoblouz', type: 'text' },
      { name: 'productName', label: 'Nom du Produit', placeholder: 'ex: Casque Dexter Carbon', type: 'text' },
      { name: 'toneOfVoice', label: 'Ton de la vidéo', placeholder: 'ex: Énergique, authentique et technique', type: 'text' },
      { name: 'hookIdea', label: 'Idée d\'accroche (Hook)', placeholder: 'ex: Le casque carbone le plus léger du marché...', type: 'text' },
      { name: 'keyFeatures', label: 'Bénéfices clés à montrer', placeholder: 'ex: Poids plume, confort intérieur, design sport', type: 'text' }
    ],
    prompt_template: `Crée un brief créatif complet destiné à un créateur de contenu UGC (User Generated Content) pour le produit **{productName}** de la marque **{brandName}**. 
Le ton doit être **{toneOfVoice}**. 
L'accroche de départ suggérée (Hook) : "{hookIdea}".
Le créateur doit mettre en avant ces caractéristiques : **{keyFeatures}**.
Inclus un script détaillé étape par étape (Hook, Problème, Présentation, Démonstration des bénéfices, Appel à l'action), des consignes techniques et esthétiques précises, et des instructions de livraison.`
  },
  {
    id: 'tpl-email-carts',
    name: 'Séquence Relance CRM E-commerce',
    description: 'Génère les textes pour une séquence automatisée de mails de paniers abandonnés ou post-achat.',
    category: 'CRM & Emailing',
    variables: [
      { name: 'brandName', label: 'Nom de la Marque', placeholder: 'ex: Maison Lepage', type: 'text' },
      { name: 'productTone', label: 'Ton de marque', placeholder: 'ex: Luxueux, élégant, relationnel', type: 'text' },
      { name: 'cartDiscount', label: 'Offre promotionnelle', placeholder: 'ex: Livraison offerte ou 10% de réduction', type: 'text' },
      { name: 'customerPainPoint', label: 'Frein principal à lever', placeholder: 'ex: Hésitation sur le prix ou la taille', type: 'text' }
    ],
    prompt_template: `Rédige une séquence de 3 e-mails d'abandon de panier pour la marque **{brandName}**. Le ton général de la marque est **{productTone}**.
L'email 1 (30 min après) doit être un simple rappel élégant.
L'email 2 (24h après) doit rassurer et lever le frein : **{customerPainPoint}**.
L'email 3 (48h après) doit proposer l'offre spéciale : **{cartDiscount}** avec sentiment d'urgence.
Fournis les objets d'emails, les pré-en-têtes et les structures de contenu complètes.`
  }
];

// Helper to get from local storage or set initial
export function getLocalStorageData<T>(key: string, initialData: T): T {
  const data = localStorage.getItem(`makesense_os_${key}`);
  if (!data) {
    localStorage.setItem(`makesense_os_${key}`, JSON.stringify(initialData));
    return initialData;
  }
  return JSON.parse(data);
}

export function saveLocalStorageData<T>(key: string, data: T): void {
  localStorage.setItem(`makesense_os_${key}`, JSON.stringify(data));
}

// Global reset database
export function resetLocalDatabase(): void {
  localStorage.removeItem('makesense_os_profiles');
  localStorage.removeItem('makesense_os_categories');
  localStorage.removeItem('makesense_os_sops');
  localStorage.removeItem('makesense_os_clients');
  localStorage.removeItem('makesense_os_assets');
  localStorage.removeItem('makesense_os_current_user');
  
  // Re-init
  getLocalStorageData('profiles', initialProfiles);
  getLocalStorageData('categories', initialCategories);
  getLocalStorageData('sops', initialSOPs);
  getLocalStorageData('clients', initialClients);
  getLocalStorageData('assets', initialClientAssets);
}
