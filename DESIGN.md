---
name: LA CAVE
description: Haute Champagne & Cuvées Rares — a daylight cellar of chalk, champagne green and one gold light.
colors:
  chalk: "#FBFAF6"
  chalk-pure: "#FFFFFF"
  surface-elevated: "#F4F7EE"
  surface-subtle: "#EFF3E8"
  green-veil: "#E6EFDD"
  green-field: "#D9E4CC"
  green-deep: "#C6D6B5"
  green-ink: "#2E4636"
  gold-champagne: "#E3C47D"
  gold-light: "#EFD9A2"
  gold-muted: "#B08F4C"
  gold-ink: "#755A22"
  champagne-cream: "#FBF7EC"
  ink: "#14150F"
  ink-soft: "#1B1F18"
  body: "#333A2F"
  muted: "#565C4E"
  subtle: "#585F50"
  status-success: "#2F6B45"
  status-warning: "#8A5A12"
  status-error: "#A3352B"
  border-hairline: "rgba(46, 70, 54, 0.10)"
  border-strong: "rgba(46, 70, 54, 0.16)"
  border-gold: "rgba(176, 143, 76, 0.35)"
typography:
  display:
    fontFamily: "Cormorant Garamond, Didot, Bodoni MT, Georgia, serif"
    fontSize: "clamp(2.25rem, 8vw, 6rem)"
    fontWeight: 300
    lineHeight: 1.12
    letterSpacing: "-0.025em"
  headline:
    fontFamily: "Cormorant Garamond, Didot, Bodoni MT, Georgia, serif"
    fontSize: "2.25rem"
    fontWeight: 300
    lineHeight: 1.15
  title:
    fontFamily: "Cormorant Garamond, Didot, Bodoni MT, Georgia, serif"
    fontSize: "1.5rem"
    fontWeight: 300
    lineHeight: 1.3
  body:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "1rem"
    fontWeight: 300
    lineHeight: 1.65
  label:
    fontFamily: "Geist, -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif"
    fontSize: "0.625rem"
    fontWeight: 400
    lineHeight: 1.4
    letterSpacing: "0.3em"
  data:
    fontFamily: "Geist Mono, monospace"
    fontSize: "0.8125rem"
    fontWeight: 400
    lineHeight: 1.4
rounded:
  none: "0px"
  seal: "9999px"
spacing:
  "2xs": "4px"
  xs: "8px"
  sm: "12px"
  md: "16px"
  lg: "24px"
  xl: "32px"
  "2xl": "48px"
  section: "112px"
components:
  button-primary:
    backgroundColor: "{colors.gold-champagne}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
    height: "48px"
  button-primary-hover:
    backgroundColor: "{colors.gold-light}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
    height: "48px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "14px 32px"
    height: "48px"
  bottle-card:
    backgroundColor: "{colors.chalk-pure}"
    textColor: "{colors.ink}"
    rounded: "{rounded.none}"
    padding: "24px"
  field-input:
    backgroundColor: "{colors.chalk}"
    textColor: "{colors.ink-soft}"
    rounded: "{rounded.none}"
    padding: "10px 16px"
    height: "44px"
  nav-link:
    backgroundColor: "transparent"
    textColor: "{colors.body}"
    rounded: "{rounded.none}"
    padding: "4px 0"
  eyebrow:
    backgroundColor: "transparent"
    textColor: "{colors.gold-ink}"
    padding: "0"
  status-pill:
    backgroundColor: "{colors.surface-subtle}"
    textColor: "{colors.green-ink}"
    rounded: "{rounded.none}"
    padding: "2px 10px"
---

## Overview

**Creative North Star: "The Daylight Cellar"**

LA CAVE is staged as the entrance hall of a chalk cellar at midday, not the candlelit vault the prestige-champagne category defaults to. Light is the material: a pale champagne-green veil on the hero, chalk-white reading surfaces for every catalogue and editorial page, and green deepening as the page descends toward the footer. Gold is a single lamp in that room — a primary action, a seal, a hairline — never a field.

The chromatic mandate is explicit and numeric: **60 % white, 30 % champagne green, 10 % champagne yellow, text in ink**. Measured on the rendered homepage, that lands at roughly 43 % chalk/white, 57 % green family and 0.4 % gold on desktop, and 43 % chalk/white, 55 % green and 1.5 % gold on mobile, with gold concentrated in CTAs, seals and the hero halo. The brief's intent — a bright house, not a dark one — holds at every breakpoint.

The typography and layout of the house are unchanged by that recolouring: Cormorant Garamond in light weights for display, Geist for body copy, 9–10 px uppercase micro-labels tracked 0.2–0.3 em, hairline borders, square corners, and photography that is never recoloured, filtered or restaged.

