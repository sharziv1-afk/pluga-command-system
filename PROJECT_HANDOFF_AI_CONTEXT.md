# PROJECT_HANDOFF_AI_CONTEXT

מסמך זה מיועד ל-AI agent עתידי, מפתח או חבר צוות שממשיך לעבוד על repository בשם `pluga-command-system`.

המסמך נכתב לפי מצב הקבצים בפועל בזמן יצירתו. אם משהו לא אומת end-to-end, הוא מסומן כ-`דורש בדיקה`.

## 1. Project name and purpose

שם הפרויקט: `pluga-command-system`

מטרת הפרויקט: אפליקציית Web לניהול פיקוד ובקרה פלוגתית בעברית. המערכת מיועדת לרכז עבודה של מפקדים וסגל סביב משימות, בקשות לוגיסטיות, פורום/עדכונים, אישורי משתמשים, תהליכי onboarding ותמונת מצב ניהולית.

המשתמשים המיועדים:
- מפקד פלוגה.
- סגן מפקד פלוגה.
- מפקדי מחלקות.
- סמלים ומפקדי כיתות.
- בעלי תפקידים פלוגתיים כמו לוגיסטיקה, רפואה, קשר ורכב.

## 2. Current product goal

המטרה הנוכחית היא להגיע ל-MVP יציב שבו:
- `/login` נטען תמיד.
- Supabase Magic Link עובד end-to-end.
- לאחר callback נוצר/נמצא פרופיל ב-`public.users`.
- משתמש חדש מנותב ל-`/onboarding`.
- משתמש pending מנותב ל-`/pending-approval`.
- משתמש מאושר ו-active מנותב ל-`/dashboard`.
- routes מוגנים חסומים למשתמשים לא מחוברים.
- ממשק עברי RTL נשמר.
- העיצוב מתקדם לכיוון בהיר: לבן/תכלת, טקסט כהה, כפתורים כחולים, כרטיסים צבעוניים רכים.

אין להמשיך לפיתוח onboarding/role-selection/admin מורכב לפני שמאמתים Magic Link callback מלא.

## 3. Current tech stack

מתוך `package.json`:
- `Next.js 16.2.6`
- `React 19.2.4`
- `React DOM 19.2.4`
- `TypeScript`
- `Tailwind CSS 4`
- `@tailwindcss/postcss`
- `lucide-react`
- `@supabase/supabase-js`
- `@supabase/ssr`
- `eslint`
- `eslint-config-next`

פקודות זמינות:
- `npm run dev`
- `npm run build`
- `npm run start`
- `npm run lint`

הפרויקט משתמש ב-App Router של Next.js.

חשוב: לפי `AGENTS.md`, זה Next.js עם breaking changes. לפני שינויי Next.js יש לקרוא מדריכים רלוונטיים מתוך:

```txt
node_modules/next/dist/docs/
```

## 4. Current Git/project state

מצב Git אחרון שנבדק:
- commit אחרון: `4e7bd9e Improve login error handling`
- commit קודם: `1a42481 Connect Supabase infrastructure`
- push כבר בוצע אחרי שינוי login error handling.
- remote: `https://github.com/sharziv1-afk/pluga-command-system.git`
- branch: `main`

בזמן יצירת מסמך זה הקובץ הזה עדיין לא קומיטט, כי הוא נוצר עכשיו.

קבצים חשובים קיימים בשורש:
- `package.json`
- `package-lock.json`
- `README.md`
- `PROJECT_SUMMARY.md`
- `AGENTS.md`
- `.gitignore`
- `.env.local`
- `.env.local.txt`
- `next.config.ts`
- `tsconfig.json`
- `postcss.config.mjs`
- `eslint.config.mjs`

הערה: `README.md` עדיין נראה כמו README גנרי של create-next-app ודורש עדכון.

## 5. Current folder structure

מבנה מרכזי:

