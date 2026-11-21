import test from "node:test";
import assert from "node:assert/strict";
import { formatBytes, formatDuration, formatSpeed } from "../src/format.js";

test("formatBytes formats byte values", () => {
  assert.equal(formatBytes(0), "0 B");
  assert.equal(formatBytes(500), "500.00 B");
  assert.equal(formatBytes(1500), "1.50 KB");
});

test("formatDuration chooses milliseconds or seconds", () => {
  assert.equal(formatDuration(250), "250 ms");
  assert.equal(formatDuration(1500), "1.50 s");
});

test("formatSpeed shows MB/s and Mbps", () => {
  assert.equal(formatSpeed(1_000_000), "1.00 MB/s (8.00 Mbps)");
});

test("formatters reject invalid values", () => {
  assert.throws(() => formatBytes(-1), RangeError);
  assert.throws(() => formatDuration(Number.NaN), RangeError);
  assert.throws(() => formatSpeed(-1), RangeError);
});
