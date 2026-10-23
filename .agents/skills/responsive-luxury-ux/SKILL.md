---
name: responsive-luxury-ux
description: >-
  Audits, validates, and refines the responsive layout, mobile ergonomics, touch targets,
  and smooth transitions across mobile (390px), tablet (768px), and desktop (1440px) viewports
  for luxury e-commerce. Use whenever building or testing navigation, sheets, grids, or checkout flows.
---

# Responsive Luxury UX & Multi-Device Ergonomics

This skill ensures that **LA CAVE** delivers a seamless, prestigious user experience across smartphones, tablets, and wide desktop screens.

## 1. Principles of Mobile Luxury

- **Restraint on Small Screens**:
  - Do not cram multiple dense columns onto mobile viewports. Use 1 column on mobile (`grid-cols-1`), 2 on tablet (`md:grid-cols-2`), 3 or 4 on desktop (`lg:grid-cols-3 xl:grid-cols-4`).
  - Maintain comfortable padding (`px-5 sm:px-8 lg:px-16 xl:px-24`).
- **Touch Targets & Tactile Elegance**:
  - Minimum interactive touch area: 44px x 44px for accessibility and ease of use.
  - Buttons must provide subtle active/press states (`active:scale-[0.99] transition-transform`).
- **Fluid Typography**:
  - Use responsive text sizing (`text-3xl sm:text-5xl lg:text-6xl font-serif`).
  - Ensure body text remains effortlessly legible with adequate line height (`leading-relaxed` or `leading-loose`).
- **Mobile Navigation**:
  - Fullscreen or side-drawer curtain menu with refined typography and smooth slide/fade entrance.
  - Fixed or sticky top bar with backdrop blur (`backdrop-blur-md bg-[#0B0B0B]/85 border-b border-neutral-800/60`).
  - Cart drawer (Slide-over) optimized for thumb reach on mobile with quick quantity toggles.

## 2. Multi-Viewport Testing Matrix

| Viewport | Device Target | Key Verification Focus |
| :--- | :--- | :--- |
| **390 x 844 px** | iPhone 14/15/16 | Drawer navigation, thumb reach for Cart CTA, legible bottle details |
| **768 x 1024 px** | iPad / Tablet | 2-column catalog grid, balanced hero typography, filter toggle |
| **1440 x 900 px** | Desktop / Retina | Spacious editorial layout, generous negative space, refined hover states |

## 3. Review Checklist for the Agent

1. Check for horizontal overflow (`overflow-x-hidden` on main container).
2. Validate that modal dialogues, slide-overs, and popovers lock body scrolling when open.
3. Test that image aspect ratios maintain bottle verticality without clipping on narrow screens.
4. Verify accessibility contrast ratios on all devices.

## 4. Evaluation Demonstration

To demonstrate this skill during evaluation:
- Run: `« Valide avec responsive-luxury-ux la réactivité de la navigation et du panier »`
- The agent tests the components across standard viewports and produces an inspection audit.
