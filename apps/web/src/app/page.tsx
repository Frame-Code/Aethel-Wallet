import Link from 'next/link';

const features = [
  'Multichain support',
  'Seguridad con biometría',
  'Panel de control en tiempo real',
];

export default function Home() {
  return (
    <main className="min-h-screen bg-slate-950 text-slate-100">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(124,58,237,0.18),transparent_25%)]" />
        <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6 pb-24 pt-8 lg:px-8">
          <nav className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/50 px-4 py-3 backdrop-blur">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500">
                <img src="/logo.svg" alt="NexS Wallet" className="h-6 w-6" />
              </div>
              <span className="text-sm font-semibold tracking-[0.3em] text-slate-200">NEXS</span>
            </div>
            <div className="flex gap-3">
              <Link href="/login" className="rounded-xl border border-slate-700 px-4 py-2 text-sm text-slate-200 transition hover:border-violet-500 hover:text-white">
                Iniciar sesión
              </Link>
              <Link href="/register" className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90">
                Crear cuenta
              </Link>
            </div>
          </nav>

          <div className="mt-16 grid flex-1 gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-sm uppercase tracking-[0.4em] text-violet-300">Wallet multichain</p>
              <h1 className="mt-4 text-5xl font-semibold leading-tight text-white lg:text-6xl">
                Controla tus criptoactivos con confianza.
              </h1>
              <p className="mt-5 max-w-2xl text-lg text-slate-300">
                Envía, recibe y monitorea tus fondos desde una interfaz moderna, segura y fácil de usar.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register" className="rounded-2xl bg-gradient-to-r from-violet-600 to-indigo-600 px-6 py-3 font-medium text-white transition hover:opacity-90">
                  Comenzar ahora
                </Link>
                <Link href="/dashboard" className="rounded-2xl border border-slate-700 px-6 py-3 font-medium text-slate-100 transition hover:border-violet-500 hover:text-white">
                  Ver demo
                </Link>
              </div>
              <ul className="mt-8 flex flex-wrap gap-3">
                {features.map((feature) => (
                  <li key={feature} className="rounded-full border border-slate-700 bg-slate-900/70 px-4 py-2 text-sm text-slate-300">
                    {feature}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl shadow-violet-950/20 backdrop-blur-xl">
              <div className="rounded-2xl bg-gradient-to-br from-violet-600 via-indigo-500 to-cyan-500 p-6">
                <div className="flex items-center justify-between">
                  <p className="text-sm text-violet-100">Saldo total</p>
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white">+8.24%</span>
                </div>
                <h2 className="mt-4 text-4xl font-semibold text-white">$83,500</h2>
                <div className="mt-6 rounded-2xl border border-white/10 bg-slate-950/15 p-4">
                  <p className="text-xs text-slate-200">NexS Wallet</p>
                  <p className="mt-2 text-lg font-semibold text-white">•••• 4821</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}