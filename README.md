# Zenith POS

Zenith POS is a Next.js App Router demo for Indonesian UMKM retail operations. It includes role-based demo access, inventory and presets, POS checkout, receipt printing, transaction search/CSV export, and a business dashboard.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Demo access

| Role | Username | Password |
| --- | --- | --- |
| Kasir | `kasir` | `kasir123` |
| Management | `management` | `admin123` |

These credentials are intentionally demo-only. Authentication and data currently live in browser `localStorage`; data is local to the browser and is not suitable for multi-user production deployment. The app keeps both `zenith_*` and legacy `umkm_*` storage keys for compatibility with existing demo data.

## Verification

```bash
npm run build
npm run lint
```

Both commands should pass before deployment.
