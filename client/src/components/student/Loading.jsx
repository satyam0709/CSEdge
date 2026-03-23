/**
 * Loading.jsx — src/components/student/Loading.jsx
 * 
 * Used in TWO ways:
 * 1. Simple spinner while other pages load  →  <Loading />
 * 2. Post-Stripe payment verification page  →  /loading/my-enrollments?session_id=...
 */
import React, { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import axiosInstance from '../../utils/axios'

const Loading = () => {
  const { path } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getToken } = useAuth()           // ✅ FIX: hook instead of window.Clerk
  const [status, setStatus] = useState('Processing...')
  const ran = useRef(false)                // prevent double-fire in React StrictMode

  useEffect(() => {
    // ── Case 1: No path param → just a spinner, do nothing ────────────────
    if (!path) return;

    if (ran.current) return;
    ran.current = true;

    const sessionId = searchParams.get('session_id');

    // ── Case 2: Regular redirect (no Stripe) ──────────────────────────────
    if (!sessionId) {
      setTimeout(() => navigate(`/${path}`), 500);
      return;
    }

    // ── Case 3: Coming back from Stripe payment ───────────────────────────
    const verify = async (attempt = 1) => {
      try {
        setStatus(attempt === 1
          ? 'Verifying your payment...'
          : `Checking payment status... (${attempt}/4)`
        );

        // Give the Stripe webhook time to fire
        await new Promise(r => setTimeout(r, attempt === 1 ? 3000 : 2000));

        const token = await getToken();

        // ✅ FIX: use axiosInstance (has base URL), not plain axios
        const { data } = await axiosInstance.post(
          '/api/user/verify-purchase',
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (data.success && data.status === 'completed') {
          setStatus('Payment confirmed! Redirecting to your courses...');
          // ✅ FIX: navigate to destination, NOT window.location.reload()
          setTimeout(() => navigate('/my-enrollments'), 1500);
          return;
        }

        // Not confirmed yet — retry up to 4 times
        if (attempt < 4) {
          verify(attempt + 1);
        } else {
          // After 4 attempts still pending — go to enrollments anyway
          // webhook will complete it in background
          setStatus('Taking you to your courses...');
          setTimeout(() => navigate('/my-enrollments'), 1500);
        }

      } catch (err) {
        console.error('Verify error:', err);
        if (attempt < 4) {
          verify(attempt + 1);
        } else {
          setStatus('Redirecting...');
          setTimeout(() => navigate(`/${path}`), 1500);
        }
      }
    };

    verify();
  }, []);

  return (
    <div className='flex flex-col justify-center items-center min-h-screen bg-gray-50 gap-4'>
      {/* Spinner */}
      <div className='w-16 h-16 border-4 border-t-blue-500 border-gray-200 rounded-full animate-spin' />
      {/* Status text — only shown on payment loading page */}
      {path && (
        <>
          <p className='text-lg font-semibold text-gray-700'>{status}</p>
          <p className='text-sm text-gray-400'>Please don't close this tab</p>
        </>
      )}
    </div>
  );
};

export default Loading;