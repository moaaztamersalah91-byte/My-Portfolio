# Taste House — bilingual catalog and translation notes

## Bilingual labels

The public site and Dashboard provide Arabic/English labels for the main navigation, forms, order status, fulfillment type, category names, prices, empty states, common validation errors, buttons, and accessibility labels. Currency labels display EGP in English and ج.م in Arabic. The Dashboard form schema labels are translated when Arabic is selected rather than showing mixed Arabic/English field names.

## Catalog names and descriptions

Menu editors accept a product name in Arabic or English and provide editable fields for both languages. The built-in suggestion button uses a small, curated food glossary and only fills known, reviewed pairs. It does not pretend to automatically translate any arbitrary product name or description; new menu content should be reviewed in both languages before publishing, or connected to a real translation service through a secured endpoint.

## Real-time data

The customer-facing menu listens to Firestore changes for products, categories, offers, and meals. Customer orders, reservations, messages, and profile data are also subscribed live when the customer is signed in. The Dashboard subscribes to all operational collections listed in `README.md`. Cart contents, favorites, theme, and language preferences remain local to the browser by design.

## Required verification

A valid Firebase configuration, deployed Firestore rules, enabled Authentication providers, and authorized hosting domains are required. Static checks do not prove that the deployed Firebase project is accessible; test with a real administrator and separate customer account before launch. No live credentials or Firebase Console session were available during this edit.
