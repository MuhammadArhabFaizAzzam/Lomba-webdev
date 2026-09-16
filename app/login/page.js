'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-xl border border-slate-200 max-w-md w-full p-8 md:p-10">
        <div className="flex items-center space-x-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-indigo-600/30">
            Z
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Login Zenith POS</h1>
            <p className="text-xs text-slate-500 font-medium">Masukkan credential yang valid untuk masuk</p>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-5">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              required
              placeholder="Contoh: kasir atau management"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium text-slate-900 transition"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium text-slate-900 transition"
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/80 text-xs text-slate-600 space-y-1.5">
            <p className="font-bold text-slate-900">📌 Demo Credentials:</p>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
              <span className="font-medium text-slate-700">Kasir:</span>
              <code className="font-mono text-indigo-600 font-bold">kasir / kasir123</code>
            </div>
            <div className="flex justify-between items-center bg-white p-2 rounded border border-slate-200">
              <span className="font-medium text-slate-700">Management:</span>
              <code className="font-mono text-indigo-600 font-bold">management / admin123</code>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-600/30 transition flex items-center justify-center space-x-2 disabled:opacity-50"
          >
            {loading ? (
              <span>Memproses...</span>
            ) : (
              <span>Masuk Sistem &rarr;</span>
            )}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <Link href="/" className="text-xs font-semibold text-slate-600 hover:text-indigo-600 transition">
            &larr; Kembali ke Dashboard Publik
          </Link>
        </div>
      </div>
    </div>
  );
}
