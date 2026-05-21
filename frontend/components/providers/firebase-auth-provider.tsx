"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import {
  signInAsGuest,
  signInWithGoogleAccount,
  signOutCurrentUser,
  subscribeToAuthChanges
} from "@/services/firebase/auth-service";
import { upsertFanProfile } from "@/services/firebase/firestore-service";
import type { AuthUser } from "@/types";

interface FirebaseAuthContextValue {
  user: AuthUser | null;
  loading: boolean;
  actionLoading: boolean;
  error: string | null;
  isConfigured: boolean;
  signInWithGoogle: () => Promise<void>;
  signInAnonymously: () => Promise<void>;
  signOut: () => Promise<void>;
  clearError: () => void;
}

const FirebaseAuthContext = createContext<FirebaseAuthContextValue | null>(null);

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Firebase operation failed. Please retry.";
}

export function FirebaseAuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isConfigured, setIsConfigured] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | undefined;

    try {
      const configured = isFirebaseConfigured();
      setIsConfigured(configured);

      if (!configured) {
        setLoading(false);
        setError("Firebase environment variables are incomplete.");
        return undefined;
      }

      unsubscribe = subscribeToAuthChanges((nextUser) => {
        setUser(nextUser);
        setLoading(false);
        setError(null);

        if (nextUser) {
          void upsertFanProfile(nextUser).catch((profileError: unknown) => {
            setError(getErrorMessage(profileError));
          });
        }
      });
    } catch (authError: unknown) {
      setError(getErrorMessage(authError));
      setLoading(false);
    }

    return () => {
      unsubscribe?.();
    };
  }, []);

  const runAuthAction = useCallback(async (action: () => Promise<AuthUser | void>) => {
    setActionLoading(true);
    setError(null);

    try {
      const nextUser = await action();

      if (nextUser) {
        await upsertFanProfile(nextUser);
      }
    } catch (actionError: unknown) {
      setError(getErrorMessage(actionError));
    } finally {
      setActionLoading(false);
    }
  }, []);

  const value = useMemo<FirebaseAuthContextValue>(
    () => ({
      user,
      loading,
      actionLoading,
      error,
      isConfigured,
      signInWithGoogle: () => runAuthAction(signInWithGoogleAccount),
      signInAnonymously: () => runAuthAction(signInAsGuest),
      signOut: () => runAuthAction(signOutCurrentUser),
      clearError: () => setError(null)
    }),
    [actionLoading, error, isConfigured, loading, runAuthAction, user]
  );

  return <FirebaseAuthContext.Provider value={value}>{children}</FirebaseAuthContext.Provider>;
}

export function useFirebaseAuth(): FirebaseAuthContextValue {
  const context = useContext(FirebaseAuthContext);

  if (!context) {
    throw new Error("useFirebaseAuth must be used inside FirebaseAuthProvider.");
  }

  return context;
}
