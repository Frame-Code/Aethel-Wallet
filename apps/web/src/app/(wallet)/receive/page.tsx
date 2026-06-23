'use client';

import { useState } from 'react';

type Chain = 'SOL' | 'BTC' | 'BNB';

const ADDRESSES: Record<Chain, string> = {
    SOL: 'DYw8jCTfwHNRJhhmFcbXvVDTqWMEVFBX6ZKUmG5CNSKH',
    BTC: 'bc1qxy2kgdygjrsqtzq2n0yrf2493p83kkfjhx0wlh',
    BNB: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
};

const CHAIN_INFO = [
    { id: 'SOL' as Chain, name: 'Solana', symbol: '◎', color: '#8b5cf6' },
    { id: 'BTC' as Chain, name: 'Bitcoin', symbol: '₿', color: '#f59e0b' },
    { id: 'BNB' as Chain, name: 'BNB Chain', symbol: '⬡', color: '#06b6d4' },
];

export default function ReceivePage() {
    const [selectedChain, setSelectedChain] = useState<Chain>('SOL');
    const [copied, setCopied] = useState(false);

    const address = ADDRESSES[selectedChain];
    const chain = CHAIN_INFO.find(c => c.id === selectedChain)!;

    const handleCopy = () => {
        navigator.clipboard.writeText(address);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">

            <h1 className="text-2xl font-bold text-white">Recibir</h1>

            <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-6">

                {/* Selección de cadena */}
                <div>
                    <label className="block text-sm text-slate-400 mb-3">Selecciona la red</label>
                    <div className="grid grid-cols-3 gap-3">
                        {CHAIN_INFO.map(c => (
                            <button
                                key={c.id}
                                onClick={() => { setSelectedChain(c.id); setCopied(false); }}
                                className={`flex flex-col items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-colors ${
                                    selectedChain === c.id
                                        ? 'border-blue-500 bg-blue-500/10 text-white'
                                        : 'border-slate-700 bg-slate-800 text-slate-400 hover:border-slate-500'
                                }`}
                            >
                                <span className="text-xl" style={{ color: c.color }}>{c.symbol}</span>
                                <span>{c.id}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* QR Code */}
                <div className="flex flex-col items-center gap-4">
                    <div className="bg-white p-4 rounded-2xl">
                        <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${address}`}
                            alt="QR Code"
                            className="w-44 h-44"
                        />
                    </div>
                    <p className="text-slate-400 text-sm">
                        Escanea el QR para recibir <span style={{ color: chain.color }} className="font-medium">{chain.name}</span>
                    </p>
                </div>

                {/* Dirección */}
                <div>
                    <label className="block text-sm text-slate-400 mb-2">Tu dirección {selectedChain}</label>
                    <div className="flex items-center gap-2 bg-slate-900 border border-slate-700 rounded-lg px-4 py-3">
                        <span className="text-white text-xs font-mono flex-1 break-all">{address}</span>
                        <button
                            onClick={handleCopy}
                            className="text-slate-400 hover:text-white transition-colors shrink-0 ml-2"
                        >
                            {copied ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#22c55e" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                            )}
                        </button>
                    </div>
                    {copied && <p className="text-xs text-emerald-400 mt-1">¡Dirección copiada!</p>}
                </div>

                <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg px-4 py-3">
                    <p className="text-blue-400 text-xs">⚠️ Solo envía {selectedChain} a esta dirección. Enviar otros tokens puede resultar en pérdida de fondos.</p>
                </div>
            </div>
        </div>
    );
}