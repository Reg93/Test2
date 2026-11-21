import { runBenchmark } from "./benchmark.js";
import { formatBytes, formatDuration, formatSpeed } from "./format.js";

function parseUrl(value) {
  let parsedUrl;

  try {
    parsedUrl = new URL(value);
  } catch {
    throw new Error("Invalid URL. Please provide a complete URL, including https://");
  }

  if (!["http:", "https:"].includes(parsedUrl.protocol)) {
    throw new Error("Only HTTP and HTTPS URLs are supported.");
  }

  return parsedUrl.toString();
}

function printSummary(summary) {
  console.log("\n========== RESULTS ==========");
  console.log(`URL:                         ${summary.url}`);
  console.log(`Successful requests:          ${summary.requestCount}`);
  console.log(`Total downloaded:             ${formatBytes(summary.totalBytesDownloaded)}`);
  console.log(`Average response time:        ${formatDuration(summary.averageRequestDurationMs)}`);
  console.log(`Total benchmark time:         ${formatDuration(summary.totalDurationMs)}`);
  console.log(`Average data per request:     ${formatBytes(summary.averageBytesPerRequest)}`);
  console.log(`Average download speed:       ${formatSpeed(summary.averageSpeedBytesPerSecond)}`);
  console.log("==============================\n");
}

export async function main() {
  const input = process.argv[2];

  if (!input || input === "--help" || input === "-h") {
    console.log("Usage: npm start -- <URL>");
    console.log("Example: npm start -- https://example.com/image.jpg");
    process.exitCode = input ? 0 : 1;
    return;
  }

  try {
    const url = parseUrl(input);
    const summary = await runBenchmark(url);
    printSummary(summary);
  } catch (error) {
    console.error(`\nError: ${error.message}`);
    process.exitCode = 1;
  }
}
