'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const HomeIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
  </svg>
);

const DashboardIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const PosIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const TransactionsIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const InventoryIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
  </svg>
);

const GuideIcon = ({ className = '' }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
  </svg>
);

export default function ClientLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [toastMessage, setToastMessage] = useState('');
  const [isInitialized, setIsInitialized] = useState(false);

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

  useEffect(() => {
    syncAuth();

    const handleAuthUpdate = () => {
      syncAuth();
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
  }, [pathname]);

  // Route Guards & Guest / Authenticated Redirection Rules
  useEffect(() => {
    if (!isInitialized) return;

    const freshUser = syncAuth();
    const protectedPaths = ['/pos', '/transactions', '/inventory', '/guide'];
    const guestOnlyPaths = ['/welcome', '/login'];

    // 1. Root path '/' behavior:
    // If guest -> redirect to /welcome
    // If authenticated -> allow '/' (both management and kasir can view dashboard)
    if (pathname === '/') {
      if (!freshUser) {
        router.push('/welcome');
        return;
      }
    }

    // 2. Unauthenticated user trying to access protected routes -> redirect to /login
    if (!freshUser && protectedPaths.includes(pathname)) {
      showToast('Akses Ditolak! Silakan login terlebih dahulu untuk mengakses halaman ini.');
      router.push('/login');
      return;
    }

    // 3. Authenticated user trying to access guest-only paths (/welcome, /login) -> redirect to role destination
    if (freshUser && guestOnlyPaths.includes(pathname)) {
      if (freshUser.role === 'kasir') {
        router.push('/pos');
      } else {
        router.push('/');
      }
      return;
    }

    // 4. Kasir permission enforcement on inventory / guide
    if (freshUser && freshUser.role === 'kasir') {
      const kasirAllowed = ['/', '/welcome', '/pos', '/transactions'];
      if (!kasirAllowed.includes(pathname)) {
        showToast('Akses Ditolak! Kasir tidak memiliki izin untuk mengakses halaman Manajemen Stok / Panduan.');
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

  // Define navigation items based on user auth status and role
  const allNavigation = [
    {
<<<<<<< HEAD
      name: 'Beranda / Selamat Datang',
      href: '/welcome',
      roles: ['guest', 'kasir', 'management'],
      icon: HomeIcon,
    },
    {
      name: 'Dashboard Bisnis',
      href: '/',
      roles: ['guest', 'kasir', 'management'],
      icon: DashboardIcon,
=======
      name: 'Dashboard Bisnis',
      href: '/',
      roles: ['kasir', 'management'],
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
    },
    {
      name: 'Kasir (POS)',
      href: '/pos',
      roles: ['kasir', 'management'],
      icon: PosIcon,
    },
    {
      name: 'Riwayat Transaksi',
      href: '/transactions',
      roles: ['kasir', 'management'],
      icon: TransactionsIcon,
    },
    {
      name: 'Manajemen Stok',
      href: '/inventory',
      roles: ['management'],
      icon: InventoryIcon,
    },
    {
      name: 'Panduan Sistem',
      href: '/guide',
      roles: ['management'],
      icon: GuideIcon,
    },
  ];

  const currentRoleKey = user ? user.role : null;
  const navigation = user ? allNavigation.filter(item => item.roles.includes(currentRoleKey)) : [];

  // If user is not authenticated and viewing guest pages (/welcome or /login), render with light Zenith POS theme without sidebar
  if (!user && (pathname === '/welcome' || pathname === '/login')) {
    return (
      <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans relative">
        {/* Toast Notification */}
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

  // Authenticated Layout Shell
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row font-sans relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce flex items-center space-x-2">
          <span>🔔</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex md:w-64 bg-slate-900 text-white flex-col shadow-xl border-r border-slate-800 z-10">
        <div className="p-6 border-b border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center font-bold text-white text-lg shadow-md shadow-indigo-600/30">
              Z
            </div>
            <div>
              <div className="brand-title">Zenith POS</div>
              <div className="brand-subtitle">Retail & Business Hub</div>
            </div>
          </div>
        </div>

        {/* User Badge & Logout */}
        {user && (
          <div className="mx-4 mt-4 p-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center justify-between">
            <div className="truncate">
              <p className="text-xs font-bold text-white truncate">{user.username}</p>
              <p className="text-[10px] uppercase tracking-wider font-semibold text-indigo-400">
                Role: {user.role === 'kasir' ? 'Kasir' : 'Management'}
              </p>
            </div>
            <button
              onClick={handleLogout}
              title="Logout"
              className="px-2 py-1 bg-rose-900/60 hover:bg-rose-800 text-rose-200 rounded text-[11px] font-medium transition"
            >
              Keluar
            </button>
          </div>
        )}

        <nav className="flex-1 p-4 space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`nav-item ${isActive ? 'active' : ''}`}
              >
                <Icon className="nav-icon"/>
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="sidebar-footer">Zenith POS v2.0 • Professional Suite</div>
      </aside>

      {/* Mobile Top Navigation */}
      <div className="md:hidden bg-slate-900 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center font-bold text-white text-sm">
            Z
          </div>
          <div>
            <span className="font-bold text-base tracking-tight block">Zenith POS</span>
            <span className="text-[10px] text-indigo-400 uppercase">{user ? user.role : ''}</span>
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
            className="text-slate-300 hover:text-white focus:outline-none p-2 rounded-lg bg-slate-800 text-xs font-semibold"
          >
            {mobileMenuOpen ? 'Tutup' : 'Menu'}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-slate-900 text-white border-t border-slate-800 p-4 space-y-2 shadow-lg z-10">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium ${
                  isActive ? 'bg-indigo-600 text-white font-semibold' : 'text-slate-300 hover:bg-slate-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </div>
      )}

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-h-screen overflow-y-auto">
        <header className="bg-white border-b border-slate-200 px-8 py-4 hidden md:flex items-center justify-between shadow-xs z-0">
          <div className="text-sm font-medium text-slate-600 flex items-center space-x-2">
            <span>Login sebagai:</span>
            {user && (
              <>
                <span className="font-bold text-slate-900">{user.username}</span>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700 uppercase">
                  {user.role}
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
