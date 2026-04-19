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

## Project Structure

```
src/
├── layouts/
│   └── Layout.astro          # Shared shell: Google Fonts, sticky nav, footer
├── pages/
│   ├── index.astro           # Home — 3-col hero + category strip
│   ├── about.astro           # About — photo placeholder + story
│   ├── gallery.astro         # Gallery — responsive grid (real photos TBD)
│   ├── order.astro           # Order inquiry form
│   └── api/
│       └── order.ts          # POST endpoint: server validation + Resend
├── lib/
│   └── orderSchema.ts        # Zod schema shared by client and server
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

| Variable        | Description                                              |
|-----------------|----------------------------------------------------------|
| `RESEND_API_KEY` | API key from your [Resend](https://resend.com) dashboard |
| `TO_EMAIL`       | Owner's real inbox — server-side only, never client-exposed |
| `FROM_EMAIL`     | Verified sender address in Resend (e.g. `orders@keribakes.com`) |

Copy `.env.example` to `.env` and populate before running or deploying.

## Other Commands

```bash
npm run build    # Production build → dist/
npm run preview  # Preview the production build locally
npx astro check  # TypeScript type-check all .astro files
```

## Deployment

The site runs as a Docker container on a personal NAS, exposed publicly via a Cloudflare Tunnel. The tunnel maps the public hostname (`keribakes.com`) to the container on port `4321`.

Full deployment runbook is tracked in Phase 3 of [CLAUDE.md](./CLAUDE.md).
