const STORAGE_ALIASES = {
  products: ['zenith_products', 'umkm_products'],
  transactions: ['zenith_transactions', 'umkm_transactions'],
  presets: ['zenith_presets'],
  shifts: ['zenith_shifts'],
  shift_history: ['shift_history', 'zenith_shifts'],
  audit_logs: ['zenith_audit_logs'],
  kds_orders: ['zenith_kds_orders'],
  kds_statuses: ['kds_statuses', 'zenith_kds_orders'],
  customers: ['zenith_customers'],
  suppliers: ['zenith_suppliers'],
  purchase_orders: ['zenith_purchase_orders'],
};

const parseArray = (value) => {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const readStoredArray = (name) => {
  if (typeof window === 'undefined') return [];
  const keys = STORAGE_ALIASES[name] || [name];
  for (const key of keys) {
    const value = window.localStorage.getItem(key);
    if (value !== null) return parseArray(value);
  }
  return [];
};

export const writeStoredArray = (name, value) => {
  if (typeof window === 'undefined') return;
  const keys = STORAGE_ALIASES[name] || [name];
  const serialized = JSON.stringify(Array.isArray(value) ? value : []);
  keys.forEach((key) => window.localStorage.setItem(key, serialized));
  window.dispatchEvent(new Event('zenith_data_update'));
};

export const removeStoredArray = (name) => {
  if (typeof window === 'undefined') return;
  (STORAGE_ALIASES[name] || [name]).forEach((key) => window.localStorage.removeItem(key));
  window.dispatchEvent(new Event('zenith_data_update'));
};

export const normalizeNonNegativeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

export const LOW_STOCK_MAX = 20;

export const needsRestock = (stock) => Math.floor(normalizeNonNegativeNumber(stock)) <= LOW_STOCK_MAX;

const CATEGORY_COST_RATE = {
  Makanan: 0.64,
  Minuman: 0.58,
  Cemilan: 0.72,
  Lainnya: 0.69,
};

const hasExplicitCost = (product) => product?.cost !== undefined && product?.cost !== null && product?.cost !== '';

export const defaultProductCost = (product) => {
  if (hasExplicitCost(product)) return normalizeNonNegativeNumber(product.cost);
  const price = normalizeNonNegativeNumber(product?.price);
  const rate = CATEGORY_COST_RATE[product?.category] ?? 0.7;
  return Math.round(price * rate);
};

export const resolveItemCost = (item, products = []) => {
  if (hasExplicitCost(item)) return normalizeNonNegativeNumber(item.cost);
  const product = products.find((entry) => String(entry.id) === String(item?.id) || entry.name === item?.name);
  if (product) return defaultProductCost(product);
  return defaultProductCost({ price: item?.price, category: item?.category });
};

export const transactionGrossProfit = (transaction, products = []) => {
  if (transaction?.status === 'Retur') return 0;
  const items = Array.isArray(transaction?.items) ? transaction.items : [];
  const sales = items.reduce(
    (sum, item) => sum + normalizeNonNegativeNumber(item.price) * normalizeNonNegativeNumber(item.qty),
    0,
  );
  const discount = normalizeNonNegativeNumber(transaction?.discountAmount);
  const cogs = items.reduce(
    (sum, item) => sum + resolveItemCost(item, products) * normalizeNonNegativeNumber(item.qty),
    0,
  );
  return sales - discount - cogs;
};

export const normalizeProduct = (product, index = 0) => ({
  ...product,
  id: product?.id ?? `product-${Date.now()}-${index}`,
  name: String(product?.name || '').trim(),
  category: String(product?.category || 'Lainnya'),
  price: normalizeNonNegativeNumber(product?.price),
  cost: defaultProductCost(product),
  stock: Math.floor(normalizeNonNegativeNumber(product?.stock)),
});

export const normalizeTransaction = (transaction, index = 0) => ({
  ...transaction,
  id: transaction?.id || `TRX-LEGACY-${index}`,
  date: transaction?.date || new Date().toLocaleString('id-ID'),
  payment: transaction?.payment || 'QRIS',
  total: normalizeNonNegativeNumber(transaction?.total),
  items: Array.isArray(transaction?.items) ? transaction.items : [],
});

export const DEFAULT_STARTER_PRODUCTS = [
  { id: 101, name: 'Kopi Susu Gula Aren', category: 'Minuman', price: 18000, cost: 9500, stock: 45 },
  { id: 102, name: 'Nasi Goreng Spesial UMKM', category: 'Makanan', price: 22000, cost: 13000, stock: 30 },
  { id: 103, name: 'Mie Goreng Tek-Tek', category: 'Makanan', price: 18000, cost: 10500, stock: 28 },
  { id: 104, name: 'Ayam Crispy Sambal Matah', category: 'Makanan', price: 25000, cost: 15000, stock: 16 },
  { id: 105, name: 'Es Teh Manis Jumbo', category: 'Minuman', price: 6000, cost: 2500, stock: 80 },
  { id: 106, name: 'Matcha Latte Ice', category: 'Minuman', price: 20000, cost: 11000, stock: 22 },
  { id: 107, name: 'Roti Bakar Cokelat Keju', category: 'Cemilan', price: 15000, cost: 8500, stock: 12 },
  { id: 108, name: 'Kentang Goreng Crispy', category: 'Cemilan', price: 14000, cost: 8000, stock: 35 },
  { id: 109, name: 'Pisang Goreng Tanduk', category: 'Cemilan', price: 12000, cost: 6500, stock: 8 },
  { id: 110, name: 'Air Mineral Botol 600ml', category: 'Minuman', price: 5000, cost: 2800, stock: 60 },
  { id: 111, name: 'Kerupuk Kaleng Renyah', category: 'Cemilan', price: 3000, cost: 1500, stock: 50 },
  { id: 112, name: 'Paket Hemat Sembako Mini', category: 'Lainnya', price: 45000, cost: 34000, stock: 14 },
];

export const seedStarterProducts = () => {
  if (typeof window === 'undefined') return [];
  const normalized = DEFAULT_STARTER_PRODUCTS.map((p, idx) => normalizeProduct(p, idx));
  writeStoredArray('products', normalized);
  window.localStorage.setItem('zenith_initialized', 'true');
  return normalized;
};

export const ensureInitialCatalog = () => {
  if (typeof window === 'undefined') return [];
  const existing = readStoredArray('products').map(normalizeProduct);
  if (existing.length > 0) {
    window.localStorage.setItem('zenith_initialized', 'true');
    return existing;
  }
  const alreadyInitialized = window.localStorage.getItem('zenith_initialized') === 'true';
  if (!alreadyInitialized) {
    return seedStarterProducts();
  }
  return [];
};

export const seedDemoSimulationData = () => {
  if (typeof window === 'undefined') return { products: [], transactions: [] };
  const products = seedStarterProducts();

  const defaultCustomers = [
    { id: 'CUST-1', name: 'Budi Santoso', phone: '081234567890', email: 'budi@gmail.com', points: 185, tier: 'Gold', totalSpent: 1450000 },
    { id: 'CUST-2', name: 'Siti Aminah', phone: '081987654321', email: 'siti@yahoo.com', points: 95, tier: 'Silver', totalSpent: 720000 },
    { id: 'CUST-3', name: 'Ahmad Fauzi', phone: '085611223344', email: 'fauzi@gmail.com', points: 35, tier: 'Bronze', totalSpent: 280000 },
  ];
  writeStoredArray('zenith_customers', defaultCustomers);

  const now = new Date();
  const sampleBlueprint = [
    { daysAgo: 6, payment: 'QRIS (Dynamic Gateway)', cashier: 'Kasir Staff', customerName: 'Budi Santoso', status: 'Lunas', items: [{ idx: 0, qty: 3 }, { idx: 1, qty: 2 }, { idx: 6, qty: 2 }] },
    { daysAgo: 5, payment: 'Tunai', cashier: 'Kasir Staff', customerName: 'Umum', status: 'Lunas', items: [{ idx: 3, qty: 2 }, { idx: 4, qty: 4 }] },
    { daysAgo: 4, payment: 'QRIS (Dynamic Gateway)', cashier: 'Management Admin', customerName: 'Siti Aminah', status: 'Lunas', items: [{ idx: 1, qty: 3 }, { idx: 5, qty: 2 }, { idx: 7, qty: 2 }] },
    { daysAgo: 3, payment: 'Debit', cashier: 'Kasir Staff', customerName: 'Ahmad Fauzi', status: 'Lunas', items: [{ idx: 11, qty: 2 }, { idx: 0, qty: 2 }] },
    { daysAgo: 2, payment: 'Tunai', cashier: 'Kasir Staff', customerName: 'Umum', status: 'Lunas', items: [{ idx: 2, qty: 3 }, { idx: 4, qty: 3 }, { idx: 8, qty: 2 }] },
    { daysAgo: 1, payment: 'Transfer', cashier: 'Management Admin', customerName: 'Budi Santoso', status: 'Lunas', items: [{ idx: 3, qty: 4 }, { idx: 5, qty: 3 }] },
    { daysAgo: 0, payment: 'QRIS (Dynamic Gateway)', cashier: 'Kasir Staff', customerName: 'Siti Aminah', status: 'Lunas', items: [{ idx: 0, qty: 4 }, { idx: 1, qty: 2 }, { idx: 7, qty: 2 }] },
    { daysAgo: 0, payment: 'QRIS (Dynamic Gateway)', cashier: 'Kasir Staff', customerName: 'Umum', status: 'Menunggu', items: [{ idx: 2, qty: 2 }, { idx: 5, qty: 1 }] },
  ];

  const sampleTransactions = sampleBlueprint.map((entry, idx) => {
    const txDate = new Date(now);
    txDate.setDate(now.getDate() - entry.daysAgo);
    txDate.setHours(10 + idx, (idx * 7) % 60, 0, 0);

    const dateStr = txDate.toLocaleDateString('id-ID', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    }) + ' ' + txDate.toTimeString().slice(0, 5);

    const items = entry.items.map(({ idx: pIdx, qty }) => {
      const p = products[pIdx] || products[0];
      return {
        id: p.id,
        name: p.name,
        category: p.category,
        price: p.price,
        cost: p.cost,
        qty,
      };
    });

    const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const taxAmount = Math.round(subtotal * 0.11);
    const total = subtotal + taxAmount;

    return normalizeTransaction({
      id: `TRX-${txDate.getTime()}-${idx}`,
      date: dateStr,
      createdAt: txDate.toISOString(),
      cashier: entry.cashier,
      customerName: entry.customerName,
      payment: entry.payment,
      subtotal,
      taxAmount,
      serviceAmount: 0,
      discountAmount: 0,
      total,
      cashReceived: entry.payment === 'Tunai' ? total + 10000 : null,
      change: entry.payment === 'Tunai' ? 10000 : null,
      status: entry.status,
      paidAt: entry.status === 'Lunas' ? dateStr : null,
      items,
    }, idx);
  }).reverse();

  writeStoredArray('transactions', sampleTransactions);

  const kdsQueue = sampleTransactions
    .filter((tx) => tx.status === 'Lunas')
    .slice(0, 3)
    .map((tx, i) => ({
      id: tx.id,
      status: i === 0 ? 'PENDING' : i === 1 ? 'COOKING' : 'READY',
    }));
  writeStoredArray('kds_statuses', kdsQueue);

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const sampleShifts = [
    {
      id: `SHIFT-${yesterday.getTime()}`,
      startTime: yesterday.toLocaleDateString('id-ID') + ' 08:00:00',
      endTime: yesterday.toLocaleDateString('id-ID') + ' 16:00:00',
      startingCash: 100000,
      cashSales: 168720,
      nonCashSales: 295260,
      transactionsCount: 5,
      returnsTotal: 0,
      expectedCash: 268720,
      actualCash: 268720,
      difference: 0,
    },
  ];
  writeStoredArray('shift_history', sampleShifts);

  return { products, transactions: sampleTransactions };
};
