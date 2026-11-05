import pRetry, { AbortError } from "p-retry";

export const TIMEOUTS = {
  GOOGLE_API: 30_000,
  LLM_API: 30_000,
  DEFAULT: 60_000,
} as const;

interface RetryOptions {
  retries?: number;
  label?: string;
}

function isTransientError(error: unknown): boolean {
  if (error instanceof Error) {
    const msg = error.message.toLowerCase();

    // AbortSignal.timeout() throws with name "TimeoutError" or "AbortError"
    if (error.name === "TimeoutError" || error.name === "AbortError") {
      return true;
    }

    // Network-level failures — always worth retrying
    if (
      msg.includes("econnreset") ||
      msg.includes("econnrefused") ||
      msg.includes("etimedout") ||
      msg.includes("socket hang up") ||
      msg.includes("fetch failed")
    ) {
      return true;
    }

    // HTTP status codes embedded in error messages
    const statusMatch = msg.match(/\b(4\d{2}|5\d{2})\b/);
    if (statusMatch) {
      const status = parseInt(statusMatch[1], 10);
      // 429 = rate limited, 5xx = server errors — transient
      // 401/403/400/404 = auth/client errors — permanent, don't retry
      return status === 429 || status >= 500;
    }
  }

  return true;
}

export function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { retries = 3, label = "API call" } = options;

  return pRetry(
    async (attemptNumber) => {
      try {
        return await fn();
      } catch (error) {
        if (!isTransientError(error)) {
          throw new AbortError(
            error instanceof Error ? error.message : String(error)
          );
        }

        console.warn(
          `[retry] ${label} attempt ${attemptNumber}/${retries + 1} failed: ${
            error instanceof Error ? error.message : error
          }`
        );

        throw error;
      }
    },
    {
      retries,
      minTimeout: 1000,
      factor: 2,
    }
  );
}
