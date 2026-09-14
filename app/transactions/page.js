'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');
    if (saved) {
      setTransactions(JSON.parse(saved));
    } else {
      setTransactions([]);
    }
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  const filteredTransactions = transactions.filter((tx) =>
    tx.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.items.toLowerCase().includes(searchTerm.toLowerCase()) ||
    tx.payment.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID Transaksi', 'Waktu', 'Detail Item', 'Metode Pembayaran', 'Total'];
    const rows = filteredTransactions.map(tx => [
      tx.id,
      tx.date,
      `"${tx.items.replace(/"/g, '""')}"`, // Escape quotes in item list
      tx.payment,
      tx.total
    ]);

    const csvContent = [
      headers.join(','),
      ...rows.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-transaksi-umkm-pro-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Riwayat Transaksi</h2>
          <p className="text-slate-500 text-sm font-normal">Daftar seluruh transaksi penjualan yang tercatat secara digital oleh sistem POS.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <button
            onClick={exportToCSV}
            disabled={filteredTransactions.length === 0}
            className="w-full sm:w-auto flex items-center justify-center space-x-2 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold rounded-xl shadow-md shadow-emerald-600/20 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            <span>Export CSV</span>
          </button>
          <input
            type="text"
            placeholder="Cari ID / Item / Metode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:w-64 px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-white"
          />
        </div>
      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">ID Transaksi</th>
                <th className="py-4 px-6 font-semibold">Waktu</th>
                <th className="py-4 px-6 font-semibold">Detail Item</th>
                <th className="py-4 px-6 font-semibold">Metode Pembayaran</th>
                <th className="py-4 px-6 font-semibold text-right">Total Pendapatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-16 text-center text-slate-400 text-sm font-medium">
                    <div className="flex flex-col items-center justify-center space-y-3">
                      <p>Belum ada riwayat transaksi penjualan.</p>
                      <Link
                        href="/pos"
                        className="px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition shadow-sm"
                      >
                        Buka Kasir POS untuk Transaksi &rarr;
                      </Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-indigo-600">{tx.id}</td>
                    <td className="py-4 px-6 text-slate-500 text-xs font-medium">{tx.date}</td>
                    <td className="py-4 px-6 text-slate-800 font-medium">{tx.items}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                        {tx.payment}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right font-extrabold text-slate-800">{formatRupiah(tx.total)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
