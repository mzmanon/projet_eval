---
name: luxury-art-direction
description: >-
  Enforces the high-end French luxury aesthetic, editorial typography, minimalist layouts,
  refined color palettes (deep black, ivory, champagne gold), and "less is more" philosophy
  for LA CAVE e-commerce platform. Use whenever designing, evaluating, or refactoring UI components.
---

# Luxury Art Direction & French Haute Maison Guidelines

This skill defines and enforces the visual identity, typography, spacing, and micro-interactions for **LA CAVE**, ensuring the experience mirrors an authentic, prestigious French champagne house.

## 1. Core Principles: "Less is More" & Haute Joaillerie du Vin

- **Quiet Luxury & Restraint**: Never crowd the screen. Generous negative space (whitespace / noir d'espace) conveys prestige, confidence, and distinction.
- **Editorial Typography**:
  - **Headings & Prestige Quotes**: Serif font with high contrast and elegance (*Cormorant Garamond* or *Playfair*).
  - **Body & Technical Specs**: Clean, legibly spaced neutral sans-serif (*Geist* or *Inter*).
  - **Trackings & Casings**: Uppercase category tags, subtle letter spacing (`tracking-[0.2em]` or `tracking-[0.25em]`), light font weights (`font-light`, `font-normal`).
- **Color Palette**:
  - `Noir Profond`: `#0B0B0B` / `#0E0E0E` (Interface background, depth, and contrast).
  - `Fond Sombre Secondaire`: `#141414` / `#1A1A1A` (Cards, elevated panels).
  - `Ivoire / Blanc Cassé`: `#FDFBF7` / `#F5F2EB` (Text contrast, editorial blocks).
  - `Or Champagne Discret`: `#C5A059` / `#D4AF37` / `#B38E46` (Accents, active states, delicate hairline borders, badges). Never flashy, never saturated yellow.
  - `Bordures Délicates`: `rgba(197, 160, 89, 0.15)` or `rgba(255, 255, 255, 0.08)` (1px hairline borders).
- **Absolute Bans**:
  - No candy-colored gradients or neon glows.
  - No oversized "Buy Now" neon buttons.
  - No cartoonish or hyper-rounded corners (`rounded-3xl` or pill buttons on everything). Favor refined subtle radiuses (`rounded-none`, `rounded-xs`, `rounded-sm`).
  - No aggressive marketing badge tickers (e.g. "MEGA DEAL -50%"). Favor "Cuvée Rare", "Millésime Remarquable", "Édition Limitée".

## 2. Layout & Spacing Rules

- **Generous Gutters & Margins**: Use `py-20`, `py-28`, `py-36` on major sections.
- **Hairline Dividers**: Fine, low-opacity borders (`border-t border-neutral-800` or `border-[#C5A059]/20`).
- **Micro-Interactions**:
  - Smooth transitions (`duration-500 ease-out`).
  - Subtle image zoom on hover (`scale-[1.02] transition-transform duration-700`).
  - Discrete line underlines extending on hover for links.

## 3. Review Checklist for the Agent

When writing or reviewing any component:
1. Is the typography hierarchy clear and balanced between serif and sans-serif?
2. Are the margins breathing and spacious?
3. Does the color scheme strictly stay within the Noir / Ivoire / Or Champagne boundaries?
4. Is the tone of voice dignified, poetic, and professional?

## 4. Evaluation Demonstration

To demonstrate this skill during evaluation:
- Run: `« Vérifie la conformité de la page d'accueil avec luxury-art-direction »`
- The agent audits every section against contrast ratios, font pairings, whitespace, and luxury tone.
