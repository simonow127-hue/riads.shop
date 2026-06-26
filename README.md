# للجمال رياض — Riads.shop

Premium Moroccan Arabic DTC COD ecommerce store for `للجمال رياض / riads`.

## Structure

```
riads-store/
  frontend/   → Next.js App Router + TypeScript + Tailwind CSS
  backend/    → Python FastAPI + PostgreSQL + Alembic
  docs/       → Full implementation brief
```

## Quick Start

### Backend

```bash
cd backend
cp .env.example .env
# edit .env with real values
pip install -r requirements.txt
fastapi run app/main.py --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
cp .env.example .env.local
# edit .env.local with real values
npm install
npm run dev
```

## Docker

```bash
# Backend
cd backend && docker build -t riads-api .

# Frontend
cd frontend && docker build -t riads-frontend .
```

## Deployment

- Frontend: `https://Riads.shop` (port 3000)
- Backend: `https://api.riads.shop` (port 8000)
- Database: PostgreSQL at `riads_database:5432/riads`

See `docs/09-deployment-env.md` for full deployment checklist.

## Google Sheets

1. Create a Google Sheet.
2. Open Extensions → Apps Script.
3. Paste `docs/google-apps-script-webhook.js`.
4. Set script property `WEBHOOK_SECRET`.
5. Deploy as web app with POST access.
6. Set `GOOGLE_SHEETS_WEBHOOK_URL` and `GOOGLE_SHEETS_WEBHOOK_SECRET` in backend `.env`.

## Products

- **جدر** — `سيروم جدر لنمو الشعر وتقوية فروة الرأس والشعر الخفيف`
- **نور** — `سيروم نور لإحياء البشرة المتعبة والباهتة`
- **نقاء** — `رول اون نقاء للانتعاش اليومي ضد التعرق ورائحة الجسم`

Offers: 1 piece 199 DH / 2 pieces 279 DH / 3 pieces 349 DH
