export async function sleep(ms) {
    return new Promise((r) => setTimeout(r, ms));
}
export async function withRetry(fn, { retries = 5, baseDelayMs = 300, // initial backoff
maxDelayMs = 3000, onRetry, } = {}) {
    let attempt = 0;
    let delay = baseDelayMs;
    while (true) {
        try {
            return await fn();
        }
        catch (e) {
            const msg = String(e?.message ?? e);
            const isRate = msg.includes("Rate limits exceeded") || msg.includes("TooManyRequests") || msg.includes("-429");
            const isRetryable = isRate || msg.includes("ETIMEDOUT") || msg.includes("ECONNRESET") || msg.includes("503");
            if (!isRetryable || attempt >= retries)
                throw e;
            if (onRetry)
                onRetry(e, attempt + 1);
            await sleep(delay);
            delay = Math.min(Math.floor(delay * 1.8), maxDelayMs);
            attempt++;
        }
    }
}
