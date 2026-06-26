# Frontend Spec

## Stack

Use:
- Next.js App Router.
- React.
- TypeScript.
- Tailwind CSS.
- `next/font`.
- Zustand or React Context for cart state.
- React Hook Form + Zod for checkout validation.
- `libphonenumber-js` for Moroccan phone validation/normalization.
- Framer Motion only if lightweight; otherwise CSS transitions.

Do not add a full ecommerce platform. This is a focused COD funnel.

## Folder Structure

Recommended:

```txt
frontend/
  app/
    layout.tsx
    page.tsx
    collections/page.tsx
    products/[slug]/page.tsx
    about/page.tsx
    contact/page.tsx
    thank-you/page.tsx
    privacy/page.tsx
    terms/page.tsx
    shipping/page.tsx
    refund-policy/page.tsx
    globals.css
  components/
    layout/
    product/
    cart/
    checkout/
    tracking/
    ui/
  lib/
    api.ts
    cart.ts
    events.ts
    phone.ts
    products.ts
    tracking.ts
  public/
    images/
  Dockerfile
  next.config.ts
  package.json
  .env.example
```

## Environment Variables

Frontend `.env.example` must include:

```env
NEXT_PUBLIC_SITE_URL=https://Riads.shop
NEXT_PUBLIC_API_URL=https://api.riads.shop

NEXT_PUBLIC_META_PIXEL_ID=
NEXT_PUBLIC_TIKTOK_PIXEL_ID=
NEXT_PUBLIC_SNAP_PIXEL_ID=

NEXT_PUBLIC_ENABLE_META_PIXEL=true
NEXT_PUBLIC_ENABLE_TIKTOK_PIXEL=true
NEXT_PUBLIC_ENABLE_SNAP_PIXEL=true
NEXT_PUBLIC_ENABLE_DEBUG_EVENTS=false
```

## Product Data

Store product seed data in `lib/products.ts` from `docs/products-seed.csv`.

Each product:
- id.
- slug.
- Arabic name.
- short heading.
- subheading.
- prices/offers.
- image placeholders.
- reviews.
- FAQs.
- cross-sell IDs.

## Cart Behavior

Cart item shape:

```ts
type CartItem = {
  productId: string
  slug: string
  name: string
  offerPieces: 1 | 2 | 3
  quantity: number
  unitBundlePrice: number
  total: number
}
```

When PDP CTA is clicked:
1. Add selected offer to cart.
2. Generate `event_id` for `AddToCart`.
3. Fire browser pixels.
4. Send `/analytics/events` to backend for CAPI dedup if configured.
5. Open cart drawer.

## Checkout Flow

Checkout popup fields:
- `fullName`
- `phone`

Validation:
- Full name: minimum 2 words recommended, minimum 3 chars hard validation.
- Phone: Moroccan mobile only. Accept local formats like `06...`, `07...`, `+2126...`, `+2127...`, `2126...`, `2127...`.
- Normalize for backend as:
  - `phone_e164`: `+2126XXXXXXXX` or `+2127XXXXXXXX`
  - `phone_digits_ma`: `2126XXXXXXXX` or `2127XXXXXXXX`

Frontend sends raw form phone plus normalized phone to backend. Backend must revalidate and normalize; never trust frontend only.

Order submit payload:

```json
{
  "customer": {
    "full_name": "string",
    "phone": "string",
    "phone_e164": "string"
  },
  "items": [],
  "totals": {
    "subtotal": 349,
    "shipping": 0,
    "total": 349,
    "currency": "MAD"
  },
  "source": {
    "landing_url": "string",
    "referrer": "string",
    "utm_source": "string",
    "utm_medium": "string",
    "utm_campaign": "string",
    "utm_content": "string",
    "utm_term": "string",
    "fbclid": "string",
    "ttclid": "string",
    "sc_click_id": "string"
  },
  "tracking": {
    "event_id": "uuid",
    "fbp": "cookie",
    "fbc": "cookie",
    "ttp": "cookie",
    "scid": "cookie"
  }
}
```

After successful response:
1. Fire browser `Purchase`/`CompletePayment` equivalent with same order event ID.
2. Show upsell modal for 10-15 seconds.
3. If accepted, call backend order upsell endpoint.
4. Redirect to `/thank-you?order=ORDER_CODE`.

## Browser Pixel Loading

Pixels must be deferred for speed:
- Load after consent/after interactive using `next/script` with `strategy="afterInteractive"` or delayed idle callback.
- Do not block first paint.
- Queue events until scripts load.
- Use same `event_id` as backend CAPI.

## Event Names

Internal event names:
- `PageView`
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Lead`
- `Purchase`
- `UpsellAccepted`

Map to platforms in `08-tracking-pixels-capi.md`.

## SEO And Metadata

Use App Router metadata exports:
- Home title: `للجمال رياض | riads - عناية مغربية موثوقة`
- Product titles include product name and COD.
- Arabic descriptions.
- Open Graph image placeholders.

## Performance

Targets:
- Lighthouse mobile performance 85+ before pixels.
- Use Next Image for product images.
- Keep JS minimal.
- Avoid heavy carousels; use CSS scroll snap or simple components.
- Defer pixels and third-party scripts.

## Docker

Use Next standalone output.

Required:
- `Dockerfile`
- `.dockerignore`
- production `next start` or standalone server.
- Expose port `3000`.

## Testing Checklist

Before delivery:
- Mobile iPhone/Android widths.
- RTL layout.
- Add-to-cart opens drawer.
- Cross-sells add correctly.
- Checkout validates Moroccan phone.
- Backend order created.
- Thank you page shown.
- Pixel events use same event IDs as CAPI.
- Env vars missing should not crash browser; log only in debug.
