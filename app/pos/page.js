'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
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
  const [discountPercent, setDiscountPercent] = useState(0);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    setProducts(readStoredArray('products').map(normalizeProduct));

    const savedTheme = localStorage.getItem('zenith_pos_theme');
    setThemeMode(savedTheme || 'dark');
  }, []);

  useEffect(() => {
    document.body.setAttribute('data-theme', themeMode === 'light' ? 'pos-light' : 'dark');
    localStorage.setItem('zenith_pos_theme', themeMode);
  }, [themeMode]);

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchQuery, selectedCategory]);

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  const discountAmount = Math.round(subtotal * Math.min(100, Math.max(0, Number(discountPercent) || 0)) / 100);
  const total = Math.max(0, subtotal - discountAmount);
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
      subtotal,
      discountPercent: Number(discountPercent) || 0,
      discountAmount,
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
      discountAmount: transaction.discountAmount,
      cashReceived: transaction.cashReceived,
      change: transaction.change,
      cartItems: transaction.items,
    });
    setShowReceiptModal(true);
    setCart([]);
    setCashReceived('');
    setDiscountPercent(0);
    setPaymentMethod('QRIS');
    setIsCheckingOut(false);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">Stok Kosong</span>;
    }
    if (stock >= 1 && stock <= 20) {
      return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">Stok Menipis ({stock})</span>;
    }
    return <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">Stok Normal ({stock})</span>;
  };

  return (
    <div className="pos-shell">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      <div className="pos-area">
        <div className="pos-toolbar">
          <div>
            <h2 className="pos-title">Kasir Point of Sale</h2>
            <p className="pos-subtitle">Pilih produk dan proses checkout dengan cepat.</p>
          </div>

          <button
            type="button"
            className="pill-button"
            onClick={() => setThemeMode((prev) => (prev === 'dark' ? 'light' : 'dark'))}
          >
            {themeMode === 'dark' ? 'Dark mode' : 'Light mode'}
          </button>
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
          <button className="pill-button" type="button" onClick={() => setCart([])} aria-label="Kosongkan keranjang">Reset</button>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col">
            <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-800">Keranjang Pesanan</h3>
              <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
                {cart.reduce((sum, item) => sum + item.qty, 0)} Item
              </span>
            </div>

            <div className="space-y-3 mb-6">
              {cart.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs font-medium">
                  Keranjang masih kosong. Pilih produk dari katalog di samping.
                </div>
              ) : (
                cart.map((item) => (
                  <div key={item.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{item.name}</h4>
                      <p className="text-[11px] text-indigo-600 font-extrabold">{formatRupiah(item.price)}</p>
                    </div>
                    <div className="flex items-center space-x-1.5 shrink-0">
                      <button type="button" onClick={() => updateQty(item.id, -1)} aria-label={`Kurangi ${item.name}`} className="w-6 h-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold rounded border border-slate-200 transition">-</button>
                      <span className="w-6 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                      <button type="button" onClick={() => updateQty(item.id, 1)} aria-label={`Tambah ${item.name}`} className="w-6 h-6 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-xs font-bold rounded border border-slate-200 transition">+</button>
                      <button type="button" onClick={() => removeFromCart(item.id)} aria-label={`Hapus ${item.name}`} className="ml-1 text-slate-400 hover:text-rose-600 p-1 transition" title="Hapus">&times;</button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="space-y-2 mb-6 pt-4 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">Metode Pembayaran</label>
              <div className="grid grid-cols-3 gap-2">
                {['QRIS', 'Tunai', 'Transfer'].map((method) => (
                  <button
                    key={method}
                    type="button"
                    onClick={() => setPaymentMethod(method)}
                    className={`py-2 rounded-xl text-xs font-bold border transition ${
                      paymentMethod === method
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                        : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {method}
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 space-y-3">
              <div className="flex justify-between items-center text-sm font-bold text-slate-900">
                <span>Total Pembayaran:</span>
                <span className="text-lg font-extrabold text-indigo-600">{formatRupiah(total)}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="text-xs font-bold text-slate-700">
                  Diskon (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={discountPercent}
                    onChange={(event) => setDiscountPercent(event.target.value)}
                    className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                  />
                </label>
                {paymentMethod === 'Tunai' && (
                  <label className="text-xs font-bold text-slate-700">
                    Uang diterima
                    <input
                      type="text"
                      inputMode="numeric"
                      value={cashReceived}
                      onChange={(event) => setCashReceived(event.target.value.replace(/\D/g, ''))}
                      className="mt-1 w-full rounded-lg border border-slate-200 px-2 py-2 text-sm"
                      placeholder="Rp"
                    />
                  </label>
                )}
              </div>
              {paymentMethod === 'Tunai' && cashAmount >= total && (
                <div className="text-right text-xs font-bold text-emerald-600">Kembalian: {formatRupiah(change)}</div>
              )}
              <button
                onClick={handleCheckout}
                disabled={cart.length === 0 || isCheckingOut}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs shadow-lg shadow-indigo-600/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                </svg>
                <span>Proses Checkout & Cetak Struk</span>
              </button>
            </div>
          </div>
        </div>
      </aside>

      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none font-mono text-slate-800">
            <div id="printable-receipt" className="space-y-4">
              <div className="text-center pb-3 border-b border-dashed border-slate-300">
                <h3 className="text-lg font-black tracking-tight text-slate-900">ZENITH POS RETAIL</h3>
                <p className="text-[11px] text-slate-500">Pusat Grosir & Eceran UMKM Professional</p>
              </div>

              <div className="text-xs space-y-1 pb-3 border-b border-dashed border-slate-300">
                <div className="flex justify-between">
                  <span className="text-slate-500">No. Transaksi:</span>
                  <span className="font-bold text-indigo-600">{receiptData.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Waktu:</span>
                  <span className="font-medium text-slate-700">{receiptData.date}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Metode Bayar:</span>
                  <span className="font-bold text-slate-800">{receiptData.payment}</span>
                </div>
              </div>

              <div className="space-y-3 pb-3 border-b border-dashed border-slate-300 text-xs">
                <div className="text-[10px] uppercase font-bold text-slate-400 grid grid-cols-12 gap-1 pb-1">
                  <span className="col-span-5">Nama Barang</span>
                  <span className="col-span-3 text-center">Harga @</span>
                  <span className="col-span-1 text-center">Qty</span>
                  <span className="col-span-3 text-right">Subtotal</span>
                </div>
                {receiptData.cartItems.map((item, idx) => (
                  <div key={idx} className="grid grid-cols-12 gap-1 items-center text-xs">
                    <span className="col-span-5 font-medium truncate">{item.name}</span>
                    <span className="col-span-3 text-center text-slate-600">{formatRupiah(item.price)}</span>
                    <span className="col-span-1 text-center font-bold text-slate-800">{item.qty}</span>
                    <span className="col-span-3 text-right font-bold text-indigo-600">{formatRupiah(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="space-y-1.5 pb-4 border-b border-dashed border-slate-300 text-sm">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Subtotal:</span>
                  <span>{formatRupiah(receiptData.subtotal)}</span>
                </div>
                {receiptData.discountAmount > 0 && (
                  <div className="flex justify-between text-xs text-rose-600">
                    <span>Diskon:</span>
                    <span>-{formatRupiah(receiptData.discountAmount)}</span>
                  </div>
                )}
                <div className="flex justify-between font-extrabold text-slate-900 text-base pt-1">
                  <span>TOTAL:</span>
                  <span className="text-indigo-600">{formatRupiah(receiptData.total)}</span>
                </div>
                {receiptData.payment === 'Tunai' && (
                  <div className="flex justify-between text-xs text-slate-600">
                    <span>Kembalian:</span>
                    <span>{formatRupiah(receiptData.change)}</span>
                  </div>
                )}
              </div>

              <div className="text-center pt-2 space-y-1">
                <p className="text-xs font-bold text-slate-800">TERIMA KASIH TELAH BERBELANJA</p>
                <p className="text-[10px] text-slate-500">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex space-x-3 print:hidden">
              <button type="button" onClick={() => setShowReceiptModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Tutup</button>
              <button type="button" onClick={handlePrintReceipt} className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center justify-center space-x-1.5">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
                <span>Cetak Struk (PDF)</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
