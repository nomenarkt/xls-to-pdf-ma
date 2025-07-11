// /frontend/shared/config.ts

type Config = {
  apiBaseUrl: string;
  environment: "development" | "staging" | "production";
  sentryDsn?: string;
  featureFlags?: Record<string, boolean>;
};

let cached: Config | null = null;

export function getConfig(): Config {
  if (cached) return cached;

  const {
    NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_ENVIRONMENT,
    NEXT_PUBLIC_SENTRY_DSN,
    NEXT_PUBLIC_FEATURE_FLAGS,
  } = process.env;

  if (!NEXT_PUBLIC_API_BASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_API_BASE_URL in environment");
  }

  const environment =
    (NEXT_PUBLIC_ENVIRONMENT as Config["environment"]) ?? "development";
  const featureFlags = parseFeatureFlags(NEXT_PUBLIC_FEATURE_FLAGS);

  cached = {
    apiBaseUrl: NEXT_PUBLIC_API_BASE_URL,
    environment,
    sentryDsn: NEXT_PUBLIC_SENTRY_DSN,
    featureFlags,
  };

  return cached;
}

function parseFeatureFlags(json?: string): Record<string, boolean> | undefined {
  try {
    return json ? JSON.parse(json) : undefined;
  } catch {
    console.warn("Invalid JSON in NEXT_PUBLIC_FEATURE_FLAGS");
    return undefined;
  }
}
