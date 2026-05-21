"use client";

import { ArrowUpRight, BrainCircuit, Cpu, Sparkles } from "lucide-react";
import { MomentumSparkline } from "@/charts/momentum-sparkline";
import { IntegrationStatusCard } from "@/components/dashboard/integration-status-card";
import { LiveMatchPanel } from "@/components/dashboard/live-match-panel";
import { MetricWidget } from "@/components/dashboard/metric-widget";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill } from "@/components/ui/status-pill";
import { useLiveDashboardFeed } from "@/hooks/use-live-dashboard-feed";

export function DashboardHome() {
  const { data, error, isLive, isLoading } = useLiveDashboardFeed();

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={isLive ? "lime" : isLoading ? "cyan" : "gold"}>
            {isLive ? "Firestore live" : isLoading ? "Syncing feed" : "Demo fallback"}
          </StatusPill>
          <span className="text-sm text-white/50">
            {data.updatedAt ? `Updated ${data.updatedAt}` : "Awaiting live match sync"}
          </span>
        </div>
        {error ? <p className="text-sm text-gold-400">{error}</p> : null}
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">
        <LiveMatchPanel match={data.liveMatch} />

        <GlassCard className="p-4 sm:p-5" intensity="strong">
          <div className="flex items-center justify-between gap-3">
            <div>
              <StatusPill tone="cyan">AI commentary</StatusPill>
              <h2 className="mt-4 font-display text-2xl font-black text-white">Insight stream</h2>
            </div>
            <div className="grid h-10 w-10 place-items-center rounded-lg border border-violet-500/30 bg-violet-500/10 text-violet-400">
              <BrainCircuit className="h-5 w-5" aria-hidden="true" />
            </div>
          </div>

          <div className="mt-5 space-y-3">
            {data.insights.map((insight) => (
              <article key={insight.id} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-bold text-white">{insight.title}</h3>
                    <p className="mt-2 text-sm leading-6 text-white/60">{insight.content}</p>
                  </div>
                  <span className="score-text rounded-md border border-neon-500/25 bg-neon-500/10 px-2 py-1 text-sm font-bold text-neon-100">
                    {insight.confidence}
                  </span>
                </div>
                <p className="mt-3 text-xs uppercase tracking-[0.14em] text-white/30">
                  {insight.generatedAt}
                </p>
              </article>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {data.metrics.map((metric, index) => (
          <MetricWidget key={metric.label} metric={metric} index={index} />
        ))}
      </section>

      <IntegrationStatusCard />

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
        <GlassCard className="p-4 sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <StatusPill tone="lime">Momentum analysis</StatusPill>
              <h2 className="mt-3 font-display text-2xl font-black text-white">Pressure curve</h2>
            </div>
            <div className="flex items-center gap-3 text-xs text-white/50">
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-neon-500" />
                Mumbai
              </span>
              <span className="inline-flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-gold-500" />
                Chennai
              </span>
            </div>
          </div>
          <div className="mt-5 h-56 rounded-lg border border-white/10 bg-black/20 p-3">
            <MomentumSparkline points={data.momentum} />
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <StatusPill tone="violet">Smart players</StatusPill>
              <h2 className="mt-3 font-display text-2xl font-black text-white">Impact signals</h2>
            </div>
            <Cpu className="h-5 w-5 text-neon-200" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-3">
            {data.playerSignals.map((player) => (
              <div key={player.name} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{player.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">{player.role}</p>
                  </div>
                  <span className="score-text text-lg font-bold text-lime-400">{player.impact}</span>
                </div>
                <p className="mt-3 text-sm text-white/60">{player.signal}</p>
                <p className="mt-2 text-xs font-semibold text-neon-100">{player.trend}</p>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {data.whatIfScenarios.map((scenario) => (
          <GlassCard key={scenario.title} interactive className="p-4 sm:p-5">
            <div className="flex items-start justify-between gap-4">
              <div>
                <StatusPill tone={scenario.probabilityShift.startsWith("+") ? "lime" : "crimson"}>
                  What-if simulator
                </StatusPill>
                <h2 className="mt-4 font-display text-xl font-black text-white">{scenario.title}</h2>
              </div>
              <div className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.045] text-neon-100">
                <Sparkles className="h-5 w-5" aria-hidden="true" />
              </div>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-[1fr_auto_1fr] sm:items-center">
              <p className="rounded-lg border border-white/10 bg-white/[0.045] p-4 text-sm text-white/60">
                {scenario.trigger}
              </p>
              <ArrowUpRight className="hidden h-5 w-5 text-white/40 sm:block" aria-hidden="true" />
              <p className="rounded-lg border border-neon-500/20 bg-neon-500/10 p-4 text-sm font-semibold text-white">
                {scenario.outcome}
              </p>
            </div>
            <p className="mt-4 score-text text-2xl font-black text-white">{scenario.probabilityShift}</p>
          </GlassCard>
        ))}
      </section>
    </div>
  );
}
