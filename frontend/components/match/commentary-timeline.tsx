import {
  Activity,
  Bot,
  Crosshair,
  Radio,
  Sparkles,
  Target,
  Trophy,
  Zap,
  type LucideIcon
} from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { cn } from "@/lib/utils";
import type { CommentaryEvent, CommentaryEventType, MetricTone } from "@/types";

const eventStyles: Record<
  CommentaryEventType,
  { icon: LucideIcon; tone: MetricTone; rail: string; label: string }
> = {
  ai: {
    icon: Bot,
    tone: "violet",
    rail: "bg-violet-500",
    label: "AI"
  },
  boundary: {
    icon: Zap,
    tone: "lime",
    rail: "bg-lime-500",
    label: "Boundary"
  },
  wicket: {
    icon: Crosshair,
    tone: "crimson",
    rail: "bg-crimson-500",
    label: "Wicket"
  },
  over: {
    icon: Activity,
    tone: "cyan",
    rail: "bg-neon-500",
    label: "Over"
  },
  tactical: {
    icon: Sparkles,
    tone: "gold",
    rail: "bg-gold-500",
    label: "Tactical"
  },
  probability: {
    icon: Target,
    tone: "cyan",
    rail: "bg-neon-500",
    label: "Win prob"
  },
  milestone: {
    icon: Trophy,
    tone: "gold",
    rail: "bg-gold-500",
    label: "Milestone"
  }
};

export function CommentaryTimeline({
  events,
  isLive
}: {
  events: CommentaryEvent[];
  isLive: boolean;
}) {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <StatusPill tone={isLive ? "lime" : "gold"}>
            <Radio className="h-3 w-3" aria-hidden="true" />
            {isLive ? "Realtime" : "Seeded"}
          </StatusPill>
          <h2 className="mt-3 font-display text-2xl font-black text-white">AI commentary timeline</h2>
        </div>
        <span className="score-text text-2xl font-black text-white">{events.length}</span>
      </div>

      <div className="relative space-y-3">
        <div className="absolute bottom-3 left-[1.18rem] top-3 w-px bg-white/10" aria-hidden="true" />
        {events.length === 0 ? (
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-5 text-sm leading-6 text-white/60">
            AI commentary will appear here as soon as the match feed publishes an event.
          </div>
        ) : null}
        {events.map((event) => {
          const style = eventStyles[event.type] ?? eventStyles.ai;
          const Icon = style.icon;

          return (
            <article
              key={event.id}
              className="relative grid grid-cols-[2.4rem_minmax(0,1fr)] gap-3 rounded-lg border border-white/10 bg-white/[0.045] p-3 sm:p-4"
            >
              <div className="relative z-10 grid h-9 w-9 place-items-center rounded-lg border border-white/10 bg-pitch-950">
                <span className={cn("absolute inset-x-2 -top-1 h-1 rounded-full", style.rail)} />
                <Icon className="h-4 w-4 text-white" aria-hidden="true" />
              </div>

              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="rounded-md border border-white/10 bg-white/5 px-2 py-1 text-xs font-bold text-white">
                    {event.over}
                  </span>
                  <StatusPill tone={style.tone}>{style.label}</StatusPill>
                  {event.winProbability !== null ? (
                    <span className="text-xs font-semibold text-neon-100">
                      {event.winProbability}% Mumbai
                    </span>
                  ) : null}
                </div>

                <h3 className="mt-3 text-sm font-bold text-white sm:text-base">{event.title}</h3>
                <p className="mt-2 text-sm leading-6 text-white/60">{event.message}</p>

                <div className="mt-3 flex flex-wrap items-center gap-2">
                  {event.confidence !== null ? (
                    <span className="score-text rounded-md border border-violet-500/25 bg-violet-500/10 px-2 py-1 text-xs font-bold text-violet-400">
                      {event.confidence}
                    </span>
                  ) : null}
                  {event.tags.map((tag) => (
                    <span key={tag} className="rounded-md bg-white/5 px-2 py-1 text-xs text-white/50">
                      {tag}
                    </span>
                  ))}
                  {event.createdAt ? <span className="text-xs text-white/40">{event.createdAt}</span> : null}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
