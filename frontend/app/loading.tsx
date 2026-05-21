import { Gauge, Radio, Sparkles } from "lucide-react";

export default function Loading() {
  return (
    <div className="grid min-h-[calc(100vh-5rem)] place-items-center px-4">
      <section className="glass-panel w-full max-w-lg p-6 text-center">
        <div className="mx-auto grid h-14 w-14 place-items-center rounded-lg border border-neon-500/30 bg-neon-500/10 text-neon-100 shadow-neon-sm">
          <Gauge className="h-7 w-7 animate-pulse" aria-hidden="true" />
        </div>
        <h1 className="mt-5 font-display text-2xl font-black text-white">Booting match intelligence</h1>
        <p className="mt-2 text-sm leading-6 text-white/60">
          Syncing live probability, AI commentary, and tactical signals.
        </p>
        <div className="mt-6 grid gap-2 sm:grid-cols-3">
          {[
            { label: "Firebase", icon: Radio },
            { label: "Gemini", icon: Sparkles },
            { label: "Dashboard", icon: Gauge }
          ].map((item) => {
            const Icon = item.icon;

            return (
              <div key={item.label} className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
                <Icon className="mx-auto h-4 w-4 text-neon-100" aria-hidden="true" />
                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.14em] text-white/50">
                  {item.label}
                </p>
              </div>
            );
          })}
        </div>
        <div className="meter-track mt-6">
          <div className="meter-fill w-3/4 bg-gradient-to-r from-neon-500 via-violet-500 to-lime-500" />
        </div>
      </section>
    </div>
  );
}
