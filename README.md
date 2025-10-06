# Application d'Exercices Quotidiens Grabovoï

Bienvenue sur l'application d'Exercices Quotidiens Grabovoï. Cette application web a été conçue pour offrir une interface moderne, intuitive et motivante pour la pratique journalière des exercices d'expansion de conscience de Grigori Grabovoï.

Elle est conçue comme une **Progressive Web App (PWA)**, ce qui signifie qu'elle est installable sur votre téléphone ou ordinateur et peut fonctionner entièrement hors ligne.

## ✨ Fonctionnalités

*   **Coach IA Intégré :** Un chatbot alimenté par l'IA (DeepSeek) pour répondre à vos questions sur l'exercice du jour et vous guider dans votre pratique.
*   **Exercices des 31 Jours :** Accès complet aux trois parties de chaque exercice quotidien (concentration, séries numériques, harmonisation universelle).
*   **Navigation Intuitive :** Naviguez facilement entre les jours via un menu déroulant, des boutons "précédent/suivant" ou un bouton "Aujourd'hui".
*   **Suivi de Progression :** Un calendrier visuel vous permet de voir les jours où vous avez pratiqué, créant un sentiment d'accomplissement.
*   **Journal Personnel :** Un espace de prise de notes pour chaque jour, sauvegardé localement sur votre appareil.
*   **Recherche dans le Journal :** Retrouvez facilement vos notes passées grâce à une barre de recherche par mot-clé intégrée au calendrier.
*   **Système de Gamification :**
    *   **Compteur de Série (Streak) :** Compte le nombre de jours consécutifs de pratique pour renforcer l'habitude.
    *   **Trophées Permanents & Mensuels :** Débloquez des badges pour des étapes clés (premier exercice, 7 jours de suite, régularité mensuelle, etc.).
*   **Personnalisation :**
    *   **Intention Principale :** Définissez un objectif global qui s'affiche sur la page d'accueil pour vous inspirer.
    *   **Thèmes Visuels :** Choisissez entre plusieurs ambiances (Cosmique, Nature, Sérénité).
*   **Gestion Complète des Données :**
    *   **Exportation :** Sauvegardez une copie de votre journal et de votre progression dans un fichier JSON.
    *   **Importation :** Restaurez vos données depuis un fichier de sauvegarde.
*   **PWA Complète :**
    *   **Installable :** Ajoutez l'application à l'écran d'accueil de votre téléphone ou sur le bureau de votre ordinateur.
    *   **Fonctionne Hors Ligne :** Une fois chargée une première fois, l'application est entièrement fonctionnelle sans connexion internet.

## 🛠️ Technologies Utilisées

*   **Frontend :** HTML5, CSS3 (avec variables), JavaScript (ES6+)
*   **Backend (pour le chatbot) :** Netlify Functions (Serverless)
*   **PWA :** Manifest Web et Service Worker pour l'installation et le mode hors ligne.
*   **IA :** API de DeepSeek

Toutes les données de l'utilisateur sont sauvegardées localement dans le `localStorage` du navigateur, garantissant une confidentialité totale.

## 🚀 Déploiement et Installation

Cette application est optimisée pour un déploiement sur **Netlify** afin de profiter des fonctions serverless pour le chatbot.

### Étape 1 : Déployer sur Netlify

1.  **Héberger le projet :** La méthode la plus simple est de lier votre site Netlify à un dépôt GitHub contenant tous les fichiers du projet. Vous pouvez aussi faire un "glisser-déposer" du dossier complet de votre projet sur la page "Sites" de Netlify.
2.  **Détection automatique :** Netlify détectera automatiquement le fichier `netlify.toml` et déploiera le site ainsi que la fonction serverless `coach.js`.

### Étape 2 : Configurer la Clé API du Chatbot

Pour que le chatbot fonctionne, vous devez configurer votre clé API DeepSeek de manière sécurisée.

1.  Sur votre tableau de bord Netlify, allez dans `Site configuration` > `Build & deploy` > `Environment`.
2.  Dans la section `Environment variables`, cliquez sur `Add a variable`.
3.  Remplissez les champs comme suit :
    *   **Key (Clé) :** `DEEPSEEK_API_KEY`
    *   **Value (Valeur) :** Collez ici votre clé API DeepSeek secrète.
4.  Cliquez sur `Create variable`.
5.  **Redéployez votre site** en allant dans l'onglet `Deploys` et en cliquant sur `Trigger deploy` > `Deploy site`.

### Étape 3 : Installer l'Application PWA

1.  Ouvrez l'URL de votre site Netlify sur votre navigateur.
2.  **Sur Mobile (Android/iOS) :** Le navigateur vous proposera d' "Ajouter à l'écran d'accueil".
3.  **Sur Ordinateur (Chrome/Edge) :** Une icône d'installation apparaîtra dans la barre d'adresse.

Une fois installée, vous pouvez lancer l'application directement depuis son icône.

## 📁 Structure des Fichiers

```.
├── 📄 index.html         # Structure principale de l'application
├── 📄 style.css          # Tous les styles visuels
├── 📄 app.js             # Toute la logique de l'application (frontend)
├── 📄 exercises.json     # La base de données contenant tous les textes des exercices
├── 📄 manifest.json      # Fichier de configuration de la PWA
├── 📄 sw.js              # Service Worker pour la gestion du cache et du mode hors ligne
├── 📄 netlify.toml       # Fichier de configuration pour Netlify (fonctions, redirections)
│
├── 📁 netlify/
│   └── 📁 functions/
│       └── 📄 coach.js     # Fonction serverless (backend) pour le chatbot
│
├── 🖼️ icon-192x192.png   # Icône de l'application (à créer)
├── 🖼️ icon-512x512.png   # Icône de l'application (à créer)
└── 📄 README.md          # Ce fichier