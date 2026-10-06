/** Path of a wavy (or flat) line from x0 to x1 around y = mid. */
export function wavePath(x0: number, x1: number, mid: number, amplitude: number, wavelength = 28): string {
  if (x1 <= x0) return "";
  if (!amplitude) return `M${x0} ${mid} L${x1} ${mid}`;
  const steps = Math.max(2, Math.ceil((x1 - x0) / 2));
  let d = "";
  for (let i = 0; i <= steps; i++) {
    const x = x0 + ((x1 - x0) * i) / steps;
    const y = mid + amplitude * Math.sin(((x - x0) / wavelength) * 2 * Math.PI);
    d += `${i ? "L" : "M"}${x.toFixed(1)} ${y.toFixed(2)}`;
  }
  return d;
}
