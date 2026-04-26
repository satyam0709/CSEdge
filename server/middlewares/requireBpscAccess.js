import { hasBpscAccess, getRequesterEmail } from "../lib/bpscAccess.js";

export async function requireBpscAccess(req, res, next) {
  try {
    const userId = req.auth()?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    const allowed = await hasBpscAccess(userId);
    if (!allowed) {
      const email = await getRequesterEmail(userId);
      return res.status(403).json({
        success: false,
        message: "BPSC section is restricted to approved emails only.",
        email,
      });
    }
    return next();
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
}
