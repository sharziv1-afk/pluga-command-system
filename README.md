# pluga-command-system

`pluga-command-system` is the codebase for **"המפקד"**, a Hebrew RTL command-management web application for a company-level command team.

The current work focus is **UI/design language and project documentation**. Do not expand backend logic, Supabase schema, auth callback, or route protection unless a direct UI issue requires it.

## Product Goal

"המפקד" centralizes company command workflows:

- Company-level dashboard and status overview
- Tasks and command follow-up
- Logistics requests
- Forum/updates
- Onboarding and pending approval flows
- Admin approval surfaces

The current application still includes a demo/localStorage layer through `AppContext`. Keep it in place until the architecture is intentionally migrated.

## Tech Stack

- Next.js 16.2.6 App Router
- React 19.2.4
- TypeScript
- Tailwind CSS 4
- Supabase Auth and Supabase SSR helpers
- Lucide React icons
- ESLint

Important Next.js note: this project uses **Next.js 16 `src/proxy.ts`**, not `middleware.ts`.

## Local Development

```bash
npm install
npm run dev
```

Open:

```txt
http://localhost:3000
http://localhost:3000/login
```

Useful checks:

```bash
npm run lint
npx tsc -p tsconfig.json --noEmit
npm run build
```

Do not run `npm audit fix --force`.

## Environment Variables

Create `.env.local` from `.env.example` and fill only local values:

```txt
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Never commit `.env.local` or real Supabase keys.

## Supabase Schema and Seed

Schema:

```txt
supabase/migrations/001_mvp_schema.sql
```

Seed:

```txt
supabase/migrations/seed_units_roles.sql
```

Current project state:

- The schema file exists and is kept in Git.
- The seed file exists and is kept in Git.
- The schema and seed were already run manually in Supabase.
- Do not change schema, RLS, triggers, seed, or database structure during design-only work.

## Auth Status

Supabase Magic Link auth is wired through:

- `src/app/(auth)/login/page.tsx`
- `src/app/auth/callback/route.ts`
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/proxy.ts`

Known current issue:

```txt
Supabase Auth 429 over_email_send_rate_limit
```

This is a Supabase email rate limit, not a UI bug. Magic Link end-to-end still requires testing after the rate limit expires.

Manual verification still needed:

- Magic Link callback reaches `/auth/callback`
- `public.users` profile is created
- New user redirects to `/onboarding`
- Pending user redirects to `/pending-approval`
- Approved active user reaches `/dashboard`

## Design System

Current design direction: **Light Gloss Command System**.

The UI should feel:

- Light, glossy, clean, professional
- Fast and operational
- Modern SaaS, not a dark military dashboard
- Mobile, tablet, and desktop friendly
- Hebrew RTL first

Core tokens:

- Primary text: `#020108`
- Primary action orange: `#FF6B02`
- Main background: `#F6F7F9`
- Secondary background: `#EEF1F5`
- Muted text: `#667085`
- Subtle text: `#98A2B3`
- Soft border: `rgba(2,1,8,0.10)`
- Glass card: `rgba(255,255,255,0.72)` with blur and soft shadow
- Strong glass card: `rgba(255,255,255,0.88)` with orange-tinted border

Primary background:

```css
radial-gradient(circle at top right, rgba(255,107,2,0.14), transparent 28%),
radial-gradient(circle at bottom left, rgba(2,1,8,0.06), transparent 32%),
#F6F7F9
```

Design files currently touched:

- `src/app/globals.css`
- `src/components/ui/GlassCard.tsx`
- `src/components/ui/GlossyButton.tsx`
- `src/components/ui/StatusBadge.tsx`
- `src/components/ui/EmptyState.tsx`
- `src/components/layout/AppSidebar.tsx`
- `src/components/layout/MobileHeader.tsx`
- `src/components/layout/PageHeader.tsx`
- Auth screens under `src/app/(auth)`
- Dashboard placeholder under `src/app/(protected)/dashboard/page.tsx`

## Routes

Public/auth routes:

- `/login`
- `/onboarding`
- `/select-role`
- `/pending-approval`
- `/auth/callback`

Protected routes:

- `/dashboard`
- `/tasks`
- `/requests`
- `/forum`
- `/admin`
- `/help`

Protected route checks are handled by `src/proxy.ts`.

## Next Safe Steps

1. Finish visual QA on `/login`, `/onboarding`, `/select-role`, `/pending-approval`, and `/dashboard`.
2. Re-test at mobile width `390x844`.
3. After Supabase rate limit ends, test Magic Link end-to-end once.
4. Verify `public.users` profile creation and redirects.
5. Only after auth callback is verified, continue onboarding/admin/product logic work.

## Guardrails

- Do not return to a dark theme as the primary design.
- Do not change Supabase schema or seed during UI work.
- Do not change `src/app/auth/callback/route.ts` unless auth testing proves a real bug.
- Do not rename `src/proxy.ts` to `middleware.ts`.
- Do not delete `src/lib/context/AppContext.tsx` or localStorage demo state without mapping dependencies.
- Do not create duplicate README, handoff, or summary files.