```txt
src/
  app/
    (auth)/
      login/page.tsx
      onboarding/page.tsx
      pending-approval/page.tsx
      select-role/page.tsx
    (protected)/
      layout.tsx
      admin/page.tsx
      dashboard/page.tsx
      forum/page.tsx
      help/page.tsx
      requests/page.tsx
      tasks/page.tsx
    auth/
      callback/route.ts
    globals.css
    layout.tsx
    page.tsx
    providers.tsx
  components/
  data/
  lib/
    context/
    supabase/
  proxy.ts
supabase/
  migrations/
    001_mvp_schema.sql
```

## 6. Important files and what each one does

### Root/app files

- `src/app/layout.tsx`  
  Root layout. מגדיר `html lang="he"` ו-`dir="rtl"`, טוען `globals.css`, ועוטף את האפליקציה ב-`Providers`.

- `src/app/page.tsx`  
  מפנה את root route ל-`/login` באמצעות `redirect('/login')`.

- `src/app/providers.tsx`  
  Client component שעוטף את הילדים ב-`AppProvider` מתוך `src/lib/context/AppContext.tsx`.

- `src/app/globals.css`  
  CSS גלובלי, Tailwind import, theme variables, light overrides, auth dark styles, scrollbar, glass effects, layout shell classes. קובץ רגיש מאוד כי הוא משפיע על כל האפליקציה.

- `next.config.ts`  
  כולל:
  - `turbopack.root = process.cwd()`
  - `distDir = ".next-build"`

### Auth files

- `src/app/(auth)/login/page.tsx`  
  מסך login עם Supabase Magic Link. שולח `signInWithOtp`, מציג שגיאה אמיתית ב-development, ומדפיס שגיאות ל-browser console.

- `src/app/auth/callback/route.ts`  
  Route handler שמקבל `code`, מבצע `exchangeCodeForSession`, קורא `getUser`, מחפש/יוצר פרופיל ב-`users`, מעדכן `last_login_at`, ומנתב לפי מצב פרופיל.

- `src/lib/supabase/env.ts`  
  קורא ומוודא קיום של `NEXT_PUBLIC_SUPABASE_URL` ו-`NEXT_PUBLIC_SUPABASE_ANON_KEY`.

- `src/lib/supabase/browser.ts`  
  יוצר Supabase browser client עם `createBrowserClient`.

- `src/lib/supabase/server.ts`  
  יוצר Supabase server client עם `createServerClient` ו-`cookies()` של Next.

- `src/lib/supabase/index.ts`  
  מייצא את Supabase helpers.

### Route protection

- `src/proxy.ts`  
  מנגנון ההגנה הנוכחי ל-routes מוגנים. חשוב: בפרויקט הזה משתמשים ב-Next.js 16 `proxy.ts`, לא `middleware.ts`.

### Protected layout/navigation

- `src/app/(protected)/layout.tsx`  
  Layout משותף לעמודים מוגנים. כולל `AppSidebar`, `MobileHeader`, ו-main content shell.

- `src/components/layout/AppSidebar.tsx`  
  Sidebar קבוע בצד ימין בדסקטופ, עם navigation.

- `src/components/layout/MobileHeader.tsx`  
  Header/drawer למובייל.

- `src/data/navigation.ts`  
  מגדיר קישורים ל-`/dashboard`, `/tasks`, `/requests`, `/forum`, `/admin`, `/help`.

### Demo/local state

- `src/lib/context/AppContext.tsx`  
  שכבת state ישנה/דמו שמנהלת `profiles`, `tasks`, `gaps`, `requests`, `forumSummaries`, `auditLogs`, session וסימולציית תפקידים דרך `localStorage`.

אין למחוק קובץ זה בלי להבין אילו מסכים עדיין תלויים בו.

### Supabase schema

- `supabase/migrations/001_mvp_schema.sql`  
  SQL schema ל-MVP ולמודולים עתידיים. כולל enum types, טבלאות, triggers, indexes.

## 7. Existing routes and what each route does

