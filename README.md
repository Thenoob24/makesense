<p align="center">
  <img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-6-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Supabase-Auth_&_DB-3FCF8E?style=for-the-badge&logo=supabase&logoColor=white" />
  <img src="https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite&logoColor=white" />
  <img src="https://img.shields.io/badge/IA-LLM7_API-8B5CF6?style=for-the-badge&logo=openai&logoColor=white" />
  <img src="https://img.shields.io/badge/Docker-Ready-2496ED?style=for-the-badge&logo=docker&logoColor=white" />
</p>

<h1 align="center">🧠 Make Sense OS</h1>

<p align="center">
  <strong>Mini Knowledge Base / OS interne pour agence de performance marketing e-commerce</strong><br/>
  <em>Construit avec l'IA comme copilote — du besoin métier au produit fonctionnel.</em>
</p>

<p align="center">
  <a href="https://makesense.constantblaszyk.fr">🌐 Démo en ligne</a> •
  <a href="#-fonctionnalités">✨ Fonctionnalités</a> •
  <a href="#-stack-technique">🛠 Stack</a> •
  <a href="#-installation--setup-local">📦 Installation</a>
</p>

---

## 📸 Capture d'écran

<!-- Remplacer par une vraie capture d'écran du dashboard -->
> 💡 **Ajouter ici une capture d'écran du dashboard :**
> Prendre un screenshot de la page Dashboard avec les KPIs visibles et le placer dans `/public/screenshot.png`
> puis décommenter la ligne ci-dessous :

<!-- ![Make Sense OS – Dashboard](./public/screenshot.png) -->

---

## 📖 À propos du projet

### 🎯 Le contexte

Ce projet est un **outil interne** développé pour répondre aux besoins réels d'une agence de performance marketing e-commerce, inspiré de l'agence **Make Sense** basée à Bondues (59).

En agence, les équipes jonglent entre les SOPs, les guidelines d'acquisition, les accès clients, les rapports de performance et les stratégies créatives. **Make Sense OS** centralise tout cela dans une interface moderne et intuitive.

### 💡 Pourquoi ce projet ?

> **Démontrer ma capacité à construire rapidement un outil interne utile avec l'IA comme copilote**, en comprenant les vrais besoins métier d'une agence e-commerce : reporting, acquisition, SEO, creative, automatisation.

Ce projet illustre :
- ✅ Ma compréhension des **enjeux métier** du marketing digital (ROAS, CAC, CPA, taux de conversion…)
- ✅ Ma capacité à **architecturer et développer un projet full-stack** de A à Z
- ✅ Mon utilisation **stratégique de l'IA** pour accélérer le développement
- ✅ Ma maîtrise d'un **stack moderne** (React, Supabase, Tailwind, Docker)
- ✅ Mon attention au **design et à l'UX** (dark mode, animations, glassmorphism)

---

## ✨ Fonctionnalités

| Fonctionnalité | Description |
|---|---|
| 📊 **Dashboard KPIs** | Vue d'ensemble avec métriques e-commerce (ROAS, CA, CAC, taux de conversion), graphiques dynamiques avec Recharts |
| 📚 **Knowledge Base / SOPs** | Base de connaissances organisée par catégories (Acquisition, SEO, Creative, Automatisation…) avec éditeur Markdown |
| 🤖 **Génération IA de SOPs** | Génération automatique de SOPs métier via l'API LLM7 — rédaction assistée en un clic |
| 🔍 **Recherche sémantique** | Recherche intelligente dans toute la base de connaissances |
| 👥 **Gestion clients** | Fiches clients avec briefs, accès/credentials, notes et comptes-rendus |
| 🔐 **Authentification & Rôles** | Système complet avec Supabase Auth — rôles Admin et Consultant |
| ⚙️ **Administration** | Panel d'administration pour gérer les utilisateurs, catégories et paramètres |
| 🌙 **Design premium** | Interface dark mode avec glassmorphism, micro-animations et typographie Inter |

---

## 🛠 Stack Technique

| Couche | Technologies |
|---|---|
| **Frontend** | React 19, TypeScript 6, Tailwind CSS 4, Framer Motion |
| **Auth & BDD** | Supabase (PostgreSQL + Auth + Row Level Security) |
| **IA** | LLM7 API pour la génération de contenu |
| **Graphiques** | Recharts |
| **Icônes** | Lucide React |
| **Markdown** | Rendu custom avec styles SOP dédiés |
| **Déploiement** | Docker + Nginx + Traefik (Coolify) |
| **Routing** | React Router DOM v7 |

---

## 📦 Installation & Setup local

### Prérequis

- **Node.js** 20+ (recommandé : 22)
- **npm** 10+
- Un compte **Supabase** (gratuit)

### 1. Cloner le repo

```bash
git clone https://github.com/Thenoob24/makesense.git
cd makesense
```

### 2. Installer les dépendances

```bash
npm install
```

### 3. Configurer les variables d'environnement

