'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Search, ShoppingCart, Trash2, ShieldCheck, MessageCircle, Clock, Users, QrCode, Printer, Scan, CheckCircle2, AlertTriangle, X } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import {
  normalizeNonNegativeNumber,
  normalizeProduct,
  normalizeTransaction,
  readStoredArray,
  writeStoredArray,
} from '../utils/storage';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

const formatProductName = (name) => {
  if (!name) return '';
  return String(name)
    .toLowerCase()
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

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

  // Advanced POS Features
  const [customers, setCustomers] = useState([]);
  const [selectedCustomerId, setSelectedCustomerId] = useState('');
  const [includeTax, setIncludeTax] = useState(true);
  const [includeService, setIncludeService] = useState(false);
  const [receiptWidth, setReceiptWidth] = useState('80mm');
  const [showEscPosModal, setShowEscPosModal] = useState(false);
  const [showScannerModal, setShowScannerModal] = useState(false);
  const [scannerCode, setScannerCode] = useState('');

  // Dynamic QRIS States
  const [activeQrisOrder, setActiveQrisOrder] = useState(null);
  const [qrisTimer, setQrisTimer] = useState(300);

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
    setCustomers(readStoredArray('zenith_customers'));
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

  useEffect(() => {
    let timer;
    if (activeQrisOrder && activeQrisOrder.status === 'PENDING' && qrisTimer > 0) {
      timer = setInterval(() => {
        setQrisTimer((prev) => {
          if (prev <= 1) {
            setActiveQrisOrder((curr) => curr ? { ...curr, status: 'EXPIRED' } : null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQrisOrder, qrisTimer]);

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

  const selectedCustomer = useMemo(() => {
    return customers.find(c => c.id === selectedCustomerId) || null;
  }, [customers, selectedCustomerId]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const taxAmount = includeTax ? subtotal * 0.11 : 0;
  const serviceAmount = includeService ? subtotal * 0.05 : 0;
  const discountAmount = selectedCustomer?.tier === 'Gold' ? subtotal * 0.05 : selectedCustomer?.tier === 'Silver' ? subtotal * 0.03 : 0;
  const total = Math.max(0, subtotal + taxAmount + serviceAmount - discountAmount);

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

  const handleScannerSubmit = (e) => {
    e.preventDefault();
    const found = products.find(p => p.name.toLowerCase().includes(scannerCode.toLowerCase()) || p.id === scannerCode);
    if (found) {
      addToCart(found);
      setScannerCode('');
      setShowScannerModal(false);
      showToast(`Produk "${found.name}" ditambahkan via Barcode Scanner!`);
    } else {
      showToast('Produk dengan kode/nama tersebut tidak ditemukan.');
    }
  };

  const handleStartQrisCheckout = () => {
    if (cart.length === 0 || isCheckingOut) return;
    const currentProducts = readStoredArray('products').map(normalizeProduct);
    const hasInsufficientStock = cart.some((item) => {
      const current = currentProducts.find((product) => product.id === item.id);
      return !current || current.stock < item.qty;
    });
    if (hasInsufficientStock) {
      setProducts(currentProducts);
      showToast('Stok berubah. Periksa kembali keranjang Anda.');
      return;
    }

    const qrisId = `QRIS-${Date.now()}`;
    setActiveQrisOrder({
      id: qrisId,
      amount: total,
      items: [...cart],
      createdAt: new Date().toLocaleDateString('id-ID') + ' ' + new Date().toTimeString().slice(0, 5),
      status: 'PENDING',
    });
    setQrisTimer(300);
    showToast('QRIS Pembayaran Dinamis dibuat. Silakan scan.');
  };

  const handleSimulateQrisPaid = () => {
    if (!activeQrisOrder) return;
    const currentProducts = readStoredArray('products').map(normalizeProduct);

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
      payment: 'QRIS (Dynamic Gateway)',
      subtotal,
      taxAmount,
      serviceAmount,
      discountAmount,
      total: activeQrisOrder.amount,
      customerName: selectedCustomer ? selectedCustomer.name : 'Umum',
      cashReceived: null,
      change: null,
      items: activeQrisOrder.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        qty: item.qty,
      })),
    });

    const nextTransactions = [transaction, ...readStoredArray('transactions')];
    writeStoredArray('transactions', nextTransactions);

    // Update customer points & total spent if customer selected
    if (selectedCustomer) {
      const earnedPoints = Math.floor(activeQrisOrder.amount / 10000);
      const allCusts = readStoredArray('zenith_customers');
      const updatedCusts = allCusts.map(c => {
        if (c.id === selectedCustomer.id) {
          const newTotalSpent = (c.totalSpent || 0) + activeQrisOrder.amount;
          const newPoints = (c.points || 0) + earnedPoints;
          let newTier = c.tier;
          if (newTotalSpent >= 1000000) newTier = 'Gold';
          else if (newTotalSpent >= 500000) newTier = 'Silver';
          return { ...c, totalSpent: newTotalSpent, points: newPoints, tier: newTier };
        }
        return c;
      });
      writeStoredArray('zenith_customers', updatedCusts);
      setCustomers(updatedCusts);
      showToast(`Member +${earnedPoints} Poin Loyalitas!`);
    }

    // Update active shift stats if active
    if (activeShift) {
      const updatedShift = {
        ...activeShift,
        nonCashSales: activeShift.nonCashSales + activeQrisOrder.amount,
        transactionsCount: activeShift.transactionsCount + 1,
      };
      setActiveShift(updatedShift);
      localStorage.setItem('zenith_active_shift', JSON.stringify(updatedShift));
    }

    const kdsStatuses = readStoredArray('kds_statuses');
    writeStoredArray('kds_statuses', [{ id: transactionId, status: 'PENDING' }, ...kdsStatuses]);

    const updatedProducts = currentProducts.map((product) => {
      const cartItem = activeQrisOrder.items.find((item) => item.id === product.id);
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
      subtotal,
      taxAmount,
      serviceAmount,
      discountAmount,
      customerName: selectedCustomer ? selectedCustomer.name : 'Umum',
      cashReceived: null,
      change: null,
      cartItems: transaction.items,
    });
    setShowReceiptModal(true);
    setCart([]);
    setActiveQrisOrder(null);
    setSelectedCustomerId('');
    setPaymentMethod('QRIS');
    showToast('Pembayaran QRIS Berhasil & Lunas via Webhook Simulator!');
  };

  const handleCheckout = () => {
    if (cart.length === 0 || isCheckingOut) return;

    if (paymentMethod === 'QRIS') {
      handleStartQrisCheckout();
      return;
    }

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
      subtotal,
      taxAmount,
      serviceAmount,
      discountAmount,
      total,
      customerName: selectedCustomer ? selectedCustomer.name : 'Umum',
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

    // Update customer points & total spent if customer selected
    if (selectedCustomer) {
      const earnedPoints = Math.floor(total / 10000);
      const allCusts = readStoredArray('zenith_customers');
      const updatedCusts = allCusts.map(c => {
        if (c.id === selectedCustomer.id) {
          const newTotalSpent = (c.totalSpent || 0) + total;
          const newPoints = (c.points || 0) + earnedPoints;
          let newTier = c.tier;
          if (newTotalSpent >= 1000000) newTier = 'Gold';
          else if (newTotalSpent >= 500000) newTier = 'Silver';
          return { ...c, totalSpent: newTotalSpent, points: newPoints, tier: newTier };
        }
        return c;
      });
      writeStoredArray('zenith_customers', updatedCusts);
      setCustomers(updatedCusts);
      showToast(`Member +${earnedPoints} Poin Loyalitas!`);
    }

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
      subtotal,
      taxAmount,
      serviceAmount,
      discountAmount,
      customerName: selectedCustomer ? selectedCustomer.name : 'Umum',
      cashReceived: transaction.cashReceived,
      change: transaction.change,
      cartItems: transaction.items,
    });
    setShowReceiptModal(true);
    setCart([]);
    setCashReceived('');
    setSelectedCustomerId('');
    setPaymentMethod('QRIS');
    setIsCheckingOut(false);
  };

  const handlePrintReceipt = () => {
    window.print();
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
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Modal Awal:</span><span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatRupiah(activeShift?.startingCash || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Penjualan Tunai:</span><span style={{ fontFamily: 'monospace', color: 'var(--success)' }}>{formatRupiah(activeShift?.cashSales || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}><span>Penjualan Non-Tunai:</span><span style={{ fontFamily: 'monospace', color: 'var(--accent-tertiary)' }}>{formatRupiah(activeShift?.nonCashSales || 0)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'var(--text-primary)', borderTop: '1px solid var(--border-default)', paddingTop: '8px' }}>
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
                  placeholder="Masukkan total hitung fisik uang"
                  required
                />
              </label>
              <div className="modal-actions" style={{ marginTop: '10px', display: 'flex', gap: '10px' }}>
                <button type="button" onClick={() => setShowCloseShiftModal(false)} className="btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Rekonsiliasi &amp; Tutup Shift</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Scanner Modal */}
      {showScannerModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '400px' }}>
            <div className="modal-header">
              <div>
                <span className="eyebrow" style={{ color: 'var(--accent-primary)' }}>Scanner Simulation</span>
                <h3>Scan Barcode / QR Produk</h3>
              </div>
              <button onClick={() => setShowScannerModal(false)} className="text-slate-400 hover:text-white"><X size={18} /></button>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', margin: '10px 0' }}>
              Simulasikan pemindaian barcode dengan mengetik kode produk atau nama barang secara instan.
            </p>
            <form onSubmit={handleScannerSubmit} className="space-y-4">
              <input
                type="text"
                autoFocus
                value={scannerCode}
                onChange={(e) => setScannerCode(e.target.value)}
                className="input"
                placeholder="Ketik nama atau SKU produk..."
                required
              />
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowScannerModal(false)} className="btn-secondary" style={{ flex: 1 }}>Batal</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Tambah ke Keranjang</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dynamic QRIS Gateway Simulation Modal */}
      {activeQrisOrder && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '440px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'between', alignItems: 'center', marginBottom: '10px' }}>
              <span className="eyebrow" style={{ color: 'var(--accent-primary)' }}>Midtrans / Xendit Sandbox</span>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300">
                {Math.floor(qrisTimer / 60)}:{String(qrisTimer % 60).padStart(2, '0')}
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 900, marginBottom: '4px' }}>Scan QRIS Dinamis</h3>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              ID Transaksi: <span style={{ fontFamily: 'monospace', color: 'var(--accent-secondary)' }}>{activeQrisOrder.id}</span>
            </p>

            <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', display: 'inline-block', marginBottom: '16px', boxShadow: '0 10px 25px rgba(0,0,0,0.3)' }}>
              <div style={{ width: '180px', height: '180px', border: '4px solid #0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '10px', margin: '0 auto' }}>
                <QrCode size={110} className="text-slate-900" />
                <span style={{ fontSize: '9px', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>STANDAR QRIS</span>
              </div>
            </div>

            <div style={{ background: 'var(--bg-canvas)', padding: '12px', borderRadius: '12px', marginBottom: '16px', fontSize: '0.8rem' }}>
              <div style={{ color: 'var(--text-secondary)' }}>Total Tagihan:</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--accent-secondary)' }}>{formatRupiah(activeQrisOrder.amount)}</div>
            </div>

            <div style={{ display: 'grid', gap: '8px' }}>
              <button
                type="button"
                onClick={handleSimulateQrisPaid}
                className="btn-primary"
                style={{ width: '100%', background: 'linear-gradient(135deg, #10b981, #059669)' }}
              >
                Simulasi Pembayaran Berhasil (Webhook)
              </button>
              <button
                type="button"
                onClick={() => setActiveQrisOrder(null)}
                className="btn-secondary"
                style={{ width: '100%' }}
              >
                Batalkan QRIS
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Left Catalog Section */}
      <section className="pos-catalog">
        <div className="catalog-header">
          <div>
            <span className="eyebrow">Pilih Produk &amp; Menu</span>
            <h2>Katalog Produk UMKM</h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              type="button"
              onClick={() => setShowScannerModal(true)}
              className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition flex items-center space-x-1.5 shadow-md"
            >
              <Scan size={15} />
              <span>Scan Barcode</span>
            </button>
            <button
              type="button"
              onClick={() => setThemeMode(themeMode === 'dark' ? 'light' : 'dark')}
              className="btn-secondary"
              style={{ padding: '8px 12px', fontSize: '0.75rem' }}
            >
              {themeMode === 'dark' ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Search & Category Filter */}
        <div className="catalog-toolbar">
          <div className="search-bar" style={{ flex: 1 }}>
            <Search size={16} color="var(--text-tertiary)" />
            <input
              type="text"
              placeholder="Cari nama produk..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="input-search"
            />
          </div>

          <div className="category-pills">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`category-pill ${selectedCategory === cat ? 'active' : ''}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="products-grid">
          {filteredProducts.length === 0 ? (
            <div className="empty-state" style={{ gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
              <p>Tidak ada produk yang sesuai dengan pencarian.</p>
            </div>
          ) : (
            filteredProducts.map((product) => {
              const isOutOfStock = product.stock <= 0;
              return (
                <div
                  key={product.id}
                  onClick={() => addToCart(product)}
                  className={`product-card ${isOutOfStock ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className="product-top">
                    <span className="product-category">{product.category}</span>
                    <span
                      className="product-stock"
                      style={{
                        background: product.stock === 0 ? 'rgba(248, 113, 113, 0.15)' : product.stock <= 10 ? 'rgba(251, 191, 36, 0.15)' : 'rgba(52, 211, 153, 0.15)',
                        color: product.stock === 0 ? 'var(--danger)' : product.stock <= 10 ? 'var(--warning)' : 'var(--success)',
                      }}
                    >
                      {product.stock === 0 ? 'Habis' : `${product.stock} stok`}
                    </span>
                  </div>

                  <div className="product-body">
                    <h4 className="product-name">{formatProductName(product.name)}</h4>
                    <span className="product-price">{formatRupiah(product.price)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </section>

      {/* Right Cart & Checkout Section */}
      <aside className="pos-cart">
        <div className="cart-head">
          <div className="flex items-center space-x-2">
            <ShoppingCart size={18} color="var(--accent-secondary)" />
            <h3 className="cart-title">Keranjang Belanja</h3>
          </div>
          {activeShift && (
            <button
              onClick={() => setShowCloseShiftModal(true)}
              className="text-[10px] font-bold px-2.5 py-1 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 hover:bg-emerald-500/30 transition"
              title="Tutup Shift Kasir"
            >
              Shift: {activeShift.transactionsCount} Trx
            </button>
          )}
        </div>

        {/* Customer CRM Selector */}
        <div className="p-3 bg-[var(--bg-canvas)] border-b border-[var(--border-default)]">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-bold text-[var(--text-secondary)] flex items-center space-x-1">
              <Users size={12} className="text-emerald-400" />
              <span>Pelanggan / Member (CRM)</span>
            </span>
            <Link href="/customers" className="text-[10px] text-emerald-400 hover:underline font-bold">+ Baru</Link>
          </div>
          <select
            value={selectedCustomerId}
            onChange={(e) => setSelectedCustomerId(e.target.value)}
            className="w-full bg-[var(--bg-surface)] border border-[var(--border-default)] rounded-xl px-3 py-2 text-xs text-[var(--text-primary)] focus:outline-none focus:border-emerald-500"
          >
            <option value="">-- Pembeli Umum (Tanpa Member) --</option>
            {customers.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.tier} Member - {c.points} Poin)
              </option>
            ))}
          </select>
        </div>

        {/* Cart Items List */}
        <div className="cart-list">
          {cart.length === 0 ? (
            <div className="cart-empty">
              <ShoppingCart size={36} color="var(--text-tertiary)" />
              <p>Keranjang masih kosong</p>
              <span>Klik produk di sebelah kiri untuk mulai transaksi</span>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-item">
                <div className="item-info">
                  <span className="item-name">{formatProductName(item.name)}</span>
                  <span className="item-price">{formatRupiah(item.price)}</span>
                </div>

                <div className="item-controls">
                  <button type="button" onClick={() => updateQty(item.id, -1)} className="qty-btn">
                    <Minus size={12} />
                  </button>
                  <span className="qty-value">{item.qty}</span>
                  <button type="button" onClick={() => updateQty(item.id, 1)} className="qty-btn">
                    <Plus size={12} />
                  </button>
                  <button type="button" onClick={() => removeFromCart(item.id)} className="remove-btn">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Payment & Summary */}
        <div className="cart-summary">
          <div className="payment-methods">
            {['QRIS', 'Tunai', 'Debit', 'Transfer'].map((method) => (
              <button
                key={method}
                type="button"
                onClick={() => setPaymentMethod(method)}
                className={`method-btn ${paymentMethod === method ? 'active' : ''}`}
              >
                {method}
              </button>
            ))}
          </div>

          {/* Tax & Service Toggles */}
          <div className="grid grid-cols-2 gap-2 text-[11px] py-2 border-t border-b border-[var(--border-default)]">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTax}
                onChange={(e) => setIncludeTax(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-[var(--text-secondary)]">PPN (11%)</span>
            </label>
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeService}
                onChange={(e) => setIncludeService(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500"
              />
              <span className="font-semibold text-[var(--text-secondary)]">Service (5%)</span>
            </label>
          </div>

          <div style={{ display: 'grid', gap: '4px', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Subtotal:</span>
              <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatRupiah(subtotal)}</span>
            </div>
            {includeTax && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>PPN 11%:</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatRupiah(taxAmount)}</span>
              </div>
            )}
            {includeService && (
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>Service 5%:</span>
                <span style={{ fontFamily: 'monospace', color: 'var(--text-primary)' }}>{formatRupiah(serviceAmount)}</span>
              </div>
            )}
            {discountAmount > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                <span>Diskon Member ({selectedCustomer?.tier}):</span>
                <span style={{ fontFamily: 'monospace' }}>-{formatRupiah(discountAmount)}</span>
              </div>
            )}
          </div>

          <div style={{ paddingTop: '10px', borderTop: '1px solid var(--border-default)', display: 'grid', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)' }}>
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
              {paymentMethod === 'QRIS' ? 'Buat QRIS Pembayaran' : 'Proses Checkout & Cetak Struk'}
            </button>
          </div>
        </div>
      </aside>

      {showReceiptModal && receiptData && (
        <div className="modal-backdrop print:p-0 print:bg-white print:static">
          <div className="modal-card print:shadow-none print:border-none print:w-full print:max-w-none" style={{ fontFamily: 'monospace', maxWidth: receiptWidth === '58mm' ? '320px' : '440px' }}>
            <div className="flex justify-between items-center pb-3 border-b border-slate-700 mb-3 print:hidden">
              <span className="text-xs font-bold text-slate-400">Pengaturan Struk Thermal</span>
              <div className="flex space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700 text-xs">
                <button
                  onClick={() => setReceiptWidth('80mm')}
                  className={`px-2.5 py-1 rounded ${receiptWidth === '80mm' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  80mm
                </button>
                <button
                  onClick={() => setReceiptWidth('58mm')}
                  className={`px-2.5 py-1 rounded ${receiptWidth === '58mm' ? 'bg-emerald-600 text-white font-bold' : 'text-slate-400'}`}
                >
                  58mm
                </button>
              </div>
            </div>

            <div id="printable-receipt" style={{ display: 'grid', gap: '12px' }}>
              <div style={{ textAlign: 'center', paddingBottom: '12px', borderBottom: '1px dashed var(--border-default)' }}>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 900, margin: '0 0 4px', color: 'var(--text-primary)' }}>ZENITH POS RETAIL</h3>
                <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', margin: 0 }}>Pusat Grosir &amp; Eceran UMKM Professional</p>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-tertiary)', margin: '2px 0 0' }}>Member: {receiptData.customerName}</p>
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
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
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
                    <span style={{ gridColumn: 'span 5', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{formatProductName(item.name)}</span>
                    <span style={{ gridColumn: 'span 3', textAlign: 'center', color: 'var(--text-secondary)' }}>{formatRupiah(item.price)}</span>
                    <span style={{ gridColumn: 'span 1', textAlign: 'center', fontWeight: 700 }}>{item.qty}</span>
                    <span style={{ gridColumn: 'span 3', textAlign: 'right', fontWeight: 700, color: 'var(--accent-secondary)' }}>{formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div style={{ display: 'grid', gap: '6px', paddingBottom: '14px', borderBottom: '1px dashed var(--border-default)', fontSize: '0.8rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                  <span>Subtotal:</span>
                  <span>{formatRupiah(receiptData.subtotal)}</span>
                </div>
                {receiptData.taxAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>PPN 11%:</span>
                    <span>{formatRupiah(receiptData.taxAmount)}</span>
                  </div>
                )}
                {receiptData.serviceAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>Service 5%:</span>
                    <span>{formatRupiah(receiptData.serviceAmount)}</span>
                  </div>
                )}
                {receiptData.discountAmount > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                    <span>Diskon Member:</span>
                    <span>-{formatRupiah(receiptData.discountAmount)}</span>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 900, color: 'var(--text-primary)', paddingTop: '4px', borderTop: '1px solid var(--border-default)' }}>
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
