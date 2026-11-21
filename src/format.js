const UNITS = ["B", "KB", "MB", "GB", "TB"];

export function formatBytes(bytes) {
  if (!Number.isFinite(bytes) || bytes < 0) {
    throw new RangeError("bytes must be a non-negative finite number");
  }

  if (bytes === 0) return "0 B";

  let value = bytes;
  let unitIndex = 0;

  while (value >= 1000 && unitIndex < UNITS.length - 1) {
    value /= 1000;
    unitIndex += 1;
  }

  return `${value.toFixed(2)} ${UNITS[unitIndex]}`;
}

export function formatDuration(milliseconds) {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    throw new RangeError("milliseconds must be a non-negative finite number");
  }

  if (milliseconds < 1000) {
    return `${milliseconds.toFixed(0)} ms`;
  }

  return `${(milliseconds / 1000).toFixed(2)} s`;
}

export function formatSpeed(bytesPerSecond) {
  if (!Number.isFinite(bytesPerSecond) || bytesPerSecond < 0) {
    throw new RangeError("bytesPerSecond must be a non-negative finite number");
  }

  const megabytesPerSecond = bytesPerSecond / 1_000_000;
  const megabitsPerSecond = (bytesPerSecond * 8) / 1_000_000;

  return `${megabytesPerSecond.toFixed(2)} MB/s (${megabitsPerSecond.toFixed(2)} Mbps)`;
}
