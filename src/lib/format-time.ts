// dateStrings + timezone "Z" on the DB connection means every timestamp the
// API returns is a UTC "YYYY-MM-DD HH:MM:SS" string with no timezone marker
// of its own — this reattaches one before parsing.
export function formatRelativeTime(mysqlDatetime: string): string {
  const date = new Date(`${mysqlDatetime.replace(" ", "T")}Z`);
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date.getTime()) / 1000));

  if (diffSeconds < 60) return "Just now";
  const diffMinutes = Math.floor(diffSeconds / 60);
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString("en-IN", { day: "2-digit", month: "short" });
}
