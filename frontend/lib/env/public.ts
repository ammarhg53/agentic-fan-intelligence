const EXPECTED_FIREBASE_PROJECT_ID = "agentic-fan-intelligence";

const REQUIRED_PUBLIC_ENV_KEYS = [
  "NEXT_PUBLIC_FIREBASE_API_KEY",
  "NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN",
  "NEXT_PUBLIC_FIREBASE_PROJECT_ID",
  "NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET",
  "NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID",
  "NEXT_PUBLIC_FIREBASE_APP_ID"
] as const;

type PublicEnvKey = (typeof REQUIRED_PUBLIC_ENV_KEYS)[number];

export interface FirebaseClientEnv {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface PublicEnvStatus {
  firebase: FirebaseClientEnv;
  missing: PublicEnvKey[];
  projectIdMatches: boolean;
  isValid: boolean;
}

function readPublicEnv(key: PublicEnvKey): string {
  return process.env[key]?.trim() ?? "";
}

export function getPublicEnvStatus(): PublicEnvStatus {
  const firebase: FirebaseClientEnv = {
    apiKey: readPublicEnv("NEXT_PUBLIC_FIREBASE_API_KEY"),
    authDomain: readPublicEnv("NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN"),
    projectId: readPublicEnv("NEXT_PUBLIC_FIREBASE_PROJECT_ID"),
    storageBucket: readPublicEnv("NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET"),
    messagingSenderId: readPublicEnv("NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID"),
    appId: readPublicEnv("NEXT_PUBLIC_FIREBASE_APP_ID")
  };

  const missing = REQUIRED_PUBLIC_ENV_KEYS.filter((key) => readPublicEnv(key).length === 0);
  const projectIdMatches = firebase.projectId === EXPECTED_FIREBASE_PROJECT_ID;

  return {
    firebase,
    missing,
    projectIdMatches,
    isValid: missing.length === 0 && projectIdMatches
  };
}

export function getFirebaseClientEnv(): FirebaseClientEnv {
  const status = getPublicEnvStatus();

  if (!status.isValid) {
    const missing = status.missing.join(", ") || "none";
    const projectIssue = status.projectIdMatches
      ? ""
      : ` Expected NEXT_PUBLIC_FIREBASE_PROJECT_ID to be ${EXPECTED_FIREBASE_PROJECT_ID}.`;

    throw new Error(`Firebase public environment is not configured. Missing: ${missing}.${projectIssue}`);
  }

  return status.firebase;
}
