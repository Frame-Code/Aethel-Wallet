'use client';

import { useState } from 'react';

interface Session {
    id: string;
    name: string;
    url: string;
    icon: string;
    chain: string;
    connectedAt: string;
}

const MOCK_SESSIONS: Session[] = [
    { id: '1', name: 'Uniswap', url: 'app.uniswap.org', icon: '🦄', chain: 'BNB', connectedAt: '23 Jun 2026' },
    { id: '2', name: 'Jupiter', url: 'jup.ag', icon: '🪐', chain: 'SOL', connectedAt: '22 Jun 2026' },
];

export default function DAppsPage() {
    const [sessions, setSessions] = useState<Session[]>(MOCK_SESSIONS);
    const [uri, setUri] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showConnect, setShowConnect] = useState(false);

    const handleConnect = async () => {
        if (!uri.trim()) {
            setError('Ingresa un URI de WalletConnect');
            return;
        }
        if (!uri.startsWith('wc:')) {
            setError('El URI debe comenzar con "wc:"');
            return;
        }
        setLoading(true);
        setError('');
        try {
            // TODO: llamar a James — pairWithDApp(uri)
            await new Promise(r => setTimeout(r, 1500));
            setUri('');
            setShowConnect(false);
        } catch {
            setError('No se pudo conectar con la DApp');
        } finally {
            setLoading(false);
        }
    };

    const handleRevoke = (id: string) => {
        // TODO: llamar a James — revokeSession(topic)
        setSessions(prev => prev.filter(s => s.id !== id));
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6">

            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">DApps</h1>
                <button
                    onClick={() => setShowConnect(!showConnect)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-xl px-4 py-2 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="12" y1="5" x2="12" y2="19"/>
                        <line x1="5" y1="12" x2="19" y2="12"/>
                    </svg>
                    Conectar DApp
                </button>
            </div>

            {/* Panel de conexión */}
            {showConnect && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-4">
                    <div>
                        <h2 className="text-white font-semibold">Conectar con WalletConnect</h2>
                        <p className="text-slate-400 text-sm mt-1">Pega el URI de WalletConnect de la DApp que quieres conectar.</p>
                    </div>

                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={uri}
                            onChange={(e) => { setUri(e.target.value); setError(''); }}
                            placeholder="wc:abc123..."
                            className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 font-mono"
                        />
                        <button
                            onClick={async () => {
                                const text = await navigator.clipboard.readText();
                                setUri(text);
                            }}
                            className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 transition-colors"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                                <rect x="8" y="2" width="8" height="4" rx="1" ry="1"/>
                            </svg>
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setShowConnect(false); setUri(''); setError(''); }}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConnect}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            {loading ? 'Conectando...' : 'Conectar'}
                        </button>
                    </div>
                </div>
            )}

            {/* Sesiones activas */}
            <div>
                <h2 className="text-slate-400 text-sm font-medium mb-3">Sesiones activas</h2>

                {sessions.length === 0 ? (
                    <div className="bg-slate-800/50 rounded-2xl p-8 border border-slate-700/50 text-center">
                        <p className="text-slate-400 text-sm">No tienes DApps conectadas</p>
                        <p className="text-slate-500 text-xs mt-1">Conecta una DApp usando el botón de arriba</p>
                    </div>
                ) : (
                    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 divide-y divide-slate-700/50">
                        {sessions.map(session => (
                            <div key={session.id} className="flex items-center justify-between p-4">
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl w-10 h-10 flex items-center justify-center bg-slate-700 rounded-full">
                                        {session.icon}
                                    </span>
                                    <div>
                                        <p className="text-white text-sm font-medium">{session.name}</p>
                                        <p className="text-slate-500 text-xs">{session.url} · {session.chain} · {session.connectedAt}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleRevoke(session.id)}
                                    className="text-rose-400 hover:text-rose-300 text-xs font-medium bg-rose-400/10 hover:bg-rose-400/20 px-3 py-1.5 rounded-lg transition-colors"
                                >
                                    Revocar
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}