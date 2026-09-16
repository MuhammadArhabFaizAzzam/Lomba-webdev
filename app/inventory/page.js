'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '', stock: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Makanan', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');

  // Custom confirmation modal state
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'delete' or 'reset'
    targetId: null,
  });

  // Toast notification state
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    if (saved) {
      setProducts(JSON.parse(saved));
    } else {
      setProducts([]);
    }
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(number);
  };

  // Helper to format raw number input with thousand separator '.' while typing
  const formatNumberInput = (value) => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return '';
    return Number(cleanValue).toLocaleString('id-ID');
  };

  // Helper when user finishes inputting (onBlur): if < 1000, multiply by 1000 (add 000)
  const handlePriceBlur = (value, formType, fieldName = 'price') => {
    const cleanValue = value.replace(/\D/g, '');
    if (!cleanValue) return;
    let num = Number(cleanValue);
    if (num > 0 && num < 1000) {
      num = num * 1000;
    }
    const formatted = num.toLocaleString('id-ID');
    if (formType === 'add') {
      setForm((prev) => ({ ...prev, [fieldName]: formatted }));
    } else if (formType === 'edit') {
      setEditForm((prev) => ({ ...prev, [fieldName]: formatted }));
    }
  };

  // Helper to parse formatted string back to number
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

    const newProduct = {
      id: Date.now(),
      name: form.name,
      category: form.category,
      price: Number(rawPrice),
      stock: Number(form.stock),
    };

    const updated = [newProduct, ...products];
    setProducts(updated);
    localStorage.setItem('zenith_products', JSON.stringify(updated));
    localStorage.setItem('umkm_products', JSON.stringify(updated));

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

    setProducts(updated);
    localStorage.setItem('zenith_products', JSON.stringify(updated));
    localStorage.setItem('umkm_products', JSON.stringify(updated));
    setShowEditModal(false);
    showToast('Produk berhasil diperbarui!');
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
      setProducts(updated);
      localStorage.setItem('zenith_products', JSON.stringify(updated));
      localStorage.setItem('umkm_products', JSON.stringify(updated));
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

  const updateStock = (id, delta) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    });
    setProducts(updated);
    localStorage.setItem('zenith_products', JSON.stringify(updated));
    localStorage.setItem('umkm_products', JSON.stringify(updated));
  };

  // Stock status badge helper
  const getStockBadge = (stock) => {
    if (stock === 0) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 flex items-center w-max space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-600"></span>
          <span>Stok Kosong</span>
        </span>
      );
    } else if (stock >= 1 && stock <= 20) {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-700 border border-amber-200 flex items-center w-max space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
          <span>Stok Menipis</span>
        </span>
      );
    } else {
      return (
        <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center w-max space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
          <span>Stok Normal</span>
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
    <div className="space-y-6 animate-fadeIn relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center space-x-3 text-xs font-bold animate-bounce">
          <span className="text-indigo-400">ℹ️</span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header & Action */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800 tracking-tight">Manajemen Stok & Produk</h2>
          <p className="text-slate-500 text-sm font-normal">Kelola inventaris barang, penyesuaian harga, dan ketersediaan stok.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={promptReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Reset Data (0)
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-5 py-2.5 rounded-xl text-xs shadow-md shadow-indigo-600/30 transition flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 4v16m8-8H4" />
            </svg>
            <span>Tambah Produk Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
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
            placeholder="Cari produk di inventaris..."
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

      {/* Products Table */}
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
            <tbody className="divide-y divide-slate-100 text-sm">
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

      {/* Modal Tambah Produk */}
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
                <input
                  type="text"
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Contoh: Kopi Susu Aren"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Satuan (Rp)</label>
                <input
                  type="text"
                  required
                  value={form.price}
                  onChange={(e) => setForm({ ...form, price: formatNumberInput(e.target.value) })}
                  onBlur={(e) => handlePriceBlur(e.target.value, 'add', 'price')}
                  placeholder="Contoh: 15 (otomatis jadi 15.000 saat selesai)"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium"
                />
                <p className="text-[10px] text-slate-400 mt-1">Ketik 15 untuk 15.000 (otomatis dikali 1.000 saat keluar input).</p>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok Awal</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={form.stock}
                  onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  placeholder="Contoh: 25"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition"
                >
                  Simpan Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Edit Produk */}
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
                <input
                  type="text"
                  required
                  value={editForm.name}
                  onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select
                  value={editForm.category}
                  onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Satuan (Rp)</label>
                <input
                  type="text"
                  required
                  value={editForm.price}
                  onChange={(e) => setEditForm({ ...editForm, price: formatNumberInput(e.target.value) })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 font-medium"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok</label>
                <input
                  type="number"
                  required
                  min="0"
                  value={editForm.stock}
                  onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition"
                >
                  Perbarui Produk
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Confirmation Modal */}
      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4 font-bold text-xl">
              ⚠️
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-2">{confirmModal.title}</h3>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">{confirmModal.message}</p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null })}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmAction}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold rounded-xl shadow-md shadow-rose-600/30 transition"
              >
                Ya, Lanjutkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
