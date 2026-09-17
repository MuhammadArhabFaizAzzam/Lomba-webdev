'use client';

import Link from 'next/link';
import { ArrowRight, BarChart3, Package, ShoppingCart, Sparkles } from 'lucide-react';

const destinations = [
  {
    href: '/',
    label: 'Dashboard Bisnis',
    description: 'Pantau pendapatan, transaksi, dan kesehatan stok dari satu ruang kendali.',
    icon: BarChart3,
    accent: 'violet',
    action: 'Masuk Dashboard',
  },
  {
    href: '/pos',
    label: 'Kasir (POS)',
    description: 'Layani transaksi dengan katalog cepat, keranjang ringkas, dan checkout yang jelas.',
    icon: ShoppingCart,
    accent: 'teal',
    action: 'Buka Kasir POS',
  },
  {
    href: '/inventory',
    label: 'Manajemen Stok',
    description: 'Kelola produk, harga, dan ketersediaan barang dengan kontrol yang sederhana.',
    icon: Package,
    accent: 'blue',
    action: 'Kelola Stok',
  },
];

export default function WelcomePage() {
  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <span className="eyebrow"><Sparkles size={14} /> Next-generation retail workspace</span>
        <h1>Operasional bisnis yang <span>lebih jernih</span>, setiap hari.</h1>
        <p>
          Zenith POS menyatukan kasir, inventaris, dan insight penjualan dalam satu ruang kerja yang cepat,
          tenang, dan siap dipakai tim retail.
        </p>
        <div className="welcome-actions">
          <Link href="/pos" className="btn-primary">Mulai dari Kasir <ArrowRight size={16} /></Link>
          <Link href="/" className="btn-secondary">Lihat Dashboard</Link>
        </div>
      </section>

      <section className="welcome-grid">
        {destinations.map(({ href, label, description, icon: Icon, accent, action }) => (
          <Link href={href} key={label} className={`welcome-card ${accent}`}>
            <span className="welcome-icon"><Icon size={22} /></span>
            <div>
              <h2>{label}</h2>
              <p>{description}</p>
            </div>
            <span className="welcome-card-action">{action} <ArrowRight size={15} /></span>
          </Link>
        ))}
      </section>

      <div className="welcome-footer">
        <span>Zenith POS v2.0</span>
        <span>•</span>
        <span>Retail &amp; Business Hub</span>
        <span>•</span>
        <span>Built for focused operations</span>
      </div>
    </div>
  );
}
