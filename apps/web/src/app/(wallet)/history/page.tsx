'use client';

import { useState } from 'react';

type Chain = 'ALL' | 'SOL' | 'BTC' | 'BNB';
type TxType = 'send' | 'receive';

interface Transaction {
    id: string;
    type: TxType;
    chain: 'SOL' | 'BTC' | 'BNB';
    amount: number;
    address: string;
    date: string;
    status: 'confirmed' | 'pending' | 'failed';
}

const TRANSACTIONS: Transaction[] = [
    { id: '1', type: 'receive', chain: 'SOL', amount: 200.00, address: 'DYw8jC...NSKH', date: '23 Jun 2026', status: 'confirmed' },
    { id: '2', type: 'send', chain: 'BNB', amount: 45.20, address: '0x71C7...976F', date: '22 Jun 2026', status: 'confirmed' },
    { id: '3', type: 'receive', chain: 'BTC', amount: 850.00, address: 'bc1qxy...wlh', date: '21 Jun 2026', status: 'confirmed' },
    { id: '4', type: 'send', chain: 'SOL', amount: 120.50, address: 'DYw8jC...NSKH', date: '20 Jun 2026', status: 'confirmed' },
    { id: '5', type: 'send', chain: 'BTC', amount: 30.00, address: 'bc1qxy...wlh', date: '19 Jun 2026', status: 'failed' },
    { id: '6', type: 'receive', chain: 'BNB', amount: 15.00, address: '0x71C7...976F', date: '18 Jun 2026', status: 'pending' },
];

const CHAIN_COLOR: Record<string, string> = {
    SOL: '#8b5cf6',
    BTC: '#f59e0b',
    BNB: '#06b6d4',
};

const CHAIN_SYMBOL: Record<string, string> = {
    SOL: '◎',
    BTC: '₿',
    BNB: '⬡',
};

const STATUS_STYLE: Record<string, string> = {
    confirmed: 'text-emerald-400 bg-emerald-400/10',
    pending: 'text-amber-400 bg-amber-400/10',
    failed: 'text-rose-400 bg-rose-400/10',
};

const STATUS_LABEL: Record<string, string> = {
    confirmed: 'Confirmado',
    pending: 'Pendiente',
    failed: 'Fallido',
};

export default function HistoryPage() {
    const [filter, setFilter] = useState<Chain>('ALL');

    const filtered = filter === 'ALL'
        ? TRANSACTIONS
        : TRANSACTIONS.filter(tx => tx.chain === filter);

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <h1 className="text-2xl font-bold text-white">Historial</h1>

            {/* Filtros */}
            <div className="flex gap-2 flex-wrap">
                {(['ALL', 'SOL', 'BTC', 'BNB'] as Chain[]).map(c => (
                    <button
                        key={c}
                        onClick={() => setFilter(c)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                            filter === c
                                ? 'bg-blue-600 text-white'
                                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                    >
                        {c === 'ALL' ? 'Todas' : c}
                    </button>
                ))}
            </div>

            {/* Lista de transacciones */}
            <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 divide-y divide-slate-700/50">
                {filtered.length === 0 && (
                    <div className="p-8 text-center text-slate-400 text-sm">
                        No hay transacciones para esta red
                    </div>
                )}
                {filtered.map(tx => (
                    <div key={tx.id} className="flex items-center justify-between p-4 hover:bg-slate-700/20 transition-colors">
                        <div className="flex items-center gap-4">
                            {/* Icono tipo */}
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                tx.type === 'receive' ? 'bg-emerald-400/10' : 'bg-rose-400/10'
                            }`}>
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={tx.type === 'receive' ? '#34d399' : '#fb7185'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {tx.type === 'receive'
                                        ? <><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></>
                                        : <><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></>
                                    }
                                </svg>
                            </div>

                            {/* Info */}
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="text-white text-sm font-medium">
                                        {tx.type === 'receive' ? 'Recibido' : 'Enviado'}
                                    </span>
                                    <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ color: CHAIN_COLOR[tx.chain], backgroundColor: `${CHAIN_COLOR[tx.chain]}20` }}>
                                        {CHAIN_SYMBOL[tx.chain]} {tx.chain}
                                    </span>
                                </div>
                                <p className="text-xs text-slate-500 mt-0.5">{tx.address} · {tx.date}</p>
                            </div>
                        </div>

                        {/* Monto y status */}
                        <div className="text-right">
                            <p className={`text-sm font-medium ${tx.type === 'receive' ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {tx.type === 'receive' ? '+' : '-'}${tx.amount.toFixed(2)}
                            </p>
                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${STATUS_STYLE[tx.status]}`}>
                                {STATUS_LABEL[tx.status]}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}