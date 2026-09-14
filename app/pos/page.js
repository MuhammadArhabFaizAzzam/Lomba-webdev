'use client';

import { useState, useEffect } from 'react';

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('umkm_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      const initial = [
        { id: 1, name: 'Kopi Susu Gula Aren (Cup)', category: 'Minuman', price: 18000, stock: 45 },
        { id: 2, name: 'Roti Bakar Special Keju', category: 'Makanan', price: 25000, stock: 4 },
        { id: 3, name: 'Nasi Goreng Rempah UMKM', category: 'Makanan', price: 22000, stock: 12 },
        { id: 4, name: 'Es Teh Manis Segar', category: 'Minuman', price: 5000, stock: 80 },
        { id: 5, name: 'Dimsum Ayam (isi 4)', category: 'Cemilan', price: 15000, stock: 3 },
      ];
      setProducts(initial);
      localStorage.setItem('umkm_products', JSON.stringify(initial));
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
          alert('Jumlah melebihi stok tersedia!');
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

    // Update product stock
    const updatedProducts = products.map((p) => {
      const cartItem = cart.find((ci) => ci.id === p.id);
      if (cartItem) {
        return { ...p, stock: p.stock - cartItem.qty };
      }
      return p;
    });

    setProducts(updatedProducts);
    localStorage.setItem('umkm_products', JSON.stringify(updatedProducts));

    // Save transaction
    const savedTrx = localStorage.getItem('umkm_transactions');
    const transactions = savedTrx ? JSON.parse(savedTrx) : [];
    const newTrx = {
      id: trxId,
      date: dateStr,
      items: itemsSummary,
      total: total,
      payment: paymentMethod,
    };

    const newTransactions = [newTrx, ...transactions];
    localStorage.setItem('umkm_transactions', JSON.stringify(newTransactions));

    setSuccessMessage(`Transaksi ${trxId} Berhasil! Total: ${formatRupiah(total)}`);
    setCart([]);

    setTimeout(() => {
      setSuccessMessage('');
    }, 4000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      {/* Product Catalog */}
      <div className="lg:col-span-2 space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Kasir Point of Sale (POS) 🛒</h2>
          <p className="text-slate-500 text-sm">Pilih produk di bawah untuk dimasukkan ke keranjang pesanan pelanggan.</p>
        </div>

        {successMessage && (
          <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl font-medium text-sm flex items-center space-x-2">
            <span>✅</span>
            <span>{successMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              onClick={() => addToCart(product)}
              className={`bg-white p-5 rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between ${
                product.stock === 0
                  ? 'opacity-60 bg-slate-100 border-slate-200 cursor-not-allowed'
                  : 'border-slate-200 hover:shadow-lg hover:border-blue-400'
              }`}
            >
              <div>
                <div className="flex justify-between items-start mb-2">
                  <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                    {product.category}
                  </span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${product.stock <= 5 ? 'bg-amber-100 text-amber-800' : 'bg-emerald-100 text-emerald-800'}`}>
                    Stok: {product.stock}
                  </span>
                </div>
                <h3 className="font-bold text-slate-800 text-base mb-1">{product.name}</h3>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
                <span className="font-extrabold text-blue-600 text-base">{formatRupiah(product.price)}</span>
                <span className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                  +
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cart / Checkout Panel */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 flex flex-col justify-between h-fit sticky top-6">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
            <h3 className="text-lg font-bold text-slate-800">Keranjang Belanja</h3>
            <span className="px-2.5 py-1 bg-blue-50 text-blue-600 text-xs font-bold rounded-lg">
              {cart.reduce((a, c) => a + c.qty, 0)} Item
            </span>
          </div>

          {cart.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-sm">
              🛒 Keranjang kosong.<br />Klik produk untuk mulai transaksi.
            </div>
          ) : (
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                  <div className="flex-1 pr-2">
                    <h4 className="font-semibold text-slate-800 text-sm truncate">{item.name}</h4>
                    <span className="text-xs text-blue-600 font-semibold">{formatRupiah(item.price)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => updateQty(item.id, -1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                    >
                      -
                    </button>
                    <span className="text-sm font-bold w-5 text-center">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.id, 1)}
                      className="w-7 h-7 rounded-lg bg-white border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-center hover:bg-slate-100"
                    >
                      +
                    </button>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-rose-500 hover:text-rose-700 text-xs ml-1 p-1"
                    >
                      ✕
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
                      ? 'bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-600/20'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between items-center text-lg font-bold text-slate-800">
            <span>Total Pembayaran:</span>
            <span className="text-blue-600">{formatRupiah(calculateTotal())}</span>
          </div>

          <button
            onClick={handleCheckout}
            disabled={cart.length === 0}
            className={`w-full py-3.5 px-4 rounded-xl font-bold text-sm text-white shadow-lg transition ${
              cart.length === 0
                ? 'bg-slate-300 cursor-not-allowed shadow-none'
                : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
            }`}
          >
            Proses Pembayaran & Cetak Struk ⚡
          </button>
        </div>
      </div>
    </div>
  );
}
