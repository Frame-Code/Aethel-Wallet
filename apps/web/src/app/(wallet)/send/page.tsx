const contacts = [
  { name: 'Alice Chen', address: 'bc1q...9f2a', tag: 'Amigos' },
  { name: 'Javier', address: '0x8A9...7c1B', tag: 'Trabajo' },
  { name: 'María', address: 'SOL1...3dA9', tag: 'Familia' },
];

export default function SendPage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-lg font-semibold text-white">Enviar activos</h3>
        <div className="mt-5 space-y-4">
          <div>
            <label className="mb-1 block text-sm text-slate-300">Destinatario</label>
            <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="Dirección o nombre" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Cantidad</label>
            <input className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500" placeholder="0.00" />
          </div>
          <div>
            <label className="mb-1 block text-sm text-slate-300">Red</label>
            <select className="w-full rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none focus:border-violet-500">
              <option>BNB Chain</option>
              <option>Bitcoin</option>
              <option>Solana</option>
            </select>
          </div>
          <button className="w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white">Revisar transacción</button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <h3 className="text-lg font-semibold text-white">Contactos recientes</h3>
          <div className="mt-4 space-y-3">
            {contacts.map((contact) => (
              <button key={contact.address} className="flex w-full items-center justify-between rounded-2xl bg-slate-950/60 px-4 py-3 text-left">
                <div>
                  <p className="font-medium text-white">{contact.name}</p>
                  <p className="text-sm text-slate-400">{contact.address}</p>
                </div>
                <span className="rounded-full bg-slate-800 px-2 py-1 text-xs text-slate-300">{contact.tag}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
          <p className="text-sm text-slate-400">Comisión estimada</p>
          <h3 className="mt-1 text-2xl font-semibold text-white">$4.80</h3>
        </div>
      </div>
    </section>
  );
}