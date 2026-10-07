/** True when the file matches an `accept` list like the file input's: "image/*,video/*,.heic". Empty accepts all. */
export function accepts(accept: string, file: { name: string; type: string }): boolean {
  const rules = accept.split(",").map((r) => r.trim().toLowerCase()).filter(Boolean);
  if (rules.length === 0) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return rules.some((rule) => {
    if (rule.startsWith(".")) return name.endsWith(rule);
    if (rule.endsWith("/*")) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

/** Video by type or, when the browser leaves the type empty, by extension. */
export function isVideo(file: { name: string; type: string }): boolean {
  return file.type.startsWith("video/") || /\.(mov|mp4|m4v|webm|mkv)$/i.test(file.name);
}

export function isImage(file: { name: string; type: string }): boolean {
  return file.type.startsWith("image/") || /\.(png|jpe?g|gif|webp|heic|heif|avif)$/i.test(file.name);
}

const units = ["Б", "КБ", "МБ", "ГБ"];

/** "1,5 МБ": binary units with a Russian decimal comma, for file limits and sizes. */
export function fileSize(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes <= 0) return "0 Б";
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const scaled = bytes / 1024 ** exp;
  return `${scaled.toFixed(scaled >= 10 || exp === 0 ? 0 : 1).replace(".", ",")} ${units[exp]}`;
}
