const apps = [
  { name: 'Uniswap', category: 'DEX', description: 'Intercambia tokens con liquidez en tiempo real.' },
  { name: 'OpenSea', category: 'NFT', description: 'Explora, compra y vende NFTs.' },
  { name: 'Aave', category: 'DeFi', description: 'Deposita activos y gana rendimiento.' },
];

export default function DappsPage() {
  return (
    <section>
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-lg font-semibold text-white">DApps recomendadas</h3>
        <div className="mt-4 grid gap-4 md:grid-cols-3">
          {apps.map((app) => (
            <div key={app.name} className="rounded-2xl bg-slate-950/60 p-5">
              <p className="text-sm text-violet-400">{app.category}</p>
              <h4 className="mt-1 text-lg font-semibold text-white">{app.name}</h4>
              <p className="mt-2 text-sm text-slate-400">{app.description}</p>
              <button className="mt-4 w-full rounded-2xl border border-slate-700 px-4 py-2 text-sm text-slate-200">Abrir</button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}