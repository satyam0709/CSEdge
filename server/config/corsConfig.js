/**
 * Shared CORS rules for Express and Socket.io.
 * Set CLIENT_URLS on the host (comma or whitespace separated), e.g.
 * https://cseedge.vercel.app,http://localhost:5173
 *
 * Optional: ALLOW_VERCEL_SUBDOMAINS=1 allows any https://*.vercel.app (preview + prod).
 */

function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.replace(/\/+$/, "").trim();
}

export function getAllowedOriginStrings() {
  const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || "";
  const defaultLocal = "http://localhost:5173";
  const list = [];
  if (raw) {
    for (const part of raw.split(/[\s,]+/)) {
      const n = normalizeOrigin(part);
      if (n) list.push(n);
    }
  }
  if (!list.includes(defaultLocal)) list.push(defaultLocal);
  return list;
}

function allowVercelSubdomains() {
  const v = process.env.ALLOW_VERCEL_SUBDOMAINS;
  return v === "1" || v === "true" || String(v).toLowerCase() === "yes";
}

/**
 * Express `cors` origin callback: (origin, cb) => void
 * @param {string[]} allowedList normalized full origin URLs
 */
export function createExpressOriginCallback(allowedList) {
  const allowVercel = allowVercelSubdomains();
  return function corsOrigin(origin, callback) {
    if (!origin) return callback(null, true);
    let hostname;
    try {
      hostname = new URL(origin).hostname;
    } catch {
      return callback(null, false);
    }
    const normalized = normalizeOrigin(origin);
    if (allowedList.some((u) => normalizeOrigin(u) === normalized)) {
      return callback(null, true);
    }
    if (allowVercel) {
      try {
        const u = new URL(origin);
        if (u.protocol === "https:" && hostname.endsWith(".vercel.app")) {
          return callback(null, true);
        }
      } catch {
        /* ignore */
      }
    }
    return callback(null, false);
  };
}

/**
 * Socket.io v4 `cors.origin`: (origin, cb) => void — echo allowed origin string.
 */
export function createSocketOriginCallback(allowedList) {
  const allowVercel = allowVercelSubdomains();
  return function socketOrigin(origin, callback) {
    if (!origin) return callback(null, true);
    let hostname;
    try {
      hostname = new URL(origin).hostname;
    } catch {
      return callback(null, false);
    }
    const normalized = normalizeOrigin(origin);
    if (allowedList.some((u) => normalizeOrigin(u) === normalized)) {
      return callback(null, origin);
    }
    if (allowVercel) {
      try {
        const u = new URL(origin);
        if (u.protocol === "https:" && hostname.endsWith(".vercel.app")) {
          return callback(null, origin);
        }
      } catch {
        /* ignore */
      }
    }
    return callback(null, false);
  };
}
