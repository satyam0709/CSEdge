import Testimonial from '../models/Testimonial.js';
import User from '../models/user.js';
import { clerkClient } from '@clerk/express';

/** Display name + email + avatar from Clerk (source of truth for this user id). */
async function getProfileFromClerk(userId) {
  const clerkUser = await clerkClient.users.getUser(userId);
  const firstLast = `${clerkUser.first_name || ''} ${clerkUser.last_name || ''}`.trim();
  const email = clerkUser.email_addresses?.[0]?.email_address || '';
  const name =
    firstLast ||
    clerkUser.username ||
    (email ? email.split('@')[0] : '') ||
    'User';
  const imageUrl = clerkUser.image_url || '';
  return { name, email, imageUrl };
}

/** Keep Mongo User in sync with Clerk (used elsewhere in the app). */
async function upsertUserFromClerkProfile(userId, profile) {
  await User.findOneAndUpdate(
    { _id: userId },
    {
      $set: {
        name: profile.name,
        email: profile.email,
        imageUrl: profile.imageUrl,
      },
      $setOnInsert: { _id: userId },
    },
    { upsert: true, new: true }
  );
}

/**
 * Public: no auth. Anyone visiting the site can read testimonials.
 */
export const listTestimonials = async (req, res) => {
  try {
    const testimonials = await Testimonial.find()
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();

    return res.json({ success: true, testimonials });
  } catch (error) {
    console.error('listTestimonials:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to load testimonials' });
  }
};

export const submitTestimonial = async (req, res) => {
  try {
    const userId = req.auth()?.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Unauthorized' });
    }

    const { feedback, rating } = req.body;
    const text = typeof feedback === 'string' ? feedback.trim() : '';
    const r = Number(rating);

    if (!text || text.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Please write at least 8 characters of feedback.',
      });
    }
    if (!Number.isFinite(r) || r < 1 || r > 5) {
      return res.status(400).json({ success: false, message: 'Rating must be between 1 and 5.' });
    }

    const profile = await getProfileFromClerk(userId);
    await upsertUserFromClerkProfile(userId, profile);

    const starRating = Math.min(5, Math.max(1, Math.round(r)));

    const testimonial = await Testimonial.findOneAndUpdate(
      { userId },
      {
        userId,
        name: profile.name,
        email: profile.email,
        imageUrl: profile.imageUrl,
        feedback: text,
        rating: starRating,
      },
      { upsert: true, new: true, runValidators: true }
    );

    return res.json({
      success: true,
      message: 'Thank you for your feedback!',
      testimonial,
    });
  } catch (error) {
    console.error('submitTestimonial:', error);
    return res.status(500).json({ success: false, message: error.message || 'Failed to save testimonial' });
  }
};
