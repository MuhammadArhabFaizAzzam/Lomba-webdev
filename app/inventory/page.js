'use client';

import { useEffect, useMemo, useState } from 'react';
import { PackagePlus, Plus, Search, Trash2 } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';

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

  // Selected preset to load
  const [selectedPresetToLoad, setSelectedPresetToLoad] = useState(null);
  const [loadMode, setLoadMode] = useState('add'); // 'add' or 'replace'

  // Custom preset form state
  const [savePresetForm, setSavePresetForm] = useState({ name: '', description: '' });

  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '', stock: '' });
  const [editForm, setEditForm] = useState({ id: null, name: '', category: 'Makanan', price: '', stock: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Semua');
<<<<<<< HEAD
=======

  // Custom confirmation modal state (for delete / reset)
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
<<<<<<< HEAD
    actionType: null,
=======
    actionType: null, // 'delete' | 'reset' | 'delete_custom_preset'
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
    targetId: null,
  });
  const [toastMessage, setToastMessage] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    const saved = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    setProducts(saved ? JSON.parse(saved) : []);
=======
    // Load products and normalize/deduplicate IDs if any duplicates or missing IDs exist
    const savedProducts = localStorage.getItem('zenith_products') || localStorage.getItem('umkm_products');
    if (savedProducts) {
      try {
        const parsed = JSON.parse(savedProducts);
        if (Array.isArray(parsed)) {
          const seenIds = new Set();
          const normalized = parsed.map((p, index) => {
            let uniqueId = p.id;
            if (uniqueId === undefined || uniqueId === null || seenIds.has(uniqueId)) {
              do {
                uniqueId = Date.now() + index + Math.floor(Math.random() * 100000);
              } while (seenIds.has(uniqueId));
            }
            seenIds.add(uniqueId);
            return {
              ...p,
              id: uniqueId,
            };
          });
          setProducts(normalized);
          // Save back the normalized unique IDs to storage
          localStorage.setItem('zenith_products', JSON.stringify(normalized));
          localStorage.setItem('umkm_products', JSON.stringify(normalized));
        } else {
          setProducts([]);
        }
      } catch (e) {
        setProducts([]);
      }
    } else {
      setProducts([]);
    }

    // Load custom presets
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
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
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

  const saveProductsToStorage = (updatedProducts) => {
    setProducts(updatedProducts);
    localStorage.setItem('zenith_products', JSON.stringify(updatedProducts));
    localStorage.setItem('umkm_products', JSON.stringify(updatedProducts));
  };

  const saveCustomPresetsToStorage = (updatedPresets) => {
    setCustomPresets(updatedPresets);
    localStorage.setItem('zenith_presets', JSON.stringify(updatedPresets));
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
<<<<<<< HEAD
    }, ...products];

    persistProducts(nextProducts);
=======
    };

    const updated = [newProduct, ...products];
    saveProductsToStorage(updated);
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
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

<<<<<<< HEAD
    persistProducts(updated);
=======
    saveProductsToStorage(updated);
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
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

  const promptDeleteCustomPreset = (id) => {
    setConfirmModal({
      isOpen: true,
      title: 'Hapus Custom Preset',
      message: 'Apakah Anda yakin ingin menghapus preset custom ini?',
      actionType: 'delete_custom_preset',
      targetId: id,
    });
  };

  const handleConfirmAction = () => {
    if (confirmModal.actionType === 'delete') {
      const updated = products.filter((p) => p.id !== confirmModal.targetId);
<<<<<<< HEAD
      persistProducts(updated);
=======
      saveProductsToStorage(updated);
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
      showToast('Produk berhasil dihapus.');
    } else if (confirmModal.actionType === 'reset') {
      localStorage.removeItem('zenith_products');
      localStorage.removeItem('umkm_products');
      localStorage.removeItem('zenith_transactions');
      localStorage.removeItem('umkm_transactions');
      setProducts([]);
      showToast('Seluruh data berhasil direset.');
    } else if (confirmModal.actionType === 'delete_custom_preset') {
      const updatedPresets = customPresets.filter((cp) => cp.id !== confirmModal.targetId);
      saveCustomPresetsToStorage(updatedPresets);
      showToast('Custom preset berhasil dihapus.');
    }
    setConfirmModal({ isOpen: false, title: '', message: '', actionType: null, targetId: null });
  };

