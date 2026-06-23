'use client';

import Link from 'next/link';
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const monthlyData = [
    { day: '1', value: 8200, prev: 6100 },
    { day: '7', value: 9800, prev: 7200 },
    { day: '14', value: 11200, prev: 8500 },
    { day: '21', value: 10500, prev: 9100 },
    { day: '30', value: 12850, prev: 10200 },
];

const portfolioData = [
    { name: 'Solana', value: 6200, color: '#8b5cf6' },
    { name: 'Bitcoin', value: 4800, color: '#f59e0b' },
    { name: 'BNB', value: 1850, color: '#06b6d4' },
];

const transactions = [
    { name: 'Envío SOL', amount: -120.50, chain: 'SOL' },
    { name: 'Recepción BTC', amount: 850.00, chain: 'BTC' },
    { name: 'Envío BNB', amount: -45.20, chain: 'BNB' },
    { name: 'Recepción SOL', amount: 200.00, chain: 'SOL' },
];

const chainIcon: Record<string, string> = {
    SOL: '◎',
    BTC: '₿',
    BNB: '⬡',
};

export default function DashboardPage() {
    return (
        <div className="space-y-6">

            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-white">Wallet Dashboard</h1>
                <div className="hidden sm:flex items-center gap-4 text-sm text-slate-400">
                    <Link href="/dashboard" className="hover:text-white transition-colors">Activos</Link>
                    <Link href="/history" className="hover:text-white transition-colors">Historial</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Analytics</Link>
                    <Link href="/dashboard" className="hover:text-white transition-colors">Ajustes</Link>
                </div>
            </div>

            {/* Row 1 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Total Balance */}
                <div className="bg-gradient-to-br from-blue-900/60 to-blue-800/30 rounded-2xl p-6 border border-blue-700/30">
                    <p className="text-slate-400 text-sm font-medium">Portfolio Total</p>
                    <p className="text-4xl font-bold text-white mt-2">
                        $12,850<span className="text-2xl text-slate-400">.75</span>
                    </p>
                    <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" />
                                Solana
                            </span>
                            <span className="text-emerald-400 font-medium">$6,200</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
                                Bitcoin
                            </span>
                            <span className="text-amber-400 font-medium">$4,800</span>
                        </div>
                        <div className="flex justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-300">
                                <span className="w-2 h-2 rounded-full bg-cyan-400 inline-block" />
                                BNB
                            </span>
                            <span className="text-cyan-400 font-medium">$1,850</span>
                        </div>
                    </div>
                </div>

                {/* Portfolio Overview */}
                <div className="lg:col-span-2 bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <div className="flex items-center justify-between mb-4">
                        <p className="text-white font-semibold">Evolución del Portfolio</p>
                        <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />Este mes</span>
                            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-400 inline-block" />Mes anterior</span>
                        </div>
                    </div>
                    <ResponsiveContainer width="100%" height={160}>
                        <LineChart data={monthlyData}>
                            <XAxis dataKey="day" stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <YAxis stroke="#475569" tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={(v) => `$${v / 1000}k`} />
                            <Tooltip
                                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '8px' }}
                                labelStyle={{ color: '#94a3b8' }}
                            />
                            <Line type="monotone" dataKey="value" stroke="#60a5fa" strokeWidth={2} dot={{ fill: '#60a5fa', r: 4 }} />
                            <Line type="monotone" dataKey="prev" stroke="#fb7185" strokeWidth={2} dot={{ fill: '#fb7185', r: 4 }} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Distribución de activos */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <p className="text-white font-semibold mb-4">Distribución de Activos</p>
                    <div className="flex justify-center">
                        <PieChart width={160} height={160}>
                            <Pie data={portfolioData} cx={75} cy={75} innerRadius={45} outerRadius={75} dataKey="value" strokeWidth={0}>
                                {portfolioData.map((entry, i) => (
                                    <Cell key={i} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </div>
                    <div className="space-y-2 mt-2">
                        {portfolioData.map((item, i) => (
                            <div key={i} className="flex justify-between text-sm">
                                <span className="flex items-center gap-2 text-slate-300">
                                    <span className="w-2 h-2 rounded-full inline-block" style={{ backgroundColor: item.color }} />
                                    {item.name}
                                </span>
                                <span className="text-slate-400">${item.value.toLocaleString()}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Transacciones recientes */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <p className="text-white font-semibold mb-4">Transacciones Recientes</p>
                    <div className="space-y-4">
                        {transactions.map((tx, i) => (
                            <div key={i} className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <span className="text-lg w-8 h-8 flex items-center justify-center bg-slate-700 rounded-full text-slate-300">
                                        {chainIcon[tx.chain]}
                                    </span>
                                    <div>
                                        <p className="text-sm text-slate-300">{tx.name}</p>
                                        <p className="text-xs text-slate-500">{tx.chain}</p>
                                    </div>
                                </div>
                                <span className={`text-sm font-medium ${tx.amount > 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                                    {tx.amount > 0 ? '+' : ''}${Math.abs(tx.amount).toFixed(2)}
                                </span>
                            </div>
                        ))}
                    </div>
                    <p className="text-xs text-slate-500 text-center mt-4">Hoy</p>
                </div>

                {/* Metas crypto */}
                <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
                    <p className="text-white font-semibold mb-6">Metas de Ahorro</p>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300 font-medium">Meta SOL</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div className="bg-purple-500 h-2 rounded-full" style={{ width: '66%' }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 text-right">66 / 100 SOL</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300 font-medium">Meta BTC</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div className="bg-amber-400 h-2 rounded-full" style={{ width: '42%' }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 text-right">0.042 / 0.1 BTC</p>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-slate-300 font-medium">Meta BNB</span>
                            </div>
                            <div className="w-full bg-slate-700 rounded-full h-2">
                                <div className="bg-cyan-400 h-2 rounded-full" style={{ width: '85%' }} />
                            </div>
                            <p className="text-xs text-slate-400 mt-1 text-right">8.5 / 10 BNB</p>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}