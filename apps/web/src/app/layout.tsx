import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Wallet Aethel',
  description: 'Non-custodial multichain wallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
