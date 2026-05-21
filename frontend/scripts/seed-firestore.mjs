import { readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { applicationDefault, cert, getApps, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const PROJECT_ID = process.env.FIREBASE_PROJECT_ID || "agentic-fan-intelligence";

function parseServiceAccount() {
  const rawJson = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;

  if (!rawJson) {
    return null;
  }

  try {
    return JSON.parse(rawJson);
  } catch (error) {
    throw new Error(`FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON: ${error.message}`);
  }
}

function initializeFirebaseAdmin() {
  if (getApps().length > 0) {
    return;
  }

  const serviceAccount = parseServiceAccount();

  initializeApp({
    credential: serviceAccount ? cert(serviceAccount) : applicationDefault(),
    projectId: PROJECT_ID
  });
}

async function readJsonFile(fileName) {
  const frontendDir = dirname(dirname(fileURLToPath(import.meta.url)));
  const rootDir = dirname(frontendDir);
  const payloadPath = join(rootDir, "datasets", fileName);
  const payload = await readFile(payloadPath, "utf8");

  return JSON.parse(payload);
}

async function seedFirestore() {
  initializeFirebaseAdmin();

  const db = getFirestore();
  const dashboardPayload = await readJsonFile("sample-dashboard-feed.json");
  const matchDetailPayload = await readJsonFile("sample-match-detail.json");
  const matchId = dashboardPayload.matchId || matchDetailPayload.matchId;

  if (!matchId) {
    throw new Error("Seed payload requires a matchId.");
  }

  const { commentary, ...matchDetail } = matchDetailPayload;

  await db.doc(`liveMatches/${matchId}`).set(
    {
      ...dashboardPayload.liveMatch,
      ...matchDetail,
      liveMatch: dashboardPayload.liveMatch,
      matchId,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  await db.doc(`dashboardFeeds/${matchId}`).set(
    {
      ...dashboardPayload,
      updatedAt: FieldValue.serverTimestamp()
    },
    { merge: true }
  );

  const batch = db.batch();

  dashboardPayload.insights.forEach((insight, index) => {
    const insightRef = db.doc(`matchInsights/seed-${matchId}-${index + 1}`);
    batch.set(
      insightRef,
      {
        ...insight,
        matchId,
        createdBy: "system-seed",
        createdAt: FieldValue.serverTimestamp(),
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  });

  const commentaryEvents = Array.isArray(commentary) ? commentary : [];

  commentaryEvents.forEach((event) => {
    const commentaryRef = db.doc(`liveMatches/${matchId}/commentary/${event.id}`);
    batch.set(
      commentaryRef,
      {
        ...event,
        matchId,
        updatedAt: FieldValue.serverTimestamp()
      },
      { merge: true }
    );
  });

  await batch.commit();

  process.stdout.write(`Seeded Firestore dashboard and match detail feeds for ${matchId} in project ${PROJECT_ID}.\n`);
}

seedFirestore().catch((error) => {
  process.stderr.write(`${error instanceof Error ? error.stack || error.message : String(error)}\n`);
  process.exitCode = 1;
});
