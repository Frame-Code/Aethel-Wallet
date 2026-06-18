import type { Metadata } from 'next';
import './globals.css';
import WalletLayout from '@/components/layout/WalletLayout';

export const metadata: Metadata = {
  title: 'NexS Wallet',
  description: 'Non-custodial multichain wallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WalletLayout>{children}</WalletLayout>
      </body>
    </html>
  );
}