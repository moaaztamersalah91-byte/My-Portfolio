# Dashboard simplification report — October 14, 2026

Removed the retired `admin/` directory and its redirect-only page files, plus unused legacy dashboard scripts/styles (`js/admin-legacy.js`, `js/admin.js`, `css/admin-refresh.css`, `css/command-center.css`). Dashboard navigation and rendering now expose exactly seven sections: Overview, Menu, Orders, Inventory, Reservations, Settings, and Customers. Point-of-sale order creation is embedded inside Orders; the sales summary is part of Overview; and inventory sub-tools stay inside Inventory. The old login-page shortcut now opens the protected `os/index.html` dashboard directly. Customer-facing website pages were intentionally retained.

This cleanup does not assert that a live Firebase sign-in or browser end-to-end test has been performed.
