'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNavigate } from '@/hooks/useNavigate';
import { useWallet } from '@/contexts/WalletContext';
import { storeMnemonic } from '@/lib/crypto/vault';

export default function CreatePasswordPage() {
    const { mnemonic } = useWallet();
    const [pin, setPin] = useState('');
    const [confirmPin, setConfirmPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const navigate = useNavigate();

    const handleConfirm = async () => {
        if (pin.length !== 6 || !/^\d+$/.test(pin)) {
            setError('El PIN debe ser de exactamente 6 dígitos numéricos');
            return;
        }
        if (pin !== confirmPin) {
            setError('Los PINs no coinciden');
            return;
        }
        if (!mnemonic) {
            setError('No hay frase semilla disponible. Vuelve al inicio.');
            return;
        }
        setLoading(true);
        try {
            await storeMnemonic(mnemonic, pin);
            navigate('/dashboard');
        } catch (err: any) {
            setError(err.message || 'Error al guardar el vault');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 w-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Crear PIN de seguridad</h2>
                <p className="text-gray-400 text-sm mt-1">Crea un PIN de 6 dígitos para proteger tu wallet.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">PIN (6 dígitos)</label>
                    <input
                        type="password"
                        value={pin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 6) { setPin(val); setError(''); }
                        }}
                        placeholder="••••••"
                        inputMode="numeric"
                        maxLength={6}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500 tracking-widest text-center font-mono"
                    />
                    <p className="text-xs text-gray-500 mt-1">Solo números, exactamente 6 dígitos</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Confirmar PIN</label>
                    <input
                        type="password"
                        value={confirmPin}
                        onChange={(e) => {
                            const val = e.target.value.replace(/\D/g, '');
                            if (val.length <= 6) { setConfirmPin(val); setError(''); }
                        }}
                        placeholder="••••••"
                        inputMode="numeric"
                        maxLength={6}
                        className={`w-full bg-gray-800 border text-white rounded-lg px-4 py-3 text-sm focus:outline-none tracking-widest text-center font-mono ${
                            confirmPin.length === 6 && confirmPin !== pin
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-700 focus:border-blue-500'
                        }`}
                    />
                    {confirmPin.length === 6 && confirmPin !== pin && (
                        <p className="text-xs text-red-400 mt-1">Los PINs no coinciden</p>
                    )}
                </div>

                <div className="flex gap-3 pt-2">
                    <button
                        onClick={() => router.back()}
                        className="flex-1 bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                    >
                        Volver
                    </button>
                    <button
                        onClick={handleConfirm}
                        disabled={loading || pin.length !== 6 || confirmPin !== pin}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                    >
                        {loading ? 'Guardando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}