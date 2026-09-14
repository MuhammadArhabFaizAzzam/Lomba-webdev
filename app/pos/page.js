'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [successMessage, setSuccessMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  
  // Receipt modal state
  const [receiptData, setReceiptData] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

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
      alert('Stok produk habis!');
      return;
    }

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) {
          alert('Jumlah melebihi stok tersedia di gudang!');
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
            alert('Melebihi stok gudang!');
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
    const dateStr = now.toISOString().slice(0, 10) + ' ' + now.toTimeString().slice(0, 5);

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

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
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
            <div className="col-span-full py-12 text-center text-slate-400 text-sm">
              Tidak ada produk yang cocok dengan pencarian.
            </div>
          ) : (
            filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className={`bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                  product.stock === 0
                    ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed'
                    : 'border-slate-200 hover:shadow-lg hover:border-indigo-400 group'
                }`}
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                      {product.category}
                    </span>
                    <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${product.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-50 text-emerald-700'}`}>
                      Stok: {product.stock}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-800 text-sm mb-1 group-hover:text-indigo-600 transition">{product.name}</h3>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                  <span className="font-extrabold text-indigo-600 text-sm">{formatRupiah(product.price)}</span>
                  <span className="w-7 h-7 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs group-hover:bg-indigo-600 group-hover:text-white transition">
                    +
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Cart / Checkout Panel */}
      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 p-6 flex flex-col justify-between h-fit sticky top-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-base font-bold text-slate-800">Keranjang Belanja</h3>
            <span className="px-2.5 py-1 bg-indigo-50 text-indigo-600 text-xs font-bold rounded-lg">
              {cart.reduce((a, c) => a + c.qty, 0)} Item
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs font-medium">
              Keranjang masih kosong.<br />Pilih produk dari katalog di samping.
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50/80 rounded-xl border border-slate-100">
                  <div className="flex-1 pr-2">
                    <h4 className="font-semibold text-slate-800 text-xs truncate">{item.name}</h4>
                    <span className="text-xs text-indigo-600 font-semibold">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-6 h-6 rounded-md bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs ml-1 p-1 font-bold"
                    >
                      &times;
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
              Metode Pembayaran
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['QRIS', 'Tunai', 'Transfer'].map((method) => (
                <button
                  key={method}
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 rounded-xl text-xs font-semibold border transition ${
                    paymentMethod === method
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-base font-bold text-slate-800 pt-1">
            <span>Total Pembayaran:</span>
            <span className="text-indigo-600 text-lg">{formatRupiah(calculateTotal())}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3 px-4 rounded-xl font-bold text-xs text-white shadow-md transition ${
              cart.length === 0
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed shadow-none'
                : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30'
            }`}
          >
            Proses Pembayaran & Cetak Struk
          </button>
        </div>
      </div>

      {/* Thermal Receipt Modal */}
      {showReceiptModal && receiptData && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 flex flex-col">
            <div className="text-center pb-4 border-b border-dashed border-slate-300">
              <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white font-bold text-lg flex items-center justify-center mx-auto mb-2 shadow-md">
                Z
              </div>
              <h3 className="font-extrabold text-slate-900 text-base">ZENITH POS RECEIPT</h3>
              <p className="text-[11px] text-slate-500">Professional Retail Solution</p>
            </div>

            <div className="py-4 space-y-2 text-xs text-slate-600 border-b border-dashed border-slate-300">
              <div className="flex justify-between">
                <span>No. Transaksi:</span>
                <span className="font-bold text-slate-800">{receiptData.id}</span>
              </div>
              <div className="flex justify-between">
                <span>Waktu:</span>
                <span className="font-medium text-slate-800">{receiptData.date}</span>
              </div>
              <div className="flex justify-between">
                <span>Metode Bayar:</span>
                <span className="font-semibold text-indigo-600">{receiptData.payment}</span>
              </div>
            </div>

            <div className="py-4 space-y-2 max-h-48 overflow-y-auto border-b border-dashed border-slate-300">
              {receiptData.cartItems ? (
                receiptData.cartItems.map((ci, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <div className="pr-2">
                      <p className="font-semibold text-slate-800">{ci.name}</p>
                      <p className="text-[11px] text-slate-400">{ci.qty} x {formatRupiah(ci.price)}</p>
                    </div>
                    <span className="font-bold text-slate-800 self-center">{formatRupiah(ci.qty * ci.price)}</span>
                  </div>
                ))
              ) : (
                <p className="text-xs text-slate-600">{receiptData.items}</p>
              )}
            </div>

            <div className="py-4 space-y-1.5 border-b border-dashed border-slate-300">
              <div className="flex justify-between text-sm font-extrabold text-slate-900">
                <span>TOTAL:</span>
                <span className="text-indigo-600">{formatRupiah(receiptData.total)}</span>
              </div>
            </div>

            <div className="text-center py-3 text-[11px] text-slate-400">
              Terima Kasih atas Kunjungan Anda!<br />Barang yang sudah dibeli tidak dapat ditukar.
            </div>

            <div className="flex space-x-2 pt-2">
              <button
                onClick={() => {
                  window.print();
                }}
                className="flex-1 py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs transition"
              >
                Cetak Struk
              </button>
              <button
                onClick={() => setShowReceiptModal(false)}
                className="flex-1 py-2.5 px-4 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs hover:bg-slate-50 transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
