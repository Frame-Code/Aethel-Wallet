'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
    { href: '/dashboard', label: 'Dashboard', icon: '▦' },
    { href: '/send', label: 'Enviar', icon: '↑' },
    { href: '/receive', label: 'Recibir', icon: '↓' },
    { href: '/history', label: 'Historial', icon: '☰' },
    { href: '/dapps', label: 'DApps', icon: '⬡' },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="fixed left-0 top-0 h-screen w-60 bg-surface-card border-r border-surface-border flex flex-col z-40">
            {/* Logo */}
            <div className="px-6 py-5 border-b border-surface-border">
                <span className="text-xl font-bold tracking-tight text-white">
                    NexS
                </span>
            </div>

            {/* Nav */}
            <nav className="flex-1 px-3 py-4 space-y-1">
                {NAV_ITEMS.map((item) => {
                    const active = pathname.startsWith(item.href);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active
                                    ? 'bg-accent text-white'
                                    : 'text-slate-400 hover:bg-surface hover:text-white'
                                }`}
                        >
                            <span className="text-base w-5 text-center">{item.icon}</span>
                            {item.label}
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-surface-border">
                <p className="text-xs text-slate-500 font-mono">NexS Wallet v0.1</p>
            </div>
        </aside>
    );
}