Routes מתוך `src/app`:

- `/`  
  מפנה ל-`/login`.

- `/login`  
  מסך הזנת דוא"ל ושליחת Supabase Magic Link.

- `/onboarding`  
  מסך onboarding. סטטוס: דורש בדיקה.

- `/pending-approval`  
  מסך המתנה לאישור. סטטוס: דורש בדיקה.

- `/select-role`  
  מסך בחירת/הדמיית תפקידים. כנראה קשור לשכבת `AppContext`/localStorage. סטטוס: דורש בדיקה.

- `/auth/callback`  
  Route handler, לא עמוד UI. משלים Supabase login callback.

- `/dashboard`  
  עמוד מוגן. Dashboard ראשי. סטטוס: דורש בדיקה אחרי auth אמיתי.

- `/tasks`  
  עמוד מוגן למשימות. סטטוס: דורש בדיקה.

- `/requests`  
  עמוד מוגן לבקשות לוגיסטיות. סטטוס: דורש בדיקה.

- `/forum`  
  עמוד מוגן לפורום/עדכונים. סטטוס: דורש בדיקה.

- `/admin`  
  עמוד מוגן לאישור משתמשים/ניהול הרשאות. סטטוס: דורש בדיקה מול Supabase.

- `/help`  
  עמוד מוגן לעזרה/מדריך. סטטוס: דורש בדיקה.

## 8. Current authentication flow

ה-flow הנוכחי:

1. המשתמש פותח `/login`.
2. המשתמש מזין דוא"ל.
3. `src/app/(auth)/login/page.tsx` קורא:

```ts
supabase.auth.signInWithOtp({
  email: email.trim(),
  options: {
    emailRedirectTo: `${window.location.origin}/auth/callback`,
    shouldCreateUser: true,
  },
})
```

4. אם Supabase מחזיר שגיאה:
   - ב-development מוצג פירוט שגיאת Supabase.
   - ב-development נרשם console error.
   - בפרודקשן מוצגת הודעה כללית.

5. לאחר לחיצה על Magic Link, Supabase אמור להפנות ל-`/auth/callback?code=...`.
6. `src/app/auth/callback/route.ts` מבצע:
   - בדיקת `code`.
   - `exchangeCodeForSession`.
   - `getUser`.
   - חיפוש פרופיל ב-`public.users` לפי `auth_user_id`.
   - יצירת פרופיל אם לא קיים.
   - עדכון `last_login_at`.
   - redirect לפי מצב המשתמש.

Redirect logic:
- `has_completed_onboarding === false` -> `/onboarding`
- `role_approval_status === 'pending'` -> `/pending-approval`
- `role_approval_status === 'approved' && status === 'active'` -> `/dashboard`
- אחרת -> `/pending-approval`

## 9. Supabase connection details

Supabase מחובר דרך:
- `@supabase/supabase-js`
- `@supabase/ssr`

Supabase helpers:
- `src/lib/supabase/browser.ts`
- `src/lib/supabase/server.ts`
- `src/lib/supabase/env.ts`

הפרויקט משתמש ב-`NEXT_PUBLIC_SUPABASE_URL` ו-`NEXT_PUBLIC_SUPABASE_ANON_KEY`.

לפי בדיקות קודמות:
- `.env.local` קיים.
- Supabase Auth endpoint ענה עם API key.
- Supabase schema קיים והטבלאות נוצרו בפרויקט Supabase.

אין להדפיס או לקמיט את ה-anon key מעבר לקובץ `.env.local` המקומי.

## 10. Required env vars

נדרשים:

```txt
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
```

קובץ מקומי:

```txt
.env.local
```

קובץ קיים אך ריק:

```txt
.env.local.txt
```

אין כרגע קובץ `.env.example`. מומלץ ליצור אחד בהמשך ללא ערכים אמיתיים.

## 11. Supabase Auth redirect settings required for local development

ב-Supabase Dashboard יש להגדיר Redirect URL ל-local:

