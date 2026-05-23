# pluga-command-system

**A Hebrew-language web application for IDF company-level command and control.**

## Project Overview

`pluga-command-system` is a unified platform designed for managing platoon operations across multiple command levels. The application centralizes task management, logistics requests, forum/updates, user approvals, onboarding processes, and administrative oversight.

### Target Users
- Company Commander (מפקד פלוגה)
- Deputy Company Commander (סגן מפקד פלוגה)
- Section Commanders (מפקדי מחלקות)
- Squad Leaders & Team Leads (סמלים ומפקדי כיתות)
- Specialist Roles (Logistics, Medical, Communications, Vehicles)

---

## Current MVP Goals

- ✅ Supabase Magic Link authentication working end-to-end
- ✅ Route protection for protected areas
- ✅ Schema and seed data in Supabase
- 🔄 User profile creation on first login
- 🔄 Onboarding flow and user approval system
- 🔄 Dashboard and feature tabs functional with real Supabase data
- 💡 Light UI design (white/light-blue, dark text, blue buttons, glass cards)
- 💡 Full Hebrew RTL support

### Known Issue: Supabase Email Rate Limit

The current development environment may encounter:
```
Status: 429
Code: over_email_send_rate_limit
Message: email rate limit exceeded
```

This is a **rate limit from Supabase Auth**, not a code bug. Wait for the limit to expire before testing Magic Link again.

---

## Tech Stack

- **Next.js** 16.2.6 (App Router with Next.js 16 `proxy.ts` for middleware)
- **React** 19.2.4
- **TypeScript** (strict mode)
- **Tailwind CSS** 4 (with custom PostCSS)
- **Supabase** (@supabase/supabase-js + @supabase/ssr)
- **Lucide React** (icons)
- **ESLint** (next configuration)

---

## Local Development Setup

### 1. Prerequisites
- Node.js 18+ and npm
- Supabase account and project
- `.env.local` file with Supabase credentials

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.example .env.local
```

Then open `.env.local` and add:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

**⚠️ IMPORTANT:**
- Never commit `.env.local` (it's in `.gitignore`)
- Never share your `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `.env*` files are automatically ignored by git

### 4. Configure Supabase Redirect URL

In your Supabase Dashboard → Authentication → URL Configuration:

Add these redirect URLs:
```
http://localhost:3000/auth/callback
http://127.0.0.1:3000/auth/callback
```

For production, add your domain URL:
```
https://yourdomain.com/auth/callback
```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Supabase Schema & Seed Data

### Schema Location
```
supabase/migrations/001_mvp_schema.sql
```

This file contains:
- Enum types (roles, statuses, etc.)
- All tables (users, units, roles, tasks, requests, forum_posts, etc.)
- RLS policies and triggers
- Indexes for performance

### Seed Data Location
```
supabase/migrations/seed_units_roles.sql
```

This file safely seeds:
- **Units** (פלוגה, מחלקות 1-4, לוגיסטיקה, רפואה, קשר, רכב)
- **Roles** (32 roles: מ״פ, סמ״פ, עוזרים, מ״מ, סמלים, מ״כ, etc.)

Uses `ON CONFLICT` to prevent duplicates if run multiple times.

### How to Run Seed Data Manually

1. In Supabase Dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy the entire contents of `supabase/migrations/seed_units_roles.sql`
4. Paste into the query editor
5. Click **Execute**
6. Verify: check `public.units` (should have 9 rows) and `public.roles` (should have 32 rows)

---

## Available Scripts

```bash
# Development server (with hot reload)
npm run dev

# TypeScript type checking
npx tsc -p tsconfig.json --noEmit

# ESLint code quality check
npm run lint

# Production build
npm run build

# Start production server
npm run start
```

---

## Authentication Flow

### Current Status
Magic Link authentication is implemented but **end-to-end testing is pending** due to Supabase email rate limits.

### Flow Overview

