'use client';

import { useEffect, useMemo, useState } from 'react';
import { PackagePlus, Plus, Search, Trash2, ArrowUpDown, Download, RefreshCw, Info, AlertTriangle } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { normalizeProduct, readStoredArray, removeStoredArray, writeStoredArray } from '../utils/storage';

const categories = ['Semua', 'Makanan', 'Minuman', 'Cemilan', 'Lainnya'];

// Built-in Indonesian Retail Presets
const BUILT_IN_PRESETS = [
  {
    id: 'warung-sembako',
    name: 'Warung Sembako',
    description: 'Starter inventory for a typical Indonesian warung (staples & daily needs)',
    products: [
      { name: 'Indomie Goreng', category: 'Makanan', price: 3500, stock: 50 },
      { name: 'Indomie Ayam Bawang', category: 'Makanan', price: 3500, stock: 40 },
      { name: 'Mie Sedaap Goreng', category: 'Makanan', price: 3500, stock: 45 },
      { name: 'Beras 5kg', category: 'Makanan', price: 65000, stock: 15 },
      { name: 'Gula Pasir 1kg', category: 'Makanan', price: 17500, stock: 25 },
      { name: 'Minyak Goreng 1L', category: 'Makanan', price: 18000, stock: 30 },
      { name: 'Tepung Terigu 1kg', category: 'Makanan', price: 12500, stock: 20 },
      { name: 'Telur Ayam (1kg)', category: 'Makanan', price: 28000, stock: 25 },
      { name: 'Garam 500g', category: 'Makanan', price: 5000, stock: 35 },
      { name: 'Kopi Kapal Api Sachet', category: 'Minuman', price: 2000, stock: 100 },
      { name: 'Teh Celup Sosro', category: 'Minuman', price: 9000, stock: 20 },
      { name: 'Kecap Manis Bango 60ml', category: 'Makanan', price: 5500, stock: 24 },
      { name: 'Saus Sambal ABC', category: 'Makanan', price: 6000, stock: 18 },
      { name: 'Air Mineral 600ml', category: 'Minuman', price: 3500, stock: 60 },
    ],
  },
  {
    id: 'mini-market',
    name: 'Mini Market',
    description: 'Modern convenience store assortment (beverages, snacks & personal care)',
    products: [
      { name: 'Aqua 600ml', category: 'Minuman', price: 4000, stock: 80 },
      { name: 'Teh Botol Sosro 450ml', category: 'Minuman', price: 5500, stock: 50 },
      { name: 'Coca-Cola 390ml', category: 'Minuman', price: 7000, stock: 40 },
      { name: 'Sprite 390ml', category: 'Minuman', price: 7000, stock: 30 },
      { name: 'Fanta 390ml', category: 'Minuman', price: 7000, stock: 30 },
      { name: 'Indomie Goreng Special', category: 'Makanan', price: 3800, stock: 100 },
      { name: 'Chitato Sapi Panggang', category: 'Cemilan', price: 11000, stock: 25 },
      { name: 'Qtela Singkong Balado', category: 'Cemilan', price: 9000, stock: 20 },
      { name: 'Oreo Vanila 119g', category: 'Cemilan', price: 10500, stock: 30 },
      { name: 'Beng-Beng 20g', category: 'Cemilan', price: 2500, stock: 120 },
      { name: 'SilverQueen Chocolate 62g', category: 'Cemilan', price: 21000, stock: 15 },
      { name: 'Ultra Milk Cokelat 250ml', category: 'Minuman', price: 6500, stock: 45 },
      { name: 'Yakult Pack (5 botol)', category: 'Minuman', price: 10500, stock: 20 },
      { name: 'Tissue Paseo 250 sheets', category: 'Lainnya', price: 16000, stock: 30 },
      { name: 'Lifebuoy Sabun Mandi', category: 'Lainnya', price: 4500, stock: 35 },
      { name: 'Pepsodent Pasta Gigi 190g', category: 'Lainnya', price: 13500, stock: 25 },
      { name: 'Clear Shampoo 160ml', category: 'Lainnya', price: 24000, stock: 15 },
    ],
  },
  {
    id: 'kantin-food-stall',
    name: 'Kantin / Food Stall',
    description: 'Ready-to-eat meals, snacks, and beverages for campus/office canteens',
    products: [
      { name: 'Nasi Putih Porsi', category: 'Makanan', price: 5000, stock: 40 },
      { name: 'Nasi Goreng Spesial', category: 'Makanan', price: 15000, stock: 30 },
      { name: 'Mie Goreng Kantin', category: 'Makanan', price: 12000, stock: 35 },
      { name: 'Mie Rebus Telur', category: 'Makanan', price: 13000, stock: 25 },
      { name: 'Telur Dadar / Ceplok', category: 'Makanan', price: 5000, stock: 50 },
      { name: 'Ayam Goreng Crispy', category: 'Makanan', price: 14000, stock: 25 },
      { name: 'Es Teh Manis', category: 'Minuman', price: 4000, stock: 60 },
      { name: 'Teh Hangat', category: 'Minuman', price: 3000, stock: 40 },
      { name: 'Kopi Hitam Tubruk', category: 'Minuman', price: 5000, stock: 30 },
      { name: 'Air Mineral Gelas', category: 'Minuman', price: 1000, stock: 100 },
      { name: 'Kerupuk Kaleng', category: 'Cemilan', price: 1000, stock: 150 },
      { name: 'Gorengan (Bakwan/Tahu)', category: 'Cemilan', price: 2000, stock: 80 },
      { name: 'Sosis Bakar', category: 'Cemilan', price: 7000, stock: 20 },
      { name: 'Nugget Goreng (5 pcs)', category: 'Cemilan', price: 10000, stock: 20 },
    ],
  },
  {
    id: 'kebutuhan-rumah',
    name: 'Kebutuhan Rumah',
    description: 'Household cleaning supplies, detergents, and washing essentials',
    products: [
      { name: 'Rinso Anti Noda 800g', category: 'Lainnya', price: 23000, stock: 20 },
      { name: 'So Klin Liquid 750ml', category: 'Lainnya', price: 17500, stock: 25 },
      { name: 'Molto Pewangi Pakaian 900ml', category: 'Lainnya', price: 16000, stock: 20 },
      { name: 'Sunlight Jeruk Nipis 755ml', category: 'Lainnya', price: 18500, stock: 30 },
      { name: 'Mama Lemon 780ml', category: 'Lainnya', price: 17000, stock: 25 },
      { name: 'Wipol Pembersih Lantai 780ml', category: 'Lainnya', price: 19000, stock: 15 },
      { name: 'Bayclin Pemutih 500ml', category: 'Lainnya', price: 10000, stock: 15 },
      { name: 'Tissue Roll (Pack of 2)', category: 'Lainnya', price: 12000, stock: 35 },
      { name: 'Plastik Sampah Hitam Besar', category: 'Lainnya', price: 11000, stock: 20 },
      { name: 'Spons Cuci Piring (Pack 3)', category: 'Lainnya', price: 7500, stock: 40 },
    ],
  },
];

