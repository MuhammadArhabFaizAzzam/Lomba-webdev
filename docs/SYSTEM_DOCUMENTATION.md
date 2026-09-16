# ZENITH POS & RETAIL SUITE - ARBITER & AGENT GUIDELINES

## Project Overview
Zenith POS is a professional retail and UMKH business management suite built with Next.js (App Router), Tailwind CSS, and client-side `localStorage` persistence.

## Architecture & Core Modules
- **Authentication & RBAC (`app/ClientLayout.js`)**: Supports two user roles:
  - **Kasir**: Limited access to POS (`/pos`), Dashboard (`/`), and Transactions (`/transactions`). Restricted from Inventory (`/inventory`).
  - **Management**: Full access to all routes including Inventory and System Guide.
- **Inventory & Pricing (`app/inventory/page.js`)**:
  - Price inputs feature automated Indonesian thousand separator formatting (`.`).
  - Stock status logic threshold:
    - Stock = `0` → **Stok Kosong**
    - Stock `1–20` → **Stok Menipis**
    - Stock `≥ 21` → **Stok Normal**
- **POS & Cart (`app/pos/page.js`)**:
  - Cart list is non-scrollable internally (handled by page-level scrolling).
  - Thermal receipt generator modal with print support (`window.print()`).
- **Transactions & Export (`app/transactions/page.js`)**:
  - Excel-compatible CSV export featuring UTF-8 BOM (`\uFEFF`) and quote escaping.
