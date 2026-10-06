// Polygonal approximations of the M3 Expressive shape library. Every shape has the same number of
// points, so any two can be morphed with a CSS clip-path or SVG transition.
export const SHAPE_POINTS = 72;

// Radius of the shape boundary in the direction of `angle` (radians, 0 = right, counter-clockwise),
// before normalisation to the unit box.
type Radius = (angle: number) => number;

const mod = (x: number, m: number) => ((x % m) + m) % m;

/** Averages the radius over a small arc: rounds the corners of polygonal shapes. */
function rounded(r: Radius, arc: number): Radius {
  const steps = 8;
  return (a) => {
    let sum = 0;
    for (let k = -steps; k <= steps; k++) sum += r(a + (k / steps) * arc);
    return sum / (2 * steps + 1);
  };
}

/** Regular polygon with `sides` and one vertex up, with rounded corners. */
function polygon(sides: number): Radius {
  const step = (2 * Math.PI) / sides;
  return rounded((a) => Math.cos(step / 2) / Math.cos(mod(a - Math.PI / 2, step) - step / 2), 0.22);
}

/** Union of `lobes` circles of radius `size` whose centres lie at `distance` from the middle. */
function lobed(lobes: number, distance: number, size: number, offset: number): Radius {
  const centres = Array.from({ length: lobes }, (_, i) => offset + (i / lobes) * 2 * Math.PI);
  return (a) => {
    let best = 0;
    for (const c of centres) {
      const dot = distance * Math.cos(a - c);
      const disc = dot * dot - distance * distance + size * size;
      if (disc >= 0) best = Math.max(best, dot + Math.sqrt(disc));
    }
    return best;
  };
}

/** Horizontal stadium: half-width 1, half-height h, semicircular ends. */
function stadium(h: number): Radius {
  const c = 1 - h;
  return (a) => {
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    if (Math.abs(dy) > 1e-9) {
      const t = h / Math.abs(dy);
      if (Math.abs(t * dx) <= c) return t;
    }
    const cx = Math.sign(dx) * c;
    const dot = dx * cx;
    return dot + Math.sqrt(dot * dot - cx * cx + h * h);
  };
}

const radii = {
  circle: () => 1,
  // smooth n-lobed shapes; the 4-lobed ones sit square, with lobes in the corners
  cookie4: (a: number) => 1 + 0.1 * Math.cos(4 * (a - Math.PI / 4)),
  cookie6: (a: number) => 1 + 0.08 * Math.cos(6 * a),
  cookie9: (a: number) => 1 + 0.06 * Math.cos(9 * (a - Math.PI / 2)),
  cookie12: (a: number) => 1 + 0.045 * Math.cos(12 * a),
  clover4: lobed(4, 0.46, 0.56, Math.PI / 4),
  clover8: (a: number) => 1 + 0.12 * Math.cos(8 * a),
  flower: (a: number) => 0.8 + 0.2 * Math.abs(Math.cos(3 * (a - Math.PI / 2))),
  sunny: (a: number) => 1 + 0.1 * Math.cos(8 * a),
  burst: (a: number) => 0.82 + 0.18 * Math.abs(Math.cos(6 * a)) ** 2,
  softBurst: (a: number) => 0.88 + 0.12 * Math.cos(10 * a),
  pentagon: polygon(5),
  pill: stadium(0.62),
  gem: polygon(6),
};

export type ShapeName = keyof typeof radii;
export const shapeNames = Object.keys(radii) as ShapeName[];

/** Points of a shape inside a unit box (0..1), starting at the top and going clockwise on screen. */
export function shapePoints(name: ShapeName, rotation = 0): [number, number][] {
  const r = radii[name] ?? radii.circle;
  const raw: [number, number][] = [];
  for (let i = 0; i < SHAPE_POINTS; i++) {
    // screen y grows downwards: going clockwise on screen is counter-clockwise in math angles negated
    const a = Math.PI / 2 - (i / SHAPE_POINTS) * 2 * Math.PI + rotation;
    const radius = r(a - rotation);
    raw.push([Math.cos(a) * radius, -Math.sin(a) * radius]);
  }
  const max = Math.max(...raw.flat().map(Math.abs));
  return raw.map(([x, y]) => [0.5 + (x / max) * 0.5, 0.5 + (y / max) * 0.5]);
}

export function clipPath(name: ShapeName, rotation = 0): string {
  return `polygon(${shapePoints(name, rotation).map(([x, y]) => `${(x * 100).toFixed(2)}% ${(y * 100).toFixed(2)}%`).join(", ")})`;
}

export function svgPath(name: ShapeName, size = 100, rotation = 0): string {
  const points = shapePoints(name, rotation);
  return points.map(([x, y], i) => `${i ? "L" : "M"}${(x * size).toFixed(2)} ${(y * size).toFixed(2)}`).join(" ") + "Z";
}
