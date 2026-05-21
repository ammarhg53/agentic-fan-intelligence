"use client";

import { useMemo, useState } from "react";
import { AlertTriangle, Bot, CheckCircle2, LogOut, UserRound, Zap } from "lucide-react";
import { GlassCard } from "@/components/ui/glass-card";
import { StatusPill } from "@/components/ui/status-pill";
import { useFirebaseAuth } from "@/components/providers/firebase-auth-provider";
import { getPublicEnvStatus } from "@/lib/env/public";
import { generateMatchInsights } from "@/services/api/ai-insights-api";
import type { AIInsight } from "@/types";

export function IntegrationStatusCard() {
  const auth = useFirebaseAuth();
  const publicEnv = useMemo(() => getPublicEnvStatus(), []);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [latestInsight, setLatestInsight] = useState<AIInsight | null>(null);

  async function handleGeneratePulse() {
    setAiLoading(true);
    setAiError(null);

    try {
      const response = await generateMatchInsights({
        matchId: "ipl-2026-final-sim",
        fanMode: "analyst",
        language: "en",
        matchContext:
          "Mumbai Mavericks need 20 runs from 13 balls with 6 wickets in hand. Dew is visible. Chennai's death bowler has missed yorker length repeatedly."
      });

      setLatestInsight(response.insights[0] ?? null);
    } catch (error: unknown) {
      setAiError(error instanceof Error ? error.message : "AI insight generation failed.");
    } finally {
      setAiLoading(false);
    }
  }

  const authLabel = auth.loading
    ? "Connecting"
    : auth.user
      ? auth.user.isAnonymous
        ? "Guest session"
        : "Signed in"
      : "Signed out";

  return (
    <GlassCard className="p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <StatusPill tone={publicEnv.isValid ? "lime" : "crimson"}>
            {publicEnv.isValid ? "Firebase ready" : "Firebase config"}
          </StatusPill>
          <h2 className="mt-3 font-display text-2xl font-black text-white">Integration control</h2>
          <p className="mt-2 max-w-3xl text-sm leading-6 text-white/60">
            Auth, Firestore, and server-side AI calls are routed through typed service layers.
          </p>
        </div>

        <div className="grid gap-2 sm:grid-cols-2 lg:min-w-[24rem]">
          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {auth.error || !auth.isConfigured ? (
                <AlertTriangle className="h-4 w-4 text-crimson-400" aria-hidden="true" />
              ) : (
                <CheckCircle2 className="h-4 w-4 text-lime-400" aria-hidden="true" />
              )}
              {authLabel}
            </div>
            <p className="mt-1 truncate text-xs text-white/50">
              {auth.user?.email ?? auth.user?.displayName ?? auth.user?.uid ?? "No active fan profile"}
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.045] p-3">
            <div className="flex items-center gap-2 text-sm font-semibold text-white">
              {aiError ? (
                <AlertTriangle className="h-4 w-4 text-crimson-400" aria-hidden="true" />
              ) : (
                <Bot className="h-4 w-4 text-neon-100" aria-hidden="true" />
              )}
              Gemini route
            </div>
            <p className="mt-1 truncate text-xs text-white/50">
              {aiLoading ? "Generating pulse" : latestInsight?.title ?? "Server-side key boundary"}
            </p>
          </div>
        </div>
      </div>

      {(auth.error || aiError || !publicEnv.isValid) && (
        <div className="mt-4 rounded-lg border border-crimson-500/25 bg-crimson-500/10 p-3 text-sm text-crimson-400">
          {auth.error ?? aiError ?? `Missing Firebase env: ${publicEnv.missing.join(", ")}`}
        </div>
      )}

      {latestInsight && (
        <div className="mt-4 rounded-lg border border-neon-500/20 bg-neon-500/10 p-4">
          <p className="text-sm font-bold text-white">{latestInsight.title}</p>
          <p className="mt-2 text-sm leading-6 text-white/60">{latestInsight.content}</p>
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {!auth.user ? (
          <>
            <button
              type="button"
              onClick={auth.signInAnonymously}
              disabled={auth.actionLoading || auth.loading || !auth.isConfigured}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm font-semibold text-white transition hover:border-neon-500/30 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Guest
            </button>
            <button
              type="button"
              onClick={auth.signInWithGoogle}
              disabled={auth.actionLoading || auth.loading || !auth.isConfigured}
              className="inline-flex h-10 items-center gap-2 rounded-lg border border-neon-500/25 bg-neon-500/10 px-3 text-sm font-semibold text-neon-100 transition hover:border-neon-500/40 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <UserRound className="h-4 w-4" aria-hidden="true" />
              Google
            </button>
          </>
        ) : (
          <button
            type="button"
            onClick={auth.signOut}
            disabled={auth.actionLoading}
            className="inline-flex h-10 items-center gap-2 rounded-lg border border-white/10 bg-white/[0.055] px-3 text-sm font-semibold text-white transition hover:border-crimson-500/30 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <LogOut className="h-4 w-4" aria-hidden="true" />
            Sign out
          </button>
        )}

        <button
          type="button"
          onClick={handleGeneratePulse}
          disabled={aiLoading}
          className="inline-flex h-10 items-center gap-2 rounded-lg border border-violet-500/25 bg-violet-500/10 px-3 text-sm font-semibold text-violet-400 transition hover:border-violet-500/40 disabled:cursor-not-allowed disabled:opacity-50"
        >
          <Zap className="h-4 w-4" aria-hidden="true" />
          {aiLoading ? "Generating" : "AI pulse"}
        </button>
      </div>
    </GlassCard>
  );
}
