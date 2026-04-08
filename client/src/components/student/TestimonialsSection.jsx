import React, { useCallback, useEffect, useState } from 'react';
import { useAuth, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { assets } from '../../assets/assets';

const TestimonialsSection = () => {
  const { isSignedIn, getToken } = useAuth();
  const { user } = useUser();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(5);
  const [submitting, setSubmitting] = useState(false);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/testimonials');
      if (data.success && Array.isArray(data.testimonials)) {
        setItems(data.testimonials);
      }
    } catch (e) {
      console.error(e);
      toast.error('Could not load testimonials.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const openModal = () => {
    if (!isSignedIn) {
      navigate('/login', { state: { from: '/' } });
      return;
    }
    setFeedback('');
    setRating(5);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isSignedIn) return;
    const text = feedback.trim();
    if (text.length < 8) {
      toast.error('Please write at least 8 characters.');
      return;
    }
    try {
      setSubmitting(true);
      const token = await getToken();
      const { data } = await axios.post(
        '/api/testimonials',
        { feedback: text, rating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (data.success) {
        toast.success(data.message || 'Thank you!');
        setModalOpen(false);
        await load();
      } else {
        toast.error(data.message || 'Could not save.');
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Could not save testimonial.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pb-14 px-8 md:px-0">
      <h2 className="text-3xl font-medium text-gray-800">Testimonials</h2>
      <p className="md:text-base text-gray-500 mt-3">
        Hear from our learners about their experiences with our courses and how <br />
        it has helped them achieve their goals.
      </p>
      <p className="text-sm text-gray-500 mt-2">
        These testimonials are public — anyone who visits this page can read them. You need to sign in to add yours.
      </p>

      {loading ? (
        <p className="mt-14 text-gray-500 text-center">Loading testimonials…</p>
      ) : items.length === 0 ? (
        <p className="mt-14 text-gray-500 text-center">
          No testimonials yet. Share your experience below.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-14">
          {items.map((t) => {
            const avatarSrc = t.imageUrl?.trim() ? t.imageUrl : assets.user_icon;
            return (
            <div
              key={t._id || t.userId}
              className="border border-gray-300 rounded-lg p-6 my-6 md:w-2/3 mx-auto overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={avatarSrc}
                  alt=""
                  className="w-12 h-12 rounded-full object-cover border border-gray-200 bg-gray-50"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = assets.user_icon;
                  }}
                />
                <div className="text-left min-w-0 flex-1">
                  <p className="font-semibold text-gray-900 text-base truncate" title={t.name}>
                    {t.name?.trim() || 'Learner'}
                  </p>
                  <p className="text-xs text-gray-500 truncate" title={t.email}>
                    {t.email || '—'}
                  </p>
                </div>
              </div>

              <p className="text-gray-600 italic mb-4">“{t.feedback}”</p>

              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <img
                    key={i}
                    src={t.rating > i ? assets.star : assets.star_blank}
                    alt=""
                    className="w-4 h-4"
                  />
                ))}
              </div>
            </div>
          );
          })}
        </div>
      )}

      <div className="mt-10 flex justify-center">
        <button
          type="button"
          onClick={openModal}
          className="bg-blue-600 text-white px-6 py-2.5 rounded-full hover:bg-blue-700 transition text-sm font-medium shadow-sm"
        >
          {isSignedIn ? 'Add testimonial' : 'Sign in to add testimonial'}
        </button>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40"
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-gray-200"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 id="testimonial-modal-title" className="text-lg font-semibold text-gray-800 mb-1">
              Share your feedback
            </h3>
            {user && (
              <div className="flex items-center gap-3 mb-4">
                <img
                  src={user.imageUrl || assets.user_icon}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = assets.user_icon;
                  }}
                />
                <div className="text-sm text-gray-600 min-w-0">
                  <p className="font-medium text-gray-800 truncate">{user.fullName || user.firstName || 'Learner'}</p>
                  <p className="truncate text-gray-500">
                    {user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`p-1 rounded ${rating >= n ? 'opacity-100' : 'opacity-40'}`}
                      aria-label={`${n} stars`}
                    >
                      <img src={assets.star} alt="" className="w-8 h-8" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="testimonial-feedback" className="block text-sm font-medium text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  id="testimonial-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  placeholder="Tell others what you liked about the platform or courses…"
                  maxLength={2000}
                  required
                />
                <p className="text-xs text-gray-400 mt-1">{feedback.length} / 2000</p>
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-50"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-60"
                >
                  {submitting ? 'Saving…' : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TestimonialsSection;