```txt
http://localhost:3000/auth/callback
```

ייתכן שגם צריך להוסיף:

```txt
http://127.0.0.1:3000/auth/callback
```

ב-production יהיה צורך להוסיף את דומיין הפרודקשן:

```txt
https://YOUR_PRODUCTION_DOMAIN/auth/callback
```

סטטוס: דורש בדיקה ב-Supabase Dashboard.

## 12. Supabase schema/tables that exist

קובץ schema:

```txt
supabase/migrations/001_mvp_schema.sql
```

Enums:
- `role_approval_status`
- `user_status`
- `approval_status`
- `task_status`
- `request_status`

טבלאות:
- `units`
- `roles`
- `users`
- `onboarding_progress`
- `audit_logs`
- `tasks`
- `requests`
- `comments`
- `approvals`
- `forum_posts`
- `feature_flags`

כולל:
- UUID primary keys.
- `created_at` ו-`updated_at` ברוב הטבלאות.
- `set_updated_at()` trigger helper.
- indexes בסיסיים.

## 13. What tables are already created

לפי בדיקות קודמות מול Supabase Table Editor:
- הטבלאות נוצרו.
- `users`, `units`, `roles`, `onboarding_progress`, `audit_logs`, `tasks`, `requests`, `comments`, `approvals`, `forum_posts`, `feature_flags` הופיעו ב-Supabase.

סטטוס נתונים בפועל כרגע: דורש בדיקה, כי לא נבדק מחדש בזמן כתיבת מסמך זה.

## 14. What tables still need seed data

כנראה נדרש seed ל:
- `units`
- `roles`

המשתמש ביקש בעבר seed ליחידות ותפקידים בעברית. לא נמצא קובץ seed ייעודי ב-repository. יש רק migration schema.

אם `units` ו-`roles` ריקות, צריך להריץ seed בטוח עם `insert ... on conflict do nothing` או equivalent.

אין להריץ drop/recreate.

## 15. Current status of login / magic link

סטטוס נוכחי:
- `/login` נפתח.
- טופס דוא"ל קיים.
- Supabase Auth request נשלח.
- error handling שופר.
- ב-development מוצגת שגיאת Supabase אמיתית.
- Magic Link end-to-end עדיין לא אומת אחרי מגבלת rate limit.

## 16. Current known Supabase error

שגיאה ידועה נוכחית:

```txt
email rate limit exceeded | status: 429 | code: over_email_send_rate_limit
```

זו שגיאת Supabase Auth בעת שליחת אימיילים.

## 17. This is not a code bug

השגיאה:

```txt
over_email_send_rate_limit
```

אינה באג בקוד ה-login. זו מגבלת קצב של Supabase על שליחת אימיילים. צריך להמתין עד שה-rate limit יסתיים או לבדוק הגדרות/מגבלות Supabase Auth.

לא לתקן זאת על ידי rewrite של auth, callback, schema או UI.

## 18. Current callback flow and what still needs verification

קובץ:

```txt
src/app/auth/callback/route.ts
```

מה קיים:
- קורא `code` מה-query.
- מחליף code ל-session.
- מקבל Auth user.
- מחפש פרופיל ב-`users` לפי `auth_user_id`.
- יוצר פרופיל חדש אם לא קיים.
- מעדכן `last_login_at`.
- מנתב לפי מצב הפרופיל.

מה צריך לבדוק:
- Magic Link אמיתי אחרי שה-rate limit נגמר.
- ש-`exchangeCodeForSession` מצליח.
- שנוצרת רשומה ב-`public.users`.
- שהמשתמש מנותב ל-`/onboarding` בפעם הראשונה.
- שה-cookie/session נשמרים.
- ש-route מוגן נפתח אחרי login.

## 19. Current route protection mechanism

קובץ:

```txt
src/proxy.ts
```

Routes מוגנים:
- `/admin`
- `/dashboard`
- `/forum`
- `/help`
- `/requests`
- `/tasks`

