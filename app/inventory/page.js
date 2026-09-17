'use client';

import { useEffect, useMemo, useState } from 'react';
import { PackagePlus, Plus, Search, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '', stock: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Makanan', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null,
    targetId: null,
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    setProducts(saved ? JSON.parse(saved) : []);
  }, []);

  const persistProducts = (nextProducts) => {
    setProducts(nextProducts);
    localStorage.setItem('zenith_products', JSON.stringify(nextProducts));
    localStorage.setItem('umkm_products', JSON.stringify(nextProducts));
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const formatNumberInput = (value) => {
    const cleanValue = String(value || '').replace(/\D/g, '');
    if (!cleanValue) return '';
    return Number(cleanValue).toLocaleString('id-ID');
  };

  const handlePriceBlur = (value, formType, fieldName = 'price') => {
    const cleanValue = String(value || '').replace(/\D/g, '');
    if (!cleanValue) return;
    let num = Number(cleanValue);
    if (num > 0 && num < 1000) num *= 1000;
    const formatted = num.toLocaleString('id-ID');
    if (formType === 'add') setForm((prev) => ({ ...prev, [fieldName]: formatted }));
    if (formType === 'edit') setEditForm((prev) => ({ ...prev, [fieldName]: formatted }));
  };

  const parseNumberInput = (formattedValue) => {
    if (!formattedValue) return '';
    const cleanValue = String(formattedValue).replace(/\./g, '').replace(/\D/g, '');
    return cleanValue ? Number(cleanValue) : '';
  };

  const handleAddProduct = (e) => {
    e.preventDefault();
    const rawPrice = parseNumberInput(form.price);
    if (!form.name || rawPrice === '' || form.stock === '') {
      showToast('Semua field wajib diisi!');
      return;
    }

    const nextProducts = [{
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(rawPrice),
      stock: Number(form.stock),
    }, ...products];

    persistProducts(nextProducts);
    setForm({ name: '', category: 'Makanan', price: '', stock: '' });
    setShowAddModal(false);
    showToast('Produk berhasil ditambahkan!');
  };

  const handleOpenEdit = (product) => {
    setEditForm({
      id: product.id,
      name: product.name,
      category: product.category,
      price: product.price ? product.price.toLocaleString('id-ID') : '',
      stock: product.stock,
    });
    setShowEditModal(true);
  };

  const handleUpdateProduct = (e) => {
    e.preventDefault();
    const rawPrice = parseNumberInput(editForm.price);
    if (!editForm.name || rawPrice === '' || editForm.stock === '') {
      showToast('Semua field wajib diisi!');
      return;
    }

    const updated = products.map((p) => {
      if (p.id === editForm.id) {
        return {
          ...p,
          name: editForm.name,
          category: editForm.category,
          price: Number(rawPrice),
          stock: Number(editForm.stock),
        };
      }
      return p;
    });

    persistProducts(updated);
    setShowEditModal(false);
    showToast('Produk berhasil diperbarui!');
  };

  const updateStock = (id, delta) => {
    const updated = products.map((product) => {
      if (product.id !== id) return product;
      return { ...product, stock: Math.max(0, Number(product.stock || 0) + delta) };
    });
    persistProducts(updated);
  };

  const promptDelete = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Hapus Produk',
      message: 'Apakah Anda yakin ingin menghapus produk ini dari inventaris? Tindakan ini tidak dapat dibatalkan.',
      actionType: 'delete',
      targetId: id,
    });
  };

  const promptReset = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Konfirmasi Reset Data (0)',
      message: 'Yakin ingin mereset seluruh data produk dan transaksi ke kondisi awal (0)? Semua data akan dikosongkan.',
      actionType: 'reset',
      targetId: null,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.actionType === 'delete') {
      const updated = products.filter((p) => p.id !== confirmModal.targetId);
      persistProducts(updated);
      showToast('Produk berhasil dihapus.');
    } else if (confirmModal.actionType === 'reset') {
      localStorage.removeItem('zenith_products');
      localStorage.removeItem('umkm_products');
      localStorage.removeItem('zenith_transactions');
      localStorage.removeItem('umkm_transactions');
      setProducts([]);
      showToast('Seluruh data berhasil direset.');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null });
  };

  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, searchQuery, selectedCategory]);

  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center w-max space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          <span>Stok Kosong</span>
        </span>
      );
    }
    if (stock >= 1 && stock <= 20) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center w-max space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Stok Menipis</span>
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center w-max space-x-1.5">
        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
        <span>Stok Normal</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 animate-fadeIn relative">
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <span className="text-indigo-400">ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="inventory-header">
        <div>
          <p className="eyebrow">Management Hub</p>
          <h2 className="page-title">Manajemen Stok Produk</h2>
        </div>
        <div className="header-actions">
          <button className="btn-secondary" type="button" onClick={promptReset}>
            <Trash2 size={15} />
            Reset data
          </button>
          <button className="btn-primary" type="button" onClick={() => setShowAddModal(true)}>
            <PackagePlus size={15} />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="overview-grid">
        <div className="overview-card accent-purple">
          <div className="meta-label">Total Produk</div>
          <div className="meta-value">{products.length}</div>
          <div className="meta-trend positive">+8.2%</div>
        </div>
        <div className="overview-card accent-cyan">
          <div className="meta-label">Stok Menipis</div>
          <div className="meta-value">{products.filter((p) => p.stock > 0 && p.stock <= 20).length}</div>
          <div className="meta-trend warning">-1.5%</div>
        </div>
        <div className="overview-card accent-amber">
          <div className="meta-label">Stok Kosong</div>
          <div className="meta-value">{products.filter((p) => p.stock === 0).length}</div>
          <div className="meta-trend negative">-0.8%</div>
        </div>
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

      <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/70 border-b border-slate-200 text-xs text-slate-400 uppercase tracking-wider">
                <th className="py-4 px-6 font-semibold">Nama Produk</th>
                <th className="py-4 px-6 font-semibold">Kategori</th>
                <th className="py-4 px-6 font-semibold">Harga Satuan</th>
                <th className="py-4 px-6 font-semibold">Jumlah Stok</th>
                <th className="py-4 px-6 font-semibold">Status Stok</th>
                <th className="py-4 px-6 font-semibold text-center">Aksi Cepat Stok</th>
                <th className="py-4 px-6 font-semibold text-right">Opsi</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-slate-400 text-sm font-medium">
                    Tidak ada produk ditemukan. Silakan tambahkan produk baru.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-4 px-6 font-bold text-slate-800">{p.name}</td>
                    <td className="py-4 px-6">
                      <span className="px-2.5 py-1 rounded-md text-xs font-semibold bg-slate-100 text-slate-600">
                        {p.category}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-extrabold text-indigo-600">{formatRupiah(p.price)}</td>
                    <td className="py-4 px-6 font-bold text-slate-700">{p.stock} pcs</td>
                    <td className="py-4 px-6">{getStockBadge(p.stock)}</td>
                    <td className="py-4 px-6 text-center">
                      <div className="inline-flex items-center space-x-1.5 bg-slate-100 p-1 rounded-lg">
                        <button
                          onClick={() => updateStock(p.id, -1)}
                          className="w-7 h-7 bg-white hover:bg-rose-50 text-slate-700 hover:text-rose-600 font-bold rounded shadow-2xs transition"
                          title="Kurangi 1"
                        >
                          -
                        </button>
                        <span className="w-8 text-center text-xs font-bold text-slate-700">{p.stock}</span>
                        <button
                          onClick={() => updateStock(p.id, 1)}
                          className="w-7 h-7 bg-white hover:bg-emerald-50 text-slate-700 hover:text-emerald-600 font-bold rounded shadow-2xs transition"
                          title="Tambah 1"
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-semibold rounded-lg text-xs transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => promptDelete(p.id)}
                        className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 font-semibold rounded-lg text-xs transition"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Tambah Produk Baru</h3>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleAddProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Produk</label>
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Kopi Susu Aren" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50">
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Satuan (Rp)</label>
                <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: formatNumberInput(e.target.value) })} onBlur={(e) => handlePriceBlur(e.target.value, 'add', 'price')} placeholder="Contoh: 15" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok Awal</label>
                <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Contoh: 25" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition">Simpan Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Edit Produk</h3>
              <button onClick={() => setShowEditModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>
            <form onSubmit={handleUpdateProduct} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Produk</label>
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50">
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Satuan (Rp)</label>
                <input type="text" required value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: formatNumberInput(e.target.value) })} onBlur={(e) => handlePriceBlur(e.target.value, 'edit', 'price')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok</label>
                <input type="number" required min="0" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition">Perbarui Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">⚠️</div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex space-x-3">
              <button type="button" onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null })} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
              <button type="button" onClick={handleConfirmAction} className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition">Ya, Lanjutkan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
