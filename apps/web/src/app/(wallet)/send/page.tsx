'use client';

import { useState } from 'react';
import { loadMnemonic } from '@/lib/crypto/vault';
import { useWallet } from '@/contexts/WalletContext';

type Chain = 'SOL' | 'BTC' | 'BNB';

const CHAINS: { id: Chain; name: string; symbol: string; balance: string; color: string }[] = [
    { id: 'SOL', name: 'Solana', symbol: '◎', balance: '66.00 SOL', color: '#8b5cf6' },
    { id: 'BTC', name: 'Bitcoin', symbol: '₿', balance: '0.042 BTC', color: '#f59e0b' },
    { id: 'BNB', name: 'BNB Chain', symbol: '⬡', balance: '8.5 BNB', color: '#06b6d4' },
];

const FEES: Record<Chain, { network: string; wallet: string }> = {
    SOL: { network: '0.000005 SOL', wallet: '0.1%' },
    BTC: { network: '0.0001 BTC', wallet: '0.1%' },
    BNB: { network: '0.0005 BNB', wallet: '0.1%' },
};

// Regex de validación por cadena
const ADDRESS_REGEX: Record<Chain, RegExp> = {
    SOL: /^[1-9A-HJ-NP-Za-km-z]{32,44}$/,
    BTC: /^(1[a-km-zA-HJ-NP-Z1-9]{25,34}|3[a-km-zA-HJ-NP-Z1-9]{25,34}|bc1[a-z0-9]{25,90}|[mn][a-km-zA-HJ-NP-Z1-9]{25,34}|2[a-km-zA-HJ-NP-Z1-9]{25,34}|tb1[a-z0-9]{25,90})$/,
    BNB: /^0x[a-fA-F0-9]{40}$/,
};

const ADDRESS_HINT: Record<Chain, string> = {
    SOL: 'La dirección Solana debe tener entre 32 y 44 caracteres alfanuméricos',
    BTC: 'La dirección Bitcoin debe comenzar con bc1, 1 o 3',
    BNB: 'La dirección BNB debe comenzar con 0x y tener 42 caracteres',
};

type Step = 'form' | 'confirm';

