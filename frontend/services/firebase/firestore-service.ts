import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  where,
  type DocumentData,
  type QueryDocumentSnapshot
} from "firebase/firestore";
import { getFirestoreDb } from "@/lib/firebase/client";
import type {
  AuthUser,
  FanProfile,
  FirestoreCollection,
  MatchInsightDocument,
  MatchTelemetryEvent
} from "@/types";

function toIsoString(value: unknown): string | null {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value && typeof value === "object" && "toDate" in value) {
    const timestamp = value as { toDate: () => Date };
    return timestamp.toDate().toISOString();
  }

  return typeof value === "string" ? value : null;
}

function mapInsightSnapshot(snapshot: QueryDocumentSnapshot<DocumentData>): MatchInsightDocument {
  const data = snapshot.data();

  return {
    id: snapshot.id,
    matchId: String(data.matchId ?? ""),
    type: normalizeInsightType(data.type),
    title: String(data.title ?? "Untitled insight"),
    content: String(data.content ?? ""),
    confidence: Number(data.confidence ?? 0),
    language: data.language === "hi" || data.language === "gu" ? data.language : "en",
    createdAt: toIsoString(data.createdAt) ?? new Date().toISOString(),
    createdBy: typeof data.createdBy === "string" ? data.createdBy : null
  };
}

function normalizeInsightType(value: unknown): MatchInsightDocument["type"] {
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

export function getCollectionPath(collectionName: FirestoreCollection): string {
  return collectionName;
}

export async function createDocument<T extends DocumentData>(
  collectionName: FirestoreCollection,
  data: T
): Promise<string> {
  const db = getFirestoreDb();
  const document = await addDoc(collection(db, getCollectionPath(collectionName)), {
    ...data,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp()
  });

  return document.id;
}

export async function setDocument<T extends DocumentData>(
  collectionName: FirestoreCollection,
  documentId: string,
  data: T
): Promise<void> {
  const db = getFirestoreDb();

  await setDoc(
    doc(db, getCollectionPath(collectionName), documentId),
    {
      ...data,
      updatedAt: serverTimestamp()
    },
    { merge: true }
  );
}

export async function getFanProfile(uid: string): Promise<FanProfile | null> {
  const db = getFirestoreDb();
  const snapshot = await getDoc(doc(db, getCollectionPath("fanProfiles"), uid));

  if (!snapshot.exists()) {
    return null;
  }

  const data = snapshot.data();

  return {
    uid,
    email: typeof data.email === "string" ? data.email : null,
    displayName: typeof data.displayName === "string" ? data.displayName : null,
    photoURL: typeof data.photoURL === "string" ? data.photoURL : null,
    favoriteTeamId: typeof data.favoriteTeamId === "string" ? data.favoriteTeamId : null,
    fanMode: data.fanMode === "casual" || data.fanMode === "fantasy" || data.fanMode === "coach" ? data.fanMode : "analyst",
    createdAt: toIsoString(data.createdAt),
    updatedAt: toIsoString(data.updatedAt)
  };
}

export async function upsertFanProfile(user: AuthUser): Promise<void> {
  await setDocument("fanProfiles", user.uid, {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    fanMode: "analyst",
    lastSeenAt: serverTimestamp()
  });
}

export async function saveMatchInsight(insight: MatchInsightDocument): Promise<string> {
  return createDocument("matchInsights", {
    matchId: insight.matchId,
    type: insight.type,
    title: insight.title,
    content: insight.content,
    confidence: insight.confidence,
    language: insight.language,
    createdBy: insight.createdBy
  });
}

export async function listRecentMatchInsights(
  matchId: string,
  maxResults = 10
): Promise<MatchInsightDocument[]> {
  const db = getFirestoreDb();
  const insightsQuery = query(
    collection(db, getCollectionPath("matchInsights")),
    where("matchId", "==", matchId),
    orderBy("createdAt", "desc"),
    limit(maxResults)
  );

  const snapshot = await getDocs(insightsQuery);

  return snapshot.docs.map(mapInsightSnapshot);
}

export async function saveMatchTelemetry(event: MatchTelemetryEvent): Promise<string> {
  return createDocument("matchTelemetry", {
    matchId: event.matchId,
    eventType: event.eventType,
    payload: event.payload,
    capturedAt: event.capturedAt
  });
}
