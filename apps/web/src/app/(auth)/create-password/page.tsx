'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreatePasswordPage() {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleConfirm = () => {
        if (newPassword.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }
        setLoading(true);
        // TODO: usar contraseña con Russell
        router.push('/dashboard');
    };

    return (
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 w-full">
            <div className="mb-6">
                <h2 className="text-xl font-semibold text-white">Crear contraseña</h2>
                <p className="text-gray-400 text-sm mt-1">Crea una contraseña para proteger tu wallet.</p>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-lg px-4 py-3 mb-4">
                    {error}
                </div>
            )}

            <div className="space-y-4">
                <div>
                    <label className="block text-sm text-gray-400 mb-1">Contraseña</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => { setNewPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        minLength={6}
                        className="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-blue-500"
                    />
                    <p className="text-xs text-gray-500 mt-1">Mínimo 6 caracteres</p>
                </div>

                <div>
                    <label className="block text-sm text-gray-400 mb-1">Confirmar contraseña</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setError(''); }}
                        placeholder="••••••••"
                        className={`w-full bg-gray-800 border text-white rounded-lg px-4 py-3 text-sm focus:outline-none ${
                            confirmPassword.length > 0 && confirmPassword !== newPassword
                                ? 'border-red-500 focus:border-red-500'
                                : 'border-gray-700 focus:border-blue-500'
                        }`}
                    />
                    {confirmPassword.length > 0 && confirmPassword !== newPassword && (
                        <p className="text-xs text-red-400 mt-1">Las contraseñas no coinciden</p>
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
                        disabled={loading || newPassword.length < 6 || confirmPassword !== newPassword}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium rounded-lg py-3 text-sm transition-colors"
                    >
                        {loading ? 'Confirmando...' : 'Confirmar'}
                    </button>
                </div>
            </div>
        </div>
    );
}