'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigate } from '@/hooks/useNavigate';
import * as bip39 from 'bip39';
import { useWallet } from '@/contexts/WalletContext';
import { deriveAddresses } from '@/lib/crypto/keygen';

// Onboarding solo se alcanza desde login cuando el usuario YA tiene cuenta
// pero no tiene vault en este dispositivo (dispositivo nuevo o reinstalación).
// Solo debe permitir importar la seed existente — NO crear una nueva wallet.
export default function OnboardingPage() {
    const [importWords, setImportWords] = useState<string[]>(Array(12).fill(''));
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { unlockWallet } = useWallet();

    const handleImport = async () => {
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

        setLoading(true);
        setError('');

        try {
            // Derivar direcciones del mnemonic ingresado
            const derived = await deriveAddresses(mnemonic);

            // Obtener las direcciones registradas en Firestore para este usuario
            const uid = localStorage.getItem('uid');
            const token = localStorage.getItem('access_token');
            const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/v1';

            const res = await fetch(`${apiUrl}/wallet/${uid}/addresses`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });

            if (!res.ok) {
                throw new Error('No se pudieron verificar las direcciones de tu cuenta.');
            }

            const addresses = await res.json();

            // Comparar las tres direcciones — todas deben coincidir
            if (
                derived.solana !== addresses.solana ||
                derived.bitcoin !== addresses.bitcoin ||
                derived.bnb !== addresses.bnb
            ) {
                setError('La frase semilla no corresponde a esta cuenta. Verifica las palabras e inténtalo de nuevo.');
                return;
            }

            unlockWallet(mnemonic);
            navigate('/create-password');
        } catch (err: any) {
            setError(err.message || 'Error al verificar la frase semilla.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 w-full">
            <div className="space-y-6">
                <div>
                    <h2 className="text-xl font-semibold text-white">Restaurar wallet</h2>
                    <p className="text-gray-400 text-sm mt-1">
                        Ingresa tu frase semilla de 12 palabras para restaurar tu wallet en este dispositivo.
                    </p>
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

                <button
                    onClick={handleImport}
                    disabled={loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                >
                    {loading ? 'Verificando...' : 'Restaurar wallet'}
                </button>
            </div>
        </div>
    );
}