'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Search, ShoppingCart, Trash2, ShieldCheck, MessageCircle, Clock } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import {
  normalizeNonNegativeNumber,
  normalizeProduct,
  normalizeTransaction,
  readStoredArray,
  writeStoredArray,
} from '../utils/storage';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [themeMode, setThemeMode] = useState('dark');
  const [showReceiptModal, setShowReceiptModal] = useState(false);
  const [receiptData, setReceiptData] = useState(null);
  const [cashReceived, setCashReceived] = useState('');
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // Shift Kasir States
  const [activeShift, setActiveShift] = useState(null);
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [startingCashInput, setStartingCashInput] = useState('100000');
  const [showCloseShiftModal, setShowCloseShiftModal] = useState(false);
  const [actualCashInput, setActualCashInput] = useState('');

  // Manager PIN States
  const [showPinModal, setShowPinModal] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pendingAction, setPendingAction] = useState(null);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    setProducts(readStoredArray('products').map(normalizeProduct));
    const savedTheme = localStorage.getItem('zenith_pos_theme');
    setThemeMode(savedTheme || 'dark');

    // Check active shift
    const savedShift = localStorage.getItem('zenith_active_shift');
    if (savedShift) {
      try {
        setActiveShift(JSON.parse(savedShift));
      } catch {
        setShowShiftModal(true);
      }
    } else {
      setShowShiftModal(true);
    }
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode === 'light' ? 'pos-light' : 'dark');
    localStorage.setItem('zenith_pos_theme', themeMode);
  }, [themeMode]);

  const handleStartShift = (e) => {
    e.preventDefault();
    const amount = normalizeNonNegativeNumber(startingCashInput.replace(/\D/g, ''));
    const shift = {
      id: `SHIFT-${Date.now()}`,
      startTime: new Date().toLocaleString('id-ID'),
      startingCash: amount,
      cashSales: 0,
      nonCashSales: 0,
      transactionsCount: 0,
    };
    localStorage.setItem('zenith_active_shift', JSON.stringify(shift));
    setActiveShift(shift);
    setShowShiftModal(false);
    showToast('Shift kasir berhasil dibuka!');
  };

  const handleCloseShift = (e) => {
    e.preventDefault();
    if (!activeShift) return;
    const actualCash = normalizeNonNegativeNumber(actualCashInput.replace(/\D/g, ''));
    const expectedCash = activeShift.startingCash + activeShift.cashSales;
    const difference = actualCash - expectedCash;

    const closedShift = {
      ...activeShift,
      endTime: new Date().toLocaleString('id-ID'),
      actualCash,
      expectedCash,
      difference,
    };

    const history = readStoredArray('shift_history');
    writeStoredArray('shift_history', [closedShift, ...history]);
    localStorage.removeItem('zenith_active_shift');
    setActiveShift(null);
    setShowCloseShiftModal(false);
    setShowShiftModal(true);
    showToast('Shift kasir berhasil ditutup dan direkap.');
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const cashAmount = normalizeNonNegativeNumber(String(cashReceived).replace(/\D/g, ''));
  const change = Math.max(0, cashAmount - total);

  const addToCart = (product) => {
    if (product.stock <= 0) {
      showToast('Stok produk habis!');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          showToast('Jumlah melebihi stok tersedia di gudang!');
          return prevCart;
        }
        return prevCart.map((item) =>
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item,
        );
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prevCart) => {
      return prevCart.flatMap((item) => {
        if (item.id !== productId) return [item];
        const product = products.find((p) => p.id === productId);
        const nextQty = item.qty + delta;

        if (nextQty <= 0) return [];
        if (product && nextQty > product.stock) {
          showToast('Melebihi stok gudang!');
          return [item];
        }
        return [{ ...item, qty: nextQty }];
      });
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const verifyManagerPin = (actionName, callback) => {
    setPendingAction({ name: actionName, callback });
    setShowPinModal(true);
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    if (pinInput === '1234' || pinInput === 'admin123') {
      showToast('Otorisasi manajer berhasil diterima.');
      setShowPinModal(false);
      setPinInput('');
      if (pendingAction && typeof pendingAction.callback === 'function') {
        pendingAction.callback();
      }
      setPendingAction(null);
    } else {
      showToast('PIN Manajer salah! (Coba: 1234)');
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0 || isCheckingOut) return;

    if (paymentMethod === 'Tunai' && cashAmount < total) {
      showToast('Nominal tunai belum mencukupi.');
      return;
    }

    setIsCheckingOut(true);

    const currentProducts = readStoredArray('products').map(normalizeProduct);
    const hasInsufficientStock = cart.some((item) => {
      const current = currentProducts.find((product) => product.id === item.id);
      return !current || current.stock < item.qty;
    });
    if (hasInsufficientStock) {
      setProducts(currentProducts);
      setIsCheckingOut(false);
      showToast('Stok berubah. Periksa kembali keranjang Anda.');
      return;
    }

    const now = new Date();
    const transactionId = `TRX-${now.getTime()}`;
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + now.toTimeString().slice(0, 5);

    const transaction = normalizeTransaction({
      id: transactionId,
      date: dateStr,
      createdAt: now.toISOString(),
      payment: paymentMethod,
      subtotal: total,
      discountPercent: 0,
      discountAmount: 0,
      total,
      cashReceived: paymentMethod === 'Tunai' ? cashAmount : null,
      change: paymentMethod === 'Tunai' ? change : null,
      items: cart.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    });

    const nextTransactions = [transaction, ...readStoredArray('transactions')];
    writeStoredArray('transactions', nextTransactions);

    // Update active shift stats if active
    if (activeShift) {
      const isCash = paymentMethod === 'Tunai';
      const updatedShift = {
        ...activeShift,
        cashSales: activeShift.cashSales + (isCash ? total : 0),
        nonCashSales: activeShift.nonCashSales + (!isCash ? total : 0),
        transactionsCount: activeShift.transactionsCount + 1,
      };
      setActiveShift(updatedShift);
      localStorage.setItem('zenith_active_shift', JSON.stringify(updatedShift));
    }

    // Also push to KDS statuses
    const kdsStatuses = readStoredArray('kds_statuses');
    writeStoredArray('kds_statuses', [{ id: transactionId, status: 'PENDING' }, ...kdsStatuses]);

    const updatedProducts = currentProducts.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (!cartItem) return product;
      return { ...product, stock: Math.max(0, Number(product.stock || 0) - cartItem.qty) };
    });

    setProducts(updatedProducts);
    writeStoredArray('products', updatedProducts);

    setReceiptData({
      id: transaction.id,
      date: transaction.date,
      payment: transaction.payment,
      total: transaction.total,
      subtotal: transaction.subtotal,
      discountAmount: 0,
      cashReceived: transaction.cashReceived,
      change: transaction.change,
      cartItems: transaction.items,
    });
    setShowReceiptModal(true);
    setCart([]);
    setCashReceived('');
    setPaymentMethod('QRIS');
    setIsCheckingOut(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleSendWhatsApp = () => {
    if (!receiptData) return;
    const itemsText = receiptData.cartItems.map(i => `- ${i.name} (${i.qty}x @${formatRupiah(i.price)})`).join('\n');
    const msg = `*STRUK BELANJA - ZENITH POS*\n\nNo: ${receiptData.id}\nWaktu: ${receiptData.date}\nMetode: ${receiptData.payment}\n\n*Daftar Belanja:*\n${itemsText}\n\n*TOTAL: ${formatRupiah(receiptData.total)}*\n${receiptData.payment === 'Tunai' ? `Tunai: ${formatRupiah(receiptData.cashReceived)}\nKembali: ${formatRupiah(receiptData.change)}\n` : ''}\nTerima kasih telah berbelanja di toko kami!`;
    const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="pos-shell">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Shift Kasir Modal */}
      {showShiftModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-primary)' }}>Shift Register</span>
                <h3>Buka Shift Kasir Baru</h3>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
              Masukkan modal awal (cash drawer) di laci kasir untuk memulai pencatatan transaksi shift ini.
            </p>
            <form onSubmit={handleStartShift} className="form-stack">
              <label>
                Modal Awal Kas (Rp)
                <input
                  type="text"
                  inputMode="numeric"
                  value={startingCashInput}
                  onChange={(e) => setStartingCashInput(e.target.value.replace(/\D/g, ''))}
                  className="input"
                  required
                />
              </label>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button type="submit" className="btn-primary" style={{ width: '100%' }}>
                  Mulai Shift Kasir
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Close Shift Modal */}
      {showCloseShiftModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-primary)' }}>Shift Reconciliation</span>
                <h3>Tutup Shift Kasir</h3>
              </div>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
              Hitung uang fisik di laci kasir saat ini untuk rekonsiliasi akhir shift.
            </p>
            
            <div style={{ background: 'var(--bg-canvas)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-default)', marginBottom: '18px', display: 'grid', gap: '8px', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', justifyContent: 'between', color: 'var(--text-secondary)' }}><span>Modal Awal:</span><span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatRupiah(activeShift?.startingCash || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'between', color: 'var(--text-secondary)' }}><span>Penjualan Tunai:</span><span style={{ fontFamily: 'monospace', color: 'var(--success)' }}>{formatRupiah(activeShift?.cashSales || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'between', color: 'var(--text-secondary)' }}><span>Penjualan Non-Tunai:</span><span style={{ fontFamily: 'monospace', color: 'var(--accent-tertiary)' }}>{formatRupiah(activeShift?.nonCashSales || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'between', fontWeight: 'bold', color: 'var(--text-primary)', borderTop: '1px solid var(--border-default)', paddingTop: '8px' }}>
                <span>Ekspektasi Uang di Laci:</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--accent-secondary)' }}>{formatRupiah((activeShift?.startingCash || 0) + (activeShift?.cashSales || 0))}</span>
              </div>
            </div>

            <form onSubmit={handleCloseShift} className="form-stack">
              <label>
                Total Uang Fisik Aktual di Laci (Rp)
                <input
                  type="text"
                  inputMode="numeric"
                  value={actualCashInput}
                  onChange={(e) => setActualCashInput(e.target.value.replace(/\D/g, ''))}
                  className="input"
                  placeholder="Contoh: 250000"
                  required
                />
              </label>
              <div className="modal-actions" style={{ marginTop: '10px' }}>
                <button
                  type="button"
                  onClick={() => setShowCloseShiftModal(false)}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                  style={{ background: 'var(--danger)' }}
                >
                  Tutup Shift & Rekap
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Manager PIN Modal */}
      {showPinModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ textAlign: 'center' }}>
            <div style={{ display: 'grid', placeItems: 'center', marginBottom: '12px' }}>
              <ShieldCheck className="text-amber-400" size={36} />
            </div>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '6px' }}>Otorisasi Manajer</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', marginBottom: '20px' }}>
              Masukkan PIN Manajer untuk tindakan: <strong style={{ color: 'var(--text-primary)' }}>{pendingAction?.name}</strong>
            </p>
            <form onSubmit={handlePinSubmit} className="form-stack">
              <input
                type="password"
                maxLength={6}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                className="input"
                style={{ textAlign: 'center', fontSize: '1.5rem', letterSpacing: '0.3em', fontFamily: 'monospace' }}
                placeholder="••••"
                autoFocus
                required
              />
              <div className="modal-actions" style={{ marginTop: '14px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => { setShowPinModal(false); setPinInput(''); }}
                  className="btn-secondary"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Verifikasi PIN
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="pos-area">
        <div className="pos-toolbar flex flex-wrap justify-between items-center gap-3">
          <div>
            <h2 className="pos-title">Kasir Point of Sale</h2>
            <p className="pos-subtitle">Pilih produk dan proses transaksi penjualan dengan cepat.</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {activeShift && (
              <button
                type="button"
                onClick={() => setShowCloseShiftModal(true)}
                className="pill-button"
                style={{ background: 'var(--surface-2)', color: 'var(--accent-secondary)', borderColor: 'var(--border-default)' }}
              >
                <Clock size={14} style={{ display: 'inline', marginRight: 4 }} />
                Shift Aktif ({activeShift.transactionsCount} tx)
              </button>
            )}
            <Link
              href="/kds"
              className="pill-button"
              target="_blank"
            >
              Layar Dapur (KDS)
            </Link>
            <button
              type="button"
              className="pill-button"
              onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
            >
              {themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
            </button>
          </div>
        </div>

        <div className="filter-row">
          <div style={{ minWidth: 0, flex: 1, position: 'relative' }}>
            <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-tertiary)' }} />
            <input
              className="input"
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari nama produk..."
              style={{ paddingLeft: 36 }}
            />
          </div>
        </div>

        <div className="filter-row" style={{ marginBottom: 0 }}>
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        {products.length === 0 ? (
          <div className="empty-state" style={{ marginTop: 18 }}>
            <p>Belum ada produk yang bisa dijual. Tambahkan item lewat halaman inventori.</p>
            <Link href="/inventory" className="btn-primary" style={{ marginTop: 14 }}>
              Tambah Produk
            </Link>
          </div>
        ) : (
          <div className="product-grid" style={{ marginTop: 18 }}>
            {filteredProducts.map((product) => (
              <button key={product.id} type="button" className="tap-card" onClick={() => addToCart(product)}>
                <div className="product-head">
                  <div>
                    <div className="product-meta">{product.category}</div>
                    <h3 className="product-name">{product.name}</h3>
                  </div>
                  <span className="product-stock">{product.stock} stok</span>
                </div>

                <div>
                  <div className="product-price">{formatRupiah(product.price)}</div>
                  <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-tertiary)', fontSize: 12 }}>Tambah ke keranjang</span>
                    <span style={{ width: 26, height: 26, borderRadius: 8, background: 'var(--surface-1)', display: 'grid', placeItems: 'center' }}><Plus size={14} /></span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      <aside className="cart-panel">
        <div className="cart-header">
          <div>
            <h3 className="panel-title">Keranjang</h3>
            <div className="quick-value">{cart.length} item</div>
          </div>
          <button
            className="pill-button"
            type="button"
            onClick={() => verifyManagerPin('Kosongkan Keranjang', () => setCart([]))}
            aria-label="Kosongkan keranjang"
          >
            Reset
          </button>
        </div>

        <div style={{ display: 'grid', gap: '16px' }}>
          <div style={{ background: 'var(--surface-2)', borderRadius: '16px', padding: '16px', border: '1px solid var(--border-default)', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '12px', borderBottom: '1px solid var(--border-default)', marginBottom: '14px' }}>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700, margin: 0 }}>Keranjang Pesanan</h3>
              <span style={{ padding: '4px 10px', background: 'rgba(139,92,246,0.15)', color: 'var(--accent-primary)', fontSize: '0.75rem', fontWeight: 700, borderRadius: '8px' }}>
                {cart.reduce((sum, item) => sum + item.qty, 0)} Item
              </span>
            </div>

            <div style={{ display: 'grid', gap: '10px', marginBottom: '16px' }}>
              {cart.length === 0 ? (
                <div style={{ padding: '32px 0', textAlign: 'center', color: 'var(--text-tertiary)', fontSize: '0.78rem' }}>
                  Keranjang masih kosong. Pilih produk dari katalog di samping.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} style={{ padding: '10px 12px', background: 'var(--surface-1)', borderRadius: '12px', border: '1px solid var(--border-default)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
                    <div style={{ minWidth: 0, flex: 1 }}>
                      <h4 style={{ fontSize: '0.8rem', fontWeight: 700, margin: '0 0 2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</h4>
                      <p style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)', fontWeight: 800, margin: 0 }}>{formatRupiah(item.price)}</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                      <button type="button" onClick={() => updateQty(item.id, -1)} aria-label={`Kurangi ${item.name}`} style={{ width: 22, height: 22, background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, borderRadius: 6, border: '1px solid var(--border-default)', display: 'grid', placeItems: 'center' }}>-</button>
                      <span style={{ width: 20, textAlign: 'center', fontSize: '0.8rem', fontWeight: 700 }}>{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)} aria-label={`Tambah ${item.name}`} style={{ width: 22, height: 22, background: 'var(--surface-2)', color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 700, borderRadius: 6, border: '1px solid var(--border-default)', display: 'grid', placeItems: 'center' }}>+</button>
                      <button type="button" onClick={() => verifyManagerPin(`Hapus ${item.name}`, () => removeFromCart(item.id))} aria-label={`Hapus ${item.name}`} style={{ color: 'var(--text-tertiary)', background: 'none', padding: '2px', cursor: 'pointer' }} title="Hapus">&times;</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div style={{ display: 'grid', gap: '8px', marginBottom: '16px', paddingTop: '12px', borderTop: '1px solid var(--border-default)' }}>
              <label style={{ display: 'block', fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-secondary)' }}>Metode Pembayaran</label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                {['QRIS', 'Tunai', 'Transfer', 'Kartu Kredit / Debit'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    style={{
                      padding: '8px 10px',
                      borderRadius: '10px',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      border: '1px solid',
                      borderColor: paymentMethod === method ? 'var(--accent-primary)' : 'var(--border-default)',
                      background: paymentMethod === method ? 'rgba(139,92,246,0.15)' : 'var(--surface-1)',
                      color: paymentMethod === method ? 'var(--text-primary)' : 'var(--text-secondary)',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div style={{ paddingTop: '12px', borderTop: '1px solid var(--border-default)', display: 'grid', gap: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700 }}>
                <span>Total Pembayaran:</span>
                <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>{formatRupiah(total)}</span>
              </div>

              {paymentMethod === 'Tunai' && (
                <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Uang diterima
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cashReceived}
                    onChange={(event) => setCashReceived(event.target.value.replace(/\D/g, ''))}
                    className="input"
                    style={{ marginTop: '4px' }}
                    placeholder="Rp"
                  />
                </label>
              )}
              {paymentMethod === 'Tunai' && cashAmount >= total && (
                <div style={{ textAlign: 'right', fontSize: '0.75rem', fontWeight: 700, color: 'var(--success)' }}>Kembalian: {formatRupiah(change)}</div>
              )}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="btn-primary"
                style={{ width: '100%', marginTop: '4px' }}
              >
                Proses Checkout & Cetak Struk
              </button>
            </div>
          </div>
        </div>
      </aside>

      {showReceiptModal && receiptData && (
        <div className="modal-backdrop print:p-0 print:bg-white print:static">
          <div className="modal-card print:shadow-none print:border-none print:w-full print:max-w-none" style={{ fontFamily: 'monospace' }}>
            <div id="printable-receipt" style={{ display: 'grid', gap: '12px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--border-default)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 4px', color: 'var(--text-primary)' }}>ZENITH POS RETAIL</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Pusat Grosir & Eceran UMKM Professional</p>
              </div>

              <div style={{ fontSize: '0.75rem', display: 'grid', gap: '4px', paddingBottom: '12px', borderBottom: '1px dashed var(--border-default)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>No. Transaksi:</span>
                  <span style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{receiptData.id}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Waktu:</span>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{receiptData.date}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'between' }}>
                  <span style={{ color: 'var(--text-secondary)' }}>Metode Bayar:</span>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{receiptData.payment}</span>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '8px', paddingBottom: '12px', borderBottom: '1px dashed var(--border-default)', fontSize: '0.75rem' }}>
                <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-tertiary)', display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px' }}>
                  <span style={{ gridColumn: 'span 5' }}>Nama Barang</span>
                  <span style={{ gridColumn: 'span 3', textAlign: 'center' }}>Harga @</span>
                  <span style={{ gridColumn: 'span 1', textAlign: 'center' }}>Qty</span>
                  <span style={{ gridColumn: 'span 3', textAlign: 'right' }}>Subtotal</span>
                </div>
                {receiptData.cartItems.map((item, idx) => (
                  <div key={idx} style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: '4px', alignItems: 'center' }}>
                    <span style={{ gridColumn: 'span 5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.name}</span>
                    <span style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-secondary)' }}>{formatRupiah(item.price)}</span>
                    <span style={{ gridColumn: 'span 1', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                    <span style={{ gridColumn: 'span 3', textAlign: 'right', fontWeight: 700, color: 'var(--accent-secondary)' }}>{formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '6px', paddingBottom: '14px', borderBottom: '1px dashed var(--border-default)', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: 'var(--text-primary)' }}>
                  <span>TOTAL:</span>
                  <span style={{ color: 'var(--accent-secondary)' }}>{formatRupiah(receiptData.total)}</span>
                </div>
                {receiptData.payment === 'Tunai' && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    <span>Kembalian:</span>
                    <span>{formatRupiah(receiptData.change)}</span>
                  </div>
                )}
              </div>

              <div style={{ textAlign: 'center', paddingTop: '4px', display: 'grid', gap: '2px' }}>
                <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>TERIMA KASIH TELAH BERBELANJA</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', margin: 0 }}>Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
              </div>
            </div>

            <div style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid var(--border-default)', display: 'grid', gap: '10px' }} className="print:hidden">
              <button
                type="button"
                onClick={handleSendWhatsApp}
                className="btn-primary"
                style={{ background: 'var(--success)', color: '#060913', width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}
              >
                <MessageCircle size={16} />
                <span>Kirim Struk via WhatsApp</span>
              </button>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowReceiptModal(false)} className="btn-secondary" style={{ flex: 1 }}>Tutup</button>
                <button type="button" onClick={handlePrintReceipt} className="btn-primary" style={{ flex: 1 }}>Cetak (PDF)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
