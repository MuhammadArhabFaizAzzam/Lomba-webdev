'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Warehouse, Truck, Plus, FileText, CheckCircle2, Phone, Building, ArrowLeft, Trash2, AlertCircle } from 'lucide-react';
import { formatRupiah } from '../utils/formatCurrency';
import { readStoredArray, writeStoredArray, normalizeProduct, normalizeNonNegativeNumber } from '../utils/storage';

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [purchaseOrders, setPurchaseOrders] = useState([]);
  const [products, setProducts] = useState([]);
  
  const [showSupplierModal, setShowSupplierModal] = useState(false);
  const [showPoModal, setShowPoModal] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Supplier Form
  const [supName, setSupName] = useState('');
  const [supContact, setSupContact] = useState('');
  const [supPhone, setSupPhone] = useState('');
  const [supAddress, setSupAddress] = useState('');

  // PO Form
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [poQty, setPoQty] = useState('10');
  const [poNotes, setPoNotes] = useState('');

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3500);
  };

  useEffect(() => {
    const loadedSup = readStoredArray('zenith_suppliers');
    if (loadedSup.length === 0) {
      const defaults = [
        { id: 'SUP-1', name: 'PT Sembako Jaya Abadi', contact: 'Bpk. Hendra', phone: '081122334455', address: 'Jl. Industri Raya No. 12, Jakarta' },
        { id: 'SUP-2', name: 'CV Distributor Minuman Segar', contact: 'Ibu Linda', phone: '085566778899', address: 'Jl. Merdeka No. 45, Bandung' },
      ];
      writeStoredArray('zenith_suppliers', defaults);
      setSuppliers(defaults);
    } else {
      setSuppliers(loadedSup);
    }

    const loadedPo = readStoredArray('zenith_purchase_orders');
    setPurchaseOrders(loadedPo);

    const loadedProd = readStoredArray('products').map(normalizeProduct);
    setProducts(loadedProd);
  }, []);

  const handleSaveSupplier = (e) => {
    e.preventDefault();
    if (!supName.trim()) {
      showToast('Nama supplier wajib diisi!');
      return;
    }
    const newSup = {
      id: `SUP-${Date.now()}`,
      name: supName.trim(),
      contact: supContact.trim() || '-',
      phone: supPhone.trim() || '-',
      address: supAddress.trim() || '-',
    };
    const updated = [newSup, ...suppliers];
    setSuppliers(updated);
    writeStoredArray('zenith_suppliers', updated);
    setSupName('');
    setSupContact('');
    setSupPhone('');
    setSupAddress('');
    setShowSupplierModal(false);
    showToast('Supplier berhasil ditambahkan!');
  };

  const handleCreatePo = (e) => {
    e.preventDefault();
    if (!selectedSupplierId || !selectedProductId) {
      showToast('Pilih supplier dan produk terlebih dahulu!');
      return;
    }
    const qty = Math.max(1, parseInt(poQty) || 1);
    const supplier = suppliers.find(s => s.id === selectedSupplierId);
    const product = products.find(p => p.id === selectedProductId);

    if (!supplier || !product) {
      showToast('Data supplier atau produk tidak valid.');
      return;
    }

    const newPo = {
      id: `PO-${Date.now()}`,
      date: new Date().toLocaleDateString('id-ID'),
      supplierName: supplier.name,
      productName: product.name,
      productId: product.id,
      qty,
      estimatedCost: product.price * 0.7 * qty, // Estimasi modal 70% dari harga jual
      status: 'Pending',
      notes: poNotes.trim() || 'Restock rutin',
    };

    const updatedPo = [newPo, ...purchaseOrders];
    setPurchaseOrders(updatedPo);
    writeStoredArray('zenith_purchase_orders', updatedPo);
    setShowPoModal(false);
    setSelectedSupplierId('');
    setSelectedProductId('');
    setPoQty('10');
    setPoNotes('');
    showToast('Purchase Order (PO) berhasil dibuat dan dikirim ke supplier!');
  };

  const handleReceivePo = (poId) => {
    const po = purchaseOrders.find(p => p.id === poId);
    if (!po || po.status === 'Diterima') return;

    // Update stock in products
    const currentProducts = readStoredArray('products').map(normalizeProduct);
    const updatedProducts = currentProducts.map(p => {
      if (p.id === po.productId) {
        return { ...p, stock: p.stock + po.qty };
      }
      return p;
    });
    setProducts(updatedProducts);
    writeStoredArray('products', updatedProducts);

    const updatedPo = purchaseOrders.map(p => p.id === poId ? { ...p, status: 'Diterima' } : p);
    setPurchaseOrders(updatedPo);
    writeStoredArray('zenith_purchase_orders', updatedPo);
    showToast(`PO #${poId} diterima! Stok produk "${po.productName}" bertambah +${po.qty}.`);
  };

  return (
    <div className="space-y-6 text-slate-100">
      {toastMessage && (
        <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-semibold border border-slate-700 animate-bounce">
          {toastMessage}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 bg-[#0B1222] p-6 rounded-2xl border border-slate-800 shadow-xl">
        <div>
          <span className="text-xs font-bold text-emerald-400 uppercase tracking-widest">Supply Chain & Inventory Procurement</span>
          <h1 className="text-2xl font-black text-white mt-1">Manajemen Supplier & Purchase Order (PO)</h1>
          <p className="text-xs text-slate-400 mt-0.5">Kelola daftar vendor pemasok barang dan buat pesanan pembelian saat stok gudang menipis.</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowSupplierModal(true)}
            className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition flex items-center space-x-2 border border-slate-700"
          >
            <Building size={16} className="text-emerald-400" />
            <span>Tambah Supplier</span>
          </button>
          <button
            onClick={() => setShowPoModal(true)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-600/20"
          >
            <Plus size={16} />
            <span>Buat Purchase Order (PO)</span>
          </button>
        </div>
      </div>

      {/* Supplier Cards Grid */}
      <div className="space-y-3">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Daftar Supplier / Vendor Terdaftar</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {suppliers.map((s) => (
            <div key={s.id} className="bg-[#0B1222] border border-slate-800 p-5 rounded-2xl shadow-lg flex items-start justify-between">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs"><Truck size={16} /></span>
                  <h4 className="font-bold text-white text-sm">{s.name}</h4>
                </div>
                <p className="text-xs text-slate-400 pl-10">Kontak: <span className="text-slate-200 font-semibold">{s.contact}</span> ({s.phone})</p>
                <p className="text-xs text-slate-500 pl-10">{s.address}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Purchase Orders Table */}
      <div className="space-y-3 pt-4">
        <h3 className="text-sm font-bold text-white uppercase tracking-wider">Riwayat Purchase Order (PO)</h3>
        <div className="bg-[#0B1222] border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-900/80 text-slate-400 border-b border-slate-800">
                  <th className="p-4 font-bold">ID PO</th>
                  <th className="p-4 font-bold">Tanggal</th>
                  <th className="p-4 font-bold">Supplier</th>
                  <th className="p-4 font-bold">Produk Pesanan</th>
                  <th className="p-4 font-bold text-center">Jumlah</th>
                  <th className="p-4 font-bold text-right">Est. Modal</th>
                  <th className="p-4 font-bold text-center">Status</th>
                  <th className="p-4 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 text-slate-300">
                {purchaseOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-slate-400">
                      Belum ada Purchase Order (PO) yang dibuat. Klik tombol "Buat Purchase Order" di atas.
                    </td>
                  </tr>
                ) : (
                  purchaseOrders.map((po) => (
                    <tr key={po.id} className="hover:bg-slate-800/40 transition">
                      <td className="p-4 font-mono font-bold text-emerald-400">{po.id}</td>
                      <td className="p-4 text-slate-400">{po.date}</td>
                      <td className="p-4 font-semibold text-white">{po.supplierName}</td>
                      <td className="p-4 font-semibold text-slate-200">{po.productName}</td>
                      <td className="p-4 text-center font-bold text-white">+{po.qty}</td>
                      <td className="p-4 text-right font-mono text-emerald-400">{formatRupiah(po.estimatedCost)}</td>
                      <td className="p-4 text-center">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                          po.status === 'Diterima' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}>
                          {po.status}
                        </span>
                      </td>
                      <td className="p-4 text-center">
                        {po.status === 'Pending' ? (
                          <button
                            onClick={() => handleReceivePo(po.id)}
                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-lg transition shadow-md"
                          >
                            Terima Barang
                          </button>
                        ) : (
                          <span className="text-emerald-400 font-bold flex items-center justify-center space-x-1">
                            <CheckCircle2 size={14} />
                            <span>Selesai</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      {showSupplierModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1222] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Tambah Supplier Baru</h3>
            <p className="text-xs text-slate-400 mb-5">Masukkan informasi vendor pemasok produk.</p>

            <form onSubmit={handleSaveSupplier} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Perusahaan / Supplier *</label>
                <input
                  type="text"
                  value={supName}
                  onChange={(e) => setSupName(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: PT Pangan Makmur"
                  required
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nama Kontak / Sales</label>
                <input
                  type="text"
                  value={supContact}
                  onChange={(e) => setSupContact(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Bpk. Budi"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Nomor Telepon / WA</label>
                <input
                  type="text"
                  value={supPhone}
                  onChange={(e) => setSupPhone(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: 08123456789"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Alamat Supplier</label>
                <input
                  type="text"
                  value={supAddress}
                  onChange={(e) => setSupAddress(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Jl. Raya Industri No. 5"
                />
              </div>
              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowSupplierModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
                >
                  Simpan Supplier
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create PO Modal */}
      {showPoModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-[#0B1222] border border-slate-800 p-6 rounded-2xl w-full max-w-md shadow-2xl">
            <h3 className="text-lg font-bold text-white mb-1">Buat Purchase Order (PO)</h3>
            <p className="text-xs text-slate-400 mb-5">Pesan stok barang ke supplier terdaftar.</p>

            <form onSubmit={handleCreatePo} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Supplier *</label>
                <select
                  value={selectedSupplierId}
                  onChange={(e) => setSelectedSupplierId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">-- Pilih Supplier --</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Pilih Produk *</label>
                <select
                  value={selectedProductId}
                  onChange={(e) => setSelectedProductId(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                >
                  <option value="">-- Pilih Produk --</option>
                  {products.map(p => (
                    <option key={p.id} value={p.id}>{p.name} (Stok: {p.stock})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Jumlah Pesanan (Qty) *</label>
                <input
                  type="number"
                  min="1"
                  value={poQty}
                  onChange={(e) => setPoQty(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1">Catatan Pesanan</label>
                <input
                  type="text"
                  value={poNotes}
                  onChange={(e) => setPoNotes(e.target.value)}
                  className="w-full bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
                  placeholder="Contoh: Pengiriman kilat"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowPoModal(false)}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold rounded-xl transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition shadow-lg"
                >
                  Kirim PO
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
