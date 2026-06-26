# AI Coder Rules

## Mission

Build a production-ready Moroccan Arabic DTC COD ecommerce funnel for `للجمال رياض / riads`.

The goal is not a generic ecommerce template. The goal is a premium, branded, high-trust, high-AOV conversion machine for three beauty/personal-care products.

## Non-Negotiables

- Use Arabic/Darija-first copy.
- Use RTL layout.
- Build `frontend/` and `backend/`.
- Use Next.js App Router + TypeScript + Tailwind CSS for frontend.
- Use Python FastAPI + PostgreSQL + Alembic for backend.
- Use COD-only checkout with only name + phone.
- Validate Moroccan phone numbers on frontend and backend.
- Include cart drawer, cross-sells, checkout popup, upsell modal, thank-you page.
- Send orders to DB and Google Sheets webhook.
- Include Meta, TikTok, and Snapchat browser pixels plus CAPI.
- Defer browser pixels.
- Use event IDs for dedup.
- Hash PII server-side for CAPI.
- Include Docker and `.env.example` in frontend and backend.
- Run backend migrations on startup.

## Coding Standards

Frontend:
- TypeScript strict mode.
- Components should be small and clear.
- Product data centralized.
- No hardcoded API URLs except env defaults for local dev.
- No raw PII in localStorage.
- Use accessible form fields and buttons.
- Keep mobile UX excellent.

Backend:
- Pydantic schemas for every request/response.
- Central config module.
- DB transactions for order creation.
- Outbound service modules for Sheets and each CAPI platform.
- Structured errors.
- No token or PII logging.
- Tests for phone normalization and order totals.

## Suggested Libraries

Frontend:
- `next`
- `react`
- `typescript`
- `tailwindcss`
- `zod`
- `react-hook-form`
- `@hookform/resolvers`
- `zustand`
- `libphonenumber-js`
- `lucide-react`
- Optional: `framer-motion`

Backend:
- `fastapi`
- `uvicorn`
- `pydantic-settings`
- `sqlalchemy`
- `asyncpg`
- `alembic`
- `httpx`
- `phonenumbers`
- `python-dotenv`
- `tenacity`

## Build Order

1. Create repo layout and base configs.
2. Implement product data.
3. Build frontend layout, design system, and static pages.
4. Implement cart store, drawer, offers, and cross-sells.
5. Implement checkout popup and phone validation.
6. Build backend models, migrations, and `/orders`.
7. Add Google Sheets webhook integration.
8. Add pixels and CAPI services.
9. Add upsell modal and order patch endpoint.
10. Add Docker, env examples, and README instructions.
11. Test end-to-end.

## CRO Rules

- 3-piece offer is preselected and visually recommended.
- CTA must always be near the selected offer.
- Every product page has at least 2 CTA sections plus sticky CTA.
- Cart drawer must show cross-sells.
- Checkout popup must show order summary, COD proof, scarcity, and social proof.
- Thank you page must instruct the customer to keep the phone available.
- Avoid fake claims and fake certificates.

## Copy Rules

Use:
- `يساعد على`
- `روتين`
- `مظهر`
- `انتعاش`
- `ثقة`
- `الدفع عند الاستلام`
- `تأكيد الطلب عبر الهاتف`

Avoid:
- Guaranteed medical results.
- Cure/treatment claims.
- Fake doctor/lab/certification claims.
- Overly formal Arabic everywhere.

## Definition Of Done

The project is done when:
- `frontend/` runs locally.
- `backend/` runs locally.
- Docker builds for both.
- Product pages are complete.
- Cart/checkout/upsell flow works.
- Orders save to PostgreSQL.
- Orders post to Google Sheets webhook.
- CAPI payloads can be tested with env test codes.
- Responsive design works on mobile and desktop.
- Docs are followed and README explains deployment.
