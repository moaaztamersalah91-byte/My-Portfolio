# Taste House — restaurant website and admin dashboard

## Dashboard

The protected admin workspace is available at `os/index.html`. It contains exactly seven sections: **Overview, Menu, Orders, Inventory, Reservations, Settings, and Customers**.

- **Overview** shows sales, order and reservation totals, recent orders, low-stock alerts, and a recorded-expense summary.
- **Menu** manages products, categories, offers, and meals.
- **Orders** creates orders in-place, searches and filters orders, updates order progress, shows delivery details, and prints invoices.
- **Inventory** manages ingredients, recipes, suppliers, and purchases.
- **Reservations** lets administrators confirm or cancel bookings.
- **Settings** controls language/theme, account access, sign-out, and recorded expenses.
- **Customers** shows customer details and contact messages/replies.

The retired `admin/` redirect-only pages, legacy admin dashboard scripts, and related unused styles have been removed. The customer-facing website pages remain part of the project and are intentionally retained.

## Live data and synchronization

The dashboard now subscribes to Firestore in real time for all 13 operational collections (`categories`, `products`, `offers`, `meals`, `orders`, `ingredients`, `recipes`, `suppliers`, `purchases`, `expenses`, `customers`, `messages`, and `reservations`). Changes made by another signed-in admin session or by customer orders/reservations/messages are reflected in the dashboard as Firestore updates arrive. The customer site listens live to products, categories, offers, meals, and the signed-in customer’s own orders, reservations, and messages. Offers and meals can be ordered from the public menu; checkout re-reads the current Firestore prices before saving. Admin POS also reads current prices transactionally. The dashboard header shows whether the live listeners are synchronized, still connecting, offline, or reporting an error. When an editor or order form is actively being used, live data is collected without replacing the user’s in-progress form.

**Live sync only works after Firebase is configured and the rules are deployed.** This ZIP does not itself publish the website or deploy Firebase configuration.

## Firebase setup

The staging configuration targets Firebase project `restaurant-32c36`. Verify `firebase/config.js` and the administrator UID in `firebase/firestore.rules`, deploy the Firestore rules, enable Google and Email/Password providers, and authorize the local and production domains before testing sign-in. The client-side UID check is not a replacement for server-side Firestore rules.

## Important limitations

Cart, favorites, and theme preferences are stored locally in the browser. The language preference is shared between the customer site and Dashboard across tabs on the same origin; operational menu, offer, meal, order, inventory, reservation, customer profile, and message data is stored in Firestore. Customer profiles are created when a customer signs in and stay subscribed to live profile updates. The browser-side transaction protects against stale menu prices during normal use, but production financial totals must still be validated by a trusted server endpoint before accepting real payments. The source includes a Firebase Web configuration, but authenticated access to the Firebase console/deployment was not available to verify the live project or execute end-to-end tests. The POS exposes cash only until a real card/wallet payment provider is connected; it does not pretend electronic payment is live.

Run the site from Live Server or another HTTP host, not by opening the files with `file://`.