אם אין Supabase user:
- redirect ל-`/login?next=<pathname>`

אם חסרים env vars:
- redirect ל-`/login?error=missing_supabase_env`

## 20. Next.js 16 proxy.ts, not middleware.ts

הפרויקט משתמש ב-Next.js 16. לפי docs של Next.js 16, `middleware.ts` נקרא עכשיו `proxy.ts`.

אין ליצור `middleware.ts` נוסף בלי סיבה חזקה. מנגנון ההגנה הנוכחי נמצא ב:

```txt
src/proxy.ts
```

## 21. Current design direction

הכיוון הרצוי של המשתמש:
- עיצוב בהיר.
- לבן / תכלת / light blue.
- טקסט כהה.
- כפתורים כחולים.
- כרטיסיות glass.
- כרטיסים צבעוניים רכים.
- עברית RTL.
- sidebar ימני.

## 22. Light design target

יעד עיצוב להמשך:
- רקע בהיר ונקי.
- cards לבנים/שקופים.
- טקסט שחור/כהה.
- primary buttons כחולים.
- states צבעוניים ועדינים.
- RTL לא נשבר.

## 23. Screens still dark and needing later alignment

מסך `/login` עדיין כהה בעיצוב `auth-navy-shell`, לפי דרישה קודמת למסך login עם dark navy gradient.

חלק מהקוד עדיין משתמש במחלקות dark כמו:
- `bg-[#030712]`
- `bg-slate-950`
- `text-slate-100`

יש overrides ב-`globals.css` שמבהירים חלק מהמחלקות הגלובליות, אבל זה דורש בדיקה ויזואלית. לא לבצע שינוי עיצובי רחב בלי QA.

## 24. Known issue: old AppContext/localStorage demo layer

יש שכבת demo/localStorage ישנה לצד Supabase.

זה סיכון ארכיטקטוני מרכזי כי:
- Supabase Auth מנהל session אמיתי.
- `AppContext` עדיין עושה auto-login ל-MP דמו דרך `localStorage`.
- חלק מהמסכים כנראה צורכים נתונים מה-context ולא מה-DB.

## 25. Where the localStorage/demo layer lives

קובץ:

```txt
src/lib/context/AppContext.tsx
```

מפתחות localStorage שנמצאו:
- `pluga_profiles`
- `pluga_tasks`
- `pluga_gaps`
- `pluga_requests`
- `pluga_forum_summaries`
- `pluga_audit_logs`
- `pluga_session`
- `pluga_sim_role`
- `pluga_sim_frame`

יש גם רכיבים שמפעילים localStorage, למשל:
- `src/components/admin/AdminTab.tsx`
- `src/components/auth/PendingView.tsx`
- `src/components/dictionary/DictionaryTab.tsx`
- `src/components/tracking/TrackingTab.tsx`

## 26. What should not be removed blindly

לא למחוק בלי בדיקה:
- `src/lib/context/AppContext.tsx`
- `src/app/providers.tsx`
- רכיבי tabs תחת `src/components`
- `src/components/auth/*`
- `src/components/admin/AdminTab.tsx`
- localStorage keys קיימים

סיבה: חלק מהעמודים עדיין עלולים להישען עליהם. מחיקה עלולה לשבור dashboard/tasks/admin/forum.

## 27. What has already been tested successfully

בדיקות שבוצעו בעבר בהקשר העבודה:
- `npm install` עבר.
- `npm run build` עבר.
- `npm run lint` עבר.
- TypeScript check עבר עם `npx tsc -p tsconfig.json --noEmit`.
- `/login` נפתח.
- `/` מפנה ל-`/login`.
- protected routes מפנים ל-login כשאין session אחרי הוספת `src/proxy.ts`.
- Supabase Auth endpoint ענה עם anon key.
- Login error handling מציג שגיאה אמיתית ב-development.
- Git push בוצע אחרי login error handling.

## 28. What still needs end-to-end testing

