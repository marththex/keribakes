# CLAUDE.md — Keri Bakes

## Project Summary
This is the website for a personal cake baking side business.
Owner: Keri Zhong | Domain: keribakes.com

## Stack
- Framework: Astro 6 with TypeScript (strict mode)
- Styling: Tailwind CSS v4 (CSS-first config via `@theme` in `src/styles/global.css`)
- Email: Resend SDK for transactional email
- Hosting: Docker on personal NAS via Cloudflare Tunnel
- Domain: Managed on Cloudflare

## Design System
Based on Template 3 "Soft Minimal" — see /docs/template3-reference.html

Color palette (defined via `@theme` in `src/styles/global.css`):
  cream:    '#F5EFE8'
  blush:    '#D9C5C0'
  sand:     '#DFC5AE'
  lavender: '#C4B8C8'
  mauve:    '#A89BAE'
  charcoal: '#4A4040'

Typography:
  Display: Cormorant Garamond (Google Fonts) — all h1–h6 and decorative text
  Body/UI: Jost weight 200–400 (Google Fonts) — all body copy, labels, nav links

Typography is loaded via a `<link>` tag in `src/layouts/Layout.astro` and applied
globally through `@layer base` in `src/styles/global.css`.

## Pages
  / (Home)    — Three-column hero section + warm closing paragraph
  /gallery    — Responsive photo grid; placeholder divs until real photos are added
  /about      — Two-column: photo placeholder left, Keri's story right
  /order      — Inquiry form with client + server validation, Resend emails

## Cake Offerings
Only three cakes are offered. Do not add or invent others:
  1. Tres Leches Cake
  2. Tres Leches Cupcakes
  3. Cheesecake Cupcakes

These are the only valid values for `cakeSelection` in the Zod schema and the
order form dropdown. The gallery also reflects only these three products.

## Order Form Spec (ENFORCE STRICTLY)
1. Requested date must be >= 7 days from today (client + server)
2. Delivery only available in Orange County and Los Angeles County
3. Pickup: no address needed
4. Delivery: county dropdown (OC/LA only) + full address required
5. Cake selection is required — must be one of the three offerings above
6. Add-ons & Special Requests is OPTIONAL free-text (fruits, candles, organic
   ingredients, decorations, etc.) — never block submission if empty
7. Sweetness cannot be adjusted — this is a non-negotiable business rule;
   do not add a sweetness field or imply it can be changed anywhere on the site
8. Final price depends on add-ons selected — a note to this effect appears
   below the cake dropdown on the order form
9. On submit: validate server-side first, then call Resend
10. Send TWO emails via Resend:
    - Customer: confirmation (24-48hr response time message)
    - Owner: full inquiry details to real inbox
11. Never expose real owner email in any client-side code or response

## Content Rules
These rules are standing constraints. Do not reintroduce any of the following:

- **No wedding cakes** — personal/celebration cakes only
- **No occasion categories** — Birthday, Baby Shower, Graduation, Bespoke, etc.
  were removed; do not add them back anywhere (form fields, gallery filters, cards)
- **No flavor preferences field** — removed from order form; do not restore
- **No design vision field** — removed from order form; do not restore
- **Sweetness is not adjustable** — never add a sweetness option or field
- **Only the three listed cake options** — Tres Leches Cake, Tres Leches
  Cupcakes, Cheesecake Cupcakes; no others

## Key Copy
About page closing line: "Let's make your special occasion something deliciously
unforgettable." — do not change this without explicit instruction.

## Photos & Media
All real photos are now live. Images are stored in `public/images/` and served statically.

**Naming conventions:**
- About page: `public/images/about/profile-1.jpg` through `profile-5.jpg` (5 photos)
- Gallery: `public/images/gallery/<cake-slug>/main.jpg` + `detail-1.jpg` through `detail-3.jpg`
  - `tres-leches-cake/`
  - `tres-leches-cupcakes/`
  - `cheesecake-cupcakes/`

**How the gallery is structured (`src/pages/gallery.astro` + `src/components/CakeGalleryCard.astro`):**
- Gallery page shows exactly **3 cards** — one per cake, displaying only `main.jpg`
- Each card shows: name, price, description, and 4 dot indicators (mauve/blush) signalling more photos
- Clicking a card opens a **PhotoSwipe 5 lightbox** with all 4 photos in order:
  `main.jpg` → `detail-1.jpg` → `detail-2.jpg` → `detail-3.jpg`
- Lightbox supports swipe on mobile and keyboard navigation
- To add more detail photos: add `detail-4.jpg` etc. to the cake folder and append the
  path to the relevant `allImages` array in `gallery.astro` (also add a dot in `CakeGalleryCard.astro`)

**How the about slideshow works (`src/components/ProfileSlideshow.astro`):**
- Auto-advances every 4 seconds with a CSS opacity fade
- Dot indicators allow manual navigation
- To replace or reorder photos: swap files in `public/images/about/`, keeping filenames
  `profile-1.jpg` through `profile-5.jpg`; update the `photos` array in the component
  if filenames change

