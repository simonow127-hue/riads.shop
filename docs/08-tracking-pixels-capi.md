# Tracking, Pixels, And CAPI

## Goals

Implement browser pixels and server-side CAPI for:
- Meta/Facebook.
- TikTok.
- Snapchat.

Requirements:
- Defer browser pixels for speed.
- Use deterministic event IDs for deduplication.
- Hash PII only server-side for CAPI.
- Keep browser pixel PII-free unless platform advanced matching is intentionally configured later.
- Send same event name and event ID across browser and server where deduplication is needed.

## Event ID Strategy

Generate UUIDs in frontend for each meaningful event:
- `view_content_event_id`
- `add_to_cart_event_id`
- `checkout_event_id`
- `purchase_event_id`

For order submit:
- Use one `purchase_event_id` in:
  - browser pixel purchase/lead event.
  - backend `/orders` payload.
  - Meta CAPI `event_id`.
  - TikTok Events API `event_id`.
  - Snap CAPI `event_id`.

For Snap purchase, also use `order_code` as transaction/order ID where possible.

## Browser Event Mapping

Internal to platform:

| Internal | Meta Pixel | TikTok Pixel | Snap Pixel |
|---|---|---|---|
| PageView | PageView | PageView | PAGE_VIEW |
| ViewContent | ViewContent | ViewContent | VIEW_CONTENT |
| AddToCart | AddToCart | AddToCart | ADD_CART |
| InitiateCheckout | InitiateCheckout | InitiateCheckout | START_CHECKOUT |
| Purchase | Purchase | CompletePayment | PURCHASE |
| Lead | Lead | SubmitForm | SIGN_UP or CUSTOM_EVENT |

Use `Purchase` for completed COD order submission because it is the closest ecommerce optimization signal. If ad account policy prefers lead optimization for COD, also send `Lead` with the same order metadata but avoid double-optimizing unless campaigns are configured for that.

## Meta Pixel + CAPI

Browser:
- Load Meta Pixel after interactive/idle.
- Send standard events with `eventID`.

Server endpoint:
- `POST https://graph.facebook.com/{version}/{pixel_id}/events?access_token={token}`

Meta CAPI payload shape:

```json
{
  "data": [
    {
      "event_name": "Purchase",
      "event_time": 1710000000,
      "event_id": "uuid",
      "action_source": "website",
      "event_source_url": "https://Riads.shop/products/nour-skin-serum",
      "user_data": {
        "ph": "sha256_phone_digits",
        "client_ip_address": "raw_ip",
        "client_user_agent": "raw_ua",
        "fbp": "fbp_cookie",
        "fbc": "fbc_cookie"
      },
      "custom_data": {
        "currency": "MAD",
        "value": 349,
        "content_type": "product",
        "contents": [
          {
            "id": "nour",
            "quantity": 3,
            "item_price": 349
          }
        ],
        "order_id": "RIADS-..."
      }
    }
  ],
  "test_event_code": "optional"
}
```

Meta hashing:
- Phone parameter is `ph`.
- Hashing required.
- Remove symbols, letters, and leading zeros.
- Include country code.
- For Morocco: local `0612345678` becomes `212612345678`, then SHA-256.

Do not hash:
- `fbp`, `fbc`, IP, user agent.

Dedup:
- Browser event `eventID` must equal CAPI `event_id`.
- Event name should match.

## TikTok Pixel + Events API

Browser:
- Load TikTok Pixel after interactive/idle.
- Send events with `event_id` when API supports it.

Server endpoint:
- `POST https://business-api.tiktok.com/open_api/v1.3/event/track/`
- Auth with access token.

TikTok payload shape:

```json
{
  "event_source": "web",
  "event_source_id": "TIKTOK_PIXEL_ID",
  "data": [
    {
      "event": "CompletePayment",
      "event_time": 1710000000,
      "event_id": "uuid",
      "user": {
        "phone": "sha256_phone_e164_with_plus",
        "external_id": "sha256_optional_order_or_customer_id",
        "ttp": "ttp_cookie",
        "ip": "raw_ip",
        "user_agent": "raw_ua"
      },
      "properties": {
        "currency": "MAD",
        "value": 349,
        "content_type": "product",
        "contents": [
          {
            "content_id": "nour",
            "content_name": "سيروم نور",
            "quantity": 3,
            "price": 349
          }
        ]
      },
      "page": {
        "url": "https://Riads.shop/thank-you",
        "referrer": "https://Riads.shop/products/nour-skin-serum"
      }
    }
  ],
  "test_event_code": "optional"
}
```

TikTok hashing:
- Hash phone with SHA-256.
- Normalize phone to E.164 with `+` before hashing.
- For Morocco: local `0612345678` becomes `+212612345678`, then SHA-256.

Dedup:
- TikTok requires matching `event_id` in Pixel and Events API.
- Same event name and same event ID.
- Dedup window is commonly 48 hours, with merge behavior for close duplicates.

## Snapchat Pixel + CAPI

Browser:
- Load Snap Pixel after interactive/idle.
- Send `client_dedup_id` with tracked events.
- For purchases, send `transaction_id` as the order code.

Server endpoint:
- `POST https://tr.snapchat.com/v3/{pixel_id}/events?access_token={token}`

Snap CAPI payload shape:

```json
{
  "data": [
    {
      "event_name": "PURCHASE",
      "event_time": 1710000000,
      "event_id": "uuid",
      "action_source": "WEB",
      "event_source_url": "https://Riads.shop/thank-you",
      "user_data": {
        "ph": "sha256_phone_digits",
        "client_ip_address": "raw_ip",
        "client_user_agent": "raw_ua"
      },
      "custom_data": {
        "currency": "MAD",
        "value": 349,
        "order_id": "RIADS-..."
      }
    }
  ]
}
```

Snap hashing:
- Normalize phone by including country code.
- Remove `+`, whitespace, parentheses, hyphens, and leading local zero.
- For Morocco: `0612345678` becomes `212612345678`, then SHA-256 lowercase hex.

Dedup:
- Pixel `client_dedup_id` must exactly match CAPI `event_id`.
- For purchase, Pixel `transaction_id` must match CAPI `custom_data.order_id`.
- Do not trim/lowercase event IDs after generation; send byte-for-byte same value.

## Cookie/Click ID Capture

Frontend should capture and send:
- URL params: `fbclid`, `ttclid`, Snap click ID if present.
- Cookies: `_fbp`, `_fbc`, `_ttp`, Snap cookies if available.
- Referrer and landing URL.
- UTM params.

Persist in first-party storage for session attribution:
- `riads_first_landing_url`
- `riads_first_referrer`
- `riads_utm`
- `riads_click_ids`

Do not store PII in localStorage.

## Deferred Loading

Implementation:
- `PixelManager` component mounted in root layout.
- Use `next/script` with `afterInteractive`.
- Optionally delay initialization with `requestIdleCallback` or 1500ms timeout.
- Provide a small event queue:
  - If pixel is not loaded, queue event.
  - Flush queue when loaded.

## Privacy

Add policy copy:
- Tracking is used to improve ads and measure performance.
- Customer phone is used for order confirmation and delivery.
- PII sent to ad platforms server-side must be hashed where required.

## Debugging

Backend should log:
- platform.
- event name.
- event ID.
- response status.
- order code.

Do not log:
- raw phone.
- hashed phone in normal logs.
- access tokens.

Add test event env vars for Meta/TikTok where supported.
