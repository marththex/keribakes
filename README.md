# Keri Bakes

Custom cake/dessert website for Keri Zhong — browse past work, learn about Keri, and submit a cake inquiry that triggers confirmation emails to both the customer and the owner via Resend.

🌐 **[keribakes.com](https://keribakes.com)**

---

![CI](https://github.com/marththex/keribakes/actions/workflows/ci.yml/badge.svg)
![Astro](https://img.shields.io/badge/Astro-6.x-FF5D01?logo=astro&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-container-2496ED?logo=docker&logoColor=white)
![Node](https://img.shields.io/badge/Node-22-339933?logo=node.js&logoColor=white)

---

## Getting started

```bash
# 1. Install dependencies
npm install

# 2. Copy and fill in environment variables
cp .env.example .env

# 3. Start dev server
npm run dev        # http://localhost:4321
```

Requires Node.js ≥ 22.

---

## Environment variables

| Variable | Description |
|---|---|
| `RESEND_API_KEY` | API key from [Resend](https://resend.com) |
| `TO_EMAIL` | Owner's real inbox — server-side only, never client-exposed |
| `FROM_EMAIL` | Verified sender address (e.g. `orders@keribakes.com`) |

---

## Cake offerings & pricing

Prices are defined in `src/lib/pricing.ts` — the single source of truth. Editing that file updates the gallery cards and order form dropdown simultaneously.

| Cake | Price |
|------|-------|
| Tres Leches Cake (6 in) | From $45 — serves 4–6 |
| Tres Leches Cake (8 in) | From $65 — serves 8–12 |
| Tres Leches Cupcakes | From $48 / dozen |
| Cheesecake Cupcakes | From $55 / dozen |

Sweetness cannot be adjusted. Final price depends on add-ons (fruit, candles, organic ingredients, decorations).

---

## Project structure

```
src/
├── components/                   # CakeGalleryCard, ProfileSlideshow, SignatureSlideshow
├── layouts/
│   └── Layout.astro              # Shared shell: Google Fonts, sticky nav, footer
├── pages/
│   ├── index.astro               # Home — 3-col hero + warm closing paragraph
│   ├── about.astro               # About — photo slideshow + story
│   ├── desserts.astro            # Gallery — 3-card grid with photo carousel
│   ├── order.astro               # Order inquiry form
│   └── api/order.ts              # POST endpoint: server validation + Resend
├── lib/
│   ├── orderSchema.ts            # Zod schema — shared by client and server
│   └── pricing.ts                # Single source of truth for pricing
├── emails/
│   ├── customerConfirmation.ts   # HTML confirmation email for customer
│   └── ownerNotification.ts      # HTML inquiry summary for Keri
├── styles/
│   └── global.css                # Tailwind @theme tokens + base styles
└── tests/
    └── schema.test.ts            # Vitest unit tests — order schema business rules
```

**To update prices** → edit `src/lib/pricing.ts`.

**To replace photos** → swap files in `public/images/about/` (profile) or `public/images/gallery/<cake-slug>/` (gallery). Keep existing filenames.

**To change the link-preview image** (shown when sharing on iMessage, Messenger, WhatsApp, etc.) → replace `public/images/about/profile-4.jpeg`. The OG meta tags in `src/layouts/Layout.astro` reference this file. Image should be at least 1200×630px.

---

## CI

`.github/workflows/ci.yml` runs on every push and PR to `main`:

| Step | Command |
|---|---|
| Lint | `npm run lint` |
| Type check | `npm run typecheck` |
| Build | `npm run build` |
| Unit tests | `npm test` |
| HTTP smoke test | starts built server, curls 4 pages |
| Audit | `npm audit --audit-level=high` (warn only) |

---

## Deployment

CD is handled by `.github/workflows/deploy.yml`. On push to `main` it SSHes into the NAS via Cloudflare Access TCP, pulls latest, and runs `docker compose up -d --build`. The container serves the Node.js server behind Nginx Proxy Manager at `keribakes.com`.

Manual redeploy:

```bash
cd /nfs/keribakes && docker compose up -d --build
```
