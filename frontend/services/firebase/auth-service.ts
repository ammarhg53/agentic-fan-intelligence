import {
  browserLocalPersistence,
  GoogleAuthProvider,
  onAuthStateChanged,
  setPersistence,
  signInAnonymously,
  signInWithPopup,
  signOut,
  type User
} from "firebase/auth";
import { getFirebaseAuth } from "@/lib/firebase/client";
import type { AuthUser } from "@/types";

export function mapFirebaseUser(user: User | null): AuthUser | null {
  if (!user) {
    return null;
  }

  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName,
    photoURL: user.photoURL,
    isAnonymous: user.isAnonymous
  };
}

export function subscribeToAuthChanges(callback: (user: AuthUser | null) => void): () => void {
  const auth = getFirebaseAuth();

  return onAuthStateChanged(auth, (user) => {
    callback(mapFirebaseUser(user));
  });
}

export async function signInWithGoogleAccount(): Promise<AuthUser> {
  const auth = getFirebaseAuth();
  const provider = new GoogleAuthProvider();

  provider.setCustomParameters({ prompt: "select_account" });
  await setPersistence(auth, browserLocalPersistence);

  const credential = await signInWithPopup(auth, provider);
  const user = mapFirebaseUser(credential.user);

  if (!user) {
    throw new Error("Google sign-in completed without a Firebase user.");
  }

  return user;
}

export async function signInAsGuest(): Promise<AuthUser> {
  const auth = getFirebaseAuth();

  await setPersistence(auth, browserLocalPersistence);

  const credential = await signInAnonymously(auth);
  const user = mapFirebaseUser(credential.user);

  if (!user) {
    throw new Error("Guest sign-in completed without a Firebase user.");
  }

  return user;
}

export async function signOutCurrentUser(): Promise<void> {
  await signOut(getFirebaseAuth());
}
