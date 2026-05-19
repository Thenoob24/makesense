// Generates rich, custom markdown depending on template type and variable inputs
export function generateAIMarkdown(templateId: string, variables: Record<string, string>): string {
  const dateStr = new Date().toLocaleDateString('fr-FR');
  
  if (templateId === 'tpl-meta-ads') {
    const client = variables.clientName || 'Client Fictif';
    const product = variables.productType || 'Produits E-commerce';
    const budget = variables.budget || '10000';
    const usp = variables.mainUSP || 'Livraison gratuite en 24h';
    const audience = variables.targetAudience || 'Acheteurs en ligne';

    return `# SOP Campagne Meta Ads - ${client}

**Document généré par l'IA Make Sense**
**Date de création** : ${dateStr}
**Focus Produit** : ${product}
**Budget mensuel** : ${budget} €

---

## 1. Objectifs & KPIs
L'objectif de cette campagne est d'augmenter le volume d'achats sur le site de **${client}** tout en maintenant un CPA cible sain.
*   **CPA Cible** : Moins de ${(Number(budget) * 0.002).toFixed(2)}€
*   **ROAS Cible** : 3.5x
*   **KPIs Primaires** : Achats, CPA, ROAS, Taux de clic (CTR)

## 2. Structure des Audiences (CBO Campaign)

### Ad Set 1 : Broad TOFU (Ciblage Large)
*   **Ciblage** : France, 18-65 ans+, Hommes & Femmes. Aucun ciblage d'intérêts.
*   **Exclusions** : Exclure les acheteurs existants de ${client} sur les 180 derniers jours (via l'audience personnalisée).
*   **But** : Laisser l'algorithme de Meta cibler l'audience idéale sur la base de la proposition de valeur : *${usp}*.

### Ad Set 2 : Lookalike Consolidation (Optionnel)
*   **Ciblage** : Lookalike 1% à 3% basée sur la liste de clients ou les acheteurs de pixel de **${client}**.
*   **Exclusion** : Acheteurs 180 jours.

## 3. Ligne Créative & Angles de Copywriting
Les créations publicitaires doivent mettre l'accent sur l'USP principale de la marque : **"${usp}"**.
Nous ciblons spécifiquement : **${audience}**.

### Angle 1 : Problème -> Solution
*   **Accroche** : "Marre de chercher le produit idéal ? Découvrez comment ${client} réinvente les ${product}."
*   **Visuel** : Vidéo UGC de 15s montrant l'unboxing et le produit en action.
*   **Bénéfice mis en avant** : ${usp}.

### Angle 2 : Social Proof & Avis Client
*   **Accroche** : "⭐⭐⭐⭐⭐ '[Nom du produit] a complètement changé mon quotidien !' - Rejoignez des milliers de clients satisfaits."
*   **Visuel** : Carrousel d'images montrant des photos réelles de clients avec leur témoignage écrit en surimpression.

## 4. Plan de Lancement & Routine d'Optimisation
1.  Activer la campagne CBO avec un budget de départ de ${(Number(budget) / 30).toFixed(0)}€ par jour.
2.  Laisser tourner sans modification pendant 5 jours (phase d'apprentissage).
3.  Couper les créations qui dépensent plus de 2x le CPA cible sans générer d'achats.`;
  }

  if (templateId === 'tpl-ugc-brief') {
    const brand = variables.brandName || 'Marque';
    const product = variables.productName || 'Produit';
    const tone = variables.toneOfVoice || 'Dynamique & Naturel';
    const hook = variables.hookIdea || 'Le produit que vous devez tester...';
    const features = variables.keyFeatures || 'Efficace et rapide';

    return `# Brief Créatif UGC - ${brand} / ${product}

**Document généré par l'IA Make Sense**
**Rôle** : Brief Créateur de contenu
**Ton recherché** : ${tone}

---

## 1. Contexte du Projet
Nous recherchons une vidéo authentique, de style TikTok / Reel, pour présenter le produit **${product}** de la marque **${brand}**. La vidéo doit sembler organique et non publicitaire. Elle sera diffusée sur nos canaux payants.

## 2. Script de la Vidéo (Format 9:16 - Vertical)

| Time | Section | Description & Actions à l'écran | Voix Off (Script à lire) |
| :--- | :--- | :--- | :--- |
| **0-3s** | **Hook (Accroche)** | Visage face caméra, montre le produit. Air surpris ou intrigué. | "${hook}" |
| **3-10s** | **Problème** | Montre la situation frustrante du quotidien que résout le produit. | "J'étais fatigué de [problème associé aux caractéristiques : ${features}]..." |
| **10-20s** | **Solution / Démo** | Application du produit à l'écran. Gros plan sur la texture/le packaging. | "J'ai testé ce produit de chez ${brand}. Il est : ${features}." |
| **20-25s** | **Preuve sociale** | Montre le résultat final avec un sourire. | "Regardez le résultat ! Ma vie est tellement plus simple maintenant." |
| **25-30s** | **CTA (Appel à l'action)** | Pointer du doigt vers le bas ou montrer un code promo à l'écran. | "Cliquez sur le lien ci-dessous pour profiter de -15% !" |

## 3. Directives Techniques
*   Filmer en vertical (format 9:16), résolution 1080p minimum.
*   Éclairage propre (face à une fenêtre de préférence).
*   Pas de musique de fond (nous gérons l'ajout de musique en montage final).
*   Articuler, parler de manière naturelle sans script écrit sous les yeux.`;
  }

  if (templateId === 'tpl-email-carts') {
    const brand = variables.brandName || 'Marque';
    const tone = variables.productTone || 'Chaleureux';
    const discount = variables.cartDiscount || 'Livraison offerte';
    const painPoint = variables.customerPainPoint || 'Le prix';

    return `# Séquence d'Abandon de Panier - ${brand}

**Document généré par l'IA Make Sense**
**Flux CRM Klaviyo**
**Charte éditoriale** : Ton ${tone}

---

## Email 1 : Le Rappel Elégant (30 minutes après)
*   **Objet** : *Oups... Quelque chose vous a échappé chez ${brand} ?*
*   **Pré-en-tête** : *Pas d'inquiétude, nous avons mis vos articles de côté.*

### Corps de l'email :
Bonjour [Prénom],

Nous avons remarqué que vous avez laissé des articles dans votre panier. Nous savons que la vie est pleine de distractions, c'est pourquoi nous les avons sauvegardés pour vous.

[BLOC DYNAMIQUE DE PRODUITS]

Si vous êtes prêt à finaliser votre commande, cliquez simplement ci-dessous pour retourner à votre panier sécurisé.

[Bouton CTA : Finaliser ma commande]

---

## Email 2 : Rassurer & Lever le frein (24h après)
*   **Objet** : *Besoin d'un avis ? Notre équipe répond à vos questions.*
*   **Pré-en-tête** : *Des questions sur ${painPoint} ? On s'occupe de tout.*

### Corps de l'email :
Bonjour [Prénom],

Vous y êtes presque ! Si vous hésitez encore au sujet de **${painPoint}**, voici ce que nos clients en disent :

*   "Le meilleur achat de l'année. Service client au top !" - Marie K.
*   "J'avais un doute au début, mais la qualité dépasse mes attentes." - Thomas L.

Chez ${brand}, nous vous proposons :
*   Des retours simples sous 14 jours
*   Un service client joignable en direct par mail ou chat

[Bouton CTA : Je valide mon panier]

---

## Email 3 : L'Incentive de Fin (48h après)
*   **Objet** : *Dernière chance : Votre avantage exclusif expire bientôt...*
*   **Pré-en-tête** : *Valable 48 heures uniquement.*

### Corps de l'email :
Bonjour [Prénom],

C'est votre dernière opportunité de récupérer votre sélection avant que votre panier ne soit vidé.

Pour vous aider à sauter le pas, voici un cadeau exclusif réservé pour vous :
🎁 **${discount}** avec le code **BIENVENU10** à insérer lors de la validation.

[Lien vers le panier pré-rempli avec réduction]

Faites vite, cette offre expire dans 48h.

[Bouton CTA : Appliquer mon code et commander]`;
  }

  return `# SOP Générique\n\nNouveau document créé le ${dateStr}`;
}

