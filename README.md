# Bon vent !

Application de suivi de prospection pour freelances et chercheurs d'emploi.

![Screenshot](docs/screenshot.png)

## Fonctionnalités

- **Tableau de bord** : Vue d'ensemble avec statistiques, entreprises à relancer et calendrier
- **Favoris** : Entreprises inspirantes qui guident votre recherche
- **Contacts** : Historique de vos candidatures avec suivi des statuts
- **Interactions** : Déclarez vos échanges (emails, appels, entretiens) avec historique global
- **Catégories** : Organisez vos prospects par domaine
- **Objectifs quotidiens** : Suivez vos interactions (commentaires, messages, prises de contact)
- **Export/Import** : Sauvegardez et restaurez vos données en JSON
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

Le projet sépare strictement la logique métier (features/) de l'interface React (components/, hooks/).

### Principes

- **Indépendance du domaine** : La logique métier dans `features/` ne dépend pas de React. Elle peut être testée et réutilisée indépendamment.
- **Injection de dépendances** : Les services reçoivent leur adapter en paramètre, permettant de substituer facilement l'implémentation (API réelle, fake pour tests).
- **Un fichier = une responsabilité** : Chaque type, service et hook est dans son propre fichier pour une navigation et maintenance simplifiées.
- **Nommage kebab-case** : Convention uniforme pour tous les fichiers.

### Structure

```
features/                     # Logique métier par domaine
├── companies/
│   ├── api/
│   │   ├── company.port.ts   # Interface du repository
│   │   ├── api.adapter.ts    # Implémentation API (IndexedDB)
│   │   └── fake.adapter.ts   # Implémentation mock (tests)
│   ├── types/
│   │   ├── company.type.ts   # Un type = un fichier
│   └── services/
│       └── *.service.ts      # Logique métier
├── categories/
├── domains/
├── objectives/
├── interactions/
└── db/                       # Configuration IndexedDB

hooks/                        # Hooks React Query (interface)
├── use-companies.hook.ts
├── use-create-company.hook.ts
└── ...

components/                   # Composants UI (Atomic Design)
├── atoms/
├── molecules/
├── organisms/
└── ui/                       # shadcn/ui

app/                          # Pages Next.js
├── page.tsx
├── favoris/
├── contacts/
└── interactions/
```

### Flux de données

```
Component → Hook → Service → Adapter → IndexedDB
                      ↓
                   (logique métier si nécessaire)
```

Les hooks utilisent React Query pour le cache et les mutations. Les services orchestrent la logique métier. Les adapters gèrent uniquement l'accès aux données.

## Démarrage

```bash
npm install
npm run dev
```

Ouvrez [http://localhost:3000](http://localhost:3000).

## Licence

MIT
