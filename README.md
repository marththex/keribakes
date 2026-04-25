# Keri Bakes

Website for Keri Zhong's custom celebration cake side business — built with Astro, TypeScript, and Tailwind CSS. Visitors can browse past work, read about Keri, and submit a cake inquiry that triggers confirmation emails to both the customer and the owner via Resend.

## Tech Stack

| Layer       | Choice                                      |
|-------------|---------------------------------------------|
| Framework   | [Astro 6](https://astro.build) (SSR mode)   |
| Language    | TypeScript (strict)                         |
| Styling     | Tailwind CSS v4 (CSS-first `@theme` config) |
| Validation  | Zod v4                                      |
| Email       | [Resend](https://resend.com)                |
| Adapter     | `@astrojs/node` (standalone)                |
| Hosting     | Docker on personal NAS via Cloudflare Tunnel |

## Cake Offerings & Pricing

| Cake | Starting Price |
|------|---------------|
| Tres Leches Cake | From $65 |
| Tres Leches Cupcakes | From $48 / dozen |
| Cheesecake Cupcakes | From $55 / dozen |

Final pricing depends on add-ons (fruit toppings, organic ingredients, decorations, candles, etc.). Sweetness cannot be adjusted.

**To update prices:** edit `src/lib/pricing.ts` — that file is the single source of truth. Changes there automatically update the gallery cards and the order form dropdown.

## Photos

All photos live in `public/images/` and are served as static files.

| Folder | Contents |
|--------|----------|
| `public/images/about/` | `profile-1.jpg` – `profile-5.jpg` (About page slideshow) |
| `public/images/gallery/tres-leches-cake/` | `main.jpg`, `detail-1.jpg` – `detail-3.jpg` |
| `public/images/gallery/tres-leches-cupcakes/` | `main.jpg`, `detail-1.jpg` – `detail-3.jpg` |
| `public/images/gallery/cheesecake-cupcakes/` | `main.jpg`, `detail-1.jpg` – `detail-3.jpg` |

**To replace about photos:** swap files in `public/images/about/`, keeping the same filenames (`profile-1.jpg` etc.).

**To add more gallery detail photos:** add `detail-4.jpg` etc. to the relevant cake folder, then append the path to that product's `detailImages` array in `src/pages/desserts.astro`.

**To add a new cake product:** add a folder under `public/images/gallery/`, add `main.jpg` + detail photos, then add a new entry to the `products` array in `src/pages/desserts.astro` and to `CAKE_OPTIONS` in `src/lib/orderSchema.ts`.

## Project Structure

```
src/
├── components/
│   └── ProfileSlideshow.astro # Auto-advancing photo slideshow for About page
├── layouts/
│   └── Layout.astro           # Shared shell: Google Fonts, sticky nav, footer
├── pages/
│   ├── index.astro            # Home — 3-col hero + warm closing paragraph
│   ├── about.astro            # About — ProfileSlideshow + story
│   ├── desserts.astro          # Gallery — 12-card grid (real photos)
│   ├── order.astro            # Order inquiry form
│   └── api/
│       └── order.ts           # POST endpoint: server validation + Resend
├── lib/
│   └── orderSchema.ts         # Zod schema shared by client and server
├── emails/
│   ├── customerConfirmation.ts   # HTML email for customer
│   └── ownerNotification.ts      # HTML email for owner
└── styles/
    └── global.css            # Tailwind @theme tokens + base styles
```

## Running Locally

**1. Install dependencies**
```bash
npm install
```

**2. Set up environment variables**
```bash
cp .env.example .env
# then fill in real values in .env
```

**3. Start the dev server**
```bash
npm run dev
# → http://localhost:4321
```

## Environment Variables

| Variable         | Description                                                      |
|------------------|------------------------------------------------------------------|
| `RESEND_API_KEY` | API key from your [Resend](https://resend.com) dashboard         |
| `TO_EMAIL`       | Owner's real inbox — server-side only, never client-exposed      |
| `FROM_EMAIL`     | Verified sender address in Resend (e.g. `orders@keribakes.com`)  |

Copy `.env.example` to `.env` and populate before running or deploying.

## Other Commands

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npx astro check  # TypeScript type-check all .astro files
```

## Project Status

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Setup & Tooling |
| Phase 1 | ✅ Complete | Core Pages (Home, About, Gallery) |
| Phase 2 | ✅ Complete | Order Form + Resend Email Integration |
| Phase 3 | 🔲 Not started | Docker + NAS Deployment |
| Phase 4 | 🔲 Not started | Polish + Launch |

See [CLAUDE.md](./CLAUDE.md) for full phase details and architectural decisions.

## Deployment

The site runs as a Docker container on a personal NAS, exposed publicly via a Cloudflare Tunnel. The tunnel maps the public hostname (`keribakes.com`) to the container on port `4321`.

Full deployment runbook is tracked in Phase 3 of [CLAUDE.md](./CLAUDE.md).
