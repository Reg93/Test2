import test from "node:test";
import assert from "node:assert/strict";
import { createServer } from "node:http";
import { runBenchmark } from "../src/benchmark.js";

 test("runBenchmark makes ten requests sequentially and counts downloaded bytes", async (t) => {
  let requestCount = 0;
  let activeRequests = 0;
  let maxActiveRequests = 0;

  const server = createServer((request, response) => {
    requestCount += 1;
    activeRequests += 1;
    maxActiveRequests = Math.max(maxActiveRequests, activeRequests);

    setTimeout(() => {
      response.writeHead(200, { "content-type": "text/plain" });
      response.end("test");
      activeRequests -= 1;
    }, 5);
  });

  await new Promise((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => new Promise((resolve, reject) => {
    server.close((error) => error ? reject(error) : resolve());
  }));

  const address = server.address();
  const result = await runBenchmark(`http://127.0.0.1:${address.port}/file`);

  assert.equal(requestCount, 10);
  assert.equal(maxActiveRequests, 1);
  assert.equal(result.requestCount, 10);
  assert.equal(result.totalBytesDownloaded, 40);
  assert.equal(result.results.length, 10);
});
