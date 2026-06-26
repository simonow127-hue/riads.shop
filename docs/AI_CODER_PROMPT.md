# Prompt For AI Coder

You are building `Riads.shop`, a premium Moroccan Arabic DTC COD ecommerce store for the brand `للجمال رياض / riads`.

Read and follow every file in `docs/` before coding:
- `docs/README.md`
- `docs/01-brand-positioning.md`
- `docs/02-icp-copywriting.md`
- `docs/03-site-architecture-ux.md`
- `docs/04-product-offers-cro.md`
- `docs/05-design-system.md`
- `docs/06-frontend-spec.md`
- `docs/07-backend-spec.md`
- `docs/08-tracking-pixels-capi.md`
- `docs/09-deployment-env.md`
- `docs/10-ai-coder-rules.md`
- `docs/products-seed.csv`
- `docs/sheet-template.csv`
- `docs/google-apps-script-webhook.js`

Deliver two production folders:
- `frontend/`: Next.js App Router + TypeScript + Tailwind CSS.
- `backend/`: Python FastAPI + PostgreSQL + Alembic.

The store must be Arabic/Darija-first, RTL, responsive, and premium. It must feel like the brand owns the products, not like a dropshipping reseller.

Products:
- `سيروم جدر لنمو الشعر وتقوية فروة الرأس والشعر الخفيف`
- `سيروم نور لإحياء البشرة المتعبة والباهتة`
- `رول اون نقاء للانتعاش اليومي ضد التعرق ورائحة الجسم`

Offers for each product:
- 1 piece: `199 DH`
- 2 pieces: `279 DH`
- 3 pieces: `349 DH`

Core flow:
1. Product page offer selector defaults to 3 pieces.
2. CTA adds selected offer to cart and opens cart drawer.
3. Cart drawer shows order summary and cross-sells.
4. Cart CTA opens checkout popup.
5. Checkout popup has only name + Moroccan phone.
6. Validate Moroccan phone on frontend and backend.
7. Submit order to backend.
8. Backend stores order in PostgreSQL, sends Google Sheets webhook, and sends Meta/TikTok/Snap CAPI if env vars are configured.
9. After valid submit, show 10-15 second upsell modal.
10. Redirect to thank-you page with COD confirmation instructions.

Tracking:
- Include Meta, TikTok, and Snapchat browser pixels.
- Defer pixels for speed.
- Include CAPI services in backend.
- Use matching event IDs for browser/server dedup.
- Hash PII server-side.
- Meta/Snap phone hash source: digits only with country code, e.g. `212612345678`.
- TikTok phone hash source: E.164 with plus, e.g. `+212612345678`.

Deployment:
- Add Dockerfile, `.dockerignore`, and `.env.example` to both frontend and backend.
- Backend must run Alembic migrations on startup when `RUN_MIGRATIONS_ON_START=true`.
- Backend DB URL env example must include:
  `postgres://riads:riads@riads_database:5432/riads?sslmode=disable`
- Frontend domain: `https://Riads.shop`
- Backend domain: `https://api.riads.shop`

Do not invent fake medical claims, fake doctors, or fake certifications. Use authority through ingredients, routine education, COD trust, clear usage, social proof placeholders, and transparent policies.

Definition of done:
- `frontend/` runs locally and builds.
- `backend/` runs locally and applies migrations.
- Docker builds for both.
- Full checkout and upsell flow works.
- Orders reach DB and Google Sheets webhook.
- Pixel/CAPI code is present and testable.
- Mobile RTL UX is polished.
