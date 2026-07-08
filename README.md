# EventLink

Plateforme SaaS de mise en relation entre organisateurs d'événements et
prestataires événementiels — lancement à Abidjan, Côte d'Ivoire.

## Stack

- **Frontend** : Next.js (App Router) · TypeScript strict · Tailwind CSS v4 · shadcn/ui · React Hook Form · Zod
- **Backend** : Supabase (PostgreSQL, Auth, Realtime, RLS)
- **Stockage média** : Cloudflare R2 (jamais dans Supabase)
- **Déploiement** : GitHub → Vercel (déploiement automatique)

## Démarrage

```bash
npm install
cp .env.example .env.local   # renseigner les clés Supabase
npm run dev
```

## Documentation

- [`ARCHITECTURE.md`](./ARCHITECTURE.md) — arborescence, conventions de nommage, système de design. À lire avant toute contribution.

## État du projet

Phase 1 (architecture frontend) en cours. Voir `ARCHITECTURE.md` pour le détail
des phases et l'ordre de développement des fonctionnalités.
