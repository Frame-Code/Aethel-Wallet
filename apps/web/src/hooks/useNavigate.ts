'use client';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

// Wrapper de router.push() que dispara la barra de progreso antes de navegar
export function useNavigate() {
    const router = useRouter();

    const navigate = useCallback((href: string) => {
        if (typeof window !== 'undefined' && (window as any).__startProgress) {
            (window as any).__startProgress();
        }
        router.push(href);
    }, [router]);

    return navigate;
}