export default function SendPage() {
    const [selectedChain, setSelectedChain] = useState<Chain>('SOL');
    const [address, setAddress] = useState('');
    const [amount, setAmount] = useState('');
    const [step, setStep] = useState<Step>('form');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [showPinModal, setShowPinModal] = useState(false);
    const [pin, setPin] = useState('');
    const [pinError, setPinError] = useState('');
    const [pinLoading, setPinLoading] = useState(false);

    const { unlockWallet } = useWallet();
    const chain = CHAINS.find(c => c.id === selectedChain)!;
    const fees = FEES[selectedChain];

    const validateAddress = (addr: string, chainId: Chain): boolean => {
        return ADDRESS_REGEX[chainId].test(addr.trim());
    };

    const handleContinue = () => {
        if (!address.trim()) {
            setError('Ingresa la dirección destino');
            return;
        }
        if (!validateAddress(address, selectedChain)) {
            setError(`Dirección inválida. ${ADDRESS_HINT[selectedChain]}`);
            return;
        }
        if (!amount || parseFloat(amount) <= 0) {
            setError('Ingresa un monto válido');
            return;
        }
        setError('');
        setShowPinModal(true);
    };

    const handlePinConfirm = async () => {
        if (pin.length !== 6) {
            setPinError('El PIN debe tener 6 dígitos');
            return;
        }
        setPinLoading(true);
        try {
            const mnemonic = await loadMnemonic(pin);
            unlockWallet(mnemonic);
            setPinError('');
            setShowPinModal(false);
            setPin('');
            setStep('confirm');
        } catch {
            setPinError('PIN incorrecto');
            setPin('');
        } finally {
            setPinLoading(false);
        }
    };

    const handleSend = async () => {
        setLoading(true);
        try {
            // TODO: llamar a Andre para firma y broadcast
            await new Promise(r => setTimeout(r, 1500));
            setStep('form');
            setAddress('');
            setAmount('');
        } catch {
            setError('Error al enviar la transacción');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto space-y-6">

            <h1 className="text-2xl font-bold text-white">Enviar</h1>

            {step === 'form' && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-6">

                    {/* Selección de cadena */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-3">Selecciona la red</label>
                        <div className="grid grid-cols-3 gap-3">
                            {CHAINS.map(c => (
                                <button
                                    key={c.id}
                                    onClick={() => { setSelectedChain(c.id); setError(''); setAddress(''); }}
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
                        <p className="text-xs text-slate-500 mt-2">Balance: {chain.balance}</p>
                    </div>

                    {/* Dirección destino */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Dirección destino</label>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={address}
                                onChange={(e) => { setAddress(e.target.value); setError(''); }}
                                placeholder={`Dirección ${selectedChain}`}
                                className="flex-1 bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                            />
                            <button
                                onClick={async () => {
                                    const text = await navigator.clipboard.readText();
                                    setAddress(text);
                                }}
                                className="bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg px-3 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                                    <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                                </svg>
                            </button>
                        </div>
                        <p className="text-xs text-slate-500 mt-1">{ADDRESS_HINT[selectedChain]}</p>
                    </div>

                    {/* Monto */}
                    <div>
                        <label className="block text-sm text-slate-400 mb-1">Monto</label>
                        <div className="relative">
                            <input
                                type="number"
                                value={amount}
                                onChange={(e) => { setAmount(e.target.value); setError(''); }}
                                placeholder="0.00"
                                min="0"
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 pr-16"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-medium">
                                {selectedChain}
                            </span>
                        </div>
                        <button
                            onClick={() => setAmount(chain.balance.split(' ')[0])}
                            className="text-xs text-blue-400 hover:text-blue-300 mt-1"
                        >
                            Usar máximo
                        </button>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleContinue}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                    >
                        Continuar
                    </button>
                </div>
            )}

            {step === 'confirm' && (
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50 space-y-6">
                    <div>
                        <h2 className="text-lg font-semibold text-white">Confirmar envío</h2>
                        <p className="text-slate-400 text-sm mt-1">Revisa los detalles antes de enviar</p>
                    </div>

                    <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Red</span>
                            <span className="text-white font-medium">{chain.name} ({selectedChain})</span>
                        </div>
                        <div className="border-t border-slate-700" />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Dirección destino</span>
                            <span className="text-white font-mono text-xs max-w-[200px] truncate">{address}</span>
                        </div>
                        <div className="border-t border-slate-700" />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Monto</span>
                            <span className="text-white font-medium">{amount} {selectedChain}</span>
                        </div>
                        <div className="border-t border-slate-700" />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Fee de red</span>
                            <span className="text-slate-300">{fees.network}</span>
                        </div>
                        <div className="border-t border-slate-700" />
                        <div className="flex justify-between text-sm">
                            <span className="text-slate-400">Comisión wallet</span>
                            <span className="text-slate-300">{fees.wallet} del monto</span>
                        </div>
                    </div>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
                        <p className="text-yellow-400 text-xs">⚠️ Las transacciones en blockchain son irreversibles. Verifica la dirección antes de confirmar.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setStep('form'); setError(''); }}
                            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleSend}
                            disabled={loading}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            {loading ? 'Enviando...' : 'Confirmar envío'}
                        </button>
                    </div>
                </div>
            )}

            {/* Modal PIN */}
            {showPinModal && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4">
                    <div className="bg-slate-800 rounded-2xl p-6 border border-slate-700 w-full max-w-sm space-y-5">
                        <div>
                            <h2 className="text-white font-semibold text-lg">Verificar identidad</h2>
                            <p className="text-slate-400 text-sm mt-1">Ingresa tu PIN para descifrar tu frase semilla y continuar con la transacción.</p>
                        </div>

                        <div>
                            <label className="block text-sm text-slate-400 mb-1">PIN de seguridad</label>
                            <input
                                type="password"
                                value={pin}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '');
                                    if (val.length <= 6) setPin(val);
                                    setPinError('');
                                }}
                                placeholder="••••••"
                                inputMode="numeric"
                                maxLength={6}
                                autoFocus
                                className="w-full bg-slate-900 border border-slate-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 tracking-widest text-center text-xl"
                            />
                            {pinError && (
                                <p className="text-xs text-red-400 mt-1">{pinError}</p>
                            )}
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => {
                                    setShowPinModal(false);
                                    setPin('');
                                    setPinError('');
                                }}
                                className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={handlePinConfirm}
                                disabled={pin.length !== 6 || pinLoading}
                                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                            >
                                {pinLoading ? 'Verificando...' : 'Confirmar'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}