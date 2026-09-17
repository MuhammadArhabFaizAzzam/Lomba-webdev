<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Zenith POS Architecture & Agent Guidelines

Refer to `docs/SYSTEM_DOCUMENTATION.md` for complete architecture details regarding Role-Based Access Control (RBAC), Inventory stock thresholds, price input formatting, CSV export, and thermal receipt printing.

## Key Engineering Rules & Recent Fixes
1. **Product ID Integrity & Normalization:** On mount, `inventory/page.js` normalizes stored products, ensuring missing or duplicate IDs are repaired and deduplicated with unique collision-safe identifiers before writing back to `zenith_products` and `umkm_products`.
2. **Kasir Dashboard Access:** Authenticated Kasir users are permitted to view the Dashboard Business page (`/`) while maintaining strict redirection / access-denied toast guards for `/inventory` and `/guide`.
3. **Checkout Payment Reset:** Successfully completed POS checkouts automatically reset the selected payment method back to `QRIS` for subsequent transactions.


