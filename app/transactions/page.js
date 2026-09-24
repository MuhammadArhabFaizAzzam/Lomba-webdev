'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ReceiptText, Search, WalletCards } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

export default function TransactionsPage() {
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');
    const loadTransactions = window.setTimeout(() => setTransactions(saved ? JSON.parse(saved) : []), 0);
    return () => window.clearTimeout(loadTransactions);
  }, []);

  const filteredTransactions = useMemo(() => {
    const query = searchTerm.toLowerCase();
    return transactions.filter((tx) => {
      const matchId = String(tx.id || '').toLowerCase().includes(query);
      const matchPayment = String(tx.payment || '').toLowerCase().includes(query);
      const matchItems = Array.isArray(tx.items) && tx.items.some(item =>
        String(item?.name || '').toLowerCase().includes(query)
      );
      return matchId || matchPayment || matchItems;
    });
  }, [transactions, searchTerm]);

  const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0);

  const exportToCSV = () => {
    if (filteredTransactions.length === 0) return;

    const headers = ['ID Transaksi', 'Waktu', 'Detail Item', 'Metode Pembayaran', 'Total'];
    const rows = filteredTransactions.map(tx => {
      const itemsSummary = Array.isArray(tx.items)
        ? tx.items.map(i => `${i.name} (${i.qty}x)`).join(', ')
        : String(tx.items || '');
      return [
        `"${String(tx.id).replace(/"/g, '""')}"`,
        `"${String(tx.date).replace(/"/g, '""')}"`,
        `"${itemsSummary.replace(/"/g, '""')}"`,
        `"${String(tx.payment).replace(/"/g, '""')}"`,
        `"${String(tx.total)}"`
      ];
    });

    const csvContent = [
      headers.map(h => `"${h}"`).join(','),
      ...rows.map(row => row.join(','))
    ].join('\r\n');

    // Add UTF-8 BOM (\uFEFF) for Excel compatibility
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-transaksi-zenith-pos-${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Finance log</span>
          <h2>Riwayat Transaksi</h2>
          <p>Semua penjualan tercatat rapi agar mudah ditinjau dan ditindaklanjuti.</p>
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
        </div>
      </div>

      <div className="table-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input
            type="text"
            placeholder="Cari ID, item, atau metode pembayaran..."
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </div>
        <span className="record-count">{filteredTransactions.length} transaksi</span>
      </div>

      <div className="data-panel">
        <div className="table-scroll">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID Transaksi</th>
                <th>Waktu</th>
                <th>Detail Item</th>
                <th>Metode</th>
                <th className="align-right">Total</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan="5">
                    <div className="table-empty">
                      <span className="empty-icon"><ReceiptText size={22} /></span>
                      <strong>Belum ada riwayat transaksi</strong>
                      <p>Transaksi dari kasir akan muncul di sini secara otomatis.</p>
                      <Link href="/pos" className="btn-primary">Buka Kasir <ArrowRight size={15} /></Link>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((tx) => (
                  <tr key={tx.id}>
                    <td className="transaction-id">{tx.id}</td>
                    <td className="muted-cell">{tx.date}</td>
                    <td className="item-cell">{tx.items}</td>
                    <td><span className="payment-badge"><WalletCards size={13} />{tx.payment}</span></td>
                    <td className="align-right amount-cell">{formatRupiah(tx.total)}</td>
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
