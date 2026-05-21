import {
  Activity,
  BrainCircuit,
  Gauge,
  Gamepad2,
  LineChart,
  Radio,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  WandSparkles,
  Zap
} from "lucide-react";
import type {
  AIInsight,
  DashboardMetricDocument,
  DashboardMetric,
  LiveDashboardData,
  LiveDashboardFeedDocument,
  LiveMatchSnapshot,
  MetricIconKey,
  MomentumPoint,
  NavigationItem,
  PlayerSignal,
  WhatIfScenario
} from "@/types";

const metricIconMap = {
  target: Target,
  zap: Zap,
  brain: BrainCircuit,
  sparkles: Sparkles,
  activity: Activity
} satisfies Record<MetricIconKey, typeof Target>;

export const navigationItems: NavigationItem[] = [
  { label: "Dashboard", href: "/", icon: Gauge, badge: "Live" },
  { label: "Match Centre", href: "/matches/ipl-2026-final-sim", icon: Gamepad2 },
  { label: "Insight Engine", href: "/insights", icon: BrainCircuit },
  { label: "Win Predictor", href: "/predictor", icon: Target },
  { label: "Momentum", href: "/momentum", icon: Activity },
  { label: "Players", href: "/players", icon: Users },
  { label: "Simulator", href: "/simulator", icon: WandSparkles }
];

export const dashboardMetrics: DashboardMetric[] = [
  {
    label: "Win probability",
    value: "64%",
    subValue: "Mumbai Surge",
    change: "+7.8 last 12 balls",
    tone: "cyan",
    icon: Target,
    progress: 64
  },
  {
    label: "Momentum index",
    value: "82",
    subValue: "High pressure swing",
    change: "+18 since over 14",
    tone: "lime",
    icon: Zap,
    progress: 82
  },
  {
    label: "AI confidence",
    value: "91%",
    subValue: "7 models aligned",
    change: "Stable signal",
    tone: "violet",
    icon: BrainCircuit,
    progress: 91
  },
  {
    label: "Boundary pressure",
    value: "2.4x",
    subValue: "Death overs threat",
    change: "Field spread exposed",
    tone: "gold",
    icon: Sparkles,
    progress: 76
  }
];

export const dashboardMetricDocuments: DashboardMetricDocument[] = dashboardMetrics.map((metric) => {
  const iconKey = Object.entries(metricIconMap).find(([, icon]) => icon === metric.icon)?.[0];

  return {
    label: metric.label,
    value: metric.value,
    subValue: metric.subValue,
    change: metric.change,
    tone: metric.tone,
    iconKey: (iconKey ?? "activity") as MetricIconKey,
    progress: metric.progress
  };
});

export const liveMatch: LiveMatchSnapshot = {
  title: "Mumbai Mavericks vs Chennai Royals",
  venue: "Wankhede Stadium, Mumbai",
  phase: "Death Overs",
  currentRate: 9.42,
  requiredRate: 11.2,
  battingTeam: {
    name: "Mumbai Mavericks",
    shortName: "MM",
    score: "168/4",
    overs: "17.5",
    probability: 64,
    color: "#00e5ff"
  },
  bowlingTeam: {
    name: "Chennai Royals",
    shortName: "CR",
    score: "187/6",
    overs: "20.0",
    probability: 36,
    color: "#ffd166"
  }
};

export const aiInsights: AIInsight[] = [
  {
    id: "insight-1",
    type: "prediction",
    title: "Yorker miss pattern detected",
    content:
      "Chennai's primary death bowler has missed the blockhole on 5 of the last 8 attempts. Mumbai should keep left-right rotation active.",
    confidence: 91,
    generatedAt: "20:08 IST",
    language: "en"
  },
  {
    id: "insight-2",
    type: "momentum",
    title: "Momentum spike after over 16",
    content:
      "Two boundaries against the long square boundary flipped the pressure model. Required rate is high, but matchup quality favors batting.",
    confidence: 87,
    generatedAt: "20:06 IST",
    language: "en"
  },
  {
    id: "insight-3",
    type: "what_if",
    title: "What-if path",
    content:
      "One wicket before 18.3 drops Mumbai to 41 percent. A 12-run over without wicket lifts them to 72 percent.",
    confidence: 84,
    generatedAt: "20:05 IST",
    language: "en"
  }
];

export const momentumPoints: MomentumPoint[] = [
  { over: 10, home: 46, away: 54 },
  { over: 11, home: 44, away: 56 },
  { over: 12, home: 48, away: 52 },
  { over: 13, home: 51, away: 49 },
  { over: 14, home: 50, away: 50 },
  { over: 15, home: 57, away: 43 },
  { over: 16, home: 61, away: 39 },
  { over: 17, home: 68, away: 32 },
  { over: 18, home: 64, away: 36 }
];

export const playerSignals: PlayerSignal[] = [
  {
    name: "Aarav Mehta",
    role: "Finisher",
    signal: "Attacks slower-ball length at 182 SR",
    impact: 88,
    trend: "+24 matchup edge"
  },
  {
    name: "R. Iyer",
    role: "Death bowler",
    signal: "Yorker accuracy falling under dew",
    impact: 71,
    trend: "-13 control"
  },
  {
    name: "Kabir Sethi",
    role: "Anchor",
    signal: "Strike rotation unlocks long-on gap",
    impact: 79,
    trend: "+9 tempo"
  }
];

export const whatIfScenarios: WhatIfScenario[] = [
  {
    title: "If Mumbai score 14 in over 18",
    trigger: "No wicket, one six",
    outcome: "Win probability rises to 72 percent",
    probabilityShift: "+8"
  },
  {
    title: "If Chennai force a dot-ball cluster",
    trigger: "3 dots before 19.0",
    outcome: "Required rate jumps above 14",
    probabilityShift: "-11"
  }
];

export const systemSignals = [
  { label: "Data latency", value: "0.42s", icon: Radio },
  { label: "Model quorum", value: "7/7", icon: ShieldCheck },
  { label: "Match tier", value: "Final", icon: Trophy },
  { label: "Tactical feed", value: "Live", icon: LineChart }
];

export const fallbackDashboardFeed: LiveDashboardData = {
  matchId: "ipl-2026-final-sim",
  status: "live",
  updatedAt: "2026-05-21T14:40:00.000Z",
  liveMatch,
  metrics: dashboardMetrics,
  insights: aiInsights,
  momentum: momentumPoints,
  playerSignals,
  whatIfScenarios
};

export function hydrateDashboardMetric(metric: DashboardMetricDocument): DashboardMetric {
  return {
    ...metric,
    icon: metricIconMap[metric.iconKey] ?? Activity
  };
}

export function hydrateDashboardFeed(feed: LiveDashboardFeedDocument): LiveDashboardData {
  return {
    matchId: feed.matchId,
    status: feed.status,
    updatedAt: feed.updatedAt,
    liveMatch: feed.liveMatch,
    metrics: feed.metrics.map(hydrateDashboardMetric),
    insights: feed.insights,
    momentum: feed.momentum,
    playerSignals: feed.playerSignals,
    whatIfScenarios: feed.whatIfScenarios
  };
}
