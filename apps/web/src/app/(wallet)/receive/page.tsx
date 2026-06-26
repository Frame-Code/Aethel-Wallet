const qrValue = 'nexs:0xA1B2...9C3D';

export default function ReceivePage() {
  return (
    <section className="grid gap-6 xl:grid-cols-[1fr_1.1fr]">
      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <h3 className="text-lg font-semibold text-white">Recibir fondos</h3>
        <div className="mt-6 flex items-center justify-center rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 p-8">
          <div className="h-56 w-56 rounded-3xl bg-white p-4">
            <div className="flex h-full items-center justify-center border border-dashed border-slate-300 text-slate-900">QR</div>
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6">
        <p className="text-sm text-slate-400">Tu dirección</p>
        <div className="mt-3 rounded-2xl bg-slate-950/60 p-4">
          <p className="break-all font-mono text-sm text-white">{qrValue}</p>
        </div>
        <button className="mt-4 w-full rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-3 text-sm font-medium text-white">Copiar dirección</button>

        <div className="mt-6 space-y-3">
          <div className="rounded-2xl bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Red</p>
            <p className="mt-1 text-white">BNB Chain</p>
          </div>
          <div className="rounded-2xl bg-slate-950/60 p-4">
            <p className="text-sm text-slate-400">Etiqueta</p>
            <p className="mt-1 text-white">Cuenta principal</p>
          </div>
        </div>
      </div>
    </section>
  );
}