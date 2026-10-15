# Taste House Dashboard — simplified structure

## Main navigation
The administrator dashboard now contains exactly seven sections: **Overview, Menu, Orders, Inventory, Reservations, Settings, and Customers**. The sidebar and dashboard routing have been reduced to those seven sections. The old `/admin/*.html` redirect pages and the unused legacy dashboard scripts/styles were removed from this project. The customer-facing website pages were left in place because they are part of the restaurant website, not extra dashboard pages.

## Where tools live
- **Overview:** completed sales, order and reservation counts, recent orders, low-stock alerts, and recorded-expense summary.
- **Menu:** products, categories, offers, and meals in one place.
- **Orders:** create orders in an inline form, search/filter orders, move orders through New → Preparing → Ready → Completed, cancel orders, and print invoices. Delivery details appear with the order.
- **Inventory:** ingredients, recipes, suppliers, and purchases. Receiving a purchase updates stock once.
- **Reservations:** confirm or cancel table bookings.
- **Settings:** admin account, appearance, language, sign out, and an optional area for managing recorded expenses.
- **Customers:** customer details and contact messages/replies.

## Real-time synchronization
All 13 dashboard collections use Firestore `onSnapshot` listeners, with connection state shown in the header. Realtime updates refresh the current view without destroying an actively edited form or in-progress POS order. Customer-facing product/category/offer/meal feeds and each customer’s own order, reservation, and message feeds also use Firestore listeners.

## Implementation
Implemented: Firebase administrator gating; Firestore collection reads; CRUD for menu, ingredient, recipe, supplier, purchase, and expense records; compressed Base64 WebP upload on products; inline POS order creation; order status transitions; once-only recipe stock deduction on New → Preparing; purchase receipt transaction; reservation status controls; customer/message list and admin reply; printable order invoice; Overview metrics; theme/language toggle; logout.

## Limitations and setup
Cart/favorites and theme/language preferences remain browser-local by design; operational catalog, order, inventory, reservation, customer, and message data use Firestore. The site still requires final production verification. Verify Firebase Authentication providers, authorized domains, Firestore rules, and the administrator UID before use. Order pricing/creation should be validated by a trusted server endpoint before taking real payments. No live Firebase sign-in, emulator, or browser end-to-end test was run during this edit.
