'use client';

import { useEffect, useMemo, useState } from 'react';
import { Minus, PackagePlus, Plus, Search, Trash2, X } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  useEffect(() => {
    const saved = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    const loadProducts = window.setTimeout(() => setProducts(saved ? JSON.parse(saved) : []), 0);
    return () => window.clearTimeout(loadProducts);
  }, []);

  const persistProducts = (nextProducts) => {
    setProducts(nextProducts);
    localStorage.setItem('zenith_products', JSON.stringify(nextProducts));
    localStorage.setItem('umkm_products', JSON.stringify(nextProducts));
  };

  const handleAddProduct = (event) => {
    event.preventDefault();
    if (!form.name.trim() || !form.price || !form.stock) {
      alert('Semua field wajib diisi!');
      return;
    }

    persistProducts([{
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(form.price),
      stock: Number(form.stock),
    }, ...products]);
    setForm({ name: '', category: 'Makanan', price: '', stock: '' });
    setShowAddModal(false);
  };

  const updateStock = (id, delta) => {
    persistProducts(products.map((product) => (
      product.id === id
        ? { ...product, stock: Math.max(0, Number(product.stock || 0) + delta) }
        : product
    )));
  };

  const handleDelete = (id) => {
    if (confirm('Yakin ingin menghapus produk ini dari inventaris?')) {
      persistProducts(products.filter((product) => product.id !== id));
    }
  };

  const filteredProducts = useMemo(() => products.filter((product) => (
    (selectedCategory === 'Semua' || product.category === selectedCategory)
    && product.name.toLowerCase().includes(searchQuery.toLowerCase())
  )), [products, searchQuery, selectedCategory]);

  const lowStockCount = products.filter((product) => Number(product.stock || 0) <= 5).length;

  return (
    <div className="page-stack">
      <div className="page-heading">
        <div>
          <span className="eyebrow">Inventory control</span>
          <h2>Manajemen Stok &amp; Produk</h2>
          <p>Kelola katalog, harga, dan ketersediaan barang tanpa kehilangan fokus.</p>
        </div>
        <button className="btn-primary" type="button" onClick={() => setShowAddModal(true)}>
          <PackagePlus size={16} /> Tambah Produk
        </button>
      </div>

      <div className="inventory-overview">
        <div><span>Total Produk</span><strong>{products.length}</strong></div>
        <div><span>Stok Menipis</span><strong className={lowStockCount ? 'warning-value' : ''}>{lowStockCount}</strong></div>
        <div><span>Hasil Filter</span><strong>{filteredProducts.length}</strong></div>
      </div>

      <div className="table-toolbar inventory-toolbar">
        <div className="search-field">
          <Search size={17} />
          <input value={searchQuery} onChange={(event) => setSearchQuery(event.target.value)} placeholder="Cari produk di inventaris..." />
        </div>
        <div className="filter-tabs">
          {categories.map((category) => (
            <button key={category} type="button" className={selectedCategory === category ? 'active' : ''} onClick={() => setSelectedCategory(category)}>
              {category}
            </button>
          ))}
        </div>
      </div>

      <div className="data-panel">
        <div className="table-scroll">
          <table className="data-table inventory-table">
            <thead>
              <tr>
                <th>Produk</th>
                <th>Kategori</th>
                <th>Harga Satuan</th>
                <th>Status Stok</th>
                <th className="align-center">Atur Stok</th>
                <th className="align-right">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr><td colSpan="6"><div className="table-empty"><span className="empty-icon"><PackagePlus size={22} /></span><strong>Belum ada produk</strong><p>Tambahkan produk pertama untuk mulai mengelola inventaris.</p><button className="btn-primary" type="button" onClick={() => setShowAddModal(true)}>Tambah Produk</button></div></td></tr>
              ) : filteredProducts.map((product) => {
                const stock = Number(product.stock || 0);
                return (
                  <tr key={product.id}>
                    <td className="item-cell">{product.name}</td>
                    <td><span className="category-badge">{product.category}</span></td>
                    <td className="amount-cell">{formatRupiah(product.price)}</td>
                    <td><span className={`stock-badge ${stock <= 5 ? 'low' : ''}`}>{stock <= 5 ? `Menipis · ${stock}` : `${stock} unit`}</span></td>
                    <td className="align-center"><div className="stock-stepper"><button type="button" onClick={() => updateStock(product.id, -1)} disabled={stock === 0}><Minus size={14} /></button><strong>{stock}</strong><button type="button" onClick={() => updateStock(product.id, 1)}><Plus size={14} /></button></div></td>
                    <td className="align-right"><button className="icon-danger" type="button" onClick={() => handleDelete(product.id)} aria-label={`Hapus ${product.name}`}><Trash2 size={16} /></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="modal-backdrop" role="presentation">
          <div className="modal-card" role="dialog" aria-modal="true" aria-labelledby="add-product-title">
            <div className="modal-header"><div><span className="eyebrow">New catalog item</span><h3 id="add-product-title">Tambah Produk</h3></div><button className="icon-button" type="button" onClick={() => setShowAddModal(false)} aria-label="Tutup"><X size={18} /></button></div>
            <form onSubmit={handleAddProduct} className="form-stack">
              <label>Nama Produk<input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} placeholder="Contoh: Es Teh Manis" /></label>
              <label>Kategori<select value={form.category} onChange={(event) => setForm({ ...form, category: event.target.value })}>{categories.slice(1).map((category) => <option key={category}>{category}</option>)}</select></label>
              <div className="form-grid"><label>Harga (Rp)<input type="number" min="0" value={form.price} onChange={(event) => setForm({ ...form, price: event.target.value })} placeholder="15000" /></label><label>Stok Awal<input type="number" min="0" value={form.stock} onChange={(event) => setForm({ ...form, stock: event.target.value })} placeholder="50" /></label></div>
              <div className="modal-actions"><button className="btn-secondary" type="button" onClick={() => setShowAddModal(false)}>Batal</button><button className="btn-primary" type="submit">Simpan Produk</button></div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
