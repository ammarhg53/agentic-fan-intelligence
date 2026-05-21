"use client";

import Link from "next/link";
import { ArrowLeft, Clock3, MapPin, Radio, Shield, Sparkles, Target, Trophy, Zap } from "lucide-react";
import { CommentaryTimeline } from "@/components/match/commentary-timeline";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill } from "@/components/ui/status-pill";
import { useMatchDetail } from "@/hooks/use-match-detail";

export function MatchDetailPage({ matchId }: { matchId: string }) {
  const { data, error, isLive, isLoading } = useMatchDetail(matchId);
  const { match, commentary } = data;

  return (
    <div className="space-y-5 sm:space-y-6">
      <div className="flex flex-col gap-3 rounded-lg border border-white/10 bg-white/[0.035] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-white/70 transition hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          Dashboard
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <StatusPill tone={isLive ? "lime" : isLoading ? "cyan" : "gold"}>
            <Radio className="h-3 w-3" aria-hidden="true" />
            {isLive ? "Firestore live" : isLoading ? "Syncing match" : "Demo fallback"}
          </StatusPill>
          {error ? <span className="text-sm text-gold-400">{error}</span> : null}
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,1.35fr)_minmax(340px,0.65fr)]">
        <GlassCard className="p-4 sm:p-6" intensity="strong">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <StatusPill tone="lime">{match.status}</StatusPill>
                <StatusPill tone="violet">{match.phase}</StatusPill>
              </div>
              <h1 className="mt-4 max-w-4xl font-display text-3xl font-black leading-tight text-white sm:text-5xl">
                {match.title}
              </h1>
              <div className="mt-4 flex flex-wrap gap-4 text-sm text-white/50">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-neon-100" aria-hidden="true" />
                  {match.venue}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Clock3 className="h-4 w-4 text-neon-100" aria-hidden="true" />
                  {match.updatedAt ?? "Live sync pending"}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 lg:w-[22rem]">
              <div className="rounded-lg border border-neon-500/25 bg-neon-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-neon-100">Win prob</p>
                <p className="mt-2 score-text text-3xl font-black text-white">{match.winProbability.home}%</p>
              </div>
              <div className="rounded-lg border border-lime-500/25 bg-lime-500/10 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-lime-400">Momentum</p>
                <p className="mt-2 score-text text-3xl font-black text-white">{match.momentumIndex}</p>
              </div>
            </div>
          </div>

          <div className="hud-line my-6" />

          <div className="grid gap-4 lg:grid-cols-2">
            {[match.liveMatch.battingTeam, match.liveMatch.bowlingTeam].map((team, index) => (
              <div key={team.shortName} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
                      {index === 0 ? "Batting now" : "Defending"}
                    </p>
                    <h2 className="mt-2 font-display text-xl font-bold text-white">{team.name}</h2>
                  </div>
                  <div
                    className="grid h-12 w-12 place-items-center rounded-lg border text-sm font-black"
                    style={{
                      borderColor: `${team.color}66`,
                      color: team.color,
                      backgroundColor: `${team.color}18`
                    }}
                  >
                    {team.shortName}
                  </div>
                </div>
                <div className="mt-5 flex items-end justify-between gap-4">
                  <div>
                    <p className="score-text text-4xl font-black text-white">{team.score}</p>
                    <p className="mt-1 text-sm text-white/50">{team.overs} overs</p>
                  </div>
                  <p className="score-text text-2xl font-bold text-white">{team.probability}%</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <StatusPill tone="gold">Match state</StatusPill>
              <h2 className="mt-3 font-display text-2xl font-black text-white">Tactical board</h2>
            </div>
            <Shield className="h-5 w-5 text-gold-400" aria-hidden="true" />
          </div>
          <p className="mt-4 text-sm leading-6 text-white/60">{match.toss}</p>
          <div className="mt-5 space-y-3">
            {match.innings.map((inning) => (
              <div key={`${inning.teamShortName}-${inning.status}`} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="font-display text-lg font-bold text-white">{inning.teamShortName}</span>
                  <span className="score-text text-2xl font-black text-white">
                    {inning.runs}/{inning.wickets}
                  </span>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-white/50">
                  <span>Overs {inning.overs}</span>
                  <span>RR {inning.runRate.toFixed(2)}</span>
                  <span>{inning.requiredRate === null ? "Target set" : `Req ${inning.requiredRate.toFixed(2)}`}</span>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section className="grid gap-4 xl:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)]">
        <GlassCard className="p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <div>
              <StatusPill tone="violet">Player intelligence</StatusPill>
              <h2 className="mt-3 font-display text-2xl font-black text-white">Impact stack</h2>
            </div>
            <Trophy className="h-5 w-5 text-neon-100" aria-hidden="true" />
          </div>
          <div className="mt-5 space-y-3">
            {match.keyPlayers.map((player) => (
              <article key={`${player.teamShortName}-${player.name}`} className="rounded-lg border border-white/10 bg-white/[0.045] p-4">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-white">{player.name}</h3>
                    <p className="mt-1 text-xs uppercase tracking-[0.14em] text-white/40">
                      {player.teamShortName} - {player.role}
                    </p>
                  </div>
                  <span className="score-text text-lg font-bold text-lime-400">{player.impact}</span>
                </div>
                <p className="mt-3 text-sm font-semibold text-white">{player.statLine}</p>
                <p className="mt-2 text-sm leading-6 text-white/60">{player.note}</p>
              </article>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-neon-500/20 bg-neon-500/10 p-4">
            <div className="flex items-center gap-2 text-sm font-bold text-white">
              <Sparkles className="h-4 w-4 text-neon-100" aria-hidden="true" />
              Tactical notes
            </div>
            <div className="mt-3 space-y-2">
              {match.tacticalNotes.map((note) => (
                <p key={note} className="text-sm leading-6 text-white/60">
                  {note}
                </p>
              ))}
            </div>
          </div>
        </GlassCard>

        <GlassCard className="p-4 sm:p-5">
          <CommentaryTimeline events={commentary} isLive={isLive} />
        </GlassCard>
      </section>

      <section className="grid gap-4 md:grid-cols-3">
        {[
          { label: "Required rate", value: match.liveMatch.requiredRate.toFixed(2), icon: Target },
          { label: "Current rate", value: match.liveMatch.currentRate.toFixed(2), icon: Zap },
          { label: "Commentary events", value: String(commentary.length), icon: Radio }
        ].map((metric) => {
          const Icon = metric.icon;

          return (
            <GlassCard key={metric.label} className="p-4">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">{metric.label}</p>
                  <p className="mt-2 score-text text-3xl font-black text-white">{metric.value}</p>
                </div>
                <div className="grid h-10 w-10 place-items-center rounded-lg border border-neon-500/25 bg-neon-500/10 text-neon-100">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
              </div>
            </GlassCard>
          );
        })}
      </section>
    </div>
  );
}
