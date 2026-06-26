# Site Architecture And UX

## Routes

Frontend routes:
- `/`: home page.
- `/collections`: all products / collection page.
- `/products/jadr-hair-serum`: product landing page for `جدر`.
- `/products/nour-skin-serum`: product landing page for `نور`.
- `/products/naqaa-roll-on`: product landing page for `نقاء`.
- `/about`: about us.
- `/contact`: contact us.
- `/thank-you`: confirmation page after successful order.
- `/privacy`, `/terms`, `/shipping`, `/refund-policy`: trust/legal pages.

Backend routes:
- `GET /health`
- `POST /orders`
- `POST /analytics/events`
- `POST /webhooks/sheets/test` optional admin-only test endpoint.

## Header

RTL layout. User requested the logo area at the right:
- Right side: circular brand icon with `N` inside using primary brand color.
- Next to it: Arabic text logo `للجمال رياض`.
- Below or under text in smaller Latin: `riads`.
- Menu links.
- Cart button with item count.

Desktop order:
1. Logo at right.
2. Navigation center.
3. Cart / contact CTA at left.

Mobile:
1. Logo right.
2. Cart icon left.
3. Menu drawer.
4. Sticky bottom CTA on product pages.

## Home Page Structure

1. Hero:
   - Arabic/Darija headline about premium Moroccan beauty confidence.
   - Subheadline covering hair, skin, freshness.
   - CTA: `اكتشفي الروتين ديالك`.
   - Secondary CTA: `شاهدي المنتجات`.
   - Hero image placeholder: premium arrangement of the 3 products.
   - Trust row: COD, Moroccan delivery, phone confirmation, best-value bundles.

2. Authority strip:
   - `اختيار مغربي`
   - `الدفع عند الاستلام`
   - `إرشادات استعمال واضحة`
   - `عروض باكات موفرة`

3. Problem/solution:
   - Talk about beauty routines failing when products are random.
   - Introduce Riads as a curated house.

4. Three-product system:
   - Product cards for Jadr, Nour, Naqaa.
   - Each card includes heading, subheading, stars, offer preview, CTA.

5. Best-value bundle education:
   - Explain why 2 and 3 pieces increase consistency and save money.
   - Feature `349 DH / 3 pieces` as most chosen.

6. UGC/social proof section:
   - 3 video placeholders.
   - 6 review cards.
   - Cities: Casablanca, Rabat, Marrakech, Tangier, Fes, Agadir.

7. Ingredients/science teaser:
   - For each product, explain key ingredient categories and routine logic.
   - Keep non-medical.

8. How COD works:
   - Choose offer.
   - Enter name and phone.
   - Phone confirmation.
   - Pay at delivery.

9. FAQ:
   - Delivery, COD, phone confirmation, usage, bundle, returns.

10. Final CTA:
   - `اختاري الروتين اللي مناسبك اليوم`.

## Collection Page

Purpose: make all three products feel like a system.

Sections:
- Collection hero: `روتين رياض للجمال اليومي`.
- Product cards.
- Comparison table:
  - Need.
  - Product.
  - Best for.
  - Recommended offer.
- Cross-routine bundle angle:
  - Hair + skin + freshness.
- Reviews and FAQ.

## Product Page Template

Every product page should be a landing page, not a basic PDP.

Sections:
1. Above the fold:
   - Product name.
   - Emotional headline.
   - 4.8/5 stars.
   - Short pain/result bullets.
   - Offer selector: 1, 2, 3 pieces.
   - CTA: add selected offer to cart and open cart drawer.
   - Product image placeholder.
   - Trust badges.

2. Pain mirror:
   - Speak to daily moments and insecurities.

3. Product mechanism:
   - Explain how the routine helps.

4. Ingredient/authority:
   - Use ingredient categories and science language.

5. How to use:
   - Clear steps.

6. Proof:
   - Reviews, UGC placeholders, city-based social proof.

7. Offer stack:
   - Re-show 1/2/3 piece offers.
   - Mark 3-piece as `الأكثر اختياراً`.

8. Cross-sell:
   - "Complete the Riads routine".

9. FAQ:
   - Product-specific.

10. Sticky CTA:
   - Mobile and desktop sticky bar after scroll.

## Cart Drawer

Cart drawer opens after every product CTA.

Must include:
- Selected items and quantities.
- Bundle savings label.
- Recommended cross-sells.
- Delivery/COD trust line.
- Scarcity line.
- CTA: `أكملي الطلب الآن`.

Cross-sell logic:
- If cart has `جدر`, recommend `نور` and `نقاء`.
- If cart has `نور`, recommend `جدر` and `نقاء`.
- If cart has `نقاء`, recommend `نور` and `جدر`.
- If cart has all three, recommend upgrading quantities to 2/3 where relevant.

## Checkout Popup

Triggered by cart CTA.

Fields:
- Full name.
- Moroccan phone number.

Validation:
- Accept Moroccan mobile numbers only.
- Normalize for storage and CAPI.
- Show inline error in Arabic/Darija.

Popup content:
- Order summary.
- Total.
- `الدفع عند الاستلام`.
- `غادي نتاصلو بك لتأكيد الطلب`.
- Scarcity line.
- Social proof mini-card.

On valid submit:
1. Create order in backend.
2. Fire browser purchase/lead events with event ID.
3. Backend sends CAPI events and Google Sheets webhook.
4. Show 10-15 second upsell modal.
5. Redirect to `/thank-you`.

## Upsell Modal

Duration: 10-15 seconds, with visible countdown.

Purpose:
- Increase AOV after commitment.
- Offer one relevant add-on before thank you.

Logic:
- Ordered `جدر`: upsell `نور` or `نقاء`.
- Ordered `نور`: upsell `نقاء`.
- Ordered `نقاء`: upsell `نور`.
- Ordered all three: upsell additional quantity or "gift second routine".

CTA:
- `زيديها للطلب قبل التأكيد النهائي`
- Secondary: `لا شكراً، كملي الطلب`

If accepted:
- Patch order with upsell item.
- Update sheets/backend order total.
- Fire upsell event.
- Then thank you page.

## Layout Direction

Use RTL globally for Arabic pages:
- `html dir="rtl" lang="ar-MA"`.
- Keep English `riads` in LTR spans when needed.

Alternating desktop sections:
- Section 1: text right, image left.
- Section 2: image right, text left.
- Section 3: text right, image left.

Mobile:
- Image first only when it helps product understanding.
- CTA should remain close to offer selector.
