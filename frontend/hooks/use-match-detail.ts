"use client";

import { useEffect, useMemo, useState } from "react";
import { fallbackMatchDetailData } from "@/lib/match-detail-data";
import { isFirebaseConfigured } from "@/lib/firebase/client";
import {
  subscribeToMatchCommentary,
  subscribeToMatchDetail
} from "@/services/firebase/match-detail-service";
import type { CommentaryEvent, MatchDetailData, MatchDetailDocument } from "@/types";

interface MatchDetailState {
  data: MatchDetailData;
  isLoading: boolean;
  isLive: boolean;
  error: string | null;
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : "Unable to connect to the live match detail feed.";
}

export function useMatchDetail(matchId: string): MatchDetailState {
  const [match, setMatch] = useState<MatchDetailDocument>(fallbackMatchDetailData.match);
  const [commentary, setCommentary] = useState<CommentaryEvent[]>(fallbackMatchDetailData.commentary);
  const [matchLoaded, setMatchLoaded] = useState(false);
  const [commentaryLoaded, setCommentaryLoaded] = useState(false);
  const [isLive, setIsLive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setMatch(fallbackMatchDetailData.match);
    setCommentary(fallbackMatchDetailData.commentary);
    setMatchLoaded(false);
    setCommentaryLoaded(false);
    setIsLive(false);
    setError(null);

    try {
      if (!isFirebaseConfigured()) {
        setMatchLoaded(true);
        setCommentaryLoaded(true);
        setError("Firebase is not configured. Showing seeded match detail intelligence.");
        return undefined;
      }

      const unsubscribeMatch = subscribeToMatchDetail(
        matchId,
        (nextMatch) => {
          setMatch(nextMatch ?? fallbackMatchDetailData.match);
          setMatchLoaded(true);
          setIsLive(Boolean(nextMatch));
          setError(nextMatch ? null : "Match document not found. Showing seeded match detail intelligence.");
        },
        (matchError) => {
          setMatch(fallbackMatchDetailData.match);
          setMatchLoaded(true);
          setIsLive(false);
          setError(getErrorMessage(matchError));
        }
      );

      const unsubscribeCommentary = subscribeToMatchCommentary(
        matchId,
        (events) => {
          setCommentary(events.length > 0 ? events : fallbackMatchDetailData.commentary);
          setCommentaryLoaded(true);
        },
        (commentaryError) => {
          setCommentary(fallbackMatchDetailData.commentary);
          setCommentaryLoaded(true);
          setError(getErrorMessage(commentaryError));
        }
      );

      return () => {
        unsubscribeMatch();
        unsubscribeCommentary();
      };
    } catch (setupError: unknown) {
      setMatchLoaded(true);
      setCommentaryLoaded(true);
      setIsLive(false);
      setError(getErrorMessage(setupError));
      return undefined;
    }
  }, [matchId]);

  return useMemo(
    () => ({
      data: {
        match,
        commentary
      },
      isLoading: !matchLoaded || !commentaryLoaded,
      isLive,
      error
    }),
    [commentary, commentaryLoaded, error, isLive, match, matchLoaded]
  );
}
