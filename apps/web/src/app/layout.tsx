import type { Metadata } from 'next';
import './globals.css';
import { WalletProvider } from '@/contexts/WalletContext';
import NavigationProgress from '@/components/NavigationProgress';

export const metadata: Metadata = {
  title: 'NexS Wallet',
  description: 'Non-custodial multichain wallet',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body>
        <WalletProvider>
          <NavigationProgress />
          {children}
        </WalletProvider>
      </body>
    </html>
  );
}