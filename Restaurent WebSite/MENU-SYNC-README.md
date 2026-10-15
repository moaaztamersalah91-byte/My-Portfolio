# Taste House live menu and ordering

The customer menu subscribes in real time to Firestore `products`, `categories`, `offers`, and `meals`. Admin edits appear on customer pages as updates arrive. Products, offers, and meals can be placed in the customer cart; checkout re-reads the current item document and price inside a Firestore transaction before creating the order. Admin POS uses the same live item groups and revalidates current prices before saving.

The signed-in customer’s own orders, reservations, and messages also subscribe to Firestore. The dashboard subscribes to all 13 operational collections and shows a live connection status.

## Required before going live

Deploy `firebase/firestore.rules` to the configured Firebase project; verify the authorized admin UID, sign-in providers, and Authorized Domains. Test with both an admin account and a customer account. This source ZIP is not a deployment of the hosting site or Firestore rules. For production financial integrity, validate totals and prices on a trusted backend/Cloud Function and integrate a real payment provider before accepting online payments.
