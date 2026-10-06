/**
 * Y range of a chart: always includes zero, adds headroom above the data and, when values go negative,
 * the same kind of room below. `min` and `max` pin either end.
 */
export function chartRange(dataMin: number | null, dataMax: number | null, pin: { min?: number; max?: number } = {}): [number, number] {
  const low = Math.min(0, dataMin ?? 0);
  const high = Math.max(0, dataMax ?? 0);
  if (low === 0 && high === 0) return [pin.min ?? 0, pin.max ?? 1];
  const span = high - low;
  const bottom = pin.min ?? (low < 0 ? low - span * 0.1 : 0);
  const top = pin.max ?? (high > 0 ? high + span * 0.15 : 0);
  return top > bottom ? [bottom, top] : [bottom, bottom + 1];
}
