# Design System

## Design Direction

Premium Moroccan beauty, calm authority, high trust. The design must look like a real DTC brand, not a generic product importer.

Mood:
- Warm.
- Minimal.
- Editorial.
- Clean product focus.
- Soft Moroccan riad inspiration without cliché patterns everywhere.

## Color Palette

Primary brand color:
- Deep terracotta: `#9A4E36`

Secondary:
- Sand cream: `#F7EFE6`
- Warm ivory: `#FFF9F2`
- Olive sage: `#7A8061`
- Deep espresso text: `#2D201A`
- Muted gold: `#C9A45C`
- Soft rose: `#E8C8B6`

Functional:
- Success green: `#2F7D4F`
- Warning amber: `#B7791F`
- Error red: `#B42318`
- Border: `#E7D8CC`

Use deep terracotta for:
- Logo circle.
- Primary CTAs.
- Offer badges.
- Active offer border.

Use cream/ivory for:
- Page background.
- Cards.
- Trust sections.

## Typography

Arabic:
- Preferred web font: `Noto Kufi Arabic` for headings.
- Body: `Noto Sans Arabic` or `Tajawal`.

English logo/support:
- `Cormorant Garamond`, `Playfair Display`, or `Inter` depending on final logo taste.

Implementation:
- Use `next/font/google`.
- Define CSS variables for fonts.
- Avoid layout shift.

## Logo

Mark (riad arch monogram):
- Moorish **horseshoe arch** silhouette — terracotta gradient `#A8583E` → `#8A452F`.
- Inner keyline: muted gold `#C9A45C`.
- Ivory serif **R** centered inside arch (`#FFF9F2`).
- Gold plinth bar at base.
- Assets: `frontend/public/brand/logo-mark.svg`, `logo-stamp.svg`, `logo-lockup.svg`.

Lockup (header/footer):
- Mark + Arabic **رياض** (dominant, Noto Kufi bold).
- Latin **riads** in Cormorant Garamond.
- Tagline: `للجمال رياض` · `riads.shop`.

Do not use plain circle + letter; always use the arch mark for brand recognition.

## Components

Buttons:
- Primary: terracotta background, ivory text, rounded full or large radius.
- Secondary: ivory background, terracotta text, terracotta border.
- Ghost: transparent, espresso text.

Offer cards:
- Rounded 24px.
- Border 1px.
- Selected offer: terracotta border, warm shadow, badge.
- `3 pieces` should appear premium and recommended.

Trust badges:
- Small icon circle.
- One concise line.
- Use in hero, cart, checkout, footer.

Product cards:
- Image area with cream background.
- Rating row.
- Product heading.
- Subheading.
- Offer teaser.
- CTA.

Cart drawer:
- Slide from left in RTL or use side panel that does not feel reversed. For Arabic UX, drawer can enter from left while logo/nav remain RTL; keep content right-aligned.
- Sticky checkout CTA at bottom.

Checkout popup:
- Centered modal.
- Order summary top.
- Name and phone fields.
- Trust/social proof box.
- CTA.

## Images

Use temporary sample images until owner provides real product photos.

Create placeholders in:
- `frontend/public/images/placeholders/hero-riads-system.webp`
- `frontend/public/images/placeholders/jadr-hero.webp`
- `frontend/public/images/placeholders/jadr-detail-1.webp`
- `frontend/public/images/placeholders/jadr-detail-2.webp`
- `frontend/public/images/placeholders/jadr-detail-3.webp`
- `frontend/public/images/placeholders/nour-hero.webp`
- `frontend/public/images/placeholders/nour-detail-1.webp`
- `frontend/public/images/placeholders/nour-detail-2.webp`
- `frontend/public/images/placeholders/nour-detail-3.webp`
- `frontend/public/images/placeholders/naqaa-hero.webp`
- `frontend/public/images/placeholders/naqaa-detail-1.webp`
- `frontend/public/images/placeholders/naqaa-detail-2.webp`
- `frontend/public/images/placeholders/naqaa-detail-3.webp`

If no image generation is available, use CSS placeholders with gradients and labels until assets are provided.

Image style:
- Warm backgrounds.
- Product on stone/cream surface.
- Moroccan bathroom/riad hints.
- No clutter.
- No fake medical lab visuals unless certificates exist.

## Responsive Rules

Mobile first:
- CTA visible without too much scrolling.
- Offer cards easy to tap.
- Checkout form fields large.
- Product images optimized.
- Sticky product CTA after offer selector leaves viewport.

Desktop:
- Max content width: 1200-1280px.
- Alternate image/text sections.
- Use larger editorial hero.
- Keep right-aligned Arabic rhythm.

## Motion

Use subtle motion only:
- Cart drawer slide.
- Modal fade/scale.
- Offer selected state.
- Countdown on upsell.

Avoid heavy animations that slow mobile ad traffic.

## Accessibility

- Semantic HTML.
- Visible focus states.
- Buttons have labels.
- Color contrast meets WCAG AA.
- Form errors announced.
- Do not rely only on color for selected offers.
