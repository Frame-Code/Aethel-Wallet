const assets = [
    { name: 'Bitcoin', symbol: 'BTC', balance: '1.2485', usd: '$52,420.00', change: '+4.2%' },
    { name: 'BNB Chain', symbol: 'BNB', balance: '7.91', usd: '$21,340.00', change: '+1.8%' },
    { name: 'Solana', symbol: 'SOL', balance: '128.4', usd: '$9,740.80', change: '-0.6%' },
];

const activity = [
    { title: 'Recibido de Alice', time: 'Hace 10 min', amount: '+0.32 BTC', status: 'Completado' },
    { title: 'Enviado a Javier', time: 'Ayer', amount: '-1.8 ETH', status: 'Completado' },
    { title: 'Intercambio USDC → USDT', time: 'Hace 2 días', amount: '+250 USDT', status: 'Pendiente' },
];

export default function DashboardPage() {
    return (
        <section className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-violet-600/15 to-indigo-500/10 p-5">
                    <p className="text-sm text-slate-400">Saldo total</p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">$83,500.00</h3>
                    <p className="mt-2 text-sm text-emerald-400">+8.24% esta semana</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Portafolio</p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">12 activos</h3>
                    <p className="mt-2 text-sm text-slate-300">Diversificación alta</p>
                </div>
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-5">
                    <p className="text-sm text-slate-400">Rendimiento</p>
                    <h3 className="mt-2 text-3xl font-semibold text-white">+12.8%</h3>
                    <p className="mt-2 text-sm text-slate-300">Últimos 30 días</p>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.6fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-slate-400">Balance principal</p>
                            <h3 className="mt-1 text-2xl font-semibold text-white">$12,480.00</h3>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm text-emerald-400">+5.3%</span>
                    </div>
                    <div className="mt-6 h-52 rounded-2xl bg-gradient-to-r from-violet-600 via-indigo-500 to-cyan-500 p-5">
                        <div className="flex h-full flex-col justify-between rounded-2xl border border-white/10 bg-slate-950/15 p-4 backdrop-blur">
                            <div>
                                <p className="text-xs text-slate-200/80">NexS Wallet</p>
                                <p className="mt-2 text-lg font-semibold text-white">•••• 4821</p>
                            </div>
                            <div className="flex items-end justify-between">
                                <div>
                                    <p className="text-xs text-slate-200/80">Titular</p>
                                    <p className="text-sm text-white">Carlos M.</p>
                                </div>
                                <p className="text-sm text-white">08/29</p>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <p className="text-sm text-slate-400">Acciones rápidas</p>
                    <div className="mt-4 space-y-3">
                        <button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white">Enviar</button>
                        <button className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200">Recibir</button>
                        <button className="w-full rounded-2xl border border-slate-700 px-4 py-3 text-sm text-slate-200">Historial</button>
                    </div>
                </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-[1.3fr_1fr]">
                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold text-white">Activos</h3>
                        <button className="text-sm text-violet-400">Ver todos</button>
                    </div>
                    <div className="mt-4 space-y-3">
                        {assets.map((asset) => (
                            <div key={asset.symbol} className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
                                <div>
                                    <p className="font-medium text-white">{asset.name}</p>
                                    <p className="text-sm text-slate-400">{asset.balance} {asset.symbol}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-medium text-white">{asset.usd}</p>
                                    <p className={`text-sm ${asset.change.startsWith('+') ? 'text-emerald-400' : 'text-red-400'}`}>{asset.change}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
                    <h3 className="text-lg font-semibold text-white">Actividad reciente</h3>
                    <div className="mt-4 space-y-3">
                        {activity.map((item) => (
                            <div key={item.title} className="rounded-2xl bg-slate-950/60 p-4">
                                <div className="flex items-center justify-between">
                                    <p className="font-medium text-white">{item.title}</p>
                                    <span className="text-sm text-slate-400">{item.time}</span>
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-sm text-slate-300">{item.status}</p>
                                    <p className="font-medium text-white">{item.amount}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}