'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Users, UserPlus, Award, Phone, Mail, ShoppingBag, ArrowLeft, Trash2, Edit3, CheckCircle2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { readStoredArray, writeStoredArray, normalizeNonNegativeNumber } from '../utils/storage';

export default function CustomersPage() {
  const [customers, setCustomers] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [tier, setTier] = useState('Bronze');
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const loaded = readStoredArray('zenith_customers');
    if (loaded.length === 0) {
      // Default demo customers
      const defaults = [
        { id: 'CUST-1', name: 'Budi Santoso', phone: '081234567890', email: 'budi@gmail.com', points: 150, tier: 'Gold', totalSpent: 1250000 },
        { id: 'CUST-2', name: 'Siti Aminah', phone: '081987654321', email: 'siti@yahoo.com', points: 80, tier: 'Silver', totalSpent: 650000 },
        { id: 'CUST-3', name: 'Ahmad Fauzi', phone: '085611223344', email: 'fauzi@gmail.com', points: 20, tier: 'Bronze', totalSpent: 180000 },
      ];
      writeStoredArray('zenith_customers', defaults);
      setCustomers(defaults);
    } else {
      setCustomers(loaded);
    }
  }, []);

  const handleSaveCustomer = (e) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) {
      showToast('Nama dan nomor HP wajib diisi!');
      return;
    }

    if (editingCustomer) {
      const updated = customers.map(c => c.id === editingCustomer.id ? { ...c, name, phone, email, tier } : c);
      setCustomers(updated);
      writeStoredArray('zenith_customers', updated);
      showToast('Data pelanggan berhasil diperbarui!');
    } else {
      const newCust = {
        id: `CUST-${Date.now()}`,
        name: name.trim(),
        phone: phone.trim(),
        email: email.trim() || '-',
        points: 0,
        tier,
        totalSpent: 0,
      };
      const updated = [newCust, ...customers];
      setCustomers(updated);
      writeStoredArray('zenith_customers', updated);
      showToast('Pelanggan baru berhasil ditambahkan!');
    }

    setName('');
    setPhone('');
    setEmail('');
    setTier('Bronze');
    setEditingCustomer(null);
    setShowAddModal(false);
  };

  const handleEdit = (c) => {
    setEditingCustomer(c);
    setName(c.name);
    setPhone(c.phone);
    setEmail(c.email === '-' ? '' : c.email);
    setTier(c.tier || 'Bronze');
    setShowAddModal(true);
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus pelanggan ini dari database CRM?')) {
      const updated = customers.filter(c => c.id !== id);
      setCustomers(updated);
      writeStoredArray('zenith_customers', updated);
      showToast('Pelanggan berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6 text-slate-100">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B1222] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">CRM & Member Loyalty</span>
          <h1 className="text-2xl font-black text-white mt-1">Manajemen Pelanggan</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola data member, poin loyalitas, tier diskon, dan riwayat belanja pelanggan.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => {
              setEditingCustomer(null);
              setName('');
              setPhone('');
              setEmail('');
              setTier('Bronze');
              setShowAddModal(true);
            }}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
          >
            <UserPlus size={16} />
            <span>Tambah Pelanggan Baru</span>
          </button>
        </div>
      </div>

      {/* Customer List Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {customers.map((c) => (
          <div key={c.id} className="bg-[#0B1222] border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between hover:border-slate-700 transition">
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-white text-base">{c.name}</h3>
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center space-x-1">
                    <Phone size={12} className="text-emerald-400" />
                    <span>{c.phone}</span>
                  </p>
                </div>
                <span className={`px-2.5 py-1 rounded-lg text-[10px] font-extrabold uppercase ${
                  c.tier === 'Gold' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                  c.tier === 'Silver' ? 'bg-slate-300/20 text-slate-200 border border-slate-300/30' :
                  'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
                }`}>
                  {c.tier} Member
                </span>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800 grid grid-cols-2 gap-3 text-xs">
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Poin Loyalitas</span>
                  <span className="font-bold text-amber-400 flex items-center space-x-1 mt-0.5">
                    <Award size={14} />
                    <span>{c.points} Poin</span>
                  </span>
                </div>
                <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-[10px] text-slate-400 block">Total Belanja</span>
                  <span className="font-bold text-emerald-400 mt-0.5 block">{formatRupiah(c.totalSpent || 0)}</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 truncate max-w-[150px]">{c.email}</span>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleEdit(c)}
                  className="p-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition"
                  title="Edit Pelanggan"
                >
                  <Edit3 size={14} />
                </button>
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 bg-rose-950/60 hover:bg-rose-900 text-rose-300 rounded-lg transition"
                  title="Hapus Pelanggan"
                >
                  <Trash2 size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1222] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">
              {editingCustomer ? 'Edit Pelanggan' : 'Tambah Pelanggan Baru'}
            </h3>
            <p className="text-xs text-slate-400 mb-5">Masukkan informasi kontak dan tier member loyalitas.</p>

            <form onSubmit={handleSaveCustomer} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Rina Wijaya"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nomor WhatsApp / HP *</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: 08123456789"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Email (Opsional)</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: rina@gmail.com"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Tier Member</label>
                <select
                  value={tier}
                  onChange={(e) => setTier(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Bronze">Bronze (Standard)</option>
                  <option value="Silver">Silver (Diskon 3%)</option>
                  <option value="Gold">Gold (Diskon 5% + Priority)</option>
                </select>
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg shadow-emerald-600/20"
                >
                  {editingCustomer ? 'Simpan Perubahan' : 'Tambah Pelanggan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
