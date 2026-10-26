<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Project overview
- Name: projet_eval (LA CAVE - Haute Champagne & Cuv�es Rares)
- Framework: Next.js 16.4.2 (App Router, React 19.3.0), TypeScript 5 (strict), Tailwind CSS v4
- Package manager: pnpm 12.11.2
- Path alias: @/* ? project root
- Styling: Tailwind v4 + CSS variables in pp/globals.css (dark palette with gold accents)

## Commands (exact)
`ash
pnpm dev        # Start dev server
pnpm build      # Production build
pnpm start      # Start production server
pnpm lint       # Run ESLint
`
No test script is defined.

## Architecture & key directories
- App Router: pp/ (routes including /champagnes, /maisons, /terroirs, /philosophie, /panier, /checkout, /account, /admin)
- Components: components/ (navigation, product, cart, etc.)
- Data/models: lib/data/ (champagnes.ts, ordersStore.ts), types in 	ypes/
- State/auth: context/CartContext.tsx, Supabase via @supabase/ssr and @supabase/supabase-js in lib/supabase/
- Layout: root layout mounts CartProvider, Navbar, CartDrawer, ProductSelectionDrawer, Footer; children have pt-[82px]
- Config: 
ext.config.ts, 	sconfig.json, eslint.config.mjs (flat, extends next/core-web-vitals + next/typescript)

## Quirks & gotchas
- Next.js 16 / React 19: check 
ode_modules/next/dist/docs/ for API differences
- Tailwind v4: @import "tailwindcss", CSS variables, @theme inline; fonts loaded in pp/layout.tsx (Cormorant Garamond, Geist, Geist Mono)
- French content/UI throughout - preserve tone/terminology
- Supabase SSR patterns in lib/supabase/ - watch server/client boundaries

## Verification
1. pnpm lint
2. pnpm build (type checking enforced by build)
