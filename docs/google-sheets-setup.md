# Google Sheets — setup (3 minutes)

Your sheet: [Orders spreadsheet](https://docs.google.com/spreadsheets/d/1noCh6q_Q-G-fnFWUoPdiHJ7aVL-9r2BMdHTI2xrVl1I/edit)

## Method A — Service account (backend writes directly, no Apps Script)

1. [Google Cloud Console](https://console.cloud.google.com/) → new project → **APIs & Services** → enable **Google Sheets API**.
2. **Credentials** → **Create credentials** → **Service account** → create → **Keys** → **Add key** → JSON → download file.
3. Open your Google Sheet → **Share** → paste the `client_email` from the JSON → role **Editor**.
4. On your PC (in `backend/` folder):
   ```bash
   python scripts/encode-service-account.py path/to/downloaded-key.json
   ```
5. Copy the printed `GOOGLE_SERVICE_ACCOUNT_JSON_B64=...` into **Easypanel → backend → Environment** → **Redeploy (Rebuild)**.

Check: `https://api.riads.shop/health` must show `"sheets_mode": "direct"` and `"sheets_configured": true`.

## Method B — Apps Script webhook

1. Sheet → **Extensions → Apps Script** → paste `docs/google-apps-script-webhook.js`.
2. **Deploy → Web app** → Execute as **Me**, access **Anyone** → copy URL ending in `/exec`.
3. Easypanel env: `GOOGLE_SHEETS_WEBHOOK_URL=<that url>` → Redeploy.

## Retry a test order

```http
POST https://api.riads.shop/orders/{order_uuid}/sync-sheet
```

`order_uuid` = `id` column in PostgreSQL (not `order_code`).
