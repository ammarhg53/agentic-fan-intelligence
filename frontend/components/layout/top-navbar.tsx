"use client";

import { Bell, Menu, Search, Signal, Sparkles } from "lucide-react";
import { StatusPill } from "@/components/ui/status-pill";
import { systemSignals } from "@/lib/dashboard-data";
import { cn } from "@/lib/utils";

export function TopNavbar({ onMenuClick }: { onMenuClick: () => void }) {
  return (
    <header className="sticky top-0 z-30 border-b border-white/10 bg-pitch-950/70 backdrop-blur-2xl">
      <div className="flex min-h-16 items-center gap-3 px-4 sm:px-6">
        <button
          type="button"
          onClick={onMenuClick}
          className="grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/5 text-white/70 transition hover:border-neon-500/40 hover:text-white lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <StatusPill tone="lime">
              <Signal className="h-3 w-3" aria-hidden="true" />
              Live
            </StatusPill>
            <span className="hidden text-xs text-white/40 sm:inline">IPL Final Simulation</span>
          </div>
          <h1 className="mt-1 truncate font-display text-lg font-bold text-white sm:text-xl">
            Agentic Fan Intelligence Platform
          </h1>
        </div>

        <div className="hidden items-center gap-2 xl:flex">
          {systemSignals.map((signal) => {
            const Icon = signal.icon;

            return (
              <div
                key={signal.label}
                className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 py-2"
              >
                <Icon className="h-3.5 w-3.5 text-neon-200" aria-hidden="true" />
                <span className="text-xs text-white/50">{signal.label}</span>
                <span className="text-xs font-semibold text-white">{signal.value}</span>
              </div>
            );
          })}
        </div>

        <div className="hidden h-10 w-64 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.045] px-3 text-white/50 md:flex">
          <Search className="h-4 w-4" aria-hidden="true" />
          <span className="text-sm">Search match, player, scenario</span>
        </div>

        <button
          type="button"
          className={cn(
            "grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.045] text-white/70 transition",
            "hover:border-violet-500/40 hover:text-white hover:shadow-violet-sm"
          )}
          aria-label="AI assistant"
        >
          <Sparkles className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          className="relative grid h-10 w-10 place-items-center rounded-lg border border-white/10 bg-white/[0.045] text-white/70 transition hover:border-neon-500/40 hover:text-white"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" aria-hidden="true" />
          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-lime-500 shadow-lime-sm" />
        </button>
      </div>
    </header>
  );
}
