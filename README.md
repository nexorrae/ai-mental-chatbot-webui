# CurhatInAI WebUI Redesign

Monorepo redesign untuk seluruh pengalaman `curhatinai.com`:
- `apps/landing-next` -> Next.js + Tailwind (SEO pages: marketing, auth, onboarding, design system)
- `apps/app-vite` -> Vite + Tailwind (core app chat/journal/mood/insights/resources/account + admin)
- `packages/design-system` -> shared CSS tokens + Tailwind preset (soft neobrutalism)
- `apps/landing-next/data/articles.json` -> source of truth article content (seeded + editable via admin)

## Information Architecture Audit
Audit rute tersedia di `docs/ia-audit.md`.

## Quick Start

```bash
npm install
npm run dev:landing
npm run dev:app
```

- Landing/Auth/Onboarding: `http://localhost:3000`
- App/Admin (Vite): `http://localhost:5174`
- Admin Articles CMS: `http://localhost:5174/admin/articles` (writes to Next API)

## Article CMS (Next + Vite)

- Next API endpoints:
  - `GET /api/articles` -> published only
  - `GET /api/articles?includeDraft=true` -> include drafts
  - `POST /api/articles` -> create article
  - `PATCH /api/articles/:slug` -> update article
  - `DELETE /api/articles/:slug` -> delete article
- Admin Vite uses `VITE_CONTENT_API_BASE` (see `apps/app-vite/.env.example`) to call Next API.
- Blog pages (`/blog` and `/blog/[slug]`) read from shared article storage and are SEO-rendered in Next.

## Scripts

```bash
npm run build
npm run lint
```

## Design Direction

- Off-white background, thick 2-3px outlines, pill buttons, high-contrast typography.
- Subtle mental-wellness elements:
  - Dismissible "Take a breath" widget
  - Grounding card (5-4-3-2-1)
  - Crisis resource link in footer/settings
- Accessibility baseline:
  - keyboard-friendly controls
  - clear focus ring
  - semantic structure and readable type sizes

## Key Routes

### Next.js (`apps/landing-next`)
`/`, `/features`, `/pricing`, `/about`, `/faq`, `/blog`, `/blog/[slug]`, `/contact`, `/design-system`, `/login`, `/register`, `/forgot-password`, `/verify-email`, `/onboarding/consent`, `/onboarding/goals`, `/onboarding/personalize`

### Vite (`apps/app-vite`)
`/app/chat`, `/app/history`, `/app/journal`, `/app/mood`, `/app/insights`, `/app/resources`, `/app/notifications`, `/app/profile`, `/app/settings`, `/app/billing`, `/admin`, `/admin/users`, `/admin/moderation`, `/admin/reports`, `/admin/settings`
