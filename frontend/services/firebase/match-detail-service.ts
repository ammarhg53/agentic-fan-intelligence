import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  type DocumentData,
  type DocumentSnapshot,
  type FirestoreError,
  type QueryDocumentSnapshot,
  type Unsubscribe
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type {
  CommentaryEvent,
  CommentaryEventType,
  LiveMatchSnapshot,
  MatchDetailDocument,
  MatchInningSummary,
  MatchPhase,
  MatchPlayerImpact,
  TeamSnapshot
} from "@/types";

const matchPhases: MatchPhase[] = ["Powerplay", "Middle Overs", "Death Overs"];
const commentaryTypes: CommentaryEventType[] = [
  "ai",
  "boundary",
  "wicket",
  "over",
  "tactical",
  "probability",
  "milestone"
];

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readString(value: unknown, fallback: string): string {
  return typeof value === "string" && value.trim() ? value : fallback;
}

function readNullableString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function readNumber(value: unknown, fallback: number): number {
  const numberValue = typeof value === "number" ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

function toIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    return (value as { toDate: () => Date }).toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
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
    probability: Math.min(Math.max(readNumber(data.probability, 50), 0), 100),
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

function normalizeInning(value: unknown): MatchInningSummary {
  const data = isRecord(value) ? value : {};
  const status =
    data.status === "completed" || data.status === "yet_to_bat" || data.status === "batting"
      ? data.status
      : "yet_to_bat";

  return {
    teamShortName: readString(data.teamShortName, "TBD"),
    runs: readNumber(data.runs, 0),
    wickets: readNumber(data.wickets, 0),
    overs: readString(data.overs, "0.0"),
    runRate: readNumber(data.runRate, 0),
    requiredRate: data.requiredRate === null || data.requiredRate === undefined ? null : readNumber(data.requiredRate, 0),
    status
  };
}

function normalizePlayerImpact(value: unknown, index: number): MatchPlayerImpact {
  const data = isRecord(value) ? value : {};

  return {
    name: readString(data.name, `Player ${index + 1}`),
    teamShortName: readString(data.teamShortName, "TBD"),
    role: readString(data.role, "Impact player"),
    statLine: readString(data.statLine, "Live stats pending"),
    impact: Math.min(Math.max(readNumber(data.impact, 0), 0), 100),
    note: readString(data.note, "Waiting for player intelligence.")
  };
}

function normalizeStringList(value: unknown): string[] {
  return Array.isArray(value)
    ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    : [];
}

function mapMatchSnapshot(snapshot: DocumentSnapshot<DocumentData>): MatchDetailDocument | null {
  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();
  const liveMatch = normalizeLiveMatch(isRecord(data.liveMatch) ? data.liveMatch : data);
  const phase = matchPhases.includes(data.phase as MatchPhase) ? (data.phase as MatchPhase) : liveMatch.phase;

  return {
    matchId: readString(data.matchId, snapshot.id),
    status: data.status === "upcoming" || data.status === "completed" ? data.status : "live",
    title: readString(data.title, liveMatch.title),
    venue: readString(data.venue, liveMatch.venue),
    phase,
    result: readNullableString(data.result),
    toss: readString(data.toss, "Toss update pending"),
    updatedAt: toIsoString(data.updatedAt),
    liveMatch,
    innings: readArray(data.innings, normalizeInning),
    keyPlayers: readArray(data.keyPlayers, normalizePlayerImpact),
    tacticalNotes: normalizeStringList(data.tacticalNotes),
    winProbability: {
      home: Math.min(Math.max(readNumber(isRecord(data.winProbability) ? data.winProbability.home : undefined, liveMatch.battingTeam.probability), 0), 100),
      away: Math.min(Math.max(readNumber(isRecord(data.winProbability) ? data.winProbability.away : undefined, liveMatch.bowlingTeam.probability), 0), 100)
    },
    momentumIndex: Math.min(Math.max(readNumber(data.momentumIndex, 50), 0), 100)
  };
}

function normalizeCommentaryType(value: unknown): CommentaryEventType {
  return commentaryTypes.includes(value as CommentaryEventType) ? (value as CommentaryEventType) : "ai";
}

function mapCommentarySnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): CommentaryEvent {
  const data = snapshot.data();
  const tags = Array.isArray(data.tags)
    ? data.tags.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
    : [];

  return {
    id: snapshot.id,
    matchId: readString(data.matchId, snapshot.ref.parent.parent?.id ?? "unknown-match"),
    sequence: readNumber(data.sequence, 0),
    over: readString(data.over, "-"),
    type: normalizeCommentaryType(data.type),
    title: readString(data.title, "AI commentary"),
    message: readString(data.message, "Awaiting the next live event."),
    confidence: data.confidence === null || data.confidence === undefined ? null : readNumber(data.confidence, 0),
    winProbability:
      data.winProbability === null || data.winProbability === undefined
        ? null
        : Math.min(Math.max(readNumber(data.winProbability, 0), 0), 100),
    source: data.source === "scorer" || data.source === "system" ? data.source : "ai",
    tags,
    createdAt: toIsoString(data.createdAt)
  };
}

export function subscribeToMatchDetail(
  matchId: string,
  onData: (match: MatchDetailDocument | null) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe {
  const db = getFirestoreDb();

  return onSnapshot(
    doc(db, "liveMatches", matchId),
    (snapshot) => {
      onData(mapMatchSnapshot(snapshot));
    },
    onError
  );
}

export function subscribeToMatchCommentary(
  matchId: string,
  onData: (events: CommentaryEvent[]) => void,
  onError: (error: FirestoreError) => void
): Unsubscribe {
  const db = getFirestoreDb();
  const commentaryQuery = query(collection(db, "liveMatches", matchId, "commentary"), orderBy("sequence", "desc"));

  return onSnapshot(
    commentaryQuery,
    (snapshot) => {
      onData(snapshot.docs.map(mapCommentarySnapshot));
    },
    onError
  );
}
