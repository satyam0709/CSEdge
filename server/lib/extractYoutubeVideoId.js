/**
 * Extract YouTube video ID from common URL shapes (aligned with client Player.jsx).
 */
export function extractYoutubeVideoId(url) {
  if (!url || typeof url !== "string") return null;
  const u = url.trim();
  if (u.length === 11 && !u.includes("/") && !u.includes("?")) return u;
  const embedMatch = u.match(/youtube\.com\/embed\/([^?&/]+)/);
  if (embedMatch) return embedMatch[1];
  const watchMatch = u.match(/[?&]v=([^&]+)/);
  if (watchMatch) return watchMatch[1];
  const shortMatch = u.match(/youtu\.be\/([^?&/]+)/);
  if (shortMatch) return shortMatch[1];
  const last = u.split("/").pop()?.split("?")[0];
  if (last && /^[\w-]{11}$/.test(last)) return last;
  return null;
}