**Key Characteristics:**
- A 60/30/10 field of chalk, champagne green and champagne yellow, with ink text throughout.
- Serif display at light weights, sans body, mono for prices, scores and vintages.
- Square corners, hairline green borders, depth from tone and one radial halo.
- Slow, restrained motion (300–500 ms, `cubic-bezier(0.16, 1, 0.3, 1)`), no bounce, no parallax gimmick.
- Bottle photography preserved exactly as supplied, on a champagne pedestal gradient.

**The Daylight Rule.** The page field is light. No large ink or black surface is ever introduced to add "luxury"; depth comes from green tone steps, hairlines and photography.

## Colors

Chalk and champagne green carry the page; gold is rationed.

### Primary
- **Champagne Yellow** (`#E3C47D`): the single warm accent. Primary CTA fill, seal rings, hairline emphasis, hero halo. Hover deepens to **Champagne Light** (`#EFD9A2`).
- **Bronze Ink** (`#755A22`): gold-family text — eyebrows, prices in serif, active nav, link hovers. 6.2:1 on chalk, 4.9:1 on the green footer.
- **Gold Border** (`#B08F4C`): 1 px edges on primary buttons, chips, seals, and the hero's lower hairline.

### Secondary
- **Green Veil** (`#E6EFDD`): homepage hero field and the drawer's quiet panels.
- **Green Field** (`#D9E4CC`): footer, catalogue mastheads, full-width green bands.
- **Green Deep** (`#C6D6B5`): announcement rail and scrollbar thumb.
- **Surface Subtle** (`#EFF3E8`): pillar bands, drawer headers, status pills.
- **Green Ink** (`#2E4636`): all green-family borders (at 8–35 % alpha) and the deepest green text.

### Neutral
- **Chalk** (`#FBFAF6`): page background and scrolling surfaces.
- **Chalk Pure** (`#FFFFFF`): cards, drawer panels, reading panes.
- **Surface Elevated** (`#F4F7EE`): sticky action bars, drawer footers.
- **Ink** (`#14150F`): headings and primary text. **Ink Soft** (`#1B1F18`) for dense data.
- **Body** (`#333A2F`): paragraphs. **Muted** (`#565C4E`): secondary metadata. **Subtle** (`#585F50`): the lightest legible tier (≥5:1 on green).
- **Champagne Cream** (`#FBF7EC`): the terroir editorial band and quiet callouts.
- **Status**: `#2F6B45` success on `#EAF2EA`, `#8A5A12` warning on `#FBF0DA`, `#A3352B` error on `#FBEAE7`.

**The Ten Percent Rule.** Champagne yellow may cover no more than a tenth of any viewport. It marks actions and provenance, never walls, never body text.

## Typography

**Display Font:** Cormorant Garamond (with Didot, Bodoni MT, Georgia)
**Body Font:** Geist (with system sans fallbacks)
**Label/Mono Font:** Geist Mono for prices, scores, vintages and order references.

**Character:** A high-contrast French serif in light weights against a technical grotesque. The pairing reads as a maison's engraved stationery and a cellar ledger: decorative only where it is large, exact everywhere it is small.

### Hierarchy
- **Display** (300, `clamp(2.25rem, 8vw, 6rem)`, 1.12, tracking −0.025em): homepage hero only; one line of it may be italic in bronze.
- **Headline** (300, 2.25–3rem, 1.15): section and page titles in serif.
- **Title** (300, 1.25–1.5rem, 1.3): card names, drawer titles, editorial sub-heads.
- **Body** (300, 0.875–1rem, 1.65): paragraphs; measure held near 60–70 ch, max `max-w-2xl`.
- **Label** (400, 9–10 px, tracking 0.2–0.3em, uppercase): eyebrows, nav, buttons, metadata.
- **Data** (400, 0.8125rem, mono): price, score, vintage, order number.

**The Two-Voice Rule.** Serif never appears below 18 px; sans never appears above 24 px. A serif label or a sans display is a break in the house voice.

## Layout

A 7xl (80 rem) container with 20/32/48 px side insets at mobile/tablet/desktop, section rhythm of 80–128 px (`py-20 sm:py-28`, `py-24 sm:py-32`). The homepage is a single column of full-bleed bands separated by hairlines: hero (82 vh), featured cuvées, the four-pillar green band, the terroir cream band, then the footer. Catalogue and editorial pages use a two-column editorial split at `lg` (text 5/12, imagery 7/12) that collapses to one column below 1024 px.

Density is generous and consistent: cards carry 24–28 px internal padding, 20–24 px grid gaps, and metadata rows separated by a single hairline. Breakpoints follow Tailwind defaults — 640, 768, 1024, 1280 px — and every band is audited at 390, 768 and 1440 px.

**The Band Rule.** A background may only change at a full-width hairline-separated band boundary. No floating coloured panels inside a reading column.

## Elevation & Depth

The system is flat-by-default and tonal: depth is a green tone step, a chalk-to-white swap, or a hairline, not a shadow. The only shadow vocabulary is functional — a drawer sliding over the page (`shadow-2xl`), the selection drawer's primary action (`shadow-md`), and dropdown surfaces. Small accent elements use a soft, offset shadow; zero-offset coloured halos are reserved for the champagne-pedestal photography treatment.

