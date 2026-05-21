import { Activity, ArrowUpRight, Clock3, MapPin } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill } from "@/components/ui/status-pill";
import { liveMatch } from "@/lib/dashboard-data";
import { formatRunRate } from "@/lib/utils";
import type { LiveMatchSnapshot } from "@/types";

export function LiveMatchPanel({ match = liveMatch }: { match?: LiveMatchSnapshot }) {
  return (
    <GlassCard className="p-4 sm:p-6" intensity="strong">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="lime">Live match</StatusPill>
            <StatusPill tone="violet">{match.phase}</StatusPill>
          </div>
          <h2 className="mt-4 max-w-3xl font-display text-3xl font-black leading-tight text-white sm:text-4xl xl:text-5xl">
            {match.title}
          </h2>
          <div className="mt-3 flex flex-wrap gap-4 text-sm text-white/50">
            <span className="inline-flex items-center gap-2">
              <MapPin className="h-4 w-4 text-neon-200" aria-hidden="true" />
              {match.venue}
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 className="h-4 w-4 text-neon-200" aria-hidden="true" />
              Over {match.battingTeam.overs}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 lg:w-[22rem]">
          <div className="rounded-lg border border-neon-500/25 bg-neon-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-neon-100/70">Current RR</p>
            <p className="mt-2 score-text text-3xl font-black text-white">
              {formatRunRate(match.currentRate)}
            </p>
          </div>
          <div className="rounded-lg border border-gold-500/25 bg-gold-500/10 p-4">
            <p className="text-xs uppercase tracking-[0.16em] text-gold-400/80">Required RR</p>
            <p className="mt-2 score-text text-3xl font-black text-white">
              {formatRunRate(match.requiredRate)}
            </p>
          </div>
        </div>
      </div>

      <div className="hud-line my-6" />

      <div className="grid gap-4 lg:grid-cols-[1fr_auto_1fr] lg:items-center">
        {[match.battingTeam, match.bowlingTeam].map((team, index) => (
          <div key={team.shortName} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                  {index === 0 ? "Chasing" : "Target set"}
                </p>
                <h3 className="mt-2 font-display text-xl font-bold text-white">{team.name}</h3>
              </div>
              <div
                className="grid h-12 w-12 place-items-center rounded-lg border text-sm font-black"
                style={{ borderColor: `${team.color}66`, color: team.color, backgroundColor: `${team.color}18` }}
              >
                {team.shortName}
              </div>
            </div>
            <div className="mt-5 flex items-end justify-between gap-4">
              <div>
                <p className="score-text text-4xl font-black text-white">{team.score}</p>
                <p className="mt-1 text-sm text-white/50">{team.overs} overs</p>
              </div>
              <div className="text-right">
                <p className="score-text text-2xl font-bold text-white">{team.probability}%</p>
                <p className="text-xs uppercase tracking-[0.14em] text-white/40">Win prob</p>
              </div>
            </div>
            <div className="meter-track mt-4">
              <div
                className="h-full rounded-sm"
                style={{
                  width: `${team.probability}%`,
                  background: `linear-gradient(90deg, ${team.color}, rgba(255,255,255,0.72))`
                }}
              />
            </div>
          </div>
        ))}

        <div className="hidden h-16 w-16 place-items-center rounded-lg border border-white/10 bg-white/[0.045] text-white/60 lg:grid">
          <ArrowUpRight className="h-6 w-6" aria-hidden="true" />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-white/50">
        <Activity className="h-4 w-4 text-lime-400" aria-hidden="true" />
        Mumbai require 20 from 13. Model detects batting edge against pace-off length.
      </div>
    </GlassCard>
  );
}
