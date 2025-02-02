# InVoice

_InVoice_ est une application web de gestion de factures développée avec Next.js et TypeScript. Elle permet aux utilisateurs de créer, modifier, supprimer et consulter des factures, ainsi que de générer un PDF pour chaque facture. L'authentification est gérée par Clerk, la base de données est accessible via Prisma et l'interface utilisateur utilise Tailwind CSS (avec DaisyUI).

---

## Table des matières

- [Description](#description)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Installation](#installation)
- [Utilisation](#utilisation)
- [Structure du projet](#structure-du-projet)
- [Contribution](#contribution)
- [Licence](#licence)

---

## Description

_InVoice_ est une application complète de gestion de factures. Elle offre les fonctionnalités suivantes :

- **Création et modification de factures** : Saisie des informations de l'émetteur, du client, des dates, des lignes de produits/services et de la TVA.
- **Gestion des lignes de facture** : Ajout, modification et suppression de produits ou services.
- **Génération de PDF** : Exportation de la facture en PDF avec un rendu fidèle via `html2canvas-pro` et `jsPDF`.
- **Mise à jour automatique des statuts** : Les factures expirées sont automatiquement marquées comme "Impayées".
- **Authentification sécurisée** : Utilisation de Clerk pour la connexion et l'inscription des utilisateurs.
- **Interface responsive** : Adaptation de l'interface aux petits et grands écrans grâce à Tailwind CSS et DaisyUI.

---

## Fonctionnalités

- **CRUD complet sur les factures** : Création, lecture, mise à jour et suppression des factures.
- **Gestion de la TVA** : Activation/désactivation et définition du taux de TVA.
- **Calcul automatique des totaux** : Total Hors Taxes (HT), TVA et Total Toutes Taxes Comprises (TTC).
- **Génération de PDF** : Téléchargement d'un PDF de la facture avec un effet de confettis.
- **Navigation intuitive** : Barre de navigation incluant les liens principaux et le profil utilisateur.
- **Sécurité** : Authentification et gestion sécurisée des utilisateurs via Clerk.

---

## Technologies utilisées

- **Next.js** et **React** pour le framework et l'interface utilisateur.
- **TypeScript** pour le typage statique.
- **Prisma** pour la gestion de la base de données.
- **Clerk** pour l'authentification.
- **Tailwind CSS** et **DaisyUI** pour le style et les composants UI.
- **jsPDF** et **html2canvas-pro** pour la génération de PDF.
- **Lodash.isequal** pour la comparaison profonde des objets.
- **Canvas-confetti** pour les animations de confettis.

---

## Installation

1. **Cloner le dépôt :**

   ```bash
   git clone https://github.com/votre-utilisateur/invoice.git
   cd invoice

2. **Installer les dépendances :**

    ```bash
    npm install
    ```

3. **Configurer les variables d'environnement :**

    Créez un fichier `.env` à la racine du projet et configurez-y vos variables (par exemple, la connexion à la base de données, les clés d'API Clerk, etc.).

4. **Exécuter les migrations :**

    ```bash
    npx prisma migrate dev
    ```
5. **Démarrer le serveur de développement :**

    ```bash
    npm run dev

## Utilisation
    Accès : Rendez-vous sur `http://localhost:3000` pour accéder à l'application.
    Authentification : Connectez-vous ou inscrivez-vous via les pages de connexion/inscription gérées par Clerk.
    Gestion des factures :
    Sur la page d'accueil, visualisez vos factures et utilisez la barre de recherche pour filtrer par nom.
    Cliquez sur une facture pour voir ses détails et effectuer des modifications.
    Utilisez les boutons pour sauvegarder vos modifications ou supprimer une facture.
    Générez un PDF de votre facture via le bouton dédié.

## Structure du projet

```
/src
  ├── app
  │     ├── components
  │     │       ├── InvoiceInfo.tsx      // Gestion des informations générales d'une facture
  │     │       ├── InvoiceComponent.tsx // Affichage d'un résumé de la facture
  │     │       ├── InvoiceLines.tsx     // Gestion des lignes (produits/services) de la facture
  │     │       ├── InvoicePDF.tsx       // Génération du PDF de la facture
  │     │       ├── Navbar.tsx           // Barre de navigation
  │     │       ├── VATControl.tsx       // Contrôle de la TVA et saisie du taux
  │     │       └── Wrapper.tsx          // Wrapper global incluant la Navbar
  │     ├── actions.ts                  // Fonctions serveur pour CRUD sur les factures et utilisateurs
  │     ├── pages
  │     │       ├── [invoiceId]          // Détails d'une facture
  │     │       ├── sign-in.tsx          // Page de connexion
  │     │       └── sign-up.tsx          // Page d'inscription
  │     └── ...                         // Autres pages et fichiers
  ├── lib
  │     └── prisma.ts                  // Configuration du client Prisma
  ├── type
  │     └── index.ts                   // Définition des types TypeScript
  └── globals.css                      // Styles globaux (Tailwind CSS)
```

## Contribution

Les contributions sont les bienvenues !

1. Forkez le dépôt.

2. Créez votre branche de fonctionnalité (`git checkout -b feature/ma-nouvelle-fonctionnalite`).

3. Commitez vos modifications (`git commit -am 'Ajout de ma nouvelle fonctionnalité'`).

4. Poussez votre branche (`git push origin feature/ma-nouvelle-fonctionnalite`).

5. Créez une Pull Request.

## Licence

Ce projet est sous licence MIT.

`Notes supplémentaires :`

- Les composants sont fortement commentés afin de faciliter la compréhension et la maintenance du code par d'autres développeurs.

- Les actions côté serveur dans `actions.ts` gèrent la logique métier et l'interaction avec la base de données via Prisma.

- L'authentification est assurée par Clerk, ce qui simplifie la gestion des utilisateurs et renforce la sécurité.

