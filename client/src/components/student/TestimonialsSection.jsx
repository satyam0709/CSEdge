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

  useEffect(() => { load(); }, [load]);

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
    <div className="section-shell pb-10 md:pb-14 px-5 md:px-10 pt-10 md:pt-12 mt-8 relative overflow-hidden">

      {/* Background accents */}
      <div
        className="absolute top-0 right-0 w-96 h-64 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(37,99,235,0.07) 0%, transparent 70%)',
          filter: 'blur(28px)',
        }}
      />
      <div
        className="absolute bottom-0 left-0 w-72 h-48 pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(99,102,241,0.05) 0%, transparent 70%)',
          filter: 'blur(22px)',
        }}
      />

      <div className="relative z-10">

        {/* Header */}
        <div className="section-accent mb-4">Student Voices</div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
          What Our <span className="gradient-text-animate">Learners Say</span>
        </h2>
        <p className="text-sm md:text-base text-slate-500 mt-3 max-w-2xl">
          Hear from our learners about their experiences with our courses and how
          it has helped them achieve their goals.
        </p>
        <p className="text-sm text-slate-400 mt-1">
          These testimonials are public — sign in to add yours.
        </p>

        {/* Cards */}
        {loading ? (
          <p className="mt-14 text-gray-500 text-center">Loading testimonials…</p>
        ) : items.length === 0 ? (
          <p className="mt-14 text-gray-500 text-center">No testimonials yet. Share your experience below.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 md:gap-6 mt-10 md:mt-14">
            {items.map((t, index) => {
              const avatarSrc = t.imageUrl?.trim() ? t.imageUrl : assets.user_icon;
              return (
                <div
                  key={t._id || t.userId}
                  className="stagger-card rounded-2xl p-5 md:p-6 overflow-hidden relative"
                  style={{
                    '--d': `${index * 70}ms`,
                    background: 'rgba(255,255,255,0.9)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(148,163,184,0.2)',
                    boxShadow: '0 4px 20px rgba(15,23,42,0.06)',
                    transition: 'all 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px)';
                    e.currentTarget.style.borderColor = 'rgba(59,130,246,0.35)';
                    e.currentTarget.style.boxShadow = '0 20px 50px rgba(37,99,235,0.12), 0 0 0 1px rgba(59,130,246,0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.borderColor = 'rgba(148,163,184,0.2)';
                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(15,23,42,0.06)';
                  }}
                >
                  {/* Decorative quote mark */}
                  <div
                    className="absolute top-3 right-4 text-5xl font-black leading-none pointer-events-none select-none"
                    style={{ color: 'rgba(37,99,235,0.07)' }}
                  >"</div>

                  <div className="flex items-center gap-3 mb-4">
                    <img
                      src={avatarSrc}
                      alt=""
                      className="w-12 h-12 rounded-full object-cover border-2"
                      style={{ borderColor: 'rgba(59,130,246,0.22)' }}
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = assets.user_icon;
                      }}
                    />
                    <div className="text-left min-w-0 flex-1">
                      <p className="font-bold text-gray-900 text-base truncate" title={t.name}>
                        {t.name?.trim() || 'Learner'}
                      </p>
                      <p className="text-xs text-gray-400 truncate" title={t.email}>
                        {t.email || '—'}
                      </p>
                    </div>
                  </div>

                  <p className="text-gray-600 italic mb-4 text-sm leading-relaxed">"{t.feedback}"</p>

                  <div className="flex items-center gap-1">
                    {[...Array(5)].map((_, i) => (
                      <img key={i} src={t.rating > i ? assets.star : assets.star_blank} alt="" className="w-4 h-4" />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* CTA button */}
        <div className="mt-10 flex justify-center">
          <button
            type="button"
            onClick={openModal}
            className="shimmer-btn inline-flex items-center gap-2 text-white px-7 py-2.5 rounded-full font-semibold text-sm"
            style={{
              background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
              boxShadow: '0 0 22px rgba(37,99,235,0.4), 0 6px 16px rgba(37,99,235,0.25)',
            }}
          >
            {isSignedIn ? '+ Add testimonial' : 'Sign in to add testimonial'}
          </button>
        </div>

      </div>

      {/* Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.55)', backdropFilter: 'blur(6px)' }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="testimonial-modal-title"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="rounded-2xl max-w-lg w-full p-6 relative"
            style={{
              background: 'rgba(255,255,255,0.98)',
              border: '1px solid rgba(148,163,184,0.25)',
              boxShadow: '0 40px 80px rgba(15,23,42,0.25)',
              animation: 'heroCtaIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close */}
            <button
              className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition"
              onClick={() => setModalOpen(false)}
              aria-label="Close"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h3 id="testimonial-modal-title" className="text-xl font-black text-gray-900 mb-1">
              Share your feedback
            </h3>

            {user && (
              <div className="flex items-center gap-3 mb-5 mt-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <img
                  src={user.imageUrl || assets.user_icon}
                  alt=""
                  className="w-10 h-10 rounded-full object-cover border border-gray-200 bg-gray-50"
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = assets.user_icon; }}
                />
                <div className="text-sm text-gray-600 min-w-0">
                  <p className="font-semibold text-gray-800 truncate">{user.fullName || user.firstName || 'Learner'}</p>
                  <p className="truncate text-gray-500 text-xs">
                    {user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress}
                  </p>
                </div>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setRating(n)}
                      className={`p-1 rounded transition-transform hover:scale-110 ${rating >= n ? 'opacity-100' : 'opacity-35'}`}
                      aria-label={`${n} stars`}
                    >
                      <img src={assets.star} alt="" className="w-8 h-8" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="testimonial-feedback" className="block text-sm font-semibold text-gray-700 mb-2">
                  Your feedback
                </label>
                <textarea
                  id="testimonial-feedback"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-800 outline-none text-sm resize-none"
                  style={{ transition: 'border-color 200ms, box-shadow 200ms' }}
                  placeholder="Tell others what you liked about the platform or courses…"
                  maxLength={2000}
                  required
                  onFocus={(e) => { e.target.style.borderColor = 'rgba(59,130,246,0.5)'; e.target.style.boxShadow = '0 0 0 3px rgba(37,99,235,0.1)'; }}
                  onBlur={(e) => { e.target.style.borderColor = '#e2e8f0'; e.target.style.boxShadow = 'none'; }}
                />
                <p className="text-xs text-gray-400 mt-1 text-right">{feedback.length} / 2000</p>
              </div>

              <div className="flex gap-3 justify-end pt-1">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-sm font-medium transition"
                  disabled={submitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="shimmer-btn px-5 py-2.5 rounded-xl text-white text-sm font-bold disabled:opacity-60"
                  style={{
                    background: 'linear-gradient(135deg, #2563eb, #4f46e5)',
                    boxShadow: '0 0 18px rgba(37,99,235,0.35)',
                  }}
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
