"use client";

import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import type {
  AIInsight,
  AppStore,
  FanMode,
  SupportedLanguage,
  UserPreferences
} from "@/types";

const defaultPreferences: UserPreferences = {
  fanMode: "analyst",
  language: "en",
  notifications: true,
  darkMode: true
};

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      (set) => ({
        userPreferences: defaultPreferences,
        setFanMode: (fanMode: FanMode) =>
          set(
            (state) => ({
              userPreferences: { ...state.userPreferences, fanMode }
            }),
            false,
            "preferences/setFanMode"
          ),
        setLanguage: (language: SupportedLanguage) =>
          set(
            (state) => ({
              userPreferences: { ...state.userPreferences, language }
            }),
            false,
            "preferences/setLanguage"
          ),
        sidebarCollapsed: false,
        toggleSidebar: () =>
          set(
            (state) => ({ sidebarCollapsed: !state.sidebarCollapsed }),
            false,
            "layout/toggleSidebar"
          ),
        setSidebarCollapsed: (sidebarCollapsed: boolean) =>
          set({ sidebarCollapsed }, false, "layout/setSidebarCollapsed"),
        activeMatchId: "ipl-2026-final-sim",
        setActiveMatchId: (activeMatchId: string | null) =>
          set({ activeMatchId }, false, "match/setActiveMatchId"),
        aiInsights: [],
        addInsight: (insight: AIInsight) =>
          set(
            (state) => ({
              aiInsights: [insight, ...state.aiInsights].slice(0, 50)
            }),
            false,
            "insights/addInsight"
          ),
        clearInsights: () => set({ aiInsights: [] }, false, "insights/clear")
      }),
      {
        name: "afi-platform-store",
        partialize: (state) => ({
          userPreferences: state.userPreferences,
          sidebarCollapsed: state.sidebarCollapsed
        }),
        skipHydration: true
      }
    ),
    { name: "AFI Platform Store" }
  )
);

export const useFanMode = () => useAppStore((state) => state.userPreferences.fanMode);
export const useLanguage = () => useAppStore((state) => state.userPreferences.language);
export const useSidebarCollapsed = () => useAppStore((state) => state.sidebarCollapsed);
