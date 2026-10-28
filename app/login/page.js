'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLoginSubmit = (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const u = username.trim().toLowerCase();
    const p = password;

    if (!u || !p) {
      setError('Username dan password wajib diisi!');
      setLoading(false);
      return;
    }

    // Strict Demo Credentials
    // Kasir: kasir / kasir123
    // Management: management / admin123
    let role = null;
    let displayName = '';

    if (u === 'kasir' && p === 'kasir123') {
      role = 'kasir';
      displayName = 'Kasir Staff';
    } else if (u === 'management' && p === 'admin123') {
      role = 'management';
      displayName = 'Management Admin';
    }

    if (!role) {
      setError('Username salah atau password salah.');
      setLoading(false);
      return;
    }

    const authUser = {
      username: displayName,
      role: role,
    };

    localStorage.setItem('zenith_auth_user', JSON.stringify(authUser));
    window.dispatchEvent(new Event('zenith_auth_update'));

    setLoading(false);
    if (role === 'kasir') {
      router.push('/pos');
    } else {
      router.push('/');
    }
  };

  const handleQuickDemoLogin = (demoUsername, demoPassword, demoRole, demoDisplayName) => {
    setUsername(demoUsername);
    setPassword(demoPassword);
    setError('');
    const authUser = {
      username: demoDisplayName,
      role: demoRole,
    };
    localStorage.setItem('zenith_auth_user', JSON.stringify(authUser));
    window.dispatchEvent(new Event('zenith_auth_update'));
    if (demoRole === 'kasir') {
      router.push('/pos');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="bg-[#121816] rounded-2xl shadow-xl border border-[#1e2a26] max-w-md w-full p-8 md:p-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-emerald-600/30">
            Z
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#f0fdf4] tracking-tight">Login Zenith POS</h1>
            <p className="text-xs text-[#94a3b8] font-medium">Masukkan credential yang valid untuk masuk</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-[#f0fdf4] uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              placeholder="Contoh: kasir atau management"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1e2a26] text-sm focus:outline-none focus:border-emerald-600 bg-[#0a0e0d] font-medium text-[#f0fdf4] transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#f0fdf4] uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-[#1e2a26] text-sm focus:outline-none focus:border-emerald-600 bg-[#0a0e0d] font-medium text-[#f0fdf4] transition"
            />
          </div>

          <div className="p-4 bg-[#0a0e0d] rounded-xl border border-[#1e2a26]/80 text-xs text-[#94a3b8] space-y-2">
            <p className="font-bold text-[#f0fdf4] flex items-center justify-between">
              <span className="flex items-center space-x-1.5">
                <Key size={14} className="text-emerald-300" />
                <span>Demo Credentials (Klik untuk Masuk Instan):</span>
              </span>
            </p>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('kasir', 'kasir123', 'kasir', 'Kasir Staff')}
              className="w-full flex justify-between items-center bg-[#121816] hover:bg-emerald-500/15 p-2.5 rounded-lg border border-[#1e2a26] hover:border-emerald-500 transition text-left group"
            >
              <span className="font-semibold text-[#f0fdf4] group-hover:text-emerald-300">Masuk sebagai Kasir:</span>
              <code className="font-mono text-emerald-300 font-bold">kasir / kasir123 &rarr;</code>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('management', 'admin123', 'management', 'Management Admin')}
              className="w-full flex justify-between items-center bg-[#121816] hover:bg-emerald-500/15 p-2.5 rounded-lg border border-[#1e2a26] hover:border-emerald-500 transition text-left group"
            >
              <span className="font-semibold text-[#f0fdf4] group-hover:text-emerald-300">Masuk sebagai Admin:</span>
              <code className="font-mono text-emerald-300 font-bold">management / admin123 &rarr;</code>
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-emerald-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <span>Masuk Sistem &rarr;</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-[#1e2a26] text-center">
          <Link href="/welcome" className="text-xs font-semibold text-[#94a3b8] hover:text-emerald-300 transition">
            &larr; Kembali ke Halaman Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
