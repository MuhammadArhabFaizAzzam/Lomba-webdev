'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Key, ShieldCheck, UserCheck, ArrowRight, Lock } from 'lucide-react';

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
    <div className="relative min-h-screen bg-[#08090C] flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* Subtle Architectural Dot Matrix & Ambient Vignette */}
      <div className="zenith-bg-grid pointer-events-none absolute inset-0 opacity-60" />
      <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-96 w-[600px] rounded-full bg-emerald-500/[0.06] blur-[120px]" />

      <div className="spotlight-card relative z-10 bg-[#0D1016]/95 backdrop-blur-2xl rounded-3xl shadow-[0_32px_80px_-20px_rgba(0,0,0,0.85),0_1px_0_0_rgba(255,255,255,0.1)_inset] border border-white/[0.1] max-w-md w-full p-8 md:p-10 overflow-hidden">
        <div className="flex items-center space-x-3.5 mb-8">
          <div className="w-11 h-11 rounded-2xl bg-[#141820] border border-white/15 flex items-center justify-center text-emerald-400 font-extrabold text-lg shadow-[inset_0_1px_0_rgba(255,255,255,0.15)]">
            Z
          </div>
          <div>
            <div className="inline-flex items-center gap-1.5 font-mono text-[10px] font-medium uppercase tracking-[0.16em] text-slate-400 mb-0.5">
              <Lock size={10} className="text-emerald-400" /> Otorisasi Sesi
            </div>
            <h1 className="text-xl font-bold text-white tracking-tight">Masuk ke Zenith POS</h1>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-300 text-xs font-medium animate-fadeIn">
            {error}
          </div>
        )}

        <form onSubmit={handleLoginSubmit} className="space-y-4">
          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Username
            </label>
            <input
              type="text"
              autoComplete="username"
              required
              placeholder="kasir atau management"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 bg-[#08090C] font-medium text-white placeholder:text-slate-600 transition"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-300 uppercase tracking-wider mb-2">
              Password
            </label>
            <input
              type="password"
              autoComplete="current-password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-white/[0.09] text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/15 bg-[#08090C] font-medium text-white placeholder:text-slate-600 transition"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs shadow-lg shadow-emerald-500/20 transition flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {loading ? (
                <span>Memverifikasi...</span>
              ) : (
                <span>Masuk ke Workspace &rarr;</span>
              )}
            </button>
          </div>

          <div className="pt-4">
            <div className="p-4 bg-[#08090C] rounded-2xl border border-white/[0.07] text-xs text-slate-400 space-y-2.5">
              <p className="font-mono text-[10px] uppercase tracking-wider text-slate-400 flex items-center gap-1.5 mb-2">
                <Key size={12} className="text-emerald-400" />
                <span>Pilih Peran Akses Cepat:</span>
              </p>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('kasir', 'kasir123', 'kasir', 'Kasir Staff')}
                className="w-full flex justify-between items-center bg-[#11141B] hover:bg-white/[0.06] p-3 rounded-xl border border-white/[0.07] hover:border-white/20 transition-all duration-200 text-left group"
              >
                <span className="flex items-center gap-2.5 font-medium text-slate-200 group-hover:text-white">
                  <UserCheck size={14} className="text-emerald-400" />
                  <span>Staf Kasir</span>
                </span>
                <code className="font-mono text-[11px] text-slate-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                  <span>kasir / kasir123</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </code>
              </button>
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('management', 'admin123', 'management', 'Management Admin')}
                className="w-full flex justify-between items-center bg-[#11141B] hover:bg-white/[0.06] p-3 rounded-xl border border-white/[0.07] hover:border-white/20 transition-all duration-200 text-left group"
              >
                <span className="flex items-center gap-2.5 font-medium text-slate-200 group-hover:text-white">
                  <ShieldCheck size={14} className="text-amber-400" />
                  <span>Administrator</span>
                </span>
                <code className="font-mono text-[11px] text-slate-400 group-hover:text-emerald-300 flex items-center gap-1.5">
                  <span>management / admin123</span>
                  <ArrowRight size={12} className="transition-transform group-hover:translate-x-0.5" />
                </code>
              </button>
            </div>
          </div>
        </form>

        <div className="mt-7 pt-5 border-t border-white/[0.07] text-center">
          <Link href="/welcome" className="text-xs font-medium text-slate-400 hover:text-white transition">
            &larr; Kembali ke Beranda
          </Link>
        </div>
      </div>
    </div>
  );
}
