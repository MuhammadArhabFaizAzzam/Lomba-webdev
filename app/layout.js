import './globals.css';
import ClientLayout from './ClientLayout';

export const metadata = {
  title: 'Zenith POS - Sistem Kasir & Manajemen Bisnis Modern',
  description: 'Aplikasi kasir POS, manajemen inventaris, dan dashboard bisnis profesional untuk retail & UMKM.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
