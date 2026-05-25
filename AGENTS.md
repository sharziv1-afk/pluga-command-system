<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

## Project-Specific Guardrails

- Use Next.js 16 `src/proxy.ts`; do not create or rename to `middleware.ts`.
- Preserve Hebrew RTL across layouts, forms, navigation, and mobile views.
- Preserve the Light Gloss Command System: bright background, orange `#FF6B02` actions, glass cards, and dark `#020108` text.
- Do not run `npm audit fix --force`.
- Do not delete or rewrite `src/lib/context/AppContext.tsx` / localStorage demo state without dependency mapping.
- Do not touch Supabase schema, seed, auth callback, or proxy during design-only work unless a direct verified issue requires it.
