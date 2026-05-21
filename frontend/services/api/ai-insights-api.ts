import { apiFetch } from "@/services/api/http-client";
import type { GenerateInsightsRequest, GenerateInsightsResponse } from "@/types";

export function generateMatchInsights(
  payload: GenerateInsightsRequest,
  signal?: AbortSignal
): Promise<GenerateInsightsResponse> {
  return apiFetch<GenerateInsightsResponse, GenerateInsightsRequest>("/api/ai/insights", {
    method: "POST",
    body: payload,
    signal
  });
}