חובה לבדוק:
- שליחת Magic Link אחרי תום rate limit.
- קבלת email בפועל.
- לחיצה על Magic Link.
- `/auth/callback` מקבל code.
- נוצרת session.
- נוצרת רשומה ב-`public.users`.
- redirect ל-`/onboarding`.
- לאחר השלמת onboarding, redirect ל-`/pending-approval`.
- לאחר אישור משתמש, redirect ל-`/dashboard`.
- גישה ל-`/dashboard` אחרי auth.
- רענון דף מוגן אחרי auth.
- logout flow - דורש בדיקה/יישום.

## 29. What has already been fixed

תוקן:
- חיבור Supabase client/server helpers.
- יצירת `src/app/auth/callback/route.ts`.
- יצירת migration SQL.
- שיפור error handling במסך login.
- הצגת שגיאת Supabase אמיתית ב-development.
- הוספת `src/proxy.ts` להגנת routes.
- תיקון layout desktop סביב sidebar ימני ו-RTL.
- יצירת `PROJECT_SUMMARY.md`.

## 30. Known bugs and open risks

פתוח/דורש בדיקה:
- Supabase email rate limit: `429 over_email_send_rate_limit`.
- Magic Link end-to-end עדיין לא אומת.
- `public.users` profile creation עדיין לא אומת אחרי Magic Link אמיתי.
- redirect ל-`/onboarding` עדיין לא אומת end-to-end.
- `AppContext` localStorage auto-login עלול להתנגש עם Supabase auth.
- admin approval UI כנראה לא מחובר במלואו ל-Supabase.
- `units` ו-`roles` אולי ריקות ודורשות seed.
- RLS policies לא נבדקו.
- README גנרי ולא משקף את הפרויקט.
- חלק מהעיצוב עדיין כהה או נשען על overrides גלובליים.
- עברית ב-terminal מוצגת לפעמים כ-mojibake; בדפדפן צריך לוודא UTF-8 תקין.

## 31. Exact next steps in order

1. להריץ את האפליקציה:

```bash
npm run dev
```

2. לפתוח:

```txt
http://localhost:3000/login
```

3. לחכות עד ש-Supabase email rate limit יפוג.

4. לנסות Magic Link עם דוא"ל אמיתי.

5. לפתוח browser console ולוודא שאין שגיאה חדשה מעבר ל-rate limit.

6. ללחוץ על Magic Link מהאימייל.

7. לוודא שהדפדפן מגיע ל:

```txt
/auth/callback
```

8. לבדוק ב-Supabase Table Editor האם נוצרה רשומה ב:

```txt
public.users
```

9. לוודא redirect ראשון ל:

```txt
/onboarding
```

10. רק אחרי זה להמשיך ל-onboarding/admin/role approval.

## 32. What not to do

אסור/לא מומלץ:
- לא להריץ `npm audit fix --force`.
- לא למחוק או ליצור מחדש טבלאות Supabase.
- לא להריץ `drop table`.
- לא לשכתב את כל auth system.
- לא למחוק את `AppContext`/localStorage בלי מיפוי תלות.
- לא לשנות schema בשביל לתקן rate limit.
- לא לשנות callback לפני בדיקת Magic Link אמיתי.
- לא להמשיך ל-admin/onboarding מורכב לפני אימות callback.
- לא לשבור Hebrew RTL.
- לא לחזור לעיצוב כהה בכל האפליקציה.
- לא לקמיט `.env.local`.

## 33. How to run the app locally

אם dependencies קיימות:

```bash
npm run dev
```

אם צריך התקנה:

```bash
npm install
npm run dev
```

כתובת:

```txt
http://localhost:3000
```

או ישירות:

```txt
http://localhost:3000/login
```

## 34. How to build the app

```bash
npm run build
```

ה-build משתמש ב-Next.js 16/Turbopack ו-output directory:

```txt
.next-build
```

## 35. How to test login

1. להריץ:

