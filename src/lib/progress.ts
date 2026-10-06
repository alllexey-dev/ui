import { wavePath } from "./wave.js";

export interface ProgressGeometry {
  height: number;
  mid: number;
  /** Path of the active indicator, empty while it is shorter than its own thickness. */
  active: string;
  /** Track after the gap, or null when the indicator fills the whole width. */
  track: { x1: number; x2: number } | null;
}

const GAP = 4;
const AMPLITUDE = 3;

/** Layout of an M3 linear progress: active indicator, a gap, the track and its stop dot at the end. */
export function progressGeometry(fraction: number, width: number, thickness: number, wave: boolean): ProgressGeometry {
  const height = thickness + (wave ? AMPLITUDE * 2 + 2 : 0);
  const mid = height / 2;
  const half = thickness / 2;
  const f = Math.min(1, Math.max(0, fraction));
  const activeEnd = f * width;
  const active = activeEnd >= thickness ? wavePath(half, activeEnd - half, mid, wave ? AMPLITUDE : 0) : "";
  const trackStart = f > 0 ? activeEnd + GAP + half : half;
  const trackEnd = width - half;
  return { height, mid, active, track: trackStart < trackEnd ? { x1: trackStart, x2: trackEnd } : null };
}

/**
 * Eases a displayed value towards its target on animation frames, so everything drawn from it moves together.
 * The first value and every value under prefers-reduced-motion are applied at once.
 */
export function createFollower(onFrame: (value: number) => void, tau = 110) {
  let shown = Number.NaN;
  let target = 0;
  let frame = 0;
  let last = 0;

  const step = (now: number) => {
    shown += (target - shown) * (1 - Math.exp(-(now - last) / tau));
    last = now;
    if (Math.abs(target - shown) < 0.0005) {
      shown = target;
      frame = 0;
    } else {
      frame = requestAnimationFrame(step);
    }
    onFrame(shown);
  };

  return {
    set(value: number) {
      target = value;
      if (Number.isNaN(shown) || matchMedia("(prefers-reduced-motion: reduce)").matches) {
        cancelAnimationFrame(frame);
        frame = 0;
        shown = value;
        onFrame(value);
        return;
      }
      if (!frame) {
        last = performance.now();
        frame = requestAnimationFrame(step);
      }
    },
    stop() {
      cancelAnimationFrame(frame);
      frame = 0;
    },
  };
}