<<<<<<< HEAD
  const filteredProducts = useMemo(() => products.filter((product) => {
    const matchesCategory = selectedCategory === 'Semua' || product.category === selectedCategory;
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  }), [products, searchQuery, selectedCategory]);
=======
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

  // Preset loading trigger
  const handleInitiateLoadPreset = (preset) => {
    setSelectedPresetToLoad(preset);
    setLoadMode('add'); // default safe mode
    setShowPresetModal(false);
    setShowLoadConfirmModal(true);
  };

  // Execute loading preset with Add or Replace mode
  const handleExecuteLoadPreset = () => {
    if (!selectedPresetToLoad || !selectedPresetToLoad.products) return;

    // Create deep copy with fresh IDs
    const preparedProducts = selectedPresetToLoad.products.map((p, idx) => ({
      id: Date.now() + idx + Math.floor(Math.random() * 1000),
      name: p.name,
      category: p.category || 'Lainnya',
      price: Number(p.price),
      stock: Number(p.stock),
    }));

    let finalProducts = [];
    if (loadMode === 'replace') {
      finalProducts = preparedProducts;
    } else {
      // Add mode: avoid exact name duplicates (case-insensitive)
      const existingNames = new Set(products.map((p) => p.name.toLowerCase().trim()));
      const uniqueNewProducts = preparedProducts.filter(
        (p) => !existingNames.has(p.name.toLowerCase().trim())
      );
      finalProducts = [...uniqueNewProducts, ...products];
    }

    saveProductsToStorage(finalProducts);
    setShowLoadConfirmModal(false);
    showToast(`✓ ${selectedPresetToLoad.name} berhasil dimuat — ${preparedProducts.length} produk.`);
    setSelectedPresetToLoad(null);
  };

  // Save current inventory as a custom preset
  const handleSaveCustomPreset = (e) => {
    e.preventDefault();
    if (!savePresetForm.name.trim()) {
      showToast('Nama preset wajib diisi!');
      return;
    }
    if (products.length === 0) {
      showToast('Inventaris Anda kosong. Tambahkan beberapa produk terlebih dahulu.');
      return;
    }

    const newCustomPreset = {
      id: 'custom-' + Date.now(),
      name: savePresetForm.name.trim(),
      description: savePresetForm.description.trim() || 'Custom user preset',
      products: products.map((p) => ({
        name: p.name,
        category: p.category,
        price: p.price,
        stock: p.stock,
      })),
    };

    const updatedPresets = [newCustomPreset, ...customPresets];
    saveCustomPresetsToStorage(updatedPresets);
    setSavePresetForm({ name: '', description: '' });
    setShowSavePresetModal(false);
    showToast(`Preset "${newCustomPreset.name}" berhasil disimpan!`);
  };
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c

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
<<<<<<< HEAD
        <div className="header-actions">
          <button className="btn-secondary" type="button" onClick={promptReset}>
            <Trash2 size={15} />
            Reset data
=======
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => setShowPresetModal(true)}
            className="bg-sky-600 hover:bg-sky-500 text-white font-semibold px-4 py-2.5 rounded-xl text-xs shadow-md shadow-sky-600/20 transition flex items-center space-x-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
            </svg>
            <span>📦 Preset Data</span>
          </button>
          <button
            onClick={promptReset}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold px-4 py-2.5 rounded-xl text-xs transition"
          >
            Reset Data (0)
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
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
                    Tidak ada produk ditemukan. Silakan tambahkan produk baru atau gunakan <button onClick={() => setShowPresetModal(true)} className="text-sky-600 underline font-semibold">Preset Data</button>.
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

