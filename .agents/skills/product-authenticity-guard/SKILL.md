---
name: product-authenticity-guard
description: >-
  Strictly guards and enforces authentic representation of champagne bottles, labels, capsules,
  and oenological data. Prohibits CSS recoloring, distortion, or artificial hallucination of branded bottles.
  Use whenever adding, modifying, or rendering product media, catalog cards, or product detail pages.
---

# Product Authenticity Guard

This skill guarantees that every champagne bottle displayed on **LA CAVE** preserves 100% of its authentic visual and technical identity.

## 1. Absolute Directives

- **Zero Color Alteration**:
  - NEVER apply CSS image filters that alter hue, saturation, or contrast on bottles:
    - Forbidden: `filter: hue-rotate(...)`, `filter: saturate(...)`, `filter: invert(...)`, `mix-blend-mode: color`, or arbitrary tints.
  - The glass (amber, olive, antique green, clear crystalline for Blanc de Blancs or Rosé), liquid hue, label paper grain, coat of arms, typography, and foil capsule MUST remain unaltered.
- **Packshot Integrity**:
  - Never stretch or skew aspect ratios. Always use `object-contain` or `aspect-[3/4]` / `aspect-[2/3]` with proper whitespace padding.
  - Neutral studio photography: Clean neutral background (pure transparent, off-white, or neutral slate black studio backdrop), never cartoonish AI backgrounds.
  - Never fabricate non-existent cuvées or pass off AI hallucinations as authentic prestige cuvées.
- **Accurate Oenological Metadata**:
  - Every bottle entry must display certified technical parameters:
    - **Maison** (e.g. *Dom Pérignon, Maison Krug, Louis Roederer, Ruinart, Taittinger, Salon, Bollinger*).
    - **Cuvée & Millésime** (e.g. *Vintage 2013*, *Grande Cuvée 171ème Édition*, *Cristal 2015*).
    - **Dosage** (*Brut Nature, Extra-Brut, Brut, Demi-Sec*).
    - **Cépages / Assemblage** (*Chardonnay, Pinot Noir, Meunier*).
    - **Terroir & Cru** (*Côte des Blancs, Montagne de Reims, Vallée de la Marne, Grand Cru*).
    - **Temps de garde sur lies** & **Température de service** (e.g. *10°C - 12°C*).

## 2. Code Review Checklist for the Agent

1. Inspect `<Image />` tags: Is `object-contain` used to prevent bottle distortion?
2. Are wrapper styles free of destructive blend modes or recolor filters?
3. Does the product card display the authentic vintage and house name with dignity?
4. Are image URLs pointing to high-resolution, genuine assets?

## 3. Evaluation Demonstration

To demonstrate this skill during evaluation:
- Run: `« Vérifie avec product-authenticity-guard que les images et fiches produits respectent l'intégrité des champagnes »`
- The agent inspects and validates that all packshots, labels, and technical sheets comply with authenticity requirements.
