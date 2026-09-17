'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [successMessage, setSuccessMessage] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Receipt modal state
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const saved = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts([]);
    }
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

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
          item.id === product.id ? { ...item, qty: item.qty + 1 } : item
        );
      } else {
        return [...prevCart, { ...product, qty: 1 }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== id));
  };

  const updateQty = (id, delta) => {
    setCart((prevCart) => {
      return prevCart.map((item) => {
        if (item.id === id) {
          const product = products.find((p) => p.id === id);
          const newQty = item.qty + delta;
          if (newQty <= 0) return null;
          if (newQty > product.stock) {
            showToast('Melebihi stok gudang!');
            return item;
          }
          return { ...item, qty: newQty };
        }
        return item;
      }).filter(Boolean);
    });
  };

  const calculateTotal = () => {
    return cart.reduce((sum, item) => sum + item.price * item.qty, 0);
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const total = calculateTotal();
    const trxId = 'TRX-' + Math.floor(1000 + Math.random() * 9000);
    const now = new Date();
    const dateStr = now.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + now.toTimeString().slice(0, 5);

    const itemsSummary = cart.map((i) => `${i.name} (${i.qty})`).join(', ');

    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((ci) => ci.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.qty };
      }
      return p;
    });

    setProducts(updatedProducts);
    localStorage.setItem('zenith_products', JSON.stringify(updatedProducts));
    localStorage.setItem('umkm_products', JSON.stringify(updatedProducts));

    const savedTrx = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');
    const transactions = savedTrx ? JSON.parse(savedTrx) : [];
    
    const transactionRecord = {
      id: trxId,
      date: dateStr,
      items: itemsSummary,
      cartItems: [...cart],
      total: total,
      payment: paymentMethod,
    };

    const newTransactions = [transactionRecord, ...transactions];
    localStorage.setItem('zenith_transactions', JSON.stringify(newTransactions));
    localStorage.setItem('umkm_transactions', JSON.stringify(newTransactions));

    // Set receipt data and open receipt modal
    setReceiptData(transactionRecord);
    setShowReceiptModal(true);
    setSuccessMessage(`Transaksi ${trxId} Berhasil Disimpan!`);
    setCart([]);
    setPaymentMethod('QRIS');

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  // Stock status badge helper
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-50 text-rose-700 border border-rose-200">
          Stok Kosong
        </span>
      );
    } else if (stock >= 1 && stock <= 20) {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
          Stok Menipis ({stock})
        </span>
      );
    } else {
      return (
        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
          Stok Normal ({stock})
        </span>
      );
    }
  };

  const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

  const filteredProducts = products.filter((p) => {
    const matchesCategory = selectedCategory === 'Semua' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* Product Catalog */}
      <div className="lg:col-span-2 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Kasir Point of Sale</h2>
            <p className="text-slate-500 text-sm font-normal">Pilih produk di bawah untuk memasukkan ke keranjang pesanan.</p>
          </div>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-sm flex items-center space-x-3">
            <svg className="w-5 h-5 text-emerald-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
            </svg>
            <span>{successMessage}</span>
          </div>
        )}

        {/* Search & Category Filter */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama produk..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 transition"
            />
          </div>
          <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
          {products.length === 0 ? (
            <div className="col-span-full py-16 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm font-medium p-8">
              <p className="mb-3">Belum ada produk terdaftar di sistem POS.</p>
              <Link
                href="/inventory"
                className="inline-block px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-xl hover:bg-indigo-500 transition shadow-sm"
              >
                + Tambah Produk di Manajemen Stok &rarr;
              </Link>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="col-span-full py-12 bg-white rounded-2xl border border-slate-200 text-center text-slate-400 text-sm font-medium">
              Tidak ada produk yang cocok dengan pencarian.
            </div>
          ) : (
            filteredProducts.map((p) => {
              const isOutOfStock = p.stock <= 0;
              return (
                <div
                  key={p.id}
                  onClick={() => !isOutOfStock && addToCart(p)}
                  className={`bg-white p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between ${
                    isOutOfStock
                      ? 'opacity-60 cursor-not-allowed border-slate-200 bg-slate-50'
                      : 'cursor-pointer hover:border-indigo-500 hover:shadow-md border-slate-200 group'
                  }`}
                >
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                        {p.category}
                      </span>
                      {getStockBadge(p.stock)}
                    </div>
                    <h3 className="text-sm font-bold text-slate-800 mb-1 group-hover:text-indigo-600 transition-colors">
                      {p.name}
                    </h3>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <span className="text-sm font-extrabold text-indigo-600">{formatRupiah(p.price)}</span>
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${isOutOfStock ? 'bg-slate-200 text-slate-500' : 'bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white transition-colors'}`}>
                      {isOutOfStock ? 'Habis' : '+ Tambah'}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Shopping Cart & Checkout Sidebar (Non-scrollable container requirement) */}
      <div className="space-y-6">
        <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 flex flex-col">
          <div className="flex justify-between items-center pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Keranjang Pesanan</h3>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded-lg">
              {cart.reduce((sum, item) => sum + item.qty, 0)} Item
            </span>
          </div>

          {/* Cart Items List - Non-Scrollable Container */}
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
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 text-xs font-bold rounded border border-slate-200 transition"
                    >
                      -
                    </button>
                    <span className="w-6 text-center text-xs font-bold text-slate-800">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 text-xs font-bold rounded border border-slate-200 transition"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="ml-1 text-slate-400 hover:text-rose-600 p-1 transition"
                      title="Hapus"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Payment Method Selection */}
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

          {/* Summary & Checkout */}
          <div className="pt-4 border-t border-slate-100 space-y-3">
            <div className="flex justify-between items-center text-sm font-bold text-slate-900">
              <span>Total Pembayaran:</span>
              <span className="text-lg font-extrabold text-indigo-600">{formatRupiah(calculateTotal())}</span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={cart.length === 0}
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

      {/* Professional Thermal Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn print:p-0 print:bg-white print:static">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 print:shadow-none print:border-none print:w-full print:max-w-none font-mono text-slate-800">
            {/* Receipt Printable Area */}
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

              {/* Items Table */}
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

              {/* Total */}
              <div className="space-y-1.5 pb-4 border-b border-dashed border-slate-300 text-sm">
                <div className="flex justify-between font-extrabold text-slate-900 text-base pt-1">
                  <span>TOTAL:</span>
                  <span className="text-indigo-600">{formatRupiah(receiptData.total)}</span>
                </div>
              </div>

              {/* Footer / Thank you */}
              <div className="text-center pt-2 space-y-1">
                <p className="text-xs font-bold text-slate-800">TERIMA KASIH TELAH BERBELANJA</p>
                <p className="text-[10px] text-slate-500">Barang yang sudah dibeli tidak dapat ditukar/dikembalikan.</p>
              </div>
            </div>

            {/* Modal Action Buttons (Hidden on print) */}
            <div className="mt-6 pt-4 border-t border-slate-100 flex space-x-3 print:hidden">
              <button
                type="button"
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Tutup
              </button>
              <button
                type="button"
                onClick={handlePrintReceipt}
                className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition flex items-center justify-center space-x-1.5"
              >
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
