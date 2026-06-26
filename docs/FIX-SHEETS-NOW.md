# Google Sheets — إعداد نهائي (سطر واحد لكل طلب)

## Easypanel → backend فقط

```env
GOOGLE_SHEETS_WEBHOOK_URL=https://script.google.com/macros/s/XXXX/exec
ENABLE_SHEETS_WEBHOOK=true
```

**احذف** من frontend: `NEXT_PUBLIC_GOOGLE_SHEETS_WEBHOOK_URL` (ما بقا كيخدم — السيرفر هو اللي يبعث).

**Rebuild backend + frontend** من GitHub `main`.

## Apps Script

1. الصق `docs/google-apps-script-webhook.js` (فيها upsert = ما كاينش تكرار)
2. Deploy → Manage deployments → Edit → **New version** → Deploy

## تحقق

`https://api.riads.shop/health` → `"sheets_configured": true`

طلبية جديدة = **سطر واحد** ف الشيت.
