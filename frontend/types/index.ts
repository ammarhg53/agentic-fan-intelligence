import type { LucideIcon } from "lucide-react";

export type FanMode = "casual" | "fantasy" | "analyst" | "coach";
export type SupportedLanguage = "en" | "hi" | "gu";
export type MetricTone = "cyan" | "violet" | "lime" | "gold" | "crimson";
export type MatchPhase = "Powerplay" | "Middle Overs" | "Death Overs";
export type MetricIconKey = "target" | "zap" | "brain" | "sparkles" | "activity";
export type CommentaryEventType =
  | "ai"
  | "boundary"
  | "wicket"
  | "over"
  | "tactical"
  | "probability"
  | "milestone";
export type FirestoreCollection =
  | "fanProfiles"
  | "matchInsights"
  | "matchTelemetry"
  | "liveMatches"
  | "dashboardFeeds";

export interface UserPreferences {
  fanMode: FanMode;
  language: SupportedLanguage;
  notifications: boolean;
  darkMode: boolean;
}

export interface AIInsight {
  id: string;
  type: "momentum" | "tactical" | "player" | "prediction" | "commentary" | "what_if";
  title: string;
  content: string;
  confidence: number;
  generatedAt: string;
  language: SupportedLanguage;
  matchId?: string;
}

export interface AuthUser {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAnonymous: boolean;
}

export interface FanProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  favoriteTeamId: string | null;
  fanMode: FanMode;
  createdAt: string | null;
  updatedAt: string | null;
}

export interface MatchInsightDocument {
  id?: string;
  matchId: string;
  type: AIInsight["type"];
  title: string;
  content: string;
  confidence: number;
  language: SupportedLanguage;
  createdAt: string;
  createdBy: string | null;
}

export interface MatchTelemetryEvent {
  matchId: string;
  eventType: "score_update" | "wicket" | "boundary" | "momentum_shift" | "fan_action";
  payload: Record<string, string | number | boolean | null>;
  capturedAt: string;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccess<T> {
  success: true;
  data: T;
}

export interface ApiFailure {
  success: false;
  error: ApiErrorBody;
}

export type ApiEnvelope<T> = ApiSuccess<T> | ApiFailure;

export interface GenerateInsightsRequest {
  matchId: string;
  matchContext: string;
  fanMode: FanMode;
  language: SupportedLanguage;
}

export interface GenerateInsightsResponse {
  insights: AIInsight[];
  generatedAt: string;
  model: string;
}

export interface AppStore {
  userPreferences: UserPreferences;
  setFanMode: (mode: FanMode) => void;
  setLanguage: (language: SupportedLanguage) => void;
  sidebarCollapsed: boolean;
  toggleSidebar: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  activeMatchId: string | null;
  setActiveMatchId: (matchId: string | null) => void;
  aiInsights: AIInsight[];
  addInsight: (insight: AIInsight) => void;
  clearInsights: () => void;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
}

export interface DashboardMetric {
  label: string;
  value: string;
  subValue: string;
  change: string;
  tone: MetricTone;
  icon: LucideIcon;
  progress: number;
}

export interface DashboardMetricDocument {
  label: string;
  value: string;
  subValue: string;
  change: string;
  tone: MetricTone;
  iconKey: MetricIconKey;
  progress: number;
}

export interface TeamSnapshot {
  name: string;
  shortName: string;
  score: string;
  overs: string;
  probability: number;
  color: string;
}

export interface LiveMatchSnapshot {
  title: string;
  venue: string;
  phase: MatchPhase;
  requiredRate: number;
  currentRate: number;
  battingTeam: TeamSnapshot;
  bowlingTeam: TeamSnapshot;
}

export interface PlayerSignal {
  name: string;
  role: string;
  signal: string;
  impact: number;
  trend: string;
}

export interface MomentumPoint {
  over: number;
  home: number;
  away: number;
}

export interface WhatIfScenario {
  title: string;
  trigger: string;
  outcome: string;
  probabilityShift: string;
}

export interface LiveDashboardFeedDocument {
  matchId: string;
  status: "live" | "upcoming" | "completed";
  updatedAt: string | null;
  liveMatch: LiveMatchSnapshot;
  metrics: DashboardMetricDocument[];
  insights: AIInsight[];
  momentum: MomentumPoint[];
  playerSignals: PlayerSignal[];
  whatIfScenarios: WhatIfScenario[];
}

export interface LiveDashboardData {
  matchId: string;
  status: LiveDashboardFeedDocument["status"];
  updatedAt: string | null;
  liveMatch: LiveMatchSnapshot;
  metrics: DashboardMetric[];
  insights: AIInsight[];
  momentum: MomentumPoint[];
  playerSignals: PlayerSignal[];
  whatIfScenarios: WhatIfScenario[];
}

export interface MatchInningSummary {
  teamShortName: string;
  runs: number;
  wickets: number;
  overs: string;
  runRate: number;
  requiredRate: number | null;
  status: "batting" | "completed" | "yet_to_bat";
}

export interface MatchPlayerImpact {
  name: string;
  teamShortName: string;
  role: string;
  statLine: string;
  impact: number;
  note: string;
}

export interface MatchDetailDocument {
  matchId: string;
  status: LiveDashboardFeedDocument["status"];
  title: string;
  venue: string;
  phase: MatchPhase;
  result: string | null;
  toss: string;
  updatedAt: string | null;
  liveMatch: LiveMatchSnapshot;
  innings: MatchInningSummary[];
  keyPlayers: MatchPlayerImpact[];
  tacticalNotes: string[];
  winProbability: {
    home: number;
    away: number;
  };
  momentumIndex: number;
}

export interface CommentaryEvent {
  id: string;
  matchId: string;
  sequence: number;
  over: string;
  type: CommentaryEventType;
  title: string;
  message: string;
  confidence: number | null;
  winProbability: number | null;
  source: "ai" | "scorer" | "system";
  tags: string[];
  createdAt: string | null;
}

export interface MatchDetailData {
  match: MatchDetailDocument;
  commentary: CommentaryEvent[];
}
