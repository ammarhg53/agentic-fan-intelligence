import {
  doc,
  onSnapshot,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type Unsubscribe
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type {
  AIInsight,
  DashboardMetricDocument,
  LiveDashboardFeedDocument,
  LiveMatchSnapshot,
  MatchPhase,
  MetricIconKey,
  MetricTone,
  MomentumPoint,
  PlayerSignal,
  SupportedLanguage,
  TeamSnapshot,
  WhatIfScenario
} from "@/types";

const metricTones: MetricTone[] = ["cyan", "violet", "lime", "gold", "crimson"];
const metricIconKeys: MetricIconKey[] = ["target", "zap", "brain", "sparkles", "activity"];
const matchPhases: MatchPhase[] = ["Powerplay", "Middle Overs", "Death Overs"];
const languages: SupportedLanguage[] = ["en", "hi", "gu"];

function toIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readNumber(value: unknown, fallback: number): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function readArray<T>(value: unknown, mapper: (item: unknown, index: number) => T): T[] {
  return Array.isArray(value) ? value.map(mapper) : [];
}

function normalizeTeam(value: unknown, fallbackShortName: string): TeamSnapshot {
  const data = isRecord(value) ? value : {};

  return {
    name: readString(data.name, fallbackShortName),
    shortName: readString(data.shortName, fallbackShortName),
    score: readString(data.score, "0/0"),
    overs: readString(data.overs, "0.0"),
    probability: readNumber(data.probability, 50),
    color: readString(data.color, "#00e5ff")
  };
}

function normalizeLiveMatch(value: unknown): LiveMatchSnapshot {
  const data = isRecord(value) ? value : {};
  const phase = matchPhases.includes(data.phase as MatchPhase) ? (data.phase as MatchPhase) : "Death Overs";

  return {
    title: readString(data.title, "Live Cricket Intelligence"),
    venue: readString(data.venue, "Match centre"),
    phase,
    requiredRate: readNumber(data.requiredRate, 0),
    currentRate: readNumber(data.currentRate, 0),
    battingTeam: normalizeTeam(data.battingTeam, "BAT"),
    bowlingTeam: normalizeTeam(data.bowlingTeam, "BOWL")
  };
}

function normalizeMetric(value: unknown, index: number): DashboardMetricDocument {
  const data = isRecord(value) ? value : {};
  const tone = metricTones.includes(data.tone as MetricTone) ? (data.tone as MetricTone) : "cyan";
  const iconKey = metricIconKeys.includes(data.iconKey as MetricIconKey)
    ? (data.iconKey as MetricIconKey)
    : "activity";

  return {
    label: readString(data.label, `Metric ${index + 1}`),
    value: readString(data.value, "0"),
    subValue: readString(data.subValue, "Awaiting signal"),
    change: readString(data.change, "Live sync"),
    tone,
    iconKey,
    progress: Math.min(Math.max(readNumber(data.progress, 0), 0), 100)
  };
}

function normalizeInsightType(value: unknown): AIInsight["type"] {
  if (
    value === "momentum" ||
    value === "tactical" ||
    value === "player" ||
    value === "prediction" ||
    value === "commentary" ||
    value === "what_if"
  ) {
    return value;
  }

  return "prediction";
}

function normalizeInsight(value: unknown, index: number): AIInsight {
  const data = isRecord(value) ? value : {};
  const language = languages.includes(data.language as SupportedLanguage)
    ? (data.language as SupportedLanguage)
    : "en";

  return {
    id: readString(data.id, `firestore-insight-${index + 1}`),
    type: normalizeInsightType(data.type),
    title: readString(data.title, "Live AI insight"),
    content: readString(data.content, "Waiting for the next model signal."),
    confidence: Math.min(Math.max(readNumber(data.confidence, 0), 0), 100),
    generatedAt: readString(data.generatedAt, "Live"),
    language,
    matchId: typeof data.matchId === "string" ? data.matchId : undefined
  };
}

function normalizeMomentumPoint(value: unknown): MomentumPoint {
  const data = isRecord(value) ? value : {};

  return {
    over: readNumber(data.over, 0),
    home: Math.min(Math.max(readNumber(data.home, 50), 0), 100),
    away: Math.min(Math.max(readNumber(data.away, 50), 0), 100)
  };
}

function normalizePlayerSignal(value: unknown, index: number): PlayerSignal {
  const data = isRecord(value) ? value : {};

  return {
    name: readString(data.name, `Player ${index + 1}`),
    role: readString(data.role, "Signal"),
    signal: readString(data.signal, "Live player intelligence pending."),
    impact: Math.min(Math.max(readNumber(data.impact, 0), 0), 100),
    trend: readString(data.trend, "Neutral")
  };
}

function normalizeScenario(value: unknown): WhatIfScenario {
  const data = isRecord(value) ? value : {};

  return {
    title: readString(data.title, "What-if scenario"),
    trigger: readString(data.trigger, "Match state changes"),
    outcome: readString(data.outcome, "Model recalculates probability"),
    probabilityShift: readString(data.probabilityShift, "0")
  };
}

function mapDashboardSnapshot(snapshot: DocumentSnapshot<DocumentData>): LiveDashboardFeedDocument | null {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    matchId: readString(data.matchId, snapshot.id),
    status: data.status === "upcoming" || data.status === "completed" ? data.status : "live",
    updatedAt: toIsoString(data.updatedAt),
    liveMatch: normalizeLiveMatch(data.liveMatch),
    metrics: readArray(data.metrics, normalizeMetric),
    insights: readArray(data.insights, normalizeInsight),
    momentum: readArray(data.momentum, normalizeMomentumPoint),
    playerSignals: readArray(data.playerSignals, normalizePlayerSignal),
    whatIfScenarios: readArray(data.whatIfScenarios, normalizeScenario)
  };
}

export function subscribeToLiveDashboardFeed(
  matchId: string,
  onData: (feed: LiveDashboardFeedDocument | null) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe {
  const db = getFirestoreDb();
  const feedRef = doc(db, "dashboardFeeds", matchId);

  return onSnapshot(
    feedRef,
    (snapshot) => {
      onData(mapDashboardSnapshot(snapshot));
    },
    onError
  );
}
