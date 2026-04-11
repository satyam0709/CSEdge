/**
 * Shared CORS rules for Express and Socket.io.
 * Set CLIENT_URLS on the host (comma or whitespace separated), e.g.
 * https://cseedge.vercel.app,http://localhost:5173
 *
 * Optional: ALLOW_VERCEL_SUBDOMAINS=1 allows any https://*.vercel.app (preview + prod).
 *
 * Render / split hosting: the frontend must be listed here or preflight fails in the browser.
 */

/** Always echoed on preflight — never rely on reflecting Access-Control-Request-Headers (some proxies strip it). */
export const CORS_ALLOWED_HEADERS = [
  "Content-Type",
  "Authorization",
  "Accept",
  "Origin",
  "X-Requested-With",
];

export const CORS_ALLOWED_METHODS = [
  "GET",
  "HEAD",
  "PUT",
  "PATCH",
  "POST",
  "DELETE",
  "OPTIONS",
];

function normalizeOrigin(url) {
  if (!url || typeof url !== "string") return "";
  return url.replace(/\/+$/, "").trim();
}

/** Default browser origins if CLIENT_URLS is unset (Render often ships without env). */
const DEFAULT_ORIGINS = [
  "http://localhost:5173",
  "https://cseedge.vercel.app",
];

export function getAllowedOriginStrings() {
  const raw = process.env.CLIENT_URLS || process.env.CLIENT_URL || "";
  const list = [];
  if (raw) {
    for (const part of raw.split(/[\s,]+/)) {
      const n = normalizeOrigin(part);
      if (n) list.push(n);
    }
  }
  for (const d of DEFAULT_ORIGINS) {
    if (!list.includes(d)) list.push(d);
  }
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
 * Answer browser CORS preflight before the `cors` package runs. When the origin is
 * allowed, we always set `Access-Control-Allow-Headers` including `Authorization`
 * so Clerk bearer tokens work even if a proxy strips `Access-Control-Request-Headers`
 * or the `cors` package skips applying options (e.g. origin denied → `next()`).
 */
export function expressPreflightCorsMiddleware(allowedList) {
  const checkOrigin = createExpressOriginCallback(allowedList);
  const allowHeadersValue = CORS_ALLOWED_HEADERS.join(", ");
  const allowMethodsValue = CORS_ALLOWED_METHODS.join(", ");

  return function preflight(req, res, next) {
    if (req.method !== "OPTIONS") return next();

    const origin = req.headers.origin;
    if (!origin || typeof origin !== "string") return next();

    checkOrigin(origin, (err, ok) => {
      if (err || !ok) return next();

      res.setHeader("Vary", "Origin");
      res.setHeader("Access-Control-Allow-Origin", origin);
      res.setHeader("Access-Control-Allow-Methods", allowMethodsValue);
      res.setHeader("Access-Control-Allow-Headers", allowHeadersValue);
      res.setHeader("Access-Control-Max-Age", "86400");
      res.setHeader("Content-Length", "0");
      return res.status(204).end();
    });
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
