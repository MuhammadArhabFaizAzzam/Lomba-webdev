'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Minus, Plus, Search, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

export default function POSPage() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [paymentMethod, setPaymentMethod] = useState('QRIS');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [themeMode, setThemeMode] = useState('dark');

  useEffect(() => {
    const savedProducts = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    const parsedProducts = savedProducts ? JSON.parse(savedProducts) : [];
    const loadProducts = window.setTimeout(() => setProducts(parsedProducts), 0);

    const savedTheme = localStorage.getItem('zenith_pos_theme');
    const loadTheme = savedTheme
      ? window.setTimeout(() => setThemeMode(savedTheme), 0)
      : undefined;

    return () => {
      window.clearTimeout(loadProducts);
      if (loadTheme) window.clearTimeout(loadTheme);
    };
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
  const tax = subtotal * 0.11;
  const grandTotal = subtotal + tax;

  const addToCart = (product) => {
    if (product.stock <= 0) return;
    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.id === product.id);
      if (existing) {
        if (existing.qty >= product.stock) return prevCart;
        return prevCart.map((item) => item.id === product.id ? { ...item, qty: item.qty + 1 } : item);
      }
      return [...prevCart, { ...product, qty: 1 }];
    });
  };

  const updateQty = (productId, delta) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item.id !== productId) return item;
          const nextQty = item.qty + delta;
          if (nextQty <= 0) return null;
          return { ...item, qty: nextQty };
        })
        .filter(Boolean)
    );
  };

  const removeItem = (productId) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;

    const now = new Date();
    const trxId = `TRX-${now.getTime().toString().slice(-6)}`;
    const transaction = {
      id: trxId,
      date: now.toISOString().slice(0, 10),
      items: cart.map((item) => `${item.name} (${item.qty})`).join(', '),
      total: grandTotal,
      payment: paymentMethod,
    };

    const saved = localStorage.getItem('zenith_transactions') || localStorage.getItem('umkm_transactions');
    const currentTransactions = saved ? JSON.parse(saved) : [];
    const nextTransactions = [transaction, ...currentTransactions];
    localStorage.setItem('zenith_transactions', JSON.stringify(nextTransactions));
    localStorage.setItem('umkm_transactions', JSON.stringify(nextTransactions));

    const updatedProducts = products.map((product) => {
      const cartItem = cart.find((item) => item.id === product.id);
      if (!cartItem) return product;
      return { ...product, stock: Math.max(0, Number(product.stock || 0) - cartItem.qty) };
    });

    setProducts(updatedProducts);
    localStorage.setItem('zenith_products', JSON.stringify(updatedProducts));
    localStorage.setItem('umkm_products', JSON.stringify(updatedProducts));
    setCart([]);
  };

  const paymentMethods = ['QRIS', 'Cash', 'Transfer', 'E-Wallet'];

  return (
    <div className="pos-shell">
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
              <button
                key={product.id}
                type="button"
                className="tap-card"
                onClick={() => addToCart(product)}
              >
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
          <button className="pill-button" type="button" onClick={() => setCart([])}>Reset</button>
        </div>

        <div className="cart-items">
          {cart.length === 0 ? (
            <div className="empty-state">Keranjang masih kosong.</div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="cart-row">
                <div>
                  <div className="cart-item-name">{item.name}</div>
                  <div className="quick-value">{formatRupiah(item.price)} / pcs</div>
                </div>

                <div className="cart-qty">
                  <button className="qty-button" type="button" onClick={() => updateQty(item.id, -1)} disabled={item.qty <= 1}>
                    <Minus size={12} />
                  </button>
                  <span>{item.qty}</span>
                  <button className="qty-button" type="button" onClick={() => updateQty(item.id, 1)}>
                    <Plus size={12} />
                  </button>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700 }}>{formatRupiah(item.price * item.qty)}</div>
                  <button type="button" onClick={() => removeItem(item.id)} style={{ marginTop: 4, color: 'var(--text-tertiary)' }}>
                    <Trash2 size={12} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-total">
          <div className="total-row">
            <span>Subtotal</span>
            <span>{formatRupiah(subtotal)}</span>
          </div>
          <div className="total-row">
            <span>Pajak</span>
            <span>{formatRupiah(tax)}</span>
          </div>
          <div className="total-row">
            <span>Total</span>
            <strong>{formatRupiah(grandTotal)}</strong>
          </div>

          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginBottom: 8 }}>Metode Pembayaran</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {paymentMethods.map((method) => (
                <button
                  key={method}
                  type="button"
                  className={`payment-button ${paymentMethod === method ? 'active' : ''}`}
                  onClick={() => setPaymentMethod(method)}
                  style={{
                    background: paymentMethod === method ? 'var(--surface-2)' : 'rgba(255,255,255,0.02)',
                    color: 'var(--text-primary)',
                    border: paymentMethod === method ? '1px solid var(--accent-tertiary)' : '1px solid var(--border-default)',
                    minWidth: 92,
                    padding: '10px 12px',
                    fontWeight: 700,
                  }}
                >
                  {method}
                </button>
              ))}
            </div>
          </div>

          <button type="button" className="checkout-button" onClick={handleCheckout} disabled={cart.length === 0}>
            Proses Pembayaran / Checkout
          </button>
        </div>
      </aside>
    </div>
  );
}
