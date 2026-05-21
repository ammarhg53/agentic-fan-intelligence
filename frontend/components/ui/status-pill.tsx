import { cn } from "@/lib/utils";
import type { MetricTone } from "@/types";

const toneClass: Record<MetricTone, string> = {
  cyan: "border-neon-500/30 bg-neon-500/10 text-neon-100",
  violet: "border-violet-500/30 bg-violet-500/10 text-violet-400",
  lime: "border-lime-500/30 bg-lime-500/10 text-lime-400",
  gold: "border-gold-500/30 bg-gold-500/10 text-gold-400",
  crimson: "border-crimson-500/30 bg-crimson-500/10 text-crimson-400"
};

export function StatusPill({
  children,
  tone = "cyan",
  className
}: {
  children: React.ReactNode;
  tone?: MetricTone;
  className?: string;
}) {
  return <span className={cn("chip", toneClass[tone], className)}>{children}</span>;
}
