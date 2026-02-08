# Bon vent !

Application de suivi de prospection pour freelances et chercheurs d'emploi.

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble avec les entreprises à relancer et en attente de réponse
- **Gestion des favoris** : Sauvegardez les entreprises qui vous intéressent
- **Suivi des contacts** : Gardez un historique de vos prises de contact
- **Zones géographiques** : Organisez vos prospects par région
- **Objectifs hebdomadaires** : Suivez vos interactions sur les réseaux (commentaires, messages, prises de contact)
- **Notes personnelles** : Ajoutez des remarques sur vos échanges
- **Thème clair/sombre** : Automatiquement synchronisé avec votre OS
- **Stockage local** : Vos données restent sur votre appareil (IndexedDB)

## Stack technique

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- shadcn/ui
- React Query
- nuqs (URL state)
- IndexedDB (idb)

## Architecture

Le projet suit une architecture hexagonale avec séparation des responsabilités :

```
features/           # Logique métier par domaine
├── companies/      # Gestion des entreprises
├── zones/          # Zones géographiques
├── objectives/     # Objectifs hebdomadaires
└── interactions/   # Historique des interactions

components/         # Composants UI (Atomic Design)
├── atoms/          # Composants de base
├── molecules/      # Composants composés
├── organisms/      # Composants complexes
└── ui/             # shadcn/ui

lib/                # Infrastructure
├── db/             # Configuration IndexedDB
├── providers/      # React Query provider
└── utils/          # Utilitaires
```

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Licence

MIT