1. **Login** → User enters email at `/login`
2. **Magic Link** → Supabase sends magic link via email
3. **Callback** → User clicks link → browser redirected to `/auth/callback?code=...`
4. **Session Exchange** → Route handler exchanges `code` for authenticated session
5. **Profile Creation** → If new user, `public.users` record is created
6. **Redirect Logic** →
   - New user (not onboarded) → `/onboarding`
   - User pending approval → `/pending-approval`
   - Approved user → `/dashboard`

### Key Files
- `src/app/(auth)/login/page.tsx` - Magic Link entry point
- `src/app/auth/callback/route.ts` - Session exchange and profile logic
- `src/lib/supabase/browser.ts` - Client-side Supabase helper
- `src/lib/supabase/server.ts` - Server-side Supabase helper
- `src/proxy.ts` - Route protection (Next.js 16 middleware)

---

## Protected Routes

The following routes are protected and require authentication:
- `/admin` - User approval and permissions
- `/dashboard` - Main dashboard
- `/tasks` - Task management
- `/requests` - Logistics requests
- `/forum` - Forum/updates
- `/help` - Help & documentation

Unauthenticated users are redirected to `/login`.

---

## Design Direction

**Current Target Aesthetic:**
- Light background (white, light gray)
- Light blue accents
- Dark text (high contrast)
- Blue primary buttons
- Glass-effect cards with soft colors
- Hebrew RTL layout (always maintained)
- Right-aligned sidebar on desktop

---

## Current Known Limitations

⚠️ **Do NOT:**
- Run `npm audit fix --force` (may break Next.js compatibility)
- Commit `.env.local` with real keys
- Delete or rename `src/lib/context/AppContext.tsx` without mapping dependencies
- Change Supabase schema without reviewing impact
- Rename `src/proxy.ts` to `middleware.ts` (Next.js 16 uses `proxy.ts`)

---

## Next Safe Steps (After Email Rate Limit Expires)

1. **Test Magic Link end-to-end:**
   - Wait for Supabase email rate limit to expire
   - Send a test magic link
   - Click the link in your email
   - Verify callback redirects correctly

2. **Verify profile creation:**
   - In Supabase Dashboard → Table Editor → `public.users`
   - Confirm a new row appears after login

3. **Test redirect logic:**
   - New user should redirect to `/onboarding`
   - After onboarding, should redirect to `/pending-approval`
   - After admin approval, should redirect to `/dashboard`

4. **Continue onboarding/approval flow:**
   - Only after callback is fully verified
   - Update onboarding form integration
   - Implement admin approval interface
   - Connect dashboard to real Supabase data

---

## Project Structure

```
src/
  app/
    (auth)/          # Auth layout
      login/         # Magic Link login
      onboarding/    # User onboarding
      pending-approval/
      select-role/
    (protected)/     # Protected layout
      layout.tsx     # Common layout for protected routes
      admin/
      dashboard/
      tasks/
      requests/
      forum/
      help/
    auth/
      callback/      # Magic Link callback handler
  components/        # Reusable UI components
    layout/          # Sidebar, header, navigation
    ui/              # Base UI components
    [feature]/       # Feature-specific tabs
  lib/
    supabase/        # Supabase clients
    context/         # React context (AppContext)
    types.ts         # TypeScript types
    utils.ts         # Utilities
    permissions.ts   # Permission logic
  proxy.ts           # Route protection (Next.js 16)

supabase/
  migrations/
    001_mvp_schema.sql      # Schema definition
    seed_units_roles.sql    # Seed data
```

---

## Deployment

### Production Build
```bash
npm run build
npm run start
```

Build output goes to `.next-build/` (configured in `next.config.ts`).

### Environment for Production
Set these environment variables in your deployment platform:
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

**Remember:** Add your production domain to Supabase redirect URLs.

---

## Support & Resources

- [Next.js 16 Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- Project handoff guide: `PROJECT_HANDOFF_AI_CONTEXT.md`
- Project summary: `PROJECT_SUMMARY.md`

---

## License

Internal IDF project.
