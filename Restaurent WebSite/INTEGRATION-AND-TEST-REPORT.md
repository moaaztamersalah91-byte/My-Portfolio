# Taste House — dashboard and customer integration notes

## Dashboard structure

The admin interface exposes exactly seven sections: **Overview, Menu, Orders, Inventory, Reservations, Settings, and Customers**. Order creation is embedded inside Orders, sales/expense summary is embedded into Overview, inventory sub-tools stay inside Inventory, and contact messages are managed from Customers. The old redirect-only `admin/*.html` stubs and unused legacy admin scripts/styles were removed. Customer-facing pages remain because they belong to the restaurant website rather than the admin dashboard.

## Existing data paths

- Public menu and categories can subscribe to Firestore (`products`, `categories`), including Base64 images, prices, availability and edits.
- Customer sign-in and orders/reservation/message/profile writes use Firebase Authentication and Firestore when configured.
- The administrator workspace loads orders, messages and reservations and listens to live changes. Staff can update order and reservation status and reply to messages. Recipe stock is deducted transactionally when an order enters Preparing; purchase receipt updates stock once.
- Firestore rules scope customer data and allow administrator access through the configured UID. Firebase Storage is not used; product images are stored as compressed WebP/Base64.

## Setup required

1. Deploy `firebase/firestore.rules` to Firebase project `restaurant-32c36`.
2. Enable Google and Email/Password under Authentication; authorize the live hosting domain, `localhost`, and `127.0.0.1` as applicable.
3. Run from Live Server or an HTTP host, not `file://`.
4. Test admin and customer accounts separately and verify the live Firestore rules and data flow before production.

## Live sync update

The dashboard now attaches Firestore realtime listeners to all 13 operational collections instead of listening only to orders, messages, and reservations. A header indicator reflects live connection state and surfaces collection listener errors; UI re-rendering is deferred while Dashboard users edit a form or create an order. On the public site, live updates preserve input values while rerendering. The public menu subscribes to products, categories, offers, and meals; each customer’s orders, reservations, messages, and profile subscribe through `customer-live.js`. The profile document is now stored separately from the `saveProfile` method so a live snapshot cannot replace the save operation. Checkout and admin POS both re-read selected item prices in Firestore transactions before order creation.

## Checks run for this edit

- JavaScript syntax check for the modified dashboard script: PASS (after the live-sync update).
- JavaScript syntax check for customer script after the dashboard-link update: PASS.
- Dashboard module/static-reference checks and ZIP integrity check: PASS.

## Limitations and outstanding work

Firebase console access was not available, so actual sign-in, Firestore rule deployment, and end-to-end live-browser tests were not run. The ZIP contains live subscription code but is not itself a deployed hosting release. A browser-created order still includes client-supplied item prices and total; do not treat totals as authoritative for real financial reporting until order creation/pricing is validated by a trusted server endpoint. Offers and meals are now included in the live customer menu and order flow. Delivery dispatch and real online payments are not production-complete. Simulated card/wallet choices were removed from the POS; cash is the only active payment method until a payment provider is integrated.

## Visual and translation polish (October 14, 2026)

- Improved Dashboard hierarchy, spacing, hover/focus states, mobile layout, and premium surfaces while retaining the existing warm neutral, coral, dark-sidebar, and gold accent palette.
- Added an always-available New order shortcut in the Dashboard header.
- Localized Dashboard/customer-site order statuses, fulfillment types, prices, form labels, common error messages, document titles, accessibility labels, and customer-facing live-feed feedback.
- Added a small Live menu indicator and visible connection error feedback on the customer site.
- Shared the Arabic/English language preference between customer pages and the Dashboard across same-origin tabs; cart, favorites and theme remain browser-local by design.
- Corrected customer-profile state handling and made live refreshes preserve form values and menu filters.
- Static syntax and packaging checks passed; live Firebase authentication, production rules, and end-to-end browser sync still require verification on the configured deployment.