```bash
npm run dev
```

2. לפתוח:

```txt
http://localhost:3000/login
```

3. לפתוח DevTools Console.
4. להזין דוא"ל אמיתי.
5. ללחוץ על כפתור שליחת קישור.
6. אם יש שגיאה, לבדוק:
   - UI message.
   - Console log שמתחיל ב-`Supabase signInWithOtp failed:`.

אם מופיע:

```txt
email rate limit exceeded | status: 429 | code: over_email_send_rate_limit
```

להמתין ולא לשנות קוד auth.

## 36. How to test Supabase callback

רק אחרי שנשלח Magic Link בהצלחה:

1. ללחוץ על הקישור באימייל.
2. לוודא שהקישור מגיע ל:

```txt
http://localhost:3000/auth/callback?code=...
```

3. לוודא שאין redirect ל:

```txt
/login?error=auth_exchange_failed
/login?error=user_not_found
/login?error=profile_lookup_failed
/login?error=profile_create_failed
/login?error=profile_update_failed
```

4. לבדוק לאן המשתמש נותב:
   - `/onboarding`
   - `/pending-approval`
   - `/dashboard`

## 37. How to check if public.users receives a new row

ב-Supabase Dashboard:

1. לפתוח את הפרויקט.
2. ללכת ל-Table Editor.
3. לבחור schema:

```txt
public
```

4. לפתוח:

```txt
users
```

5. לבדוק שנוצר row עם:
   - `auth_user_id`
   - `email`
   - `name`
   - `role = pending`
   - `permission_level = 0`
   - `has_completed_onboarding = false`
   - `role_approval_status = pending`
   - `status = pending`
   - `last_login_at`

אם לא נוצר row, לבדוק query params ב-login אחרי callback ולבדוק console/server logs.

## 38. How to continue after the rate limit expires

1. לא לשנות קוד.
2. לחכות לתום rate limit של Supabase.
3. לנסות דוא"ל אמיתי פעם אחת.
4. אם השגיאה נעלמת והאימייל מגיע, להמשיך ל-callback verification.
5. אם מופיעה שגיאה אחרת, לתעד בדיוק:
   - `message`
   - `status`
   - `code`
   - console output
   - network request

## 39. Prompt for future AI agents to continue safely

אפשר להשתמש בפרומפט הבא:

```txt
Read PROJECT_HANDOFF_AI_CONTEXT.md first.
Do not change schema, UI, or auth architecture yet.
Start by running npm run dev and opening /login.
The last known Supabase Auth issue is email rate limit exceeded, status 429, code over_email_send_rate_limit.
Wait/verify after the rate limit expires.
Test Magic Link end-to-end.
Confirm /auth/callback creates a row in public.users and redirects to /onboarding.
Only after callback is verified, continue onboarding/admin approval work.
Keep Hebrew RTL and keep moving toward the light design direction.
Do not delete AppContext/localStorage blindly.
```

## 40. Bug report template for future fixes

```md
## Bug title

### Expected behavior

### Actual behavior

### Steps to reproduce
1.
2.
3.

### Environment
- Route:
- Browser:
- Local/Production:
- Supabase project:

### Console error
```txt

```

### Network error
```txt

```

### Server terminal error
```txt

```

### Related files
- 

### Suspected cause

### Fix applied

### Tests run
- [ ] npm run lint
- [ ] npx tsc -p tsconfig.json --noEmit
- [ ] npm run build
- [ ] Browser tested
- [ ] Supabase verified

### Remaining risk
```

## Current Safe Next Action

הפעולה הבטוחה הבאה היא:

```bash
npm run dev
```

לאחר מכן לפתוח:

```txt
http://localhost:3000/login
```

אם עדיין מופיעה שגיאת:

```txt
email rate limit exceeded | status: 429 | code: over_email_send_rate_limit
```

אין לשנות קוד. להמתין לסיום מגבלת Supabase ואז לבדוק Magic Link end-to-end.
