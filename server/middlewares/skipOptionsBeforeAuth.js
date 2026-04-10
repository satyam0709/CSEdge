/**
 * Clerk's requireAuth() may respond to unauthenticated requests with a redirect.
 * Browsers forbid redirects on CORS preflight (OPTIONS). When the origin is not
 * allowed, the cors package forwards OPTIONS to this router — we must not 302.
 * When the origin is allowed, express cors ends the OPTIONS response earlier and
 * this middleware is never reached.
 */
export function skipOptionsBeforeAuth(req, res, next) {
  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }
  next();
}
