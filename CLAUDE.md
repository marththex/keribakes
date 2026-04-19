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
  / (Home)    — Hero (3-col), tagline, category strip, CTA
  /gallery    — Photo grid of past cakes (placeholder divs, real photos TBD)
  /about      — Two-column: photo placeholder + Keri's story
  /order      — Inquiry form with client + server validation, Resend emails

## Order Form Rules (ENFORCE STRICTLY)
1. Requested date must be >= 7 days from today (client + server)
2. Delivery only available in Orange County and Los Angeles County
3. Pickup: no address needed
4. Delivery: county dropdown (OC/LA only) + full address required
5. On submit: validate server-side first, then call Resend
6. Send TWO emails via Resend:
   - Customer: confirmation (24-48hr response time message)
   - Owner: full inquiry details to real inbox
7. Never expose real owner email in any client-side code or response

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
- No wedding cakes — personal/celebration cakes only
- Keep components small and single-purpose

## Tailwind CSS Notes
- Tailwind v4 does NOT use tailwind.config.ts — all theme tokens are defined
  with `@theme {}` in `src/styles/global.css`
- The `@astrojs/tailwind` integration is deprecated for v4; project uses
  `@tailwindcss/vite` added directly to `vite.plugins` in `astro.config.mjs`
- Custom color tokens (cream, blush, etc.) are available as standard Tailwind
  utilities: `bg-cream`, `text-mauve`, `border-blush`, etc.

---

## Build Status

### ✅ Phase 0 — Setup & Tooling (complete)
- Astro 6 project scaffolded with TypeScript strict mode
- Tailwind CSS v4 configured via `@tailwindcss/vite`
- Custom pastel palette and Google Fonts wired up
- `@astrojs/node` adapter set to `standalone` mode
- `.env.example` created; `.gitignore` covers `.env` and `dist/`

### ✅ Phase 1 — Core Pages (complete)
- `src/layouts/Layout.astro` — sticky nav (logo left, links right), footer
  with Instagram placeholder and copyright
- `src/pages/index.astro` — three-column hero + 4-category card strip
- `src/pages/about.astro` — two-column layout with photo placeholder and story
- `src/pages/gallery.astro` — responsive 1/2/3-col grid with pastel placeholder
  cards (name + occasion label); real photos to be swapped in later

### ✅ Phase 2 — Order Form + Email (complete)
- `src/lib/orderSchema.ts` — single Zod v4 schema imported by both client and server
- `src/pages/order.astro` — full inquiry form:
  - Name, email, phone, occasion, servings, flavor notes, design notes
  - Date picker with `min` attribute enforcing 7-day minimum (server-generated)
  - Pickup / Delivery radio toggle; delivery reveals county dropdown (OC/LA only)
    and address field
  - Client-side Zod validation with inline field errors and scroll-to-first-error
  - POSTs JSON to `/api/order`; shows success state on 200, field errors on 422
- `src/pages/api/order.ts` — POST endpoint:
  - Parses JSON body, runs full Zod server validation
  - Reads `RESEND_API_KEY`, `TO_EMAIL`, `FROM_EMAIL` from env (never client-exposed)
  - Sends customer confirmation and owner notification emails concurrently
- `src/emails/customerConfirmation.ts` — styled HTML confirmation for the customer
- `src/emails/ownerNotification.ts` — styled HTML inquiry summary for Keri

### 🔲 Phase 3 — Docker + NAS Deployment (next up)
- Write Dockerfile (multi-stage: build → node:slim runtime)
- Write docker-compose.yml for NAS deployment
- Configure Cloudflare Tunnel to forward to container port 4321
- Document deployment runbook
