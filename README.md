# NAIL PROFILE

**Tes ongles. Ton design. Ton format.**

La première plateforme de personnalisation d'ongles par IA. Scanne tes mains, l'IA mesure tes ongles et crée un Nail Profile unique. Chaque design est ensuite adapté à tes dimensions réelles — pas à un modèle générique.

---

## Le concept

Un ongle n'est pas un écran. C'est une forme.

Les outils actuels génèrent des images de nail art. Nail Profile est différent : nous créons un modèle numérique de tes vrais ongles, puis chaque design y est dessiné directement. Pas de simulacre. Pas d'approximation. Un vrai produit, pensé pour toi.

---

## Fonctionnalités

### Scan & Profil
- Scan IA haute précision des 10 ongles
- Détection automatique des formes, dimensions et orientations
- Nail Profile permanent réutilisable pour toutes les créations
- Correction manuelle des contours

### Studio de Création
- Prompt libre en langage naturel
- Import d'images d'inspiration (photo, URL, palette)
- 12 styles rapides (Minimal, French, Chrome, Luxury, Floral, Gothic, Kawaii, Y2K, Nature, Wedding, Art, Abstract)
- Génération d'un set de 10 designs cohérents
- Régénération individuelle d'un ongle

### Try-On & Commande
- Visualisation sur tes mains avec avant/après
- Zoom, rotation et changement de lumière
- Vérification de fabricabilité avant commande
- Finitions : Brillante, Mate, Chrome, Métallique
- Formes : Naturelle, Almond, Oval, Square, Coffin
- Commande persistée dans PostgreSQL

### Marketplace
- Explorer des créations de la communauté
- Filtres par collection (Mariage, Minimal, Chrome, Art, Festival, Nature, Gothic, Y2K, Saisons)
- Fiche produit avec visuel réel, try-on et commande
- Design paramétrique : chaque création s'adapte au Nail Profile de chaque acheteur

### Créateur
- Publier ses créations (Privé / Public / Créateur)
- Tableau de bord : vues, essais, commandes, revenus
- Commission sur les ventes

---

## Architecture technique

- **Framework** : Next.js 16 (App Router)
- **Base de données** : PostgreSQL via Drizzle ORM
- **Style** : Tailwind CSS 4
- **Langage** : TypeScript strict
- **Pictogrammes** : Lucide React (linéaires)
- **Visuels** : Images locales haute qualité dans `public/images/`

### Structure des tables

- `users` — Comptes utilisateurs
- `nail_profiles` — Profils de scan
- `nails` — 10 ongles individuels avec dimensions
- `design_sets` — Sets de 10 designs
- `designs` — Designs individuels par ongle
- `orders` — Commandes
- `favorites` — Favoris
- `collections` — Collections thématiques
- `collection_designs` — Liaison collections/designs
- `inspirations` — Images d'inspiration uploadées

### API Routes

- `GET /api/health` — Healthcheck
- `GET /api/profile` — Nail Profile de l'utilisateur
- `GET /api/designs` — Marketplace
- `POST /api/designs` — Publier une création
- `GET /api/designs/[id]` — Détail d'un design
- `GET /api/collections` — Collections
- `GET /api/orders` — Historique des commandes
- `POST /api/orders` — Créer une commande

---

## Pages

| Route | Description |
|---|---|
| `/` | Landing immersive avec hero visuel et storytelling |
| `/scan` | Scan des mains |
| `/scan/extraction` | Extraction et correction des ongles |
| `/scan/profile` | Nail Profile avec les 10 gabarits |
| `/canvas` | Nail Canvas (mode Main / Canvas) |
| `/create` | AI Design Studio |
| `/create/result` | Set de 10 designs générés |
| `/create/fabricability` | Vérification de fabrication |
| `/create/publish` | Publier dans la marketplace |
| `/try-on` | Try-On interactif |
| `/checkout` | Commande |
| `/explore` | Marketplace |
| `/explore/[id]` | Fiche produit |
| `/my-creations` | Galerie personnelle |
| `/orders` | Historique des commandes |
| `/creator` | Tableau de bord créateur |
| `/profile` | Profil utilisateur |

---

## Démarrage

```bash
npm install
cp .env.example .env  # configurer DATABASE_URL
npx drizzle-kit push   # appliquer le schéma
npx tsx src/db/seed.ts # injecter les données de test
npm run dev
```

---

## Design direction

- Fond ivoire `#fbfaf8`
- Noir profond `#101010`
- Rose unique `#e62e6b`
- Pictogrammes linéaires modernes (Lucide)
- Aucun dégradé
- Aucun emoji
- Aucun picto étoile
- Vrais visuels de mains et manucures
- Typographie Inter
- Coins arrondis
- Mobile-first, responsive desktop

---

## Licence

© NAIL PROFILE 2026
