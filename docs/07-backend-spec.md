# Backend Spec

## Stack

Use:
- Python 3.12.
- FastAPI.
- Pydantic v2.
- SQLAlchemy 2.x async or SQLModel if preferred.
- Alembic for migrations.
- PostgreSQL.
- `httpx` for outbound webhooks/CAPI.
- `phonenumbers` for Morocco phone validation.
- `uvicorn` or `fastapi run`.

## Folder Structure

```txt
backend/
  app/
    main.py
    core/
      config.py
      database.py
      security.py
    models/
      order.py
      analytics_event.py
    schemas/
      order.py
      analytics.py
    services/
      phone.py
      sheets.py
      meta_capi.py
      tiktok_events.py
      snapchat_capi.py
      orders.py
    api/
      routes/
        health.py
        orders.py
        analytics.py
  alembic/
  alembic.ini
  Dockerfile
  requirements.txt
  .env.example
```

## Environment Variables

Backend `.env.example`:

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

Never commit real tokens.

## Database

Tables:

### orders

Columns:
- `id` UUID primary key.
- `order_code` unique text, human-readable, e.g. `RIADS-20260523-AB12`.
- `status` text: `new`, `upsell_added`, `sent_to_sheet`, `sheet_failed`, `confirmed`, `cancelled`.
- `customer_name` text.
- `phone_raw` text.
- `phone_e164` text.
- `phone_digits_meta_snap` text.
- `phone_country` text default `MA`.
- `items` JSONB.
- `subtotal_mad` integer.
- `shipping_mad` integer default 0.
- `total_mad` integer.
- `currency` text default `MAD`.
- `source` JSONB.
- `tracking` JSONB.
- `client_ip` text.
- `user_agent` text.
- `event_id` text.
- `sheet_sent_at` timestamp nullable.
- `created_at`, `updated_at`.

### analytics_events

Columns:
- `id` UUID primary key.
- `event_name` text.
- `event_id` text.
- `order_id` nullable UUID.
- `payload` JSONB.
- `platform_results` JSONB.
- `created_at`.

## Migrations On Start

Use Alembic migrations.

On FastAPI lifespan startup:
- If `RUN_MIGRATIONS_ON_START=true`, run `alembic upgrade head` before serving traffic.
- Log migration success/failure.
- Fail startup if migration fails in production.

FastAPI docs recommend lifespan for startup initialization. Use an async lifespan context manager in `app/main.py`.

## API Endpoints

### GET /health

Response:

```json
{
  "ok": true,
  "service": "riads-api",
  "env": "production"
}
```

### POST /orders

Responsibilities:
1. Validate payload.
2. Revalidate Moroccan phone.
3. Normalize phone:
   - E.164 with plus for TikTok: `+2126...`
   - digits only for Meta/Snap hashing: `2126...`
4. Create order in DB.
5. Send Google Sheets webhook.
6. Send server-side CAPI purchase/lead events if enabled.
7. Return order code and upsell recommendations.

Response:

```json
{
  "ok": true,
  "order_id": "uuid",
  "order_code": "RIADS-...",
  "upsell": {
    "recommended_product_id": "nour",
    "offer_pieces": 1,
    "price_mad": 199
  }
}
```

### PATCH /orders/{order_id}/upsell

Adds upsell item before thank-you redirect.

Validate:
- order exists.
- upsell not duplicated unless explicitly allowed.
- recompute total.
- update sheet if already sent, or send final payload after upsell if implementing delayed sheet send.

Recommended: delay Sheets send until after upsell decision if the frontend flow always waits 10-15 seconds. If order must be captured instantly, send initial order, then send an `UPSOLD` update row or update existing row by `order_code`.

### POST /analytics/events

Receives browser event metadata and forwards CAPI where appropriate.

Use for:
- `ViewContent`
- `AddToCart`
- `InitiateCheckout`
- `Lead`
- `Purchase`
- `UpsellAccepted`

Do not require PII except for purchase/lead events. Include IP and user agent from request.

## Phone Validation

Use `phonenumbers` library:
- Region: `MA`.
- Accept mobile only where possible.
- Normalize to E.164.

Fallback regex for mobile:
- Local: `^(06|07)[0-9]{8}$`
- International: `^(\\+?212)(6|7)[0-9]{8}$`

Display errors in frontend; backend returns structured error:

```json
{
  "code": "invalid_phone",
  "message_ar": "المرجو إدخال رقم هاتف مغربي صحيح"
}
```

## Google Sheets Webhook

Backend sends POST to `GOOGLE_SHEETS_WEBHOOK_URL` with one flat row per order:
- `date` (`DD/MM/YYYY`, Africa/Casablanca)
- `orderid` (e.g. `riads-20260524-a1b2`)
- `country` (`Morocco`)
- `name`, `phone`
- `product`, `sku`, `quantity` (slash-separated per line item)
- `total_price`, `currency` (`MAD`)
- `status` (empty string)

Upsell sends another row with the updated totals and items. No webhook secret.

Retry:
- 3 attempts with exponential backoff.
- Log failures.
- Store failure status in DB.

## CAPI Hashing

Server hashes PII with SHA-256 lowercase hex.

Do not hash:
- IP address.
- User agent.
- click IDs.
- browser IDs/cookies.

Hash:
- Phone.
- Name-derived fields if sent.
- external_id if used.

Phone source formats:
- Meta/Snap: normalize to digits only with country code, no `+`, e.g. `212612345678`, then hash.
- TikTok: normalize to E.164 with `+`, e.g. `+212612345678`, then hash.

## Docker

Expose port `8000`.

Use:
- `requirements.txt` or `pyproject.toml`.
- non-root user if possible.
- healthcheck endpoint.

Docker command:
- `uvicorn app.main:app --host 0.0.0.0 --port 8000 --proxy-headers`

## Security

- Validate CORS origins.
- Rate limit `/orders` by IP/phone if possible.
- Sanitize all text fields.
- Do not expose stack traces in production.
- Store only needed PII.
- Avoid logging raw phone numbers; log order code.

## Admin Later

Not required for v1, but leave DB ready for:
- order dashboard.
- confirmation team statuses.
- duplicate phone detection.
- delivery outcome import.
