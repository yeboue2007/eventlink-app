# EventLink

Plateforme SaaS de mise en relation entre organisateurs d'événements et prestataires événementiels — Abidjan.

## Stack
- Next.js 16 (App Router) + Tailwind CSS
- Supabase (Postgres, Auth, RLS) — projet `eventlink` (réf. atfkmynxserakuyqvvzk)
- Déploiement Vercel

## Configuration locale
Copier `.env.local.example` en `.env.local` et renseigner les clés du projet Supabase.

```bash
npm install
npm run dev
```

## Structure
- `app/page.tsx` — landing page (charte graphique EventLink)
- `app/inscription`, `app/login` — auth (rôle client/prestataire, sélection multi-catégories)
- `app/dashboard/client` — publication de demandes multi-lots
- `app/dashboard/prestataire` — crédits, catégories, réponse aux demandes (offres simples ou groupées)
- `lib/supabase` — clients Supabase (browser/serveur)
- `proxy.ts` — rafraîchissement de session (convention Next.js 16, ex-middleware)
