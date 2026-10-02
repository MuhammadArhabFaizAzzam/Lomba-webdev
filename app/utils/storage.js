const STORAGE_ALIASES = {
  products: ['zenith_products', 'umkm_products'],
  transactions: ['zenith_transactions', 'umkm_transactions'],
  presets: ['zenith_presets'],
  shifts: ['zenith_shifts'],
  audit_logs: ['zenith_audit_logs'],
  kds_orders: ['zenith_kds_orders'],
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
};

export const removeStoredArray = (name) => {
  if (typeof window === 'undefined') return;
  (STORAGE_ALIASES[name] || [name]).forEach((key) => window.localStorage.removeItem(key));
};

export const normalizeNonNegativeNumber = (value, fallback = 0) => {
  const number = Number(value);
  return Number.isFinite(number) && number >= 0 ? number : fallback;
};

export const normalizeProduct = (product, index = 0) => ({
  ...product,
  id: product?.id ?? `product-${Date.now()}-${index}`,
  name: String(product?.name || '').trim(),
  category: String(product?.category || 'Lainnya'),
  price: normalizeNonNegativeNumber(product?.price),
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
