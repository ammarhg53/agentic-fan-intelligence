import "server-only";

const DEFAULT_GEMINI_MODEL = "gemini-1.5-flash";

export interface ServerEnvStatus {
  geminiApiKeyConfigured: boolean;
  geminiModel: string;
  missing: string[];
}

export interface GeminiServerEnv {
  apiKey: string;
  model: string;
}

export function getServerEnvStatus(): ServerEnvStatus {
  const geminiApiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const geminiModel = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  return {
    geminiApiKeyConfigured: geminiApiKey.length > 0,
    geminiModel,
    missing: geminiApiKey.length > 0 ? [] : ["GEMINI_API_KEY"]
  };
}

export function getGeminiServerEnv(): GeminiServerEnv {
  const apiKey = process.env.GEMINI_API_KEY?.trim() ?? "";
  const model = process.env.GEMINI_MODEL?.trim() || DEFAULT_GEMINI_MODEL;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured on the server.");
  }

  return { apiKey, model };
}
