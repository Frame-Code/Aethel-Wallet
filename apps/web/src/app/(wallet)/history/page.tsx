const history = [
  { type: 'Recibido', asset: 'BTC', amount: '+0.32', date: '12 Jun 2026', status: 'Completado' },
  { type: 'Enviado', asset: 'ETH', amount: '-1.8', date: '10 Jun 2026', status: 'Completado' },
  { type: 'Intercambio', asset: 'USDC', amount: '+250', date: '08 Jun 2026', status: 'Pendiente' },
];

export default function HistoryPage() {
  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Historial</h3>
        <button className="rounded-xl border border-slate-700 px-3 py-2 text-sm text-slate-200">Filtrar</button>
      </div>
      <div className="mt-4 space-y-3">
        {history.map((item) => (
          <div key={`${item.type}-${item.date}`} className="flex items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3">
            <div>
              <p className="font-medium text-white">{item.type}</p>
              <p className="text-sm text-slate-400">{item.date}</p>
            </div>
            <div className="text-right">
              <p className={`font-medium ${item.amount.startsWith('+') ? 'text-emerald-400' : 'text-white'}`}>{item.amount} {item.asset}</p>
              <p className="text-sm text-slate-400">{item.status}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}