export default function InventoryPage() {
  const [products, setProducts] = useState([]);
  const [customPresets, setCustomPresets] = useState([]);

  // Modals state
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [showSavePresetModal, setShowSavePresetModal] = useState(false);
  const [showLoadConfirmModal, setShowLoadConfirmModal] = useState(false);
  
  // Quick Restock Modal State
  const [showRestockModal, setShowRestockModal] = useState(false);
  const [restockProduct, setRestockProduct] = useState(null);
  const [restockAmount, setRestockAmount] = useState('10');

  // Selected preset to load
  const [selectedPresetToLoad, setSelectedPresetToLoad] = useState(null);
  const [loadMode, setLoadMode] = useState('add'); // 'add' or 'replace'

  // Custom preset form state
  const [savePresetForm, setSavePresetForm] = useState({ name: '', description: '' });

  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '', stock: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Makanan', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
  const [stockStatusFilter, setStockStatusFilter] = useState('Semua'); // 'Semua' | 'Normal' | 'Menipis' | 'Habis'
  const [onlyLowStock, setOnlyLowStock] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('filter') === 'low') {
        setOnlyLowStock(true);
        setStockStatusFilter('Menipis');
      }
    }
  }, []);

  // Custom confirmation modal state (for delete / reset)
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    actionType: null, // 'delete' | 'reset' | 'delete_custom_preset'
    targetId: null,
  });
  const [toastMessage, setToastMessage] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const parsed = readStoredArray('products');
    if (parsed.length > 0) {
      try {
          const seenIds = new Set();
          const normalized = parsed.map((p, index) => {
            let uniqueId = normalizeProduct(p, index).id;
            if (uniqueId === undefined || uniqueId === null || seenIds.has(uniqueId)) {
              do {
                uniqueId = Date.now() + index + Math.floor(Math.random() * 100000);
              } while (seenIds.has(uniqueId));
            }
            seenIds.add(uniqueId);
            return { ...normalizeProduct(p, index), id: uniqueId };
          });
          setProducts(normalized);
          writeStoredArray('products', normalized);
      } catch (e) {
        showToast('Data produk tidak valid dan perlu dimuat ulang.');
        setProducts([]);
      }
    } else {
      setProducts([]);
    }

    const savedPresets = localStorage.getItem('zenith_presets');
    if (savedPresets) {
      try {
        setCustomPresets(JSON.parse(savedPresets));
      } catch (e) {
        setCustomPresets([]);
      }
    } else {
      setCustomPresets([]);
    }
  }, []);

  const saveProductsToStorage = (updatedProducts) => {
    setProducts(updatedProducts);
    writeStoredArray('products', updatedProducts);
  };

  const saveCustomPresetsToStorage = (updatedPresets) => {
    setCustomPresets(updatedPresets);
    localStorage.setItem('zenith_presets', JSON.stringify(updatedPresets));
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

    const newProduct = {
      id: Date.now(),
      name: form.name.trim(),
      category: form.category,
      price: Number(rawPrice),
      stock: Number(form.stock),
    };

    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
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
          name: editForm.name.trim(),
          category: editForm.category,
          price: Number(rawPrice),
          stock: Number(editForm.stock),
        };
      }
      return p;
    });

    saveProductsToStorage(updated);
    setShowEditModal(false);
    showToast('Produk berhasil diperbarui!');
  };

  const updateStock = (id, delta) => {
    const updated = products.map((p) => {
      if (p.id === id) {
        const newStock = Math.max(0, p.stock + delta);
        return { ...p, stock: newStock };
      }
      return p;
    });
    saveProductsToStorage(updated);
  };

  const handleQuickRestockSubmit = (e) => {
    e.preventDefault();
    if (!restockProduct) return;
    const qty = Number(restockAmount);
    if (isNaN(qty) || qty <= 0) {
      showToast('Masukkan jumlah restock yang valid!');
      return;
    }

    const updated = products.map((p) => {
      if (p.id === restockProduct.id) {
        return { ...p, stock: p.stock + qty };
      }
      return p;
    });

    saveProductsToStorage(updated);
    setShowRestockModal(false);
    setRestockProduct(null);
    setRestockAmount('10');
    showToast(`Stok ${restockProduct.name} berhasil ditambah +${qty} pcs!`);
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
      title: 'Reset Seluruh Data Produk',
      message: 'PERINGATAN: Tindakan ini akan menghapus SEMUA produk dari inventaris. Lanjutkan?',
      actionType: 'reset',
      targetId: null,
    });
  };

  const promptDeleteCustomPreset = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Custom Preset',
      message: 'Hapus preset simpanan ini?',
      actionType: 'delete_custom_preset',
      targetId: id,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.actionType === 'delete') {
      const updated = products.filter((p) => p.id !== confirmModal.targetId);
      saveProductsToStorage(updated);
      showToast('Produk berhasil dihapus.');
    } else if (confirmModal.actionType === 'reset') {
      removeStoredArray('products');
      removeStoredArray('transactions');
      setProducts([]);
      showToast('Seluruh data berhasil direset.');
    } else if (confirmModal.actionType === 'delete_custom_preset') {
      const updatedPresets = customPresets.filter((cp) => cp.id !== confirmModal.targetId);
      saveCustomPresetsToStorage(updatedPresets);
      showToast('Custom preset berhasil dihapus.');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null });
  };

  // Export Inventory CSV
  const exportInventoryCSV = () => {
    if (products.length === 0) return;
    const headers = ['ID', 'Nama Produk', 'Kategori', 'Harga Satuan (Rp)', 'Stok'];
    const rows = products.map(p => [
      `"${p.id}"`,
      `"${String(p.name).replace(/"/g, '""')}"`,
      `"${String(p.category).replace(/"/g, '""')}"`,
      `"${p.price}"`,
      `"${p.stock}"`
    ]);
    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `laporan-inventaris-zenith-pos-${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
      const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
      
      let matchesStockStatus = true;
      const st = Number(product.stock || 0);
      if (stockStatusFilter === 'Normal') matchesStockStatus = st > 20;
      if (stockStatusFilter === 'Menipis') matchesStockStatus = st > 0 && st <= 20;
      if (stockStatusFilter === 'Habis') matchesStockStatus = st === 0;

      const matchesLowStockParam = !onlyLowStock || st <= 5;

      return matchesCategory && matchesSearch && matchesStockStatus && matchesLowStockParam;
    });
  }, [products, searchQuery, selectedCategory, stockStatusFilter, onlyLowStock]);

  const handleInitiateLoadPreset = (preset) => {
    setSelectedPresetToLoad(preset);
    setLoadMode('add');
    setShowPresetModal(false);
    setShowLoadConfirmModal(true);
  };

  const handleExecuteLoadPreset = () => {
    if (!selectedPresetToLoad || !selectedPresetToLoad.products) return;

    const preparedProducts = selectedPresetToLoad.products.map((p, idx) => ({
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      name: p.name,
      category: p.category || 'Makanan',
      price: Number(p.price || 0),
      stock: Number(p.stock || 0),
    }));

    let nextProducts = [];
    if (loadMode === 'replace') {
      nextProducts = preparedProducts;
    } else {
      const existingNames = new Set(products.map((p) => p.name.toLowerCase()));
      const filteredNew = preparedProducts.filter((p) => !existingNames.has(p.name.toLowerCase()));
      nextProducts = [...filteredNew, ...products];
    }

    saveProductsToStorage(nextProducts);
    setShowLoadConfirmModal(false);
    setSelectedPresetToLoad(null);
    showToast(`Preset "${selectedPresetToLoad.name}" berhasil dimuat!`);
  };

  const handleSaveCustomPreset = (e) => {
    e.preventDefault();
    if (!savePresetForm.name.trim()) return;
    if (products.length === 0) {
      showToast('Tidak ada produk untuk disimpan sebagai preset.');
      return;
    }

    const newCustomPreset = {
      id: `custom-${Date.now()}`,
      name: savePresetForm.name.trim(),
      description: savePresetForm.description.trim() || 'Custom user preset',
      products: products.map((p) => ({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
      })),
    };

    const updated = [newCustomPreset, ...customPresets];
    saveCustomPresetsToStorage(updated);
    setSavePresetForm({ name: '', description: '' });
    setShowSavePresetModal(false);
    showToast(`Preset "${newCustomPreset.name}" berhasil disimpan!`);
  };

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
          <Info size={16} className="text-indigo-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="inventory-header">
        <div>
          <p className="eyebrow">Management Hub</p>
          <h2 className="page-title">Manajemen Stok &amp; Inventaris</h2>
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={exportInventoryCSV}
            className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-600/20 transition flex items-center space-x-2"
          >
            <Download size={15} />
            <span>Export CSV</span>
          </button>
          <button
            onClick={() => setShowPresetModal(true)}
            className="bg-emerald-700 hover:bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-emerald-700/20 transition flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>Preset Data</span>
          </button>
          <button
            onClick={promptReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Reset Data (0)
          </button>
          <button className="btn-primary" type="button" onClick={() => setShowAddModal(true)}>
            <PackagePlus size={15} />
            Tambah Produk
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Produk</p>
            <h3 className="text-2xl font-extrabold text-slate-800 mt-1">{products.length}</h3>
            <span className="text-xs text-emerald-600 font-semibold mt-1 inline-block">Item terdaftar</span>
          </div>
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center font-bold text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stok Menipis</p>
            <h3 className="text-2xl font-extrabold text-amber-600 mt-1">{products.filter((p) => p.stock > 0 && p.stock <= 20).length}</h3>
            <span className="text-xs text-amber-600 font-semibold mt-1 inline-block">Perlu restock</span>
          </div>
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center font-bold text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Stok Kosong</p>
            <h3 className="text-2xl font-extrabold text-rose-600 mt-1">{products.filter((p) => p.stock === 0).length}</h3>
            <span className="text-xs text-rose-600 font-semibold mt-1 inline-block">Habis total</span>
          </div>
          <div className="w-12 h-12 bg-rose-50 text-rose-600 rounded-2xl flex items-center justify-center font-bold text-xl">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
          </div>
        </div>
      </div>

      {onlyLowStock && (
        <div className="mb-4 p-3.5 bg-amber-50 border border-amber-200 text-amber-800 text-xs rounded-xl flex items-center justify-between">
          <span className="font-medium">Menampilkan produk dengan stok menipis/habis (≤ 5 pcs) dari peringatan dashboard.</span>
          <button onClick={() => { setOnlyLowStock(false); setStockStatusFilter('Semua'); }} className="font-bold underline px-2 py-1 bg-amber-100 hover:bg-amber-200 rounded-lg transition">Tampilkan Semua Produk</button>
        </div>
      )}

      {/* Filter Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none text-slate-400">
            <Search size={16} />
          </span>
            <input
              type="text"
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Cari produk berdasarkan nama..."
              className="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 transition"
            />
          </div>

          {/* Stock Status Filter */}
          <select
            value={stockStatusFilter}
            onChange={(e) => setStockStatusFilter(e.target.value)}
            className="px-4 py-2.5 bg-white rounded-xl border border-slate-200 text-xs font-bold text-slate-700 focus:outline-none focus:border-emerald-600 transition"
          >
          <option value="Semua">Semua Status Stok</option>
          <option value="Normal">Stok Normal (&gt;20)</option>
          <option value="Menipis">Stok Menipis (1-20)</option>
          <option value="Habis">Stok Habis (0)</option>
        </select>

        <div className="flex gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => setSelectedCategory(category)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition ${
                selectedCategory === category
                  ? 'bg-slate-900 text-white shadow-sm'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
              }`}
            >
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
                    Tidak ada produk ditemukan. Silakan tambahkan produk baru atau gunakan <button onClick={() => setShowPresetModal(true)} className="text-emerald-600 underline font-semibold">Preset Data</button>.
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
                    <td className="py-4 px-6 font-extrabold text-emerald-600">{formatRupiah(p.price)}</td>
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
                        <button
                          onClick={() => { setRestockProduct(p); setRestockAmount('10'); setShowRestockModal(true); }}
                          className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-[10px] font-bold rounded shadow-2xs transition ml-1"
                          title="Restock Massal"
                        >
                          Restock +
                        </button>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        onClick={() => handleOpenEdit(p)}
                        className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 font-semibold rounded-lg text-xs transition"
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

      {/* Preset Modal */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Preset Data Retail Instan</h3>
                <p className="text-xs text-slate-500">Pilih dari templat standar industri retail Indonesia untuk langsung mengisi inventaris.</p>
              </div>
              <button onClick={() => setShowPresetModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
              {BUILT_IN_PRESETS.map((preset) => (
                <div key={preset.id} className="p-4 rounded-xl border border-slate-200 hover:border-emerald-600 bg-slate-50/50 flex flex-col justify-between transition group">
                  <div>
                    <h4 className="font-bold text-slate-800 text-sm group-hover:text-emerald-600 transition">{preset.name}</h4>
                    <p className="text-xs text-slate-500 mt-1 leading-relaxed">{preset.description}</p>
                    <span className="inline-block mt-3 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 font-semibold text-[11px]">
                      {preset.products.length} Produk siap muat
                    </span>
                  </div>
                  <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-end">
                    <button
                      onClick={() => handleInitiateLoadPreset(preset)}
                      className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-lg transition shadow-xs"
                    >
                      Gunakan Preset &rarr;
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <button
                onClick={() => setShowSavePresetModal(true)}
                className="text-xs font-bold text-emerald-600 hover:underline"
              >
                + Simpan Stok Saat Ini sebagai Preset Baru
              </button>
              <button onClick={() => setShowPresetModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Confirm Modal */}
      {showLoadConfirmModal && selectedPresetToLoad && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-2">Muat Preset: {selectedPresetToLoad.name}</h3>
            <p className="text-xs text-slate-600 mb-5 leading-relaxed">
              Bagaimana Anda ingin memasukkan produk dari preset ini ke dalam inventaris?
            </p>

            <div className="space-y-3 mb-6">
              <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition ${loadMode === 'add' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                <input type="radio" name="loadMode" checked={loadMode === 'add'} onChange={() => setLoadMode('add')} className="mt-0.5 mr-3 accent-emerald-600" />
                <div>
                  <strong className="text-xs text-slate-800 block">Gabungkan (Rekomendasi)</strong>
                  <span className="text-[11px] text-slate-500">Tambahkan produk baru dan pertahankan produk yang sudah ada.</span>
                </div>
              </label>

              <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition ${loadMode === 'replace' ? 'border-emerald-600 bg-emerald-50/50' : 'border-slate-200'}`}>
                <input type="radio" name="loadMode" checked={loadMode === 'replace'} onChange={() => setLoadMode('replace')} className="mt-0.5 mr-3 accent-emerald-600" />
                <div>
                  <strong className="text-xs text-slate-800 block">Timpa Seluruhnya (Ganti Total)</strong>
                  <span className="text-[11px] text-slate-500">Hapus inventaris saat ini dan ganti dengan isi preset ini.</span>
                </div>
              </label>
            </div>

            <div className="flex space-x-3">
              <button onClick={() => setShowLoadConfirmModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
              <button onClick={handleExecuteLoadPreset} className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition">Muat Sekarang</button>
            </div>
          </div>
        </div>
      )}

      {/* Quick Restock Modal */}
      {showRestockModal && restockProduct && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Restock Produk</h3>
            <p className="text-xs text-slate-500 mb-4">Tambah stok untuk <strong className="text-emerald-600">{restockProduct.name}</strong> (Stok saat ini: {restockProduct.stock} pcs)</p>
            
            <form onSubmit={handleQuickRestockSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Tambahan (Pcs)</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={restockAmount}
                  onChange={(e) => setRestockAmount(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 font-bold"
                  autoFocus
                />
              </div>

              <div className="pt-2 flex space-x-3">
                <button type="button" onClick={() => setShowRestockModal(false)} className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
                <button type="submit" className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition">Tambah Stok</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Save Custom Preset Modal */}
      {showSavePresetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <div className="flex justify-between items-center mb-4 pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-800">Simpan Preset Baru</h3>
              <button onClick={() => setShowSavePresetModal(false)} className="text-slate-400 hover:text-slate-600 text-lg font-bold">&times;</button>
            </div>

            <form onSubmit={handleSaveCustomPreset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Preset</label>
                <input
                  type="text"
                  required
                  value={savePresetForm.name}
                  onChange={(e) => setSavePresetForm({ ...savePresetForm, name: e.target.value })}
                  placeholder="Contoh: Toko Cabang Utama"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deskripsi (Opsional)</label>
                <textarea
                  value={savePresetForm.description}
                  onChange={(e) => setSavePresetForm({ ...savePresetForm, description: e.target.value })}
                  placeholder="Contoh: Stok standar untuk cabang utama"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 resize-none"
                ></textarea>
              </div>

              <div className="pt-4 flex space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSavePresetModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition"
                >
                  Simpan Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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
                <input type="text" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Contoh: Kopi Susu Aren" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50">
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Jual Satuan (Rp)</label>
                <input type="text" required value={form.price} onChange={(e) => setForm({ ...form, price: formatNumberInput(e.target.value) })} onBlur={(e) => handlePriceBlur(e.target.value, 'add', 'price')} placeholder="Contoh: 15.000" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 font-medium" />
                <span className="text-[10px] text-slate-400 mt-1 block">*Estimasi margin keuntungan kotor ~30% dihitung otomatis.</span>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok Awal</label>
                <input type="number" required min="0" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} placeholder="Contoh: 25" className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowAddModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition">Simpan Produk</button>
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
                <input type="text" required value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Kategori</label>
                <select value={editForm.category} onChange={(e) => setEditForm({ ...editForm, category: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50">
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                  <option value="Cemilan">Cemilan</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Harga Jual Satuan (Rp)</label>
                <input type="text" required value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: formatNumberInput(e.target.value) }) } onBlur={(e) => handlePriceBlur(e.target.value, 'edit', 'price')} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50 font-medium" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Jumlah Stok</label>
                <input type="number" required min="0" value={editForm.stock} onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })} className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-emerald-600 bg-slate-50" />
              </div>
              <div className="pt-4 flex justify-end space-x-3">
                <button type="button" onClick={() => setShowEditModal(false)} className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition">Batal</button>
                <button type="submit" className="px-5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md shadow-emerald-600/30 transition">Perbarui Produk</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmModal.isOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <AlertTriangle size={24} className="text-rose-600" />
            </div>
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
