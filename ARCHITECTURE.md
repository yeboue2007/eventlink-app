# Architecture frontend — EventLink

Ce document est la source de vérité pour l'organisation du code frontend. Toute
nouvelle fonctionnalité doit s'y conformer ; toute exception doit être justifiée
et documentée ici.

## 1. Arborescence

```
eventlink/
├── app/                        # Next.js App Router — routage uniquement
│   ├── (public)/                # Landing, recherche publique, profils publics (groupe, sans segment d'URL)
│   ├── (auth)/                  # Connexion / inscription / mot de passe oublié (groupe, sans segment d'URL)
│   ├── auth/confirm/            # Callback des liens e-mail Supabase (token_hash)
│   ├── client/                  # Espace organisateur d'événement — protégé par layout.tsx (rôle DB)
│   ├── prestataire/              # Espace entreprise prestataire — protégé par layout.tsx (rôle DB)
│   ├── admin/                    # Back-office — protégé par layout.tsx (rôle DB)
│   ├── tableau-de-bord/          # Redirecteur : envoie vers /client, /prestataire ou /admin selon le rôle
│   ├── api/                     # Route Handlers (webhooks, endpoints ponctuels)
│   ├── layout.tsx
│   └── globals.css              # Tokens de marque (voir §3)
│
├── features/                   # Logique métier, organisée par domaine
│   └── <domaine>/               # ex. demandes, offres, credits, entreprises...
│       ├── components/          # Composants propres à ce domaine
│       ├── hooks/                # Hooks propres à ce domaine
│       ├── actions/              # Server Actions (mutations)
│       ├── queries/              # Lecture de données (Server Components), ajouté au besoin
│       ├── schemas/              # Schémas de validation Zod
│       └── types/                # Types propres à ce domaine

**Note sur `(public)`/`(auth)` vs `client`/`prestataire`/`admin`** : les groupes
entre parenthèses n'ajoutent pas de segment d'URL (utile quand plusieurs pages
partagent un layout sans vouloir de préfixe visible). `client`, `prestataire`
et `admin` sont volontairement de **vrais dossiers** (pas des groupes) car on
veut un préfixe d'URL distinct par espace (`/client/...`, `/admin/...`) — chacun
protégé par son propre `layout.tsx` qui vérifie le rôle en base.
│
├── components/
│   ├── ui/                      # Design system générique, sans logique métier
│   ├── shared/                   # Composants métier réutilisés par 2+ domaines
│   └── layout/                   # Navbar, Sidebar, Footer
│
├── lib/
│   ├── supabase/                 # Clients Supabase (browser/server/middleware)
│   └── utils.ts
│
├── hooks/                       # Hooks génériques, non liés à un domaine
├── types/                       # Types globaux partagés (ex. Role)
├── proxy.ts                       # Rafraîchissement de session Supabase (convention Next.js 16)
└── public/brand/                 # Logo et assets de marque officiels
```

**Règle de dépendance** : `app/` ne contient que du routage et compose des
éléments de `features/` et `components/`. Aucune logique métier ne doit être
écrite directement dans un fichier `page.tsx`.

## 2. Conventions de nommage

| Élément | Convention | Exemple |
|---|---|---|
| Dossiers et fichiers | `kebab-case` | `demande-form.tsx`, `credit-wallet/` |
| Composants React | `PascalCase` (nom du composant = nom du fichier en PascalCase) | `DemandeForm` dans `demande-form.tsx` |
| Hooks | `camelCase`, préfixe `use` | `useCreditBalance.ts` |
| Server Actions | suffixe `.actions.ts` | `demandes.actions.ts` |
| Schémas de validation | suffixe `.schema.ts` | `demande.schema.ts` |
| Types de domaine | suffixe `.types.ts` | `offre.types.ts` |
| Constantes | `SCREAMING_SNAKE_CASE` | `MAX_LOTS_PAR_DEMANDE` |
| Variables et fonctions | `camelCase` | `calculerCoutCredits()` |
| Tables/colonnes SQL (rappel) | `snake_case` en français | `entreprise_id`, `date_evenement` |

**Langue** : le code (variables, fonctions, types) est en anglais s'il est
générique/technique, en français s'il nomme un concept métier propre à
EventLink (ex. `Demande`, `Offre`, `Entreprise` restent en français, comme
dans la base de données — pas de traduction qui romprait la cohérence avec le
schéma SQL).

## 3. Système de design

Tous les tokens de marque vivent dans `app/globals.css` (`@theme inline`).
**Aucune couleur ni valeur de rayon ne doit être codée en dur dans un
composant** — toujours passer par les classes Tailwind générées à partir des
tokens (`bg-primary`, `text-el-navy`, `rounded-lg`, etc.) ou par
`bg-el-gradient` / `text-el-gradient` pour le dégradé de marque.

Rappel de la charte :
- Le dégradé (violet → rose → orange) est réservé aux **accents et CTA**.
- Le navy porte la confiance : badges de vérification, indice de fiabilité.
- Police unique : Poppins (`font-sans`, déjà configurée dans le layout racine).

Les composants `components/ui/*` ne contiennent **aucune logique métier** —
un `Button` ne sait pas ce qu'est une offre ; un composant de
`features/offres/components` l'utilise et lui donne un sens métier.

**Inventaire (Phase 4)** : Button, Card, Badge, Input, Label, Table, Dialog
(sert aussi de Modal), Select, Avatar, DropdownMenu, Tabs, Separator,
Checkbox, Tooltip, Loader/FullPageLoader, Pagination (basée sur des liens,
compatible Server Components), notifications toast (`sonner`, distinct de la
table `notifications` en base qui est le centre persistant).

**Composants de layout** (`components/layout/`) : `AppNavbar` (barre des
espaces authentifiés), `Sidebar` (générique, reçoit sa liste de liens en
prop — ne connaît aucune route métier en dur), `Footer` (site public).

**Composants partagés génériques** (`components/shared/`) : `FilterBar`
(recherche + filtres Select réutilisable par n'importe quel écran de liste —
recherche prestataires, back-office, etc. — sans connaître les catégories
concrètes qu'on lui passe).

## 4. Modules métier (`features/`)

Chaque domaine est autonome et ne doit pas importer directement les
`components/` ou `types/` internes d'un autre domaine — les échanges passent
par `components/shared/` ou `types/` (globaux). Cette isolation permet de
faire évoluer un domaine (ex. `credits`) sans casser les autres.

Domaines prévus (créés vides, remplis au fur et à mesure des phases) :
`projets`, `demandes`, `offres`, `entreprises`, `credits`, `messagerie`,
`notifications`, `calendrier`, `avis`, `favoris`, `recherche`, `administration`.

`categories` est un domaine transverse minimal (uniquement des `queries/`) :
plusieurs autres domaines (demandes, entreprises, recherche, administration)
ont besoin de lire l'arbre des catégories — un seul point de lecture plutôt
qu'une requête dupliquée dans chacun.

## 5. Règle transversale

Avant toute fonctionnalité métier significative, se poser les questions du
brief : est-ce générique ? Peut-on faire évoluer sans refonte ? Introduit-on de
la dette technique ? Si une meilleure architecture existe, la proposer avant
de coder — ne pas simplement l'implémenter.
