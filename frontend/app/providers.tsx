"use client";

import { useEffect, type ReactNode } from "react";
import { ThemeProvider } from "next-themes";
import { FirebaseAuthProvider } from "@/components/providers/firebase-auth-provider";
import { useAppStore } from "@/store/use-app-store";

export function Providers({ children }: { children: ReactNode }) {
  useEffect(() => {
    void useAppStore.persist.rehydrate();
  }, []);

  return (
    <ThemeProvider attribute="class" defaultTheme="dark" forcedTheme="dark" enableSystem={false}>
      <FirebaseAuthProvider>{children}</FirebaseAuthProvider>
    </ThemeProvider>
  );
}
