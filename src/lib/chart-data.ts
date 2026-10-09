/**
 * Y range of a chart. By default it keeps zero in view, adds headroom above the data and, when values go
 * negative, the same kind of room below. With `zero: false` (prices and other values far from zero) it
 * follows the data. `min` and `max` pin either end.
 */
export function chartRange(dataMin: number | null, dataMax: number | null, pin: { min?: number; max?: number; zero?: boolean } = {}): [number, number] {
  if (pin.zero === false && dataMin !== null && dataMax !== null) {
    const pad = (dataMax - dataMin) * 0.08 || Math.abs(dataMax) * 0.01 || 1;
    return ordered(pin.min ?? dataMin - pad, pin.max ?? dataMax + pad);
  }
  const low = Math.min(0, dataMin ?? 0);
  const high = Math.max(0, dataMax ?? 0);
  if (low === 0 && high === 0) return ordered(pin.min ?? 0, pin.max ?? 1);
  const span = high - low;
  return ordered(pin.min ?? (low < 0 ? low - span * 0.1 : 0), pin.max ?? (high > 0 ? high + span * 0.15 : 0));
}

const ordered = (bottom: number, top: number): [number, number] => (top > bottom ? [bottom, top] : [bottom, bottom + 1]);

/**
 * Puts series sampled at different moments on one time axis, as Chart expects: `times` is every moment of
 * any series, sorted, and each series gets null where it has no point.
 */
export function alignSeries(series: [time: number, value: number][][]): { times: number[]; values: (number | null)[][] } {
  const times = [...new Set(series.flatMap((points) => points.map(([t]) => t)))].sort((a, b) => a - b);
  const index = new Map(times.map((t, i) => [t, i]));
  const values = series.map((points) => {
    const column: (number | null)[] = new Array(times.length).fill(null);
    for (const [t, v] of points) column[index.get(t)!] = v;
    return column;
  });
  return { times, values };
}

/** The last value at or before index `at`: what a series with gaps shows at that moment. */
export function valueAt(values: readonly (number | null | undefined)[], at = values.length - 1): number | null {
  for (let i = Math.min(at, values.length - 1); i >= 0; i--) {
    const v = values[i];
    if (v !== null && v !== undefined) return v;
  }
  return null;
}