**Image tags:** Images in `public/` are rendered with plain `<img>` tags using
`loading="lazy"` and `decoding="async"`. If Astro image optimisation (webp conversion,
quality 80) is needed in future, move images to `src/assets/` and import them with
Astro's `<Image>` component from `astro:assets`.

## Git Conventions
- Always commit using the repo's local git config (already set: Marcus Chong / marcuslchong@gmail.com)
- Never mention Claude, AI, or "as requested" in commit messages
- Write all commit messages in first person, past tense, as the developer
- Example: "Update order form with add-ons field" — not "Added changes as requested by user"

## Environment Variables (never hardcode)
  RESEND_API_KEY   = from Resend dashboard
  TO_EMAIL         = real owner inbox (server-side only)
  FROM_EMAIL       = orders@[yourdomain].com

See `.env.example` for the template.

## Deployment
- Astro output mode: server (for API routes)
- Adapter: @astrojs/node
- Build: `astro build` → docker build → push to NAS
- Cloudflare Tunnel hostname maps to container port 4321

## Code Conventions
- TypeScript strict mode — no `any` types
- All form data typed and validated with Zod v4 schemas
- Zod schema lives in `src/lib/orderSchema.ts` — imported by both the page
  script (client-side) and the API endpoint (server-side) from one source of truth
- Components in src/components/
- Pages in src/pages/
- API endpoints in src/pages/api/
- Email templates (plain TS functions returning HTML strings) in src/emails/
- Keep components small and single-purpose

## Tailwind CSS Notes
- Tailwind v4 does NOT use tailwind.config.ts — all theme tokens are defined
  with `@theme {}` in `src/styles/global.css`
- The `@astrojs/tailwind` integration is deprecated for v4; project uses
  `@tailwindcss/vite` added directly to `vite.plugins` in `astro.config.mjs`
- Custom color tokens (cream, blush, etc.) are available as standard Tailwind
  utilities: `bg-cream`, `text-mauve`, `border-blush`, etc.

---

## Current State

| Phase | Status | Description |
|-------|--------|-------------|
| Phase 0 | ✅ Complete | Setup & Tooling |
| Phase 1 | ✅ Complete | Core Pages (Home, About, Gallery — all with real photos) |
| Phase 2 | ✅ Complete | Order Form + Resend Email Integration |
| Phase 3 | 🔲 Not started | Docker + NAS Deployment |
| Phase 4 | 🔲 Not started | Polish + Launch |

### ✅ Phase 0 — Setup & Tooling
- Astro 6 project with TypeScript strict mode
- Tailwind CSS v4 configured via `@tailwindcss/vite`
- Custom pastel palette and Google Fonts wired up
- `@astrojs/node` adapter set to `standalone` mode
- `.env.example` created; `.gitignore` covers `.env` and `dist/`

### ✅ Phase 1 — Core Pages
- `src/layouts/Layout.astro` — sticky nav (logo left, links right), footer
  with Instagram placeholder and copyright
- `src/pages/index.astro` — three-column hero + warm closing paragraph
- `src/components/ProfileSlideshow.astro` — auto-advancing photo slideshow (5 photos,
  4s interval, dot navigation) used on the About page
- `src/pages/about.astro` — two-column layout: ProfileSlideshow left, story right
- `src/components/CakeGalleryCard.astro` — card component with main image, dot indicators,
  and PhotoSwipe 5 lightbox (4 photos per cake: main + detail-1/2/3)
- `src/pages/gallery.astro` — 3-card grid (one per cake); clicking opens full lightbox

### ✅ Phase 2 — Order Form + Email
- `src/lib/orderSchema.ts` — single Zod v4 schema used by both client and server;
  `cakeSelection` enum enforces only the three permitted cake options
- `src/pages/order.astro` — inquiry form fields:
  - Name, email, phone (required)
  - Cake selection dropdown — Tres Leches Cake / Tres Leches Cupcakes /
    Cheesecake Cupcakes (required)
  - Add-ons & Special Requests — free-text textarea (optional)
  - Requested date — min 7 days from today, enforced client + server (required)
  - Pickup / Delivery toggle; delivery reveals county (OC/LA) + address (required)
  - How did you hear about me? (optional)
  - Pricing note below cake dropdown; sweetness note below fulfillment section
  - Client-side Zod validation with inline errors and scroll-to-first-error
  - POSTs JSON to `/api/order`; shows success state on 200, field errors on 422
- `src/pages/api/order.ts` — POST endpoint:
  - Parses JSON body, runs full Zod server-side validation
  - Reads `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL` from env (never client-exposed)
  - Sends customer confirmation and owner notification emails concurrently
- `src/emails/customerConfirmation.ts` — styled HTML confirmation for customer
- `src/emails/ownerNotification.ts` — styled HTML inquiry summary for Keri

### 🔲 Phase 3 — Docker + NAS Deployment
- Write Dockerfile (multi-stage: build → node:slim runtime)
- Write docker-compose.yml for NAS deployment
- Configure Cloudflare Tunnel to forward to container port 4321
- Document deployment runbook

### 🔲 Phase 4 — Polish + Launch
- Swap placeholder divs in gallery for real photos
- Final copy review with Keri
- Domain DNS cutover to Cloudflare Tunnel
- Smoke test on production