Créer un fichier `.env` à la racine :

```env
VITE_SUPABASE_URL="https://votre-projet.supabase.co"
VITE_SUPABASE_ANON_KEY="votre-clé-anon"
VITE_LLM7_API_URL="https://api.llm7.io/v1"
VITE_LLM7_API_KEY="votre-clé-llm7"
```

### 4. Initialiser la base de données Supabase

Exécuter les scripts SQL dans l'ordre dans l'éditeur SQL de Supabase :

1. `supabase_schema.sql` → Crée les tables et les politiques RLS
2. `supabase_seed.sql` → Insère les données de démonstration

### 5. Lancer le serveur de développement

```bash
npm run dev
```

L'application est accessible sur `http://localhost:5174`

### 6. Comptes de démonstration

| Rôle | Email | Mot de passe |
|---|---|---|
| 🔑 **Admin** | `admin@makesense.agency` | `password123` |
| 👤 **Consultant** | `consultant@makesense.agency` | `password123` |

---

## 🚀 Utilisation

### Dashboard
Accédez au **Dashboard** pour visualiser les KPIs e-commerce. Les métriques s'adaptent dynamiquement au nombre de clients dans la base.

### Knowledge Base
Parcourez les **SOPs** par catégorie. Chaque article peut être consulté, modifié ou supprimé.

### Génération IA
Cliquez sur **"Générer une SOP"** pour créer automatiquement un article à partir d'un titre et d'une catégorie. L'IA rédige un contenu structuré et actionable, adapté au contexte agence.

### Gestion clients
Ajoutez des fiches clients avec :
- **Briefs créas / stratégies** — documents de cadrage
- **Accès & Credentials** — mots de passe masqués, copiables en un clic
- **Notes & Comptes-rendus** — historique des échanges

### Recherche
La **recherche sémantique** parcourt l'ensemble de la base de connaissances pour trouver les contenus les plus pertinents.

---

## 🧪 Méthodologie IA & Prompts

### Mon approche

Ce projet a été développé en **pair-programming avec l'IA**. Voici ma méthodologie :

1. **Cadrage du besoin** — Définition des user stories et du périmètre fonctionnel
2. **Architecture** — Choix de la stack, structure des composants, modèle de données
3. **Développement itératif** — Chaque fonctionnalité est construite, testée et raffinée
4. **Prompt engineering** — Rédaction de prompts précis pour la génération de SOPs

### Exemples de prompts utilisés pour la génération de SOPs

```
Rédige une SOP complète et détaillée pour une agence de marketing digital
sur le sujet : "{titre}".

La SOP doit :
- Être structurée avec des titres, sous-titres et listes
- Contenir des étapes concrètes et actionnables
- Inclure des bonnes pratiques et des pièges à éviter
- Être rédigée dans un ton professionnel mais accessible
```

### Ce que cela démontre

- 🎯 **Capacité à formuler des besoins** — Transformer un besoin métier flou en spécification technique
- 🔄 **Itération rapide** — Prototyper, tester, améliorer en cycles courts
- 🧠 **Esprit critique** — Valider, corriger et enrichir les outputs IA
- ⚡ **Productivité** — Construire un outil complet en quelques jours

---

## 🔮 Améliorations futures

- [ ] 📊 **Connexion API réelle** — Intégration avec Google Ads, Meta Ads, Google Analytics pour des KPIs en temps réel
- [ ] 📝 **Éditeur WYSIWYG** — Remplacement du Markdown brut par un éditeur riche (TipTap / Lexical)
- [ ] 🔔 **Notifications** — Alertes sur les variations de KPIs et les mises à jour de SOPs
- [ ] 📱 **PWA** — Installation en tant qu'application mobile
- [ ] 🗂️ **Versioning des SOPs** — Historique des modifications avec diff
- [ ] 🤖 **Chatbot interne** — Assistant IA conversationnel pour interroger la knowledge base
- [ ] 📈 **Rapports automatiques** — Génération de rapports clients hebdomadaires via IA

---

## 👤 Auteur & Contexte

<table>
  <tr>
    <td>
      <strong>Constant Blaszyk</strong><br/>
      Développeur Full-Stack en recherche d'alternance<br/><br/>
      🎓 Passionné par le développement web, l'IA et le marketing digital<br/>
      🏢 Projet développé dans le cadre d'une candidature chez <strong>Make Sense</strong> (Bondues, 59)<br/>
      💼 Objectif : démontrer ma valeur ajoutée en construisant un outil concret et utile<br/><br/>
      <a href="https://github.com/Thenoob24">GitHub</a> •
      <a href="https://makesense.constantblaszyk.fr">Démo en ligne</a>
    </td>
  </tr>
</table>

---

<p align="center">
  <strong>⭐ Si ce projet vous plaît, n'hésitez pas à laisser une étoile !</strong><br/>
  <em>Fait avec ❤️, du café et beaucoup d'IA.</em>
</p>
