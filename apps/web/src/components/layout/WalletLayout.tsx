import Sidebar from './Sidebar';

export default function WalletLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-surface">
            <Sidebar />
            <main className="ml-60 flex-1 p-6 lg:p-8">
                <div className="mx-auto max-w-7xl space-y-6">
                    <header className="flex items-center justify-between rounded-2xl border border-slate-800/80 bg-slate-900/70 px-5 py-4 shadow-lg shadow-slate-950/30 backdrop-blur">
                        <div>
                            <p className="text-sm text-slate-400">Bienvenido de nuevo</p>
                            <h2 className="text-xl font-semibold text-white">Panel principal</h2>
                        </div>
                        <div className="flex items-center gap-3">
                            <button className="rounded-xl border border-slate-700 bg-slate-900 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-500/60 hover:bg-slate-800">
                                Buscar
                            </button>
                            <button className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:from-violet-500 hover:to-indigo-500">
                                + Nueva transacción
                            </button>
                        </div>
                    </header>
                    {children}
                </div>
            </main>
        </div>
    );
}