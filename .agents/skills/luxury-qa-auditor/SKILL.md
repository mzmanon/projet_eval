---
name: luxury-qa-auditor
description: >-
  Audits code quality, Next.js 16 breaking changes (async params/searchParams), TypeScript strictness,
  Next.js build health, SEO metadata, and WAI-ARIA accessibility. Use before committing changes,
  validating milestones, or finalizing the production build for Vercel.
---

# Luxury QA Auditor & Build Verifier

This skill defines the technical validation pipeline for **LA CAVE**, ensuring the application meets strict quality, stability, and performance standards.

## 1. Next.js 16 App Router Breaking Changes Compliance

- **Async `params` and `searchParams`**:
  - In Next.js 16, page and layout props for `params` and `searchParams` are Promises.
  ```tsx
  // Correct Next.js 16 pattern:
  export default async function ProductPage({
    params,
  }: {
    params: Promise<{ slug: string }>;
  }) {
    const { slug } = await params;
    // ...
  }
  ```
  - Any synchronous access (`params.slug`) triggers deprecation/type errors and must be prevented.
- **Turbopack & Tailwind v4 Integration**:
  - Verify that CSS imports follow `@import "tailwindcss";` and custom rules do not break Turbopack loaders.

## 2. Quality Pipeline Commands

The agent executes the following commands to validate code integrity:

1. **TypeScript Typecheck**:
   ```bash
   pnpm exec tsc --noEmit
   ```
2. **ESLint Code Quality**:
   ```bash
   pnpm lint
   ```
3. **Next.js Production Build Test**:
   ```bash
   pnpm build
   ```

## 3. SEO & Accessibility Checklist

- **Semantic HTML**: Proper `<header>`, `<main>`, `<nav>`, `<article>`, `<footer>` elements.
- **Single `<h1>`**: Exactly one clear `<h1>` per page.
- **Descriptive Titles & Meta**: Rich OpenGraph tags, page title format: `<Page Title> | LA CAVE — Haute Champagne`.
- **WAI-ARIA**:
  - `aria-label` on icon-only buttons (cart trigger, search, close buttons, quantity adjusters).
  - Proper roles for dialogs (`role="dialog"`, `aria-modal="true"`).

## 4. Evaluation Demonstration

To demonstrate this skill during evaluation:
- Run: `« Lance un cycle de contrôle qualité avec luxury-qa-auditor »`
- The agent runs type checks, lint checks, verifies Next.js 16 async conventions, and generates a QA scorecard.