export function generateAIsop(template: string, additionalContext: string): string {
  const dateStr = new Date().toLocaleDateString('fr-FR');
  const contextStr = additionalContext ? `\n\n**Contexte additionnel fourni :** ${additionalContext}` : '';

  if (template === 'reporting-mensuel') {
    return `# SOP : Reporting Mensuel Performance E-commerce
*Généré par l'IA Make Sense le ${dateStr}*${contextStr}

---

## 1. Objectif
L'objectif de cette SOP est d'encadrer la création et l'analyse du rapport mensuel de performance pour nos clients e-commerce. Elle vise à unifier la restitution des KPIs majeurs publicitaires et financiers, et à en extraire des recommandations concrètes de scaling ou d'optimisation de budget.

## 2. Étapes
1.  **Extraction des données brutes** : Collecter les dépenses publicitaires (Meta, Google, TikTok Ads) et les revenus HT depuis Shopify Analytics sur le mois complet.
2.  **Calcul du MER et des marges** : Calculer le Marketing Efficiency Ratio (CA HT / Dépenses Ads totales) et croiser les données avec le coût des marchandises vendues pour obtenir la marge brute.
3.  **Mise à jour du Dashboard Client** : Intégrer les KPIs consolidés dans le dashboard Looker Studio ou Triple Whale dédié au client.
4.  **Rédaction de la note d'analyse** : Rédiger une analyse qualitative de 3-4 paragraphes expliquant les hausses/baisses et les leviers d'acquisition les plus performants.
5.  **Validation et envoi** : Faire relire le rapport par le Account Manager référent avant envoi par email au client, accompagné d'une proposition de créneau de call stratégique.

## 3. Outils
*   **Shopify Partner / WooCommerce** (Données de vente HT)
*   **Plateformes publicitaires** (Ads Managers Meta, Google, TikTok)
*   **Google Looker Studio** (Visualisation des données clients)
*   **Klaviyo** (Statistiques CRM et flux de retention)
*   **Google Sheets / Excel** (Calculs financiers intermédiaires)

## 4. KPIs
*   **MER (Marketing Efficiency Ratio)** : Cible > 4.0x
*   **Blended CAC (Coût d'Acquisition Client)** : Cible spécifique au business plan du client
*   **ROAS Blended** : Rapport du chiffre d'affaires sur les dépenses Ads
*   **Taux de réachat à 30 jours** : Indicateur de performance CRM

## 5. Exemples
*   *Exemple de rapport type* : Un client vendant des cosmétiques bio avec un budget de 10 000€ Ads génère 45 000€ CA HT. Le MER est de 4.5. La note recommande de transférer 15% du budget Meta Ads vers Google Shopping (PMax) en raison d'un épuisement créatif constaté sur Meta.
*   *Application au contexte spécifique* : ${additionalContext || "Aucun contexte particulier spécifié."}
`;
  }

  if (template === 'brief-crea-meta') {
    return `# SOP : Brief Créatif Meta Ads (UGC / Image)
*Généré par l'IA Make Sense le ${dateStr}*${contextStr}

---

## 1. Objectif
Cette SOP a pour but de formaliser le brief destiné aux créateurs de contenu UGC ou aux designers de l'agence. Elle garantit que chaque publicité Meta Ads respecte les principes de persuasion directe (AIDA) et comporte des instructions de montage et de formatage rigoureuses pour maximiser le CTR et le taux d'achat.

## 2. Étapes
1.  **Définition de l'angle publicitaire** : Déterminer la frustration client principale (pain point) et l'argument de vente (USP) à mettre en scène.
2.  **Rédaction du script (Modèle AIDA)** : Découper le script en 4 phases : Accroche (0-3s), Problème (3-8s), Solution/Démo (8-18s), et CTA (18-25s).
3.  **Consignes de tournage et d'attitude** : Spécifier au créateur l'éclairage requis, le ton de la voix, et les plans de démonstration produit rapprochés nécessaires.
4.  **Consignes de post-production** : Fournir les chartes graphiques, la typographie à utiliser pour les sous-titres, et les animations de boutons CTA.
5.  **Exportation et nommage** : Exporter au format requis et nommer le fichier final selon notre convention interne (ex: \`[CLIENT]_[CAMP]_[FORMAT]_[VERSION]\`).

## 3. Outils
*   **Notion / Google Docs** (Rédaction du script et partage de brief)
*   **CapCut / Premiere Pro** (Montage vidéo publicitaire)
*   **Figma** (Création de visuels statiques, carrousels et miniatures)
*   **Meta Ads Creative Center** (Mockups publicitaires et prévisualisation)

## 4. KPIs
*   **Thumbstop Rate (Taux de rétention à 3s)** : Cible > 30%
*   **Hook Rate** : Taux d'attention initial des utilisateurs
*   **CTR Publicitaire (Taux de clic)** : Cible > 1.8%
*   **CPA Moyen** : Coût par action par concept créatif testé

## 5. Exemples
*   *Exemple de brief type* : Vidéo UGC de style TikTok pour une marque d'accessoires de voyage. L'accroche est "Ne voyagez plus jamais avec une valise encombrante...". Le brief spécifie des plans serrés de pliage du sac et un bouton "Commander avec -10%" de couleur turquoise à la fin.
*   *Application au contexte spécifique* : ${additionalContext || "Aucun contexte particulier spécifié."}
`;
  }

  if (template === 'strategie-seo') {
    return `# SOP : Stratégie SEO E-commerce (Optimisation & Contenu)
*Généré par l'IA Make Sense le ${dateStr}*${contextStr}

---

## 1. Objectif
L'objectif de cette SOP est de guider les consultants dans l'élaboration et le déploiement d'une stratégie de référencement naturel pérenne pour les clients e-commerce. Elle vise à identifier les mots-clés d'intention d'achat, corriger les erreurs techniques de crawling, et planifier la production éditoriale.

## 2. Étapes
1.  **Recherche de mots-clés et clusterisation** : Identifier les mots-clés transactionnels à fort volume et les regrouper par thématiques (clusters).
2.  **Audit technique on-page** : Vérifier le score de vitesse mobile, l'optimisation des balises title et meta descriptions, et éliminer le contenu dupliqué.
3.  **Planning éditorial** : Planifier la rédaction de fiches produits optimisées et de 2 articles de blog mensuels ciblant des questions informatives d'utilisateurs.
4.  **Optimisation du maillage interne** : Relier les articles informationnels vers les pages catégories de vente pour transférer l'autorité SEO (Link Juice).
5.  **Netlinking & Autorité** : Mettre en place une campagne d'acquisition de liens externes qualitatifs de sites partenaires dans la même thématique.

## 3. Outils
*   **Semrush / Ahrefs** (Recherche de mots-clés et audit de concurrents)
*   **Google Search Console** (Suivi de l'indexation et des requêtes réelles)
*   **Google PageSpeed Insights** (Diagnostic de vitesse technique)
*   **Screaming Frog** (Crawl de site pour détecter les erreurs 404)

## 4. KPIs
*   **Trafic Organique Mensuel (Sessions)** : Cible de croissance +10% MoM
*   **Nombre de mots-clés dans le Top 3 / Top 10** : Suivi des positions clés
*   **Taux de clic moyen (CTR organqiue)** : Mesure de l'efficacité des titres et metas
*   **Chiffre d'Affaires SEO** : Revenu généré par le canal de recherche organique

## 5. Exemples
*   *Exemple de stratégie type* : Un e-commerce de mode éthique cible le mot-clé principal "chaussures vegan". L'audit révèle des balises H1 manquantes sur les fiches produits et des images trop lourdes. Les optimisations techniques permettent un gain de 5 places dans les résultats de recherche en 4 semaines.
*   *Application au contexte spécifique* : ${additionalContext || "Aucun contexte particulier spécifié."}
`;
  }

  if (template === 'onboarding-client') {
    return `# SOP : Onboarding Client E-commerce
*Généré par l'IA Make Sense le ${dateStr}*${contextStr}

---

## 1. Objectif
Cette SOP définit le protocole standardisé pour accueillir et configurer les comptes de nos nouveaux clients e-commerce. L'objectif est de sécuriser tous les accès techniques requis (Shopify, Meta BM, Google Ads, Klaviyo) et de lancer les campagnes opérationnelles sous 10 jours ouvrés sans friction.

## 2. Étapes
1.  **Envoi du formulaire initial** : Envoyer par email le questionnaire de bienvenue pour collecter les coordonnées clés, les chartes graphiques et les budgets.
2.  **Réunion de Kickoff** : Animer un call de 45 minutes pour valider les KPIs de départ, les personas cibles, et le calendrier éditorial.
3.  **Création du dossier client partagé** : Initialiser le dossier client dans notre drive partagé et ajouter le profil client dans Make Sense OS.
4.  **Demande d'accès centralisés** : Envoyer les demandes d'accès partenaires pour Meta Business Manager, Google Ads CID, Shopify, et Klaviyo.
5.  **Configuration des flux & tracking** : Tester l'activation du pixel Meta et des tags de conversion Google Ads (API de conversion installée et opérationnelle).

## 3. Outils
*   **Slack** (Canal de communication partagé avec le client)
*   **Google Workspace / Drive** (Stockage des briefs créatifs et des ressources)
*   **Calendly / Zoom** (Planification et enregistrement du kickoff call)
*   **Loom** (Envoi de tutoriels vidéos personnalisés pour guider le client sur les accès)

## 4. KPIs
*   **Délai d'onboarding complet** : Cible < 10 jours ouvrés
*   **Taux de complétude des accès au kickoff** : Cible 100%
*   **Satisfaction Client Initiale (Score NPS)** : Évaluée à J+30

## 5. Exemples
*   *Exemple d'onboarding type* : Un client d'alimentation saine rejoint l'agence. Le Account Manager crée le canal Slack dédié et envoie les invitations. Le client fournit ses accès Meta via Loom en 24h. Le kickoff est planifié le troisième jour, permettant un lancement publicitaire à J+8.
*   *Application au contexte spécifique* : ${additionalContext || "Aucun contexte particulier spécifié."}
`;
  }

  // Fallback
  return `# SOP : Document Personnalisé
*Généré par l'IA Make Sense le ${dateStr}*${contextStr}

---

## 1. Objectif
Objectif général de la procédure à définir selon vos besoins.

## 2. Étapes
1. Étape initiale de cadrage.
2. Étape de mise en œuvre et d'exécution des tâches.
3. Étape d'optimisation et d'analyse.

## 3. Outils
* Outils de travail collaboratifs de l'agence.
* Outils d'analytics e-commerce.

## 4. KPIs
* Indicateurs clés de performance à suivre régulièrement.

## 5. Exemples
* Mise en situation pratique.
* Application au contexte spécifique : ${additionalContext || "Aucun contexte particulier spécifié."}
`;
}

