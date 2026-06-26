# Riads Store Build Docs

This folder is the implementation brief for a premium Moroccan Arabic DTC store for `Riads.shop`.

Brand:
- Arabic name: `للجمال رياض`
- English mark: `riads`
- Domain: `https://Riads.shop`
- Backend: `https://api.riads.shop`
- Database name: `riads`
- Backend stack: Python FastAPI + PostgreSQL
- Frontend stack: Next.js App Router + TypeScript + Tailwind CSS
- Business model: COD-only, high-AOV bundles, cart cross-sells, post-checkout upsell, webhook to Google Sheets.

Required implementation folders:
- `frontend/`: customer-facing responsive store.
- `backend/`: FastAPI order API, database, CAPI integrations, webhook delivery.
- `docs/`: this specification package.

Read these docs in order:
1. `01-brand-positioning.md`
2. `02-icp-copywriting.md`
3. `03-site-architecture-ux.md`
4. `04-product-offers-cro.md`
5. `05-design-system.md`
6. `06-frontend-spec.md`
7. `07-backend-spec.md`
8. `08-tracking-pixels-capi.md`
9. `09-deployment-env.md`
10. `10-ai-coder-rules.md`

Templates:
- `sheet-template.csv`: Google Sheet columns for orders.
- `products-seed.csv`: seed product and offer data.
- `google-apps-script-webhook.js`: Apps Script endpoint to paste into Google Sheets.

Core conversion target:
- Make the store feel like the owner/manufacturer of the products, not a dropshipping reseller.
- Use Moroccan Arabic, premium wellness/beauty authority, social proof, COD reassurance, scarcity, bundle economics, and clean mobile UX.
- Every product page must push the selected offer into cart, open the cart drawer, show cross-sells, then launch a checkout popup with only name + Moroccan phone.
