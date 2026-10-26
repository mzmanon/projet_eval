# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: French champagne enthusiasts, collectors and gift buyers browsing a curated prestige-champagne boutique in French, on desktop and mobile.

Secondary: the evaluator of this project, who judges the interface, responsive behavior, accessibility, code quality and the documented craft of the build.

## Product Purpose

LA CAVE is a French haute-champagne boutique experience: a curated catalog of prestige cuvées, editorial pages on maisons and terroirs, a cart and a simulated checkout, a customer account area and an admin dashboard.

It is an evaluation deliverable and showcase, not a live shop. Success means the whole journey reads as an authentic, restrained French luxury house, works across the documented viewports, and demonstrates production-grade Next.js 16 craft. Fictional transactions are acceptable; real revenue is not a goal.

## Positioning

A confidential, cellar-narrated selection: each bottle is presented through house, vintage, dosage, terroir, cépage, élevage and tasting notes, framed by an Épernay cellar-preservation story rather than by discounts or mass-market merchandising.

In this showcase context the cellar/allocation narrative is fictional brand copy, not an operating business claim.

## Operating Context

- The catalog is browsed as a gallery; bottle authenticity and oenological detail are part of the appeal.
- Buyers compare cuvées by house, vintage, dosage, score and price (EUR), then choose format and quantity in a selection drawer.
- Cart, checkout, account and admin are demonstration flows: orders are stored in `localStorage`, checkout simulates submission, and the admin area uses a demo PIN gate with hardcoded KPIs.
- The project is graded against its own binding skills: luxury art direction, product authenticity, responsive behaviour, Supabase RLS, and Next.js 16 QA.
- The interface is French-only, priced in EUR, with France/Europe shipping copy.

## Capabilities and Constraints

- Next.js 16.4.2 App Router, React 19.3, TypeScript, Tailwind CSS v4 with Turbopack, `lucide-react`.
- Routes: `/` (home), `/champagnes`, `/champagnes/[slug]`, `/panier`, `/checkout`, `/account`, `/admin`, `/maisons`, `/philosophie`, `/terroirs`.
- Catalog data is a static typed dataset in `lib/data/champagnes.ts`; cart state lives in `context/CartContext.tsx`; orders use `lib/data/ordersStore.ts` over `localStorage`.
- Supabase dependencies and a full RLS schema exist (`supabase/migrations/20261023_init_la_cave_schema.sql`) but are not yet wired into auth, catalog or orders.
- Checkout has no payment provider and must not be presented as taking real payment; there is no real inventory, fulfilment or shipping integration.
- French-language UI, EUR pricing, free-shipping threshold at 250 €.
- Confirmed open decisions: whether Supabase replaces the localStorage demo layer; whether auth becomes real; whether admin gating becomes genuine. None are required for the showcase.

## Brand Commitments

- Name: **LA CAVE** — Haute Champagne & Cuvées Rares. Voice: dignified, poetic, precise French; no hype, no discount language.
- The five project skills in `.agents/skills/` are binding for future work:
  - `luxury-art-direction`: serif + sans editorial pairing (Cormorant Garamond, Geist), generous negative space, "less is more", no neon, no candy gradients, no pill-button clutter. Its original deep-black / ivory / champagne-gold palette was superseded by an explicit owner brief (2026-10-26): the site must read 60 % white, 30 % champagne green, 10 % champagne yellow with black text. That 60/30/10 light palette is now the system of record (see `DESIGN.md`); the skill's layout, typography and restraint rules still bind.
  - `product-authenticity-guard`: real bottle imagery must never be recolored, distorted or fabricated; `object-contain` / vertical aspect ratios; no invented cuvées or fake prestige labels.
  - `responsive-luxury-ux`: validate 390 / 768 / 1440 px, 44 px touch targets, body-scroll lock on drawers.
  - `supabase-rls-security` and `luxury-qa-auditor`: RLS and Next.js 16 correctness when those layers are touched.

## Evidence on Hand

- Curated sample catalog: real house and cuvée names with plausible technical metadata and scores, in `lib/data/champagnes.ts`.
- Editorial content on houses and terroirs (`app/maisons/page.tsx`, `app/terroirs/page.tsx`) and a house manifesto (`app/philosophie/page.tsx`).
- Bottle imagery is third-party placeholder photography (Wikimedia Commons, Unsplash), not owned product packshots.
- One sample order (`LC-2026-849201`) and hardcoded admin KPIs are demonstration data.

Absences future work must not fabricate: real customers, testimonials, press coverage, awards, allocations, cellar locations, stock availability, delivery performance, or completed sales figures. Any new proof point must be supplied by the project owner and labelled as sample data if fictional.

## Product Principles

1. **Authenticity over decoration.** Bottles, houses and oenological facts are shown as they are; imagery is never restyled to fit the palette.
2. **Restraint signals value.** Space, hairlines, typography and slow transitions do the persuading; no urgency tactics or loud commerce patterns.
3. **Editorial depth is the product.** Terroir, maison and tasting knowledge make the catalog worth reading, not just a grid of prices.
4. **Demo honesty.** Never let a showcase flow imply real payment, real stock or real allocation; sample data stays visibly demonstrable.
5. **Craft is verifiable.** Every change holds up on the documented viewports, with accessible targets and semantics, and on the Next.js 16 build.

## Accessibility & Inclusion

Project skills require 44 × 44 px minimum interactive targets, visible focus and hover states, descriptive `aria-label` on icon-only controls, `role="dialog"` / `aria-modal="true"` for drawers, a single `<h1>` per page, and legible contrast for body copy on the dark palette.