<<<<<<< HEAD
=======
      {/* Modal: Preset Data Explorer */}
      {showPresetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 md:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-3 border-b border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-xl bg-sky-100 text-sky-600 flex items-center justify-center font-bold text-lg">
                  📦
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Preset Data & Starter Inventory</h3>
                  <p className="text-xs text-slate-500">Pilih dari preset retail Indonesia atau buat preset kustom Anda.</p>
                </div>
              </div>
              <button onClick={() => setShowPresetModal(false)} className="text-slate-400 hover:text-slate-600 text-xl font-bold">&times;</button>
            </div>

            <div className="space-y-6">
              {/* Built-in Presets Section */}
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Built-in Retail Presets</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {BUILT_IN_PRESETS.map((preset) => (
                    <div key={preset.id} className="p-4 rounded-xl border border-slate-200 bg-slate-50/70 hover:border-sky-300 transition flex flex-col justify-between">
                      <div>
                        <div className="flex justify-between items-start mb-1">
                          <h5 className="font-bold text-slate-800 text-sm">{preset.name}</h5>
                          <span className="px-2 py-0.5 bg-sky-100 text-sky-700 rounded text-[10px] font-semibold">
                            {preset.products.length} produk
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mb-4 leading-relaxed">{preset.description}</p>
                      </div>
                      <button
                        onClick={() => handleInitiateLoadPreset(preset)}
                        className="w-full py-2 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold shadow-xs transition"
                      >
                        Muat Preset &rarr;
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Custom Presets Section */}
              <div className="pt-4 border-t border-slate-200">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">My Custom Presets</h4>
                  <button
                    onClick={() => {
                      setShowPresetModal(false);
                      setShowSavePresetModal(true);
                    }}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-lg transition"
                  >
                    + Simpan Inventaris Saat Ini sebagai Preset
                  </button>
                </div>

                {customPresets.length === 0 ? (
                  <div className="p-6 text-center border border-dashed border-slate-200 rounded-xl text-slate-400 text-xs">
                    Belum ada custom preset yang disimpan.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {customPresets.map((preset) => (
                      <div key={preset.id} className="p-4 rounded-xl border border-slate-200 bg-white flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <div className="flex items-center space-x-2">
                            <h5 className="font-bold text-slate-800 text-sm">{preset.name}</h5>
                            <span className="px-2 py-0.5 bg-indigo-50 text-indigo-700 rounded text-[10px] font-semibold">
                              {preset.products.length} produk
                            </span>
                          </div>
                          <p className="text-xs text-slate-500">{preset.description}</p>
                        </div>
                        <div className="flex items-center space-x-2 w-full sm:w-auto justify-end">
                          <button
                            onClick={() => handleInitiateLoadPreset(preset)}
                            className="px-3 py-1.5 bg-sky-600 hover:bg-sky-500 text-white rounded-lg text-xs font-bold transition"
                          >
                            Muat
                          </button>
                          <button
                            onClick={() => promptDeleteCustomPreset(preset.id)}
                            className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-bold transition"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button
                onClick={() => setShowPresetModal(false)}
                className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Load Preset Confirmation (Add vs Replace) */}
      {showLoadConfirmModal && selectedPresetToLoad && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Muat Preset: {selectedPresetToLoad.name}</h3>
            <p className="text-xs text-slate-500 mb-6">Bagaimana Anda ingin menambahkan produk preset ini ke inventaris?</p>

            <div className="space-y-3 mb-6">
              <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition ${loadMode === 'add' ? 'border-sky-600 bg-sky-50/50' : 'border-slate-200 bg-white'}`}>
                <input
                  type="radio"
                  name="loadMode"
                  value="add"
                  checked={loadMode === 'add'}
                  onChange={() => setLoadMode('add')}
                  className="mt-0.5 text-sky-600 focus:ring-sky-500"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-slate-900">Tambahkan ke inventaris saat ini (Aman)</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Mempertahankan produk lama dan menambahkan produk baru dari preset (duplikat nama dicegah).</span>
                </div>
              </label>

              <label className={`flex items-start p-3.5 rounded-xl border cursor-pointer transition ${loadMode === 'replace' ? 'border-rose-600 bg-rose-50/50' : 'border-slate-200 bg-white'}`}>
                <input
                  type="radio"
                  name="loadMode"
                  value="replace"
                  checked={loadMode === 'replace'}
                  onChange={() => setLoadMode('replace')}
                  className="mt-0.5 text-rose-600 focus:ring-rose-500"
                />
                <div className="ml-3">
                  <span className="block text-xs font-bold text-slate-900">Ganti seluruh inventaris</span>
                  <span className="block text-[11px] text-slate-500 mt-0.5">Menghapus seluruh produk lama dan menggantinya dengan isi preset ini.</span>
                </div>
              </label>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => {
                  setShowLoadConfirmModal(false);
                  setSelectedPresetToLoad(null);
                }}
                className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleExecuteLoadPreset}
                className="flex-1 py-2.5 bg-sky-600 hover:bg-sky-500 text-white text-xs font-bold rounded-xl shadow-md shadow-sky-600/30 transition"
              >
                Muat Preset Sekarang
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Save Current Inventory as Custom Preset */}
      {showSavePresetModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-fadeIn">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 md:p-8 shadow-2xl border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Simpan Custom Preset</h3>
            <p className="text-xs text-slate-500 mb-6">Simpan {products.length} produk di inventaris saat ini sebagai preset kustom.</p>

            <form onSubmit={handleSaveCustomPreset} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Nama Preset</label>
                <input
                  type="text"
                  required
                  value={savePresetForm.name}
                  onChange={(e) => setSavePresetForm({ ...savePresetForm, name: e.target.value })}
                  placeholder="Contoh: Toko Cabang Utama"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Deskripsi (Opsional)</label>
                <textarea
                  value={savePresetForm.description}
                  onChange={(e) => setSavePresetForm({ ...savePresetForm, description: e.target.value })}
                  placeholder="Contoh: Stok standar untuk cabang utama"
                  rows="3"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-indigo-600 bg-slate-50 resize-none"
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
                  className="flex-1 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-md shadow-indigo-600/30 transition"
                >
                  Simpan Preset
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Tambah Produk */}
>>>>>>> ace681d7ed129e49a4af4dc75983e4dbc153218c
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
