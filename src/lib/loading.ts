import { clipPath, type ShapeName } from "./shapes.js";

// Shared by the Svelte LoadingIndicator and the <m3-loading-indicator> element.
const sequence: ShapeName[] = ["softBurst", "cookie9", "pentagon", "pill", "sunny", "cookie4", "gem"];

/** The shape the indicator rests on, and keeps under prefers-reduced-motion. */
export const restingClipPath = clipPath(sequence[0]);

/** Morphs the element through the shape sequence while it turns. Returns null when motion is reduced. */
export function animateLoading(el: Element): Animation | null {
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return null;
  const frames = [...sequence, sequence[0]].map((shape, i) => ({ clipPath: clipPath(shape), rotate: `${i * 140}deg` }));
  return el.animate(frames, { duration: 650 * sequence.length, iterations: Infinity, easing: "cubic-bezier(0.38, 1.21, 0.22, 1)" });
}
