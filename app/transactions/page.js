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
    return transactions.filter((tx) =>
      String(tx.id).toLowerCase().includes(query)
      || String(tx.items).toLowerCase().includes(query)
      || String(tx.payment).toLowerCase().includes(query)
    );
  }, [transactions, searchTerm]);

  const totalRevenue = transactions.reduce((sum, tx) => sum + Number(tx.total || 0), 0);

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Finance log</span>
          <h2>Riwayat Transaksi</h2>
          <p>Semua penjualan tercatat rapi agar mudah ditinjau dan ditindaklanjuti.</p>
        </div>
        <div className="heading-stat">
          <span>Total tercatat</span>
          <strong>{formatRupiah(totalRevenue)}</strong>
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
