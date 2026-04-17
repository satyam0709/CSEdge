import WeeklySprint from "../models/WeeklySprint.js";
import { buildSprintLeaderboard } from "../lib/weeklySprintLeaderboard.js";

function slugify(v) {
  return String(v || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export const createWeeklySprint = async (req, res) => {
  try {
    const { title, description, startDate, endDate, isPublished = true, featuredCount = 5 } =
      req.body || {};
    if (!title || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: "title, startDate and endDate are required",
      });
    }

    const sprint = await WeeklySprint.create({
      title: String(title).trim(),
      slug: slugify(title),
      description: String(description || ""),
      startDate: new Date(startDate),
      endDate: new Date(endDate),
      isPublished: Boolean(isPublished),
      featuredCount: Number(featuredCount) || 5,
    });

    return res.json({ success: true, sprint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const updateWeeklySprint = async (req, res) => {
  try {
    const { id } = req.params;
    const patch = { ...req.body };
    if (patch.title) patch.slug = slugify(patch.title);
    const sprint = await WeeklySprint.findByIdAndUpdate(id, patch, { new: true });
    if (!sprint) return res.status(404).json({ success: false, message: "Sprint not found" });
    return res.json({ success: true, sprint });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const listWeeklySprintsAdmin = async (_req, res) => {
  try {
    const sprints = await WeeklySprint.find({}).sort({ startDate: -1 }).lean();
    return res.json({ success: true, sprints });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getActiveWeeklySprintPublic = async (_req, res) => {
  try {
    const now = new Date();
    const sprint = await WeeklySprint.findOne({
      isPublished: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    })
      .sort({ startDate: -1 })
      .lean();

    if (!sprint) return res.json({ success: true, sprint: null });

    const leaderboardData = await buildSprintLeaderboard({
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      limit: 50,
      featuredCount: sprint.featuredCount || 5,
    });

    return res.json({
      success: true,
      sprint: {
        ...sprint,
        leaderboard: leaderboardData.leaderboard,
        featured: leaderboardData.featured,
        totalParticipants: leaderboardData.totalParticipants,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const getWeeklySprintBySlugPublic = async (req, res) => {
  try {
    const { slug } = req.params;
    const sprint = await WeeklySprint.findOne({ slug: String(slug || "").toLowerCase(), isPublished: true }).lean();
    if (!sprint) return res.status(404).json({ success: false, message: "Sprint not found" });

    const leaderboardData = await buildSprintLeaderboard({
      startDate: sprint.startDate,
      endDate: sprint.endDate,
      limit: Number(req.query.limit || 50),
      featuredCount: sprint.featuredCount || 5,
    });

    return res.json({
      success: true,
      sprint: {
        ...sprint,
        leaderboard: leaderboardData.leaderboard,
        featured: leaderboardData.featured,
        totalParticipants: leaderboardData.totalParticipants,
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
