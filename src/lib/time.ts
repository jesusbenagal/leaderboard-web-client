export function timeAgo(iso: string): string {
  const delta = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (delta < 60) return `${delta}s`;
  const m = Math.floor(delta / 60);
  if (m < 60) return `${m}m`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  return `${d}d`;
}
