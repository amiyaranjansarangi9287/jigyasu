/**
 * Options for the retry utility.
 */
export interface RetryOptions {
  maxAttempts?: number;
  baseDelay?: number;
  maxDelay?: number;
}

/**
 * Executes an async function with exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const maxAttempts = options.maxAttempts ?? 3;
  const baseDelay = options.baseDelay ?? 1000;
  const maxDelay = options.maxDelay ?? 10000;

  let attempt = 0;

  while (attempt < maxAttempts) {
    try {
      return await fn();
    } catch (error) {
      attempt++;
      if (attempt >= maxAttempts) {
        throw error;
      }
      // Calculate delay: baseDelay * 2^(attempt-1), capped at maxDelay
      const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay);
      // Add slight jitter (±10%) to prevent thundering herd
      const jitter = delay * 0.1 * (Math.random() * 2 - 1);
      
      await new Promise(resolve => setTimeout(resolve, delay + jitter));
    }
  }

  throw new Error('Unreachable code in retryWithBackoff');
}