export async function generateAIsopReal(template: string, additionalContext: string): Promise<string> {
  const apiUrl = import.meta.env.VITE_LLM7_API_URL || 'https://api.llm7.io/v1';
  const apiKey = import.meta.env.VITE_LLM7_API_KEY;

  if (!apiKey) {
    console.warn("LLM7_API_KEY non configurée. Utilisation de la génération simulée.");
    return generateAIsop(template, additionalContext);
  }

  // Get standard prompt template to instruct the AI model
  const templates: Record<string, { systemPrompt: string; userPrompt: string }> = {
    'reporting-mensuel': {
      systemPrompt: "Tu es un consultant expert en performance marketing et e-commerce. Rédige des procédures opérationnelles standardisées (SOP) professionnelles et structurées en Markdown.",
      userPrompt: `Rédige une SOP complète de "Reporting Mensuel Performance E-commerce".
Le document doit obligatoirement être structuré avec les sections suivantes :
1. Objectif (décrire l'objectif de la procédure)
2. Étapes (les étapes détaillées pour faire le reporting, extraire les données, calculer le MER, etc.)
3. Outils (la liste des outils indispensables comme Shopify, Looker Studio, Triple Whale, etc.)
4. KPIs (le MER, Blended CAC, ROAS, Taux de réachat, etc. avec des valeurs cibles)
5. Exemples (une mise en situation concrète)

Prends en compte le contexte additionnel fourni par l'utilisateur :
"${additionalContext || 'Aucun contexte particulier spécifié.'}"

Fournis uniquement le contenu en Markdown, sans fioritures ni salutations.`
    },
    'brief-crea-meta': {
      systemPrompt: "Tu es un directeur de création expert en publicités payantes (Meta Ads, UGC). Rédige des briefs créatifs et des SOP en Markdown.",
      userPrompt: `Rédige une SOP de "Brief Créatif Meta Ads (UGC / Image)".
Le document doit obligatoirement être structuré avec les sections suivantes :
1. Objectif (assurer que chaque création publicitaire respecte la structure AIDA et maximise le CTR)
2. Étapes (choix de l'angle publicitaire, écriture du script AIDA, consignes au créateur UGC, post-prod)
3. Outils (Notion, Figma, Premiere Pro, CapCut, etc.)
4. KPIs (Thumbstop rate >30%, Hook rate, CTR >1.8%, CPA)
5. Exemples (exemple de brief concret)

Prends en compte le contexte additionnel fourni par l'utilisateur :
"${additionalContext || 'Aucun contexte particulier spécifié.'}"

Fournis uniquement le contenu en Markdown, sans fioritures.`
    },
    'strategie-seo': {
      systemPrompt: "Tu es un consultant SEO expert pour les sites e-commerce. Rédige des SOP structurées en Markdown.",
      userPrompt: `Rédige une SOP de "Stratégie SEO E-commerce (Optimisation & Contenu)".
Le document doit obligatoirement être structuré avec les sections suivantes :
1. Objectif (identifier des mots-clés d'intention d'achat et structurer le maillage interne)
2. Étapes (audit technique, recherche de mots-clés, rédaction d'articles de blog et fiches produits, netlinking)
3. Outils (Semrush, Google Search Console, Screaming Frog, etc.)
4. KPIs (Trafic organique MoM, mots-clés Top 3/10, CTR moyen, Chiffre d'Affaires SEO)
5. Exemples (cas d'usage concret pour un client e-commerce)

Prends en compte le contexte additionnel fourni par l'utilisateur :
"${additionalContext || 'Aucun contexte particulier spécifié.'}"

Fournis uniquement le contenu en Markdown, sans fioritures.`
    },
    'onboarding-client': {
      systemPrompt: "Tu es un Account Manager senior dans une agence e-commerce. Rédige des SOP d'onboarding en Markdown.",
      userPrompt: `Rédige une SOP d' "Onboarding Client E-commerce".
Le document doit obligatoirement être structuré avec les sections suivantes :
1. Objectif (accueillir le client et obtenir tous les accès techniques en moins de 10 jours)
2. Étapes (formulaire de bienvenue, kickoff meeting, création de dossier partagé, demandes d'accès Meta BM / Google Ads / Shopify / Klaviyo, installation du tracking)
3. Outils (Slack, Google Drive, Calendly, Loom, GTM)
4. KPIs (Délai d'onboarding, taux de complétude des accès, NPS J+30)
5. Exemples (scénario type d'onboarding)

Prends en compte le contexte additionnel fourni par l'utilisateur :
"${additionalContext || 'Aucun contexte particulier spécifié.'}"

Fournis uniquement le contenu en Markdown, sans fioritures.`
    }
  };

  const currentTemplate = templates[template] || {
    systemPrompt: "Tu es un assistant de productivité pour une agence marketing. Rédige des procédures standardisées (SOP) claires et professionnelles.",
    userPrompt: `Rédige une SOP personnalisée basée sur ce sujet et ce contexte additionnel :
Sujet : ${template}
Contexte : ${additionalContext || 'Aucun contexte particulier spécifié.'}

Structure le document avec des titres de sections clairs (Objectif, Étapes, Outils, KPIs, Exemples) au format Markdown.`
  };

  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: currentTemplate.systemPrompt },
          { role: 'user', content: currentTemplate.userPrompt }
        ],
        temperature: 0.7
      })
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    const generatedText = data.choices?.[0]?.message?.content;
    if (!generatedText) {
      throw new Error("Format de réponse invalide ou choix vides de l'API LLM7.");
    }

    return generatedText;
  } catch (error) {
    console.error("Erreur lors de la génération avec LLM7, repli sur le modèle simulé :", error);
    return generateAIsop(template, additionalContext);
  }
}

