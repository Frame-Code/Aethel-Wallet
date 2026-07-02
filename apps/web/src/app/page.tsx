'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useWallet } from '@/contexts/WalletContext';

export default function Home() {
  const router = useRouter();
  const { isUnlocked } = useWallet();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      router.replace('/welcome');
    } else if (isUnlocked) {
      router.replace('/dashboard');
    } else {
      router.replace('/unlock');
    }
  }, [isUnlocked, router]);

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col items-center justify-center gap-4">
      <div className="w-10 h-10 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
      <p className="text-gray-400 text-sm">Cargando...</p>
    </div>
  );
}
