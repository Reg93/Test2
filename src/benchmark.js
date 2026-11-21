import { performance } from "node:perf_hooks";

const REQUEST_COUNT = 10;
const DEFAULT_TIMEOUT_MS = 60_000;

export async function downloadOnce(url, timeoutMs = DEFAULT_TIMEOUT_MS) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const startedAt = performance.now();

  try {
    const response = await fetch(url, {
      method: "GET",
      signal: controller.signal,
      redirect: "follow",
      headers: {
        "user-agent": "internet-speed-test/1.0"
      }
    });

    let bytesDownloaded = 0;

    if (response.body) {
      const reader = response.body.getReader();

      try {
        while (true) {
          const { done, value } = await reader.read();

          if (done) break;
          bytesDownloaded += value.byteLength;
        }
      } finally {
        reader.releaseLock();
      }
    }

    const durationMs = performance.now() - startedAt;

    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ${response.statusText} — ${url}`
      );
    }

    return {
      status: response.status,
      bytesDownloaded,
      durationMs,
      finalUrl: response.url
    };
  } catch (error) {
    if (error.name === "AbortError") {
      throw new Error(`Request timed out after ${timeoutMs} ms: ${url}`);
    }

    throw error;
  } finally {
    clearTimeout(timeout);
  }
}

export async function runBenchmark(url, options = {}) {
  const requestCount = options.requestCount ?? REQUEST_COUNT;
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const results = [];
  const benchmarkStartedAt = performance.now();

  for (let index = 0; index < requestCount; index += 1) {
    process.stdout.write(`Request ${index + 1}/${requestCount} ... `);

    const result = await downloadOnce(url, timeoutMs);
    results.push(result);

    process.stdout.write(
      `done — ${result.bytesDownloaded} bytes in ${result.durationMs.toFixed(0)} ms\n`
    );
  }

  const totalDurationMs = performance.now() - benchmarkStartedAt;
  const totalBytesDownloaded = results.reduce(
    (sum, result) => sum + result.bytesDownloaded,
    0
  );
  const averageRequestDurationMs =
    results.reduce((sum, result) => sum + result.durationMs, 0) /
    results.length;
  const averageBytesPerRequest = totalBytesDownloaded / results.length;
  const averageSpeedBytesPerSecond =
    totalDurationMs > 0 ? totalBytesDownloaded / (totalDurationMs / 1000) : 0;

  return {
    url,
    requestCount,
    results,
    totalBytesDownloaded,
    totalDurationMs,
    averageRequestDurationMs,
    averageBytesPerRequest,
    averageSpeedBytesPerSecond
  };
}
