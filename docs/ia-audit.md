# CurhatinAI Information Architecture Audit

Date: 2026-02-15
Scope: `ai-mental-chatbot-webui` redesign (Next.js marketing/auth/onboarding + Vite core app/admin)

## Audit Method
- Reviewed existing frontend routes/components in repo (`src/App.tsx`, `src/pages/ChatPage.tsx`).
- Mapped user-requested product flows (marketing, auth, onboarding, core app, account, admin).
- Created target sitemap for full redesign with consistent design system and responsive behavior.

## Existing Routes Found (Before Redesign)
- `/` (landing in single-page view)
- `/chat` (chat page via local state toggle, not URL router)

## Target IA (After Redesign)

### A. Public + SEO (Next.js)
- `/` Home
- `/features` Features
- `/pricing` Pricing
- `/about` About
- `/faq` FAQ
- `/blog` Blog/Articles index
- `/blog/ketika-overthinking-muncul` Example article template
- `/contact` Contact
- `/design-system` Design System + Component Library showcase

### B. Auth (Next.js)
- `/login`
- `/register`
- `/forgot-password`
- `/verify-email`

### C. Onboarding (Next.js)
- `/onboarding/consent`
- `/onboarding/goals`
- `/onboarding/personalize`

### D. Core App (Vite)
- `/app/chat`
- `/app/history`
- `/app/journal`
- `/app/mood`
- `/app/insights`
- `/app/resources`
- `/app/notifications`

### E. Account (Vite)
- `/app/profile`
- `/app/settings`
- `/app/billing`

### F. Admin (Vite)
- `/admin`
- `/admin/users`
- `/admin/moderation`
- `/admin/reports`
- `/admin/settings`

## Cross-Cutting UX Rules
- Soft neobrutalism tokens shared across apps.
- Mental wellness micro-elements in key surfaces:
  - Dismissible "Take a breath" widget.
  - Grounding 5-4-3-2-1 card in empty/intense states.
  - Crisis support link in footer and settings.
- Accessibility baseline:
  - Visible focus ring, keyboard reachable controls, semantic landmarks, high contrast.
  - Clear heading hierarchy and readable body size.

## Notes
- Live crawl of `curhatinai.com` is not performed in this repository-only audit.
- Target IA covers all required flows and can be mapped to real sitemap if additional routes exist in production.
