# ZENITH POS & RETAIL SUITE - ARCHITECTURE & AGENT GUIDELINES

## Project Overview
Zenith POS is an end-to-end retail and UMKM business management suite built with Next.js (App Router), Tailwind CSS, and client-side `localStorage` persistence.

## Architecture & Core Modules
- **Authentication & RBAC (`app/ClientLayout.js`)**: Supports two user roles:
  - **Kasir**: Operational access to POS (`/pos`), Dashboard (`/`), Transactions (`/transactions`), and Welcome (`/welcome`).
  - **Management (Admin)**: Full access to all routes including Inventory (`/inventory`), KDS (`/kds`), CRM Customers (`/customers`), Suppliers & PO (`/suppliers`), and System Guide (`/guide`).
- **Inventory, Presets & Pricing (`app/inventory/page.js`)**:
  - Price and cost (HPP) inputs feature automated Indonesian thousand separator formatting (`.`).
  - Built-in retail presets and custom user-saved presets (`zenith_presets`).
  - Stock status logic threshold (`LOW_STOCK_MAX = 20`):
    - Stock = `0` → **Stok Kosong**
    - Stock `1–20` → **Stok Menipis**
    - Stock `≥ 21` → **Stok Normal**
- **POS, Shift Register & Dynamic QRIS (`app/pos/page.js`)**:
  - Cashier shift opening & closing reconciliation with printable shift report.
  - Barcode scanner simulator, CRM member discount tiers, PPN 11% & Service 5% toggles.
  - Dynamic QRIS gateway sandbox with countdown timer, webhook paid simulation, and pending admin verification mode.
  - Thermal receipt generator modal (58mm / 80mm) with print support (`window.print()`).
- **Kitchen Display System (`app/kds/page.js`)**:
  - Real-time order queue (`PENDING` → `COOKING` → `READY` → `COMPLETED`) synced with POS and Returns.
- **CRM & Loyalty (`app/customers/page.js`)**:
  - Member tiers (`Bronze`, `Silver` 3% discount, `Gold` 5% discount) with automatic loyalty point accrual and tier upgrades.
- **Suppliers & Purchase Orders (`app/suppliers/page.js`)**:
  - Vendor directory and Purchase Order (PO) creation & receiving workflow that automatically increments product inventory.
- **Transactions, Returns & CSV Export (`app/transactions/page.js`)**:
  - Full financial log, admin payment confirmation (`Tandai Lunas`), item return (`Retur`) with automatic stock restoration, and UTF-8 BOM (`\uFEFF`) Excel-compatible CSV export.
