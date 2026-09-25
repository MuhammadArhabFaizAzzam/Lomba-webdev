# Zenith POS

Zenith POS adalah aplikasi kasir (point-of-sale) sekaligus dashboard operasional yang dibuat untuk bisnis retail dan UMKM. Lewat satu antarmuka yang sama, tim kasir bisa memproses transaksi, sementara manajemen bisa memantau stok dan performa penjualan tanpa harus berpindah-pindah sistem.

## Esensi proyek

Ini bukan sekadar template Next.js biasa. Zenith POS dibangun sebagai sistem kasir yang cukup lengkap, mencakup:

- POS/kasir untuk transaksi penjualan sehari-hari
- Manajemen stok dan harga produk
- Dashboard untuk memantau pendapatan dan performa harian
- Riwayat transaksi lengkap dengan ekspor ke CSV
- Role-based access control, memisahkan akses kasir dan manajemen
- Mode demo berbasis `localStorage`, jadi bisa langsung dicoba tanpa setup database

## Fitur utama

### 1. Kasir / Point of Sale
Kasir bisa memilih produk dari katalog, mengatur jumlah item di keranjang, lalu memilih metode pembayaran—baik QRIS, tunai, atau transfer. Setelah checkout, struk transaksi langsung muncul dan stok produk otomatis berkurang.

### 2. Manajemen inventaris
Produk bisa ditambah, diedit, atau dihapus sesuai kebutuhan, lengkap dengan nama, kategori, harga, dan jumlah stok. Untuk mempercepat demo, tersedia juga preset produk siap pakai untuk berbagai skenario retail. Status stok pun otomatis terklasifikasi: kosong, menipis, atau normal.

### 3. Dashboard bisnis
Halaman ini merangkum hal-hal penting dalam sekali lihat—total pendapatan, jumlah transaksi, jumlah produk aktif, hingga produk dengan stok rendah. Ditambah grafik penjualan harian dan distribusi kategori untuk gambaran yang lebih visual.

### 4. Riwayat transaksi
Setiap transaksi yang terjadi tercatat otomatis dan bisa dicari berdasarkan ID, nama item, atau metode pembayaran. Kalau perlu diolah lebih lanjut, datanya bisa diekspor ke CSV yang kompatibel dengan Excel.

### 5. Akses berbasis peran
Kasir hanya bisa mengakses Dashboard, POS, dan Riwayat Transaksi, sementara Management punya akses penuh termasuk ke halaman Inventory dan Guide. Kalau ada yang mencoba membuka halaman di luar izinnya, sistem akan otomatis mengarahkan ke halaman login atau dashboard yang sesuai.

## Stack teknologi

- Next.js 16
- React 19
- Tailwind CSS
- Lucide React
- Recharts

## Struktur aplikasi

```bash
app/
  ClientLayout.js
  layout.js
  page.js                  # Dashboard bisnis
  login/page.js            # Login user
  welcome/page.js          # Landing page
  pos/page.js              # Point of Sale
  inventory/page.js        # Manajemen stok
  transactions/page.js     # Riwayat transaksi
  guide/page.js            # Panduan pengguna
```

## Cara menjalankan

1. Instal dependency:

```bash
npm install
```

2. Jalankan server pengembangan:

```bash
npm run dev
```

3. Buka aplikasi di browser:

```bash
http://localhost:3000
```

## Demo credentials

Untuk mencoba aplikasinya, gunakan salah satu akun berikut:

- Kasir
  - Username: `kasir`
  - Password: `kasir123`

- Management
  - Username: `management`
  - Password: `admin123`

## Catatan penting

Data aplikasi ini disimpan di `localStorage`, jadi cukup untuk kebutuhan demo dan prototyping, bukan produksi. Alurnya sengaja dibuat ringan dan cepat, mengikuti kebutuhan retail/UMKM yang biasanya tidak butuh sistem backend multi-user yang rumit. Fokus utamanya memang pada efisiensi operasional harian, bukan kompleksitas teknis di belakang layar.

## Tujuan penggunaan

Zenith POS cocok dipakai untuk presentasi, simulasi bisnis, maupun evaluasi sistem kasir dan pengelolaan stok skala kecil-menengah. Kelebihannya ada pada kesederhanaan, kecepatan, dan kemudahan—cocok untuk siapa saja yang ingin merasakan alur kerja kasir tanpa ribet.