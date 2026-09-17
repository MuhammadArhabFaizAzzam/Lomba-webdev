'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  BarChart3,
  CreditCard,
  House,
  Package,
  ReceiptText,
  Settings,
  ShoppingCart,
  Bell,
  Menu,
  X,
  LayoutGrid,
} from 'lucide-react';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Beranda', href: '/welcome', icon: House },
    { name: 'Dashboard Bisnis', href: '/', icon: LayoutGrid },
    { name: 'Kasir (POS)', href: '/pos', icon: ShoppingCart },
    { name: 'Riwayat Transaksi', href: '/transactions', icon: ReceiptText },
    { name: 'Manajemen Stok', href: '/inventory', icon: Package },
  ];

  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-header">
          <div className="brand-stack">
            <div className="brand-mark">Z</div>
            <div>
              <div className="brand-title">Zenith POS</div>
              <div className="brand-subtitle">Retail & Business Hub</div>
            </div>
          </div>
        </div>

        <nav className="side-nav">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">Zenith POS v2.0 • Professional Suite</div>
      </aside>

      <main className="app-main">
        <header className="topbar">
          <div className="topbar-title">Sistem Operasional &amp; Kasir Ritel Profesional</div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button className="pill-button" aria-label="Notifikasi" type="button">
              <Bell size={14} />
            </button>
            <button className="pill-button" aria-label="Pengaturan" type="button">
              <Settings size={14} />
            </button>
            <span className="topbar-status">
              <span className="status-dot" />
              Sistem Aktif &amp; Terhubung
            </span>
          </div>
        </header>

        <div className="page-shell">{children}</div>
      </main>
    </div>
  );
}
