# Deployment And Environment

## Target Deployment

Server:
- Easypanel.
- PostgreSQL already installed.
- Frontend domain: `Riads.shop`
- Backend domain: `api.riads.shop`

Database internal URL:

```txt
postgres://riads:riads@riads_database:5432/riads?sslmode=disable
```

Use this in backend `DATABASE_URL` unless Easypanel provides a different internal hostname.

## Repository Layout

```txt
riads-store/
  frontend/
  backend/
  docs/
  README.md
  .gitignore
```

Each deployable folder must include:
- `Dockerfile`
- `.dockerignore`
- `.env.example`
- README instructions.

## Frontend Deployment

Container:
- Port: `3000`
- Build command: `npm run build`
- Start command: `npm run start`

Required env:

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

DNS:
- `Riads.shop` -> frontend service.
- `www.Riads.shop` -> frontend service or redirect to apex.

Frontend should call backend at:
- `https://api.riads.shop`

## Backend Deployment

Container:
- Port: `8000`
- Healthcheck: `/health`

Required env:

```env
APP_ENV=production
APP_NAME=riads-api
API_BASE_URL=https://api.riads.shop
FRONTEND_URL=https://Riads.shop
CORS_ORIGINS=https://Riads.shop,https://www.Riads.shop
DATABASE_URL=postgres://riads:riads@riads_database:5432/riads?sslmode=disable
RUN_MIGRATIONS_ON_START=true
GOOGLE_SHEETS_WEBHOOK_URL=
META_PIXEL_ID=
META_ACCESS_TOKEN=
META_TEST_EVENT_CODE=
TIKTOK_PIXEL_ID=
TIKTOK_ACCESS_TOKEN=
TIKTOK_TEST_EVENT_CODE=
SNAP_PIXEL_ID=
SNAP_ACCESS_TOKEN=
HASH_SALT_INTERNAL=
ENABLE_CAPI=true
ENABLE_SHEETS_WEBHOOK=true
LOG_LEVEL=INFO
```

DNS:
- `api.riads.shop` -> backend service.

## Docker Requirements

Frontend Docker:
- Use Node LTS.
- Install dependencies with lockfile.
- Build Next.js in standalone mode.
- Copy only runtime output.
- Run as non-root where possible.

Backend Docker:
- Use Python 3.12 slim.
- Install dependencies.
- Copy app and alembic.
- Run FastAPI with proxy headers.

## Migrations

Backend startup:
- Run `alembic upgrade head` when `RUN_MIGRATIONS_ON_START=true`.
- For first deploy, create tables automatically.
- If migrations fail, backend should not start in production.

## Google Sheets Setup

1. Create a Google Sheet.
2. Add columns from `docs/sheet-template.csv`.
3. Open Extensions -> Apps Script.
4. Paste `docs/google-apps-script-webhook.js`.
5. Deploy → New deployment → Web app → Execute as: Me, Who has access: Anyone.
6. Copy the deployment URL into backend `GOOGLE_SHEETS_WEBHOOK_URL`.

## Operational Checklist

Before launch:
- Real product images uploaded.
- Real phone/contact info added.
- Policies reviewed.
- Pixel IDs and tokens configured.
- Test order reaches DB.
- Test order reaches Google Sheet.
- Meta/TikTok/Snap test events visible.
- Mobile checkout tested.
- COD confirmation wording clear.

## Future Improvements

After v1:
- Admin order dashboard.
- Confirmation team statuses.
- Delivery company integration.
- WhatsApp order confirmation.
- A/B test offer default.
- Server-side landing page experiments.
- Real review upload workflow.
