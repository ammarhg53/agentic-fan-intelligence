"use client";

import { useEffect, useMemo, useState } from "react";
import { fallbackDashboardFeed, hydrateDashboardFeed } from "@/lib/dashboard-data";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import { subscribeToLiveDashboardFeed } from "@/services/firebase/live-dashboard-service";
import type { LiveDashboardData } from "@/types";

interface LiveDashboardFeedState {
  data: LiveDashboardData;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
}

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }

  return "Unable to connect to Firestore live feed.";
}

export function useLiveDashboardFeed(matchId = fallbackDashboardFeed.matchId): LiveDashboardFeedState {
  const [state, setState] = useState<LiveDashboardFeedState>({
    data: fallbackDashboardFeed,
    isLoading: true,
    isLive: false,
    error: null
  });

  useEffect(() => {
    try {
      if (!isFirebaseConfigured()) {
        setState({
          data: fallbackDashboardFeed,
          isLoading: false,
          isLive: false,
          error: "Firebase is not configured. Showing seeded demo intelligence."
        });
        return undefined;
      }

      const unsubscribe = subscribeToLiveDashboardFeed(
        matchId,
        (feed) => {
          setState({
            data: feed ? hydrateDashboardFeed(feed) : fallbackDashboardFeed,
            isLoading: false,
            isLive: Boolean(feed),
            error: feed ? null : "Firestore dashboard feed not found. Showing seeded demo intelligence."
          });
        },
        (error) => {
          setState({
            data: fallbackDashboardFeed,
            isLoading: false,
            isLive: false,
            error: getErrorMessage(error)
          });
        }
      );

      return unsubscribe;
    } catch (error: unknown) {
      setState({
        data: fallbackDashboardFeed,
        isLoading: false,
        isLive: false,
        error: getErrorMessage(error)
      });
      return undefined;
    }
  }, [matchId]);

  return useMemo(() => state, [state]);
}
