'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as bip39 from 'bip39';
import { useWallet } from '@/contexts/WalletContext';

type Step = 'welcome' | 'create' | 'import';

const MOCK_SEED = [
    'apple', 'bridge', 'cloud', 'dance',
    'eagle', 'forest', 'green', 'house',
    'island', 'jungle', 'kite', 'lemon'
];

export default function OnboardingPage() {
    const [step, setStep] = useState<Step>('welcome');
    const [confirmed, setConfirmed] = useState(false);
    const [error, setError] = useState('');
    const [copied, setCopied] = useState(false);
    const [importWords, setImportWords] = useState<string[]>(Array(12).fill(''));
    const router = useRouter();
    const { unlockWallet } = useWallet();

    const handleConfirm = () => {
        if (!confirmed) {
            setError('Debes confirmar que anotaste tu frase semilla');
            return;
        }
        unlockWallet(MOCK_SEED.join(' '));
        router.push('/dashboard');
    };

    const handleImport = () => {
        const allFilled = importWords.every(w => w.trim() !== '');
        if (!allFilled) {
            setError('Debes ingresar las 12 palabras');
            return;
        }
        const mnemonic = importWords.join(' ');
        if (!bip39.validateMnemonic(mnemonic)) {
            setError('Frase semilla inválida. Verifica que todas las palabras sean correctas.');
            return;
        }
        unlockWallet(mnemonic);
        setError('');
        router.push('/create-password');
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 w-full">

            {/* PASO 1 — Bienvenida */}
            {step === 'welcome' && (
                <div className="text-center space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Bienvenido a NexS Wallet</h2>
                        <p className="text-gray-400 text-sm mt-2">¿Cómo quieres empezar?</p>
                    </div>

                    <div className="space-y-3">
                        <button
                            onClick={() => setStep('create')}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-4 text-sm transition-colors"
                        >
                            Crear nueva wallet
                            <p className="text-blue-200 text-xs font-normal mt-1">Genera una nueva frase semilla</p>
                        </button>

                        <button
                            onClick={() => setStep('import')}
                            className="w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg py-4 text-sm transition-colors"
                        >
                            Importar wallet existente
                            <p className="text-gray-400 text-xs font-normal mt-1">Usa tu frase semilla de 12 palabras</p>
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 2 — Crear: mostrar seed phrase */}
            {step === 'create' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Tu frase semilla</h2>
                        <p className="text-gray-400 text-sm mt-1">Anota estas 12 palabras en orden. No la compartas con nadie.</p>
                    </div>

                    <div className="bg-gray-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {MOCK_SEED.map((word, i) => (
                            <div key={i} className="bg-gray-700 rounded-lg px-3 py-2 text-sm text-white flex gap-2">
                                <span className="text-gray-500 text-xs">{i + 1}.</span>
                                <span>{word}</span>
                            </div>
                        ))}
                    </div>

                    <button
                        onClick={() => {
                            navigator.clipboard.writeText(MOCK_SEED.join(' '));
                            setCopied(true);
                            setTimeout(() => setCopied(false), 2000);
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-slate-300 hover:text-white rounded-lg py-2.5 text-sm transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                                Copiado
                            </>
                        ) : (
                            <>
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                                </svg>
                                Copiar frase semilla
                            </>
                        )}
                    </button>

                    <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg px-4 py-3">
                        <p className="text-yellow-400 text-xs">⚠️ Guarda esta frase en un lugar seguro. Si la pierdes, no podrás recuperar tu wallet.</p>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <label className="flex items-start gap-3 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={confirmed}
                            onChange={(e) => {
                                setConfirmed(e.target.checked);
                                setError('');
                            }}
                            className="mt-0.5 accent-blue-500"
                        />
                        <span className="text-gray-400 text-sm">He anotado mi frase semilla en un lugar seguro</span>
                    </label>

                    <div className="flex gap-3">
                        <button
                            onClick={() => setStep('welcome')}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleConfirm}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Continuar
                        </button>
                    </div>
                </div>
            )}

            {/* PASO 3 — Importar wallet */}
            {step === 'import' && (
                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-white">Importar wallet</h2>
                        <p className="text-gray-400 text-sm mt-1">Ingresa tus 12 palabras en orden.</p>
                    </div>

                    <button
                        onClick={async () => {
                            try {
                                const text = await navigator.clipboard.readText();
                                const words = text.trim().split(/\s+/);
                                if (words.length === 12) {
                                    setImportWords(words);
                                    setError('');
                                } else {
                                    setError('La frase pegada no tiene exactamente 12 palabras');
                                }
                            } catch {
                                setError('No se pudo acceder al portapapeles');
                            }
                        }}
                        className="w-full flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-slate-300 hover:text-white rounded-lg py-2.5 text-sm transition-colors"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                            <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                        </svg>
                        Pegar frase semilla
                    </button>

                    <div className="bg-gray-800 rounded-xl p-4 grid grid-cols-2 sm:grid-cols-3 gap-2">
                        {Array.from({ length: 12 }, (_, i) => (
                            <div key={i} className="flex items-center gap-2 bg-gray-700 rounded-lg px-2 py-2">
                                <span className="text-gray-500 text-xs w-4 shrink-0">{i + 1}.</span>
                                <input
                                    type="text"
                                    value={importWords[i]}
                                    onChange={(e) => {
                                        const updated = [...importWords];
                                        updated[i] = e.target.value.toLowerCase().trim();
                                        setImportWords(updated);
                                        setError('');
                                    }}
                                    className="bg-transparent text-white text-sm focus:outline-none w-full"
                                    placeholder="palabra"
                                />
                            </div>
                        ))}
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-3">
                        <button
                            onClick={() => { setStep('welcome'); setError(''); setImportWords(Array(12).fill('')); }}
                            className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Volver
                        </button>
                        <button
                            onClick={handleImport}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                        >
                            Importar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}