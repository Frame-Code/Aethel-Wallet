export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-950 px-4 py-12">
      <div className="mx-auto flex max-w-7xl items-center justify-center">
        <div className="grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="hidden rounded-3xl bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 p-10 lg:flex lg:flex-col lg:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-violet-100">Seguridad + libertad</p>
              <h1 className="mt-4 text-5xl font-semibold text-white">Gestiona tus activos en una sola plataforma</h1>
            </div>
            <div className="rounded-2xl border border-white/10 bg-slate-950/15 p-5 backdrop-blur-sm">
              <p className="text-sm text-slate-100">Con NexS Wallet puedes enviar, recibir y monitorear tus criptos con total control.</p>
            </div>
          </div>

          <div className="w-full max-w-md justify-self-center">
            <div className="text-center mb-8">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-600 to-indigo-500 shadow-lg shadow-violet-900/20">
                <img src="/logo.svg" alt="NexS Wallet" className="h-10 w-10" />
              </div>
              <h1 className="mt-4 text-3xl font-bold text-white">NexS Wallet</h1>
              <p className="text-slate-400 mt-1">Tu billetera multichain</p>
            </div>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}