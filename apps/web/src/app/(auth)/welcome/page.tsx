'use client';

import Link from 'next/link';

export default function WelcomePage() {
    return (
        <div className="bg-gray-900 rounded-2xl p-6 sm:p-8 border border-gray-800 w-full">
            <div className="text-center space-y-2 mb-8">
                <h2 className="text-xl font-semibold text-white">Bienvenido</h2>
                <p className="text-gray-400 text-sm">¿Cómo quieres empezar?</p>
            </div>

            <div className="space-y-3">
                <Link
                    href="/register"
                    className="block w-full bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg py-4 text-sm text-center transition-colors"
                >
                    Crear nueva wallet
                    <p className="text-blue-200 text-xs font-normal mt-1">Genera una nueva frase semilla</p>
                </Link>

                <Link
                    href="/register?mode=import"
                    className="block w-full bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white font-medium rounded-lg py-4 text-sm text-center transition-colors"
                >
                    Importar wallet existente
                    <p className="text-gray-400 text-xs font-normal mt-1">Usa tu frase semilla de 12 palabras</p>
                </Link>
            </div>

            <p className="text-center text-gray-400 text-sm mt-8">
                ¿Ya tienes cuenta?{' '}
                <Link href="/login" className="text-blue-400 hover:text-blue-300">
                    Inicia sesión
                </Link>
            </p>
        </div>
    );
}
