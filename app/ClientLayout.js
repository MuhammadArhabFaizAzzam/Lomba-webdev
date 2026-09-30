'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  BookOpen,
  Home,
  LogOut,
  ShieldCheck,
  UserCheck,
  Menu,
  X,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { readStoredArray, normalizeProduct } from './utils/storage';

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);
  const [lowStockCount, setLowStockCount] = useState(0);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const syncAuth = () => {
    const savedUser = localStorage.getItem('zenith_auth_user');
    if (savedUser) {
      try {
        const parsed = JSON.parse(savedUser);
        if (parsed && parsed.username && parsed.role) {
          setUser(parsed);
          setIsInitialized(true);
          return parsed;
        }
      } catch (e) {
        // ignore parse error
      }
    }
    setUser(null);
    setIsInitialized(true);
    return null;
  };

  const updateLowStockCount = () => {
    try {
      const products = readStoredArray('products').map(normalizeProduct);
      const low = products.filter(p => p.stock <= 20).length;
      setLowStockCount(low);
    } catch (e) {
      setLowStockCount(0);
    }
  };

  useEffect(() => {
    syncAuth();
    updateLowStockCount();

    const handleAuthUpdate = () => {
      syncAuth();
      updateLowStockCount();
    };

    window.addEventListener('zenith_auth_update', handleAuthUpdate);
    window.addEventListener('storage', handleAuthUpdate);

    return () => {
      window.removeEventListener('zenith_auth_update', handleAuthUpdate);
      window.removeEventListener('storage', handleAuthUpdate);
    };
  }, []);

  // Synchronize auth state on route changes
  useEffect(() => {
    syncAuth();
    updateLowStockCount();
  }, [pathname]);

  // Route Guards & Guest / Authenticated Redirection Rules
  useEffect(() => {
    if (!isInitialized) return;

    const freshUser = syncAuth();
    const protectedPaths = ['/pos', '/transactions', '/inventory', '/guide'];
    const guestOnlyPaths = ['/welcome', '/login'];

    if (pathname === '/') {
      if (!freshUser) {
        router.push('/welcome');
        return;
      }
    }

    if (!freshUser && protectedPaths.includes(pathname)) {
      showToast('Akses Ditolak! Silakan login terlebih dahulu untuk mengakses halaman ini.');
      router.push('/login');
      return;
    }

    if (freshUser && guestOnlyPaths.includes(pathname)) {
      if (freshUser.role === 'kasir') {
        router.push('/pos');
      } else {
        router.push('/');
      }
      return;
    }

    if (freshUser && freshUser.role === 'kasir') {
      const kasirAllowed = ['/', '/welcome', '/pos', '/transactions'];
      if (!kasirAllowed.includes(pathname)) {
        showToast('Akses Ditolak! Kasir tidak memiliki izin untuk mengakses Manajemen Stok atau Panduan.');
        router.push('/pos');
      }
    }
  }, [pathname, router, isInitialized]);

  const handleLogout = () => {
    localStorage.removeItem('zenith_auth_user');
    setUser(null);
    window.dispatchEvent(new Event('zenith_auth_update'));
    showToast('Berhasil keluar dari sesi.');
    router.push('/welcome');
  };

  // Grouped Navigation separated for Admin (Management) vs Kasir
  const navigationSections = useMemo(() => {
    if (!user) return [];

    if (user.role === 'management') {
      // Admin / Management Full Navigation
      return [
        {
          title: 'ANALITIK & MONITORING',
          items: [
            {
              name: 'Dashboard Bisnis',
              href: '/',
              icon: LayoutDashboard,
              description: 'Statistik & grafik pendapatan',
            },
            {
              name: 'Riwayat Transaksi',
              href: '/transactions',
              icon: Receipt,
              description: 'Rekap penjualan & export CSV',
            },
          ],
        },
        {
          title: 'OPERASIONAL TOKO',
          items: [
            {
              name: 'Kasir Point of Sale',
              href: '/pos',
              icon: ShoppingCart,
              description: 'Transaksi cepat & cetak struk',
            },
            {
              name: 'Manajemen Stok',
              href: '/inventory',
              icon: Package,
              badge: lowStockCount > 0 ? `${lowStockCount} Menipis` : null,
              badgeType: 'warning',
              description: 'Katalog produk & stok gudang',
            },
          ],
        },
        {
          title: 'SISTEM & INFORMASI',
          items: [
            {
              name: 'Panduan Sistem',
              href: '/guide',
              icon: BookOpen,
              description: 'Alur evaluasi fitur aplikasi',
            },
            {
              name: 'Halaman Beranda',
              href: '/welcome',
              icon: Home,
              description: 'Portal sambutan platform',
            },
          ],
        },
      ];
    } else {
      // Kasir Specialized Navigation
      return [
        {
          title: 'OPERASIONAL KASIR',
          items: [
            {
              name: 'Buka Kasir (POS)',
              href: '/pos',
              icon: ShoppingCart,
              highlight: true,
              description: 'Input pesanan & cetak nota',
            },
            {
              name: 'Riwayat Transaksi',
              href: '/transactions',
              icon: Receipt,
              description: 'Daftar transaksi penjualan',
            },
          ],
        },
        {
          title: 'INFORMASI UMUM',
          items: [
            {
              name: 'Dashboard Ringkas',
              href: '/',
              icon: LayoutDashboard,
              description: 'Ringkasan data operasional',
            },
            {
              name: 'Halaman Beranda',
              href: '/welcome',
              icon: Home,
              description: 'Portal informasi toko',
            },
          ],
        },
      ];
    }
  }, [user, lowStockCount]);

  if (!user && (pathname === '/welcome' || pathname === '/login')) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
        {toastMessage && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce flex items-center space-x-2">
            <span>🔔</span>
            <span>{toastMessage}</span>
          </div>
        )}
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans relative">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce flex items-center space-x-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-68 bg-[#090E1A] text-white flex-col shadow-2xl border-r border-slate-800/80 z-20 sticky top-0 h-screen overflow-y-auto select-none">
        {/* Brand Header */}
        <div className="p-5 border-b border-slate-800/80 bg-[#0B1222]/60">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 flex items-center justify-center font-black text-white text-lg shadow-lg shadow-indigo-500/25">
              Z
            </div>
            <div>
              <div className="font-extrabold text-base tracking-tight text-white flex items-center space-x-1.5">
                <span>Zenith POS</span>
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">PRO</span>
              </div>
              <div className="text-[11px] text-slate-400 font-medium">Digital Retail & POS Hub</div>
            </div>
          </div>
        </div>

        {/* Role Badge & User Profile Info */}
        {user && (
          <div className="p-4 border-b border-slate-800/60 bg-[#0D1527]/50">
            <div className={`p-3 rounded-xl border flex items-center justify-between ${
              user.role === 'management'
                ? 'bg-indigo-950/40 border-indigo-500/30 text-indigo-200'
                : 'bg-emerald-950/40 border-emerald-500/30 text-emerald-200'
            }`}>
              <div className="flex items-center space-x-2.5 min-w-0">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                  user.role === 'management' ? 'bg-indigo-600 text-white' : 'bg-emerald-600 text-white'
                }`}>
                  {user.role === 'management' ? <ShieldCheck size={16} /> : <UserCheck size={16} />}
                </div>
                <div className="truncate">
                  <div className="text-xs font-bold text-white truncate">{user.username}</div>
                  <div className="text-[10px] font-semibold tracking-wide uppercase opacity-80">
                    {user.role === 'management' ? 'Administrator' : 'Staf Kasir'}
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                title="Keluar dari akun"
                className="p-1.5 hover:bg-rose-900/60 text-slate-400 hover:text-rose-200 rounded-lg transition"
              >
                <LogOut size={14} />
              </button>
            </div>
          </div>
        )}

        {/* Grouped Navigation Links */}
        <nav className="flex-1 p-3.5 space-y-6">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center justify-between">
                <span>{section.title}</span>
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;

                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      className={`group flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-indigo-600 to-indigo-700 text-white shadow-md shadow-indigo-600/30 font-bold border border-indigo-400/30'
                          : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center space-x-3 truncate">
                        <Icon size={16} className={`shrink-0 transition-transform group-hover:scale-110 ${
                          isActive ? 'text-white' : 'text-slate-400 group-hover:text-indigo-400'
                        }`} />
                        <span className="truncate">{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="ml-2 px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-amber-500 text-slate-950 flex items-center space-x-1 shrink-0">
                          <AlertTriangle size={10} />
                          <span>{item.badge}</span>
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="p-4 border-t border-slate-800/80 bg-[#0B1222]/40 text-center">
          <div className="text-[11px] font-medium text-slate-400 flex items-center justify-center space-x-1">
            <Sparkles size={12} className="text-indigo-400" />
            <span>Zenith POS v2.0</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">SME Digital Transformation</div>
        </div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-[#090E1A] text-white p-4 flex items-center justify-between shadow-md z-20 border-b border-slate-800">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm shadow-md">
            Z
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">Zenith POS</span>
            <span className="text-[10px] text-indigo-400 uppercase font-semibold">
              {user ? (user.role === 'management' ? 'Admin' : 'Kasir') : ''}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {user && (
            <button
              onClick={handleLogout}
              className="px-2.5 py-1.5 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded-lg text-xs font-semibold"
            >
              Keluar
            </button>
          )}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="text-slate-300 hover:text-white p-2 rounded-lg bg-slate-800 text-xs font-semibold"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu with Grouped Sections */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#090E1A] text-white border-t border-slate-800 p-4 space-y-4 shadow-xl z-20 max-h-[80vh] overflow-y-auto">
          {navigationSections.map((section, idx) => (
            <div key={idx} className="space-y-1.5">
              <div className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {section.title}
              </div>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive ? 'bg-indigo-600 text-white font-bold' : 'text-slate-300 hover:bg-slate-800'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon size={16} />
                        <span>{item.name}</span>
                      </div>
                      {item.badge && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-500 text-slate-950">
                          {item.badge}
                        </span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-3.5 hidden md:flex items-center justify-between shadow-xs z-10 sticky top-0">
          <div className="text-xs font-medium text-slate-600 flex items-center space-x-2">
            <span>Sesi Aktif:</span>
            {user && (
              <>
                <span className="font-bold text-slate-900">{user.username}</span>
                <span className={`px-2 py-0.5 rounded text-[11px] font-bold uppercase ${
                  user.role === 'management'
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                }`}>
                  {user.role === 'management' ? 'Administrator' : 'Kasir'}
                </span>
              </>
            )}
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse"></span>
              Sistem Aktif & Terhubung
            </span>
            {user && (
              <button
                onClick={handleLogout}
                className="text-xs font-semibold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 px-3 py-1.5 rounded-lg transition"
              >
                Keluar (Logout)
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 p-6 md:p-10 lg:p-12 max-w-7xl 2xl:max-w-[1700px] w-full mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