### Shadow Vocabulary
- **Overlay** (`0 25px 50px -12px rgba(20, 21, 15, 0.25)`): cart and product drawers.
- **Action** (`0 4px 6px -1px rgba(20, 21, 15, 0.10), 0 2px 4px -2px rgba(20, 21, 15, 0.10)`): primary gold buttons.
- **Pedestal** (`radial-gradient(ellipse at center, rgba(227,196,125,0.30) 0%, rgba(239,243,232,0.95) 75%)`): the photographic ground under every bottle.

**The Hairline-Not-Shadow Rule.** If a surface needs separating and it is not floating over the page, use a 1 px border at 10–16 % green ink. Never add a card shadow to compensate for a missing tone step.

## Shapes

Square is the house geometry: buttons, cards, inputs, chips, drawers and tables are all `border-radius: 0`. The two exceptions are the circular maison seal (`9999px`) used for the LC monogram and the round status icon, and the top announcement rail, which is a full-bleed bar with no radius. Nothing is clipped or masked except photography overflows at `overflow-hidden` on its pedestal. Borders are always 1 px; the vertical rhythm of a page comes from these lines rather than from containers.

## Components

### Buttons
- **Shape:** square (0 px), 48 px tall, 1 px bronze border.
- **Primary:** champagne yellow `#E3C47D` fill, ink text, 32 px horizontal padding, 10 px label tracked 0.22em uppercase; hover to `#EFD9A2`.
- **Ghost:** transparent, green-ink border at 20 %, ink label; hover darkens the border to bronze and keeps the label ink.
- **Focus:** visible 1 px bronze outline offset 2 px; no glow.

### Chips
- **Style:** chalk translucent fill over photography (`#FBFAF6` at 85 %), 1 px bronze or green hairline, 9–10 px uppercase bronze label.
- **State:** dosage pills select with a champagne-yellow 35 % fill and bronze border; unselected are transparent with a 15 % green border.

### Cards / Containers
- **Corner Style:** square.
- **Background:** white body, champagne-pedestal image well.
- **Shadow Strategy:** none at rest; the whole card lifts through its hairline shifting to bronze on hover.
- **Border:** 1 px green ink at 10 %.
- **Internal Padding:** 24–28 px; image well 320–384 px tall.

### Inputs / Fields
- **Style:** chalk fill, 1 px green-ink border at 15 %, square, 10 px / 16 px padding, 12 px text.
- **Focus:** border shifts to bronze `#B08F4C`; no ring, no glow.
- **Disabled / Muted:** muted text `#565C4E` at label size.

### Navigation
- **Style:** fixed cream bar with a blurred gradient over content, green announcement rail above, 9 px uppercase bronze-tinted rail copy, 11–12 px uppercase nav labels tracked 0.22em in body ink; active is bronze.
- **Mobile:** hamburger opens a full-screen chalk sheet; 44 px targets, body scroll locked, close control labelled.
- **Cart:** the nav item doubles as the cart trigger and opens the full-page privilege drawer.

### Bottle Card (signature)
The recurring object of the house: a square white card holding a bottle on a champagne pedestal, a bronze provenance chip top-left, a mono vintage top-right, a serif name, house and dosage line, then a hairline footer with the price in serif and a "Sélectionner" action. Photography is `object-contain`, never tinted, never cropped to the label.

### Selection Drawer (signature)
A right-hand white panel (`max-w-lg`/`max-w-xl`) with a `#F4F7EE` header, the bottle on its pedestal, quantity and format controls, and a sticky champagne-yellow add-to-cart bar. It is the only place where gold covers a full control, and it is the conversion moment.

## Do's and Don'ts

### Do:
- **Do** keep the page field light: chalk `#FBFAF6` or white for reading, green for atmosphere, and reach for a deeper green band to add weight.
- **Do** hold champagne yellow under 10 % of any viewport and use it only for actions, seals and hairlines.
- **Do** keep text ink `#14150F`, paragraphs `#333A2F`, metadata `#565C4E` or `#585F50`, and verify ≥4.5:1 on the green surfaces.
- **Do** use 1 px green hairlines and square corners for separation.
- **Do** preserve bottle photography exactly: no recolouring, no duotone, no heavy filters, `object-contain` on the pedestal.
- **Do** keep touch targets at 44 px and lock body scroll behind drawers.

### Don't:
- **Don't** reintroduce black, near-black or dark-green fields as page backgrounds; the house is now daylight.
- **Don't** use champagne yellow for body text, large fills or decorative stripes.
- **Don't** add gradients other than the champagne pedestal and the hero's single gold halo.
- **Don't** round buttons, cards or inputs; only the circular seal is round.
- **Don't** replace a hairline with a shadow to separate flat surfaces.
- **Don't** retitle, rewrite or translate the French copy while restyling; the words are part of the house.
