"use client";

import { motion } from "framer-motion";
import { GlassCard } from "@/components/ui/glass-card";
import { cn } from "@/lib/utils";
import type { DashboardMetric, MetricTone } from "@/types";

const toneClasses: Record<MetricTone, { text: string; fill: string; border: string }> = {
  cyan: {
    text: "text-neon-100",
    fill: "bg-gradient-to-r from-neon-500 via-cyan-200 to-violet-500",
    border: "border-neon-500/30"
  },
  violet: {
    text: "text-violet-400",
    fill: "bg-gradient-to-r from-violet-600 via-violet-400 to-neon-500",
    border: "border-violet-500/30"
  },
  lime: {
    text: "text-lime-400",
    fill: "bg-gradient-to-r from-lime-500 via-neon-500 to-lime-400",
    border: "border-lime-500/25"
  },
  gold: {
    text: "text-gold-400",
    fill: "bg-gradient-to-r from-gold-500 via-amber-500 to-crimson-500",
    border: "border-gold-500/30"
  },
  crimson: {
    text: "text-crimson-400",
    fill: "bg-gradient-to-r from-crimson-500 via-amber-500 to-gold-500",
    border: "border-crimson-500/30"
  }
};

export function MetricWidget({ metric, index }: { metric: DashboardMetric; index: number }) {
  const Icon = metric.icon;
  const tone = toneClasses[metric.tone];

  return (
    <motion.div
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07, duration: 0.42, ease: [0.16, 1, 0.3, 1] }}
    >
      <GlassCard interactive className={cn("h-full p-4 sm:p-5", tone.border)}>
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-white/40">
              {metric.label}
            </p>
            <p className="mt-3 score-text text-3xl font-black text-white sm:text-4xl">
              {metric.value}
            </p>
          </div>
          <div className={cn("grid h-10 w-10 place-items-center rounded-lg border bg-white/5", tone.border)}>
            <Icon className={cn("h-5 w-5", tone.text)} aria-hidden="true" />
          </div>
        </div>
        <div className="mt-4 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/90">{metric.subValue}</p>
            <p className="mt-1 text-xs text-white/50">{metric.change}</p>
          </div>
          <span className={cn("text-xs font-bold uppercase tracking-[0.14em]", tone.text)}>
            {metric.progress}
          </span>
        </div>
        <div className="meter-track mt-4">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${metric.progress}%` }}
            transition={{ delay: 0.18 + index * 0.05, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className={cn("meter-fill", tone.fill)}
          />
        </div>
      </GlassCard>
    </motion.div>
  );
}
