import { randomUUID } from "crypto";
import { NextResponse, type NextRequest } from "next/server";
import { getGeminiServerEnv, getServerEnvStatus } from "@/lib/env/server";
import type {
  AIInsight,
  ApiEnvelope,
  FanMode,
  GenerateInsightsRequest,
  GenerateInsightsResponse,
  SupportedLanguage
} from "@/types";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const GEMINI_API_BASE_URL = "https://generativelanguage.googleapis.com/v1beta";
const MAX_CONTEXT_LENGTH = 2600;

interface GeminiPart {
  text?: string;
}

interface GeminiCandidate {
  content?: {
    parts?: GeminiPart[];
  };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

function jsonResponse<T>(body: ApiEnvelope<T>, status = 200) {
  return NextResponse.json(body, { status });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isFanMode(value: unknown): value is FanMode {
  return value === "casual" || value === "fantasy" || value === "analyst" || value === "coach";
}

function isSupportedLanguage(value: unknown): value is SupportedLanguage {
  return value === "en" || value === "hi" || value === "gu";
}

function validateRequestBody(value: unknown): GenerateInsightsRequest | null {
  if (!isRecord(value)) {
    return null;
  }

  const matchId = value.matchId;
  const matchContext = value.matchContext;
  const fanMode = value.fanMode;
  const language = value.language;

  if (
    typeof matchId !== "string" ||
    typeof matchContext !== "string" ||
    !isFanMode(fanMode) ||
    !isSupportedLanguage(language)
  ) {
    return null;
  }

  return {
    matchId: matchId.trim().slice(0, 120),
    matchContext: matchContext.trim().slice(0, MAX_CONTEXT_LENGTH),
    fanMode,
    language
  };
}

function buildInsightPrompt(payload: GenerateInsightsRequest): string {
  return [
    "You are Agentic Fan Intelligence, a premium AI cricket analyst.",
    "Generate concise, high-signal cricket fan insights from the live match context.",
    "Return only a JSON array with 2 or 3 objects.",
    "Each object must use this exact shape:",
    '{"type":"prediction|momentum|tactical|player|commentary|what_if","title":"short title","content":"one or two crisp sentences","confidence":0-100}',
    `Fan mode: ${payload.fanMode}`,
    `Language code: ${payload.language}`,
    `Match id: ${payload.matchId}`,
    `Live context: ${payload.matchContext}`
  ].join("\n");
}

function normalizeModelPath(model: string): string {
  return model.startsWith("models/") ? model : `models/${model}`;
}

function extractGeminiText(response: GeminiResponse): string {
  return (
    response.candidates
      ?.flatMap((candidate) => candidate.content?.parts ?? [])
      .map((part) => part.text ?? "")
      .join("\n")
      .trim() ?? ""
  );
}

function extractJsonArray(text: string): unknown {
  const trimmed = text.trim();

  if (trimmed.startsWith("[")) {
    return JSON.parse(trimmed);
  }

  const start = trimmed.indexOf("[");
  const end = trimmed.lastIndexOf("]");

  if (start === -1 || end === -1 || end <= start) {
    throw new Error("Gemini did not return a JSON array.");
  }

  return JSON.parse(trimmed.slice(start, end + 1));
}

function normalizeInsightType(value: unknown): AIInsight["type"] {
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

function clampConfidence(value: unknown): number {
  const confidence = typeof value === "number" ? value : Number(value);

  if (!Number.isFinite(confidence)) {
    return 78;
  }

  return Math.min(Math.max(Math.round(confidence), 0), 100);
}

function normalizeInsights(text: string, payload: GenerateInsightsRequest): AIInsight[] {
  const parsed = extractJsonArray(text);
  const items = Array.isArray(parsed) ? parsed : [];

  return items
    .filter(isRecord)
    .slice(0, 3)
    .map((item) => ({
      id: randomUUID(),
      type: normalizeInsightType(item.type),
      title: typeof item.title === "string" && item.title.trim() ? item.title.trim().slice(0, 90) : "AI match signal",
      content:
        typeof item.content === "string" && item.content.trim()
          ? item.content.trim().slice(0, 420)
          : "The model detected a live tactical shift, but the explanation was incomplete.",
      confidence: clampConfidence(item.confidence),
      generatedAt: new Date().toISOString(),
      matchId: payload.matchId,
      language: payload.language
    }));
}

function fallbackInsight(text: string, payload: GenerateInsightsRequest): AIInsight[] {
  return [
    {
      id: randomUUID(),
      type: "commentary",
      title: "AI match pulse",
      content: text.slice(0, 420) || "The AI engine returned an empty insight.",
      confidence: 72,
      generatedAt: new Date().toISOString(),
      matchId: payload.matchId,
      language: payload.language
    }
  ];
}

export async function POST(request: NextRequest) {
  const serverEnv = getServerEnvStatus();

  if (!serverEnv.geminiApiKeyConfigured) {
    return jsonResponse<GenerateInsightsResponse>(
      {
        success: false,
        error: {
          code: "GEMINI_NOT_CONFIGURED",
          message: "Gemini API key is not configured on the server."
        }
      },
      503
    );
  }

  const rawBody = await request.json().catch(() => null);
  const payload = validateRequestBody(rawBody);

  if (!payload || payload.matchContext.length < 12 || payload.matchId.length === 0) {
    return jsonResponse<GenerateInsightsResponse>(
      {
        success: false,
        error: {
          code: "INVALID_INSIGHT_REQUEST",
          message: "A valid matchId, matchContext, fanMode, and language are required."
        }
      },
      400
    );
  }

  const { apiKey, model } = getGeminiServerEnv();
  const endpoint = `${GEMINI_API_BASE_URL}/${normalizeModelPath(model)}:generateContent?key=${encodeURIComponent(apiKey)}`;

  try {
    const geminiResponse = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [
          {
            role: "user",
            parts: [{ text: buildInsightPrompt(payload) }]
          }
        ],
        generationConfig: {
          temperature: 0.55,
          topP: 0.9,
          maxOutputTokens: 900,
          responseMimeType: "application/json"
        }
      })
    });

    if (!geminiResponse.ok) {
      return jsonResponse<GenerateInsightsResponse>(
        {
          success: false,
          error: {
            code: "GEMINI_UPSTREAM_ERROR",
            message: "Gemini could not generate insights right now."
          }
        },
        502
      );
    }

    const geminiPayload = (await geminiResponse.json()) as GeminiResponse;
    const generatedText = extractGeminiText(geminiPayload);
    const insights = (() => {
      try {
        const normalized = normalizeInsights(generatedText, payload);
        return normalized.length > 0 ? normalized : fallbackInsight(generatedText, payload);
      } catch {
        return fallbackInsight(generatedText, payload);
      }
    })();

    return jsonResponse<GenerateInsightsResponse>({
      success: true,
      data: {
        insights,
        generatedAt: new Date().toISOString(),
        model
      }
    });
  } catch {
    return jsonResponse<GenerateInsightsResponse>(
      {
        success: false,
        error: {
          code: "AI_ROUTE_FAILURE",
          message: "The AI insight route failed before completion."
        }
      },
      500
    );
  }
}
