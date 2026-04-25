# CLAUDE.md — Keri Bakes

## Project Summary
This is the website for a personal cake baking side business.
Owner: Keri Zhong | Domain: keribakes.com

## Business Info
  Instagram: @keribakesoc
  URL: https://www.instagram.com/keribakesoc/

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
  /desserts   — Responsive photo grid; placeholder divs until real photos are added
  /about      — Two-column: photo placeholder left, Keri's story right
  /order      — Inquiry form with client + server validation, Resend emails

## Cake Offerings
Only three gallery cards / four order-form options are offered. Do not add or invent others.

Gallery cards (one per cake type):
  1. Tres Leches Cake  (shown as a single card; customers pick 6 in or 8 in on the order form)
  2. Tres Leches Cupcakes
  3. Cheesecake Cupcakes

Order form `cakeSelection` enum values (must match CAKE_OPTIONS in `orderSchema.ts`):
  1. Tres Leches Cake (6 in)  — serves 4–6
  2. Tres Leches Cake (8 in)  — serves 8–12
  3. Tres Leches Cupcakes
  4. Cheesecake Cupcakes

## Pricing
Prices are defined in `src/lib/pricing.ts` — this is the **single source of truth**.
Editing that file updates the gallery cards and the order form dropdown simultaneously.
Do not hardcode prices anywhere else in the codebase.

`PRICING` (order form dropdown, keyed by exact CAKE_OPTIONS values):
  Tres Leches Cake (6 in): From $45  (serves 4–6)
  Tres Leches Cake (8 in): From $65  (serves 8–12)
  Tres Leches Cupcakes:    From $48 / dozen
  Cheesecake Cupcakes:     From $55 / dozen

`GALLERY_CARD_PRICE` (gallery card display, shows lowest starting price per product):
  Tres Leches Cake:     From $45
  Tres Leches Cupcakes: From $48 / dozen
  Cheesecake Cupcakes:  From $55 / dozen

## Order Form Spec (ENFORCE STRICTLY)
1. Requested date must be >= 7 days from today (client + server)
2. Preferred Time is required — dropdown with 1-hour slots 10:00 AM–6:00 PM
   (defined in `TIME_SLOTS` export in `orderSchema.ts`)
3. Delivery only available in Orange County and Los Angeles County
4. Pickup: no address needed
5. Delivery: county dropdown (OC/LA only) + street address, apt/unit (optional),
   city, and ZIP code — each a separate field, all required except apt/unit
6. Cake selection is required — must be one of the three offerings above
7. Add-ons & Special Requests is OPTIONAL free-text (fruits, candles, organic
   ingredients, decorations, etc.) — never block submission if empty
8. Sweetness cannot be adjusted — this is a non-negotiable business rule;
   do not add a sweetness field or imply it can be changed anywhere on the site
9. Final price depends on add-ons selected — a note to this effect appears
   below the cake dropdown on the order form
10. How Did You Hear: dropdown (Instagram / Facebook / Word of mouth / Google Search /
    TikTok / Referred by a friend / Other); selecting "Other" reveals a text input
    (required only when Other is selected); selecting "Referred by a friend" reveals a
    friend name input (required only when that option is selected) —
    field names: `referral`, `referralOther`, `referralFriend`
11. On submit: validate server-side first, then call Resend
12. Send TWO emails via Resend:
    - Customer: confirmation (24-48hr response time message)
    - Owner: full inquiry details to real inbox
13. Never expose real owner email in any client-side code or response

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

## Gallery Behavior
- In-card left/right arrow navigation — no lightbox, photos stay within the card
- 4 photos per cake card: `main.jpg` → `detail-1.jpg` → `detail-2.jpg` → `detail-3.jpg`
- Arrows wrap around (last → first, first → last); swipe supported on mobile
- Active dot indicators: filled dot = current photo, outlined = others
- CSS filter on all images: `brightness(1.05) contrast(1.08) saturate(1.1)` for consistent tone
- Warm overlay via `::after` pseudo-element on `.img-wrapper` (rgba(255,245,235,0.08), multiply)
- To add more photos: add `detail-4.jpg` etc. and append to `allImages` in `desserts.astro`

**How the gallery is structured (`src/pages/desserts.astro` + `src/components/CakeGalleryCard.astro`):**
- Gallery page shows exactly **3 cards** — one per cake
- Each card: name, price, description below; in-card photo carousel above
- `allImages[0]` is always `main.jpg` (the starting photo); no separate `mainImage` prop
- To add more detail photos: add `detail-4.jpg` etc. to the cake folder and append the
  path to the relevant `allImages` array in `desserts.astro`

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

## Social / Link Preview (Open Graph)
Open Graph and Twitter Card meta tags are injected globally in `src/layouts/Layout.astro`.
Every page gets the same preview image; title and description follow the per-page props.

- **OG image:** `public/images/about/profile-2.jpg` — served at the absolute URL
  `https://keribakes.com/images/about/profile-2.jpg`
- `astro.config.mjs` has `site: 'https://keribakes.com'` so `Astro.site` resolves
  the absolute base at build time
- To swap the preview photo: replace `public/images/about/profile-2.jpg` with a
  new image (1200×630px minimum recommended; square 1200×1200 also works well)
- Do **not** hardcode `https://keribakes.com` in the meta tags — always derive it
  from `Astro.site` so staging/preview deployments don't leak the production URL

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

## Animations & Transitions
All animation styles live in `src/styles/animations.css` (imported by Layout.astro). All animation JS lives in a `<script>` block at the bottom of Layout.astro, bound to `astro:page-load`.

**Classes:**
- `.animate-on-load` — elements that fade+slide up on initial page load; only hidden on true first visit (gated by `.first-load` on `<html>`, set via `sessionStorage`)
- `.scroll-reveal` — elements that fade+slide up when scrolled into view (IntersectionObserver, threshold 0.12)
- `.btn-lift` — micro-interaction: lift + shadow on hover; back on active
- `.nav-ul-link` + `.nav-active` — underline slide-in on hover/active nav links
- `.gallery-card` hover — lift + shadow; arrow opacity reveals

**View Transitions:** Astro `<ViewTransitions />` is active. Root transition is suppressed (header/nav stay stable). Only `<main transition:name="page-content">` animates with `page-exit` (0.3s) / `page-enter` (0.45s) keyframes. All slideshow components bind to `astro:page-load` and cancel/reinit on each navigation.

**Reduced motion:** All motion-dependent styles are inside `@media (prefers-reduced-motion: no-preference)`. Nav underline gets `transition: none` under `prefers-reduced-motion: reduce`.

## Code Conventions
- TypeScript strict mode — no `any` types
- All form data typed and validated with Zod v4 schemas
- Zod schema lives in `src/lib/orderSchema.ts` — imported by both the page
  script (client-side) and the API endpoint (server-side) from one source of truth
- Use `process.env` (not `import.meta.env`) for server-side runtime env vars in API
  routes — `import.meta.env` bakes values at build time and will be `undefined` in Docker
- Linting: ESLint 9 flat config (`eslint.config.js`) with `eslint-plugin-astro` +
  `typescript-eslint`; run with `npm run lint`
- Tests: Vitest (`src/tests/`); run with `npm test`; covers order schema business rules
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

All phases complete. Site is live at keribakes.com.
