import React, { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import axios from 'axios'

const Loading = () => {
  const { path } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState('Processing payment...');

  useEffect(() => {
    const processPayment = async () => {
      const sessionId = searchParams.get('session_id');
      const purchaseId = searchParams.get('purchase_id');

      if (sessionId && purchaseId) {
        try {
          setStatus('Verifying payment...');

          // Wait a bit for webhook to process
          await new Promise(resolve => setTimeout(resolve, 3000));

          // Check purchase status
          const token = await window.Clerk?.session?.getToken();
          const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/verify-purchase`, {
            sessionId
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });

          if (response.data.success && response.data.status === 'completed') {
            setStatus('Payment successful! Redirecting...');
            // Refresh the page to update enrolled courses
            setTimeout(() => {
              window.location.reload();
            }, 2000);
          } else {
            setStatus('Payment still processing...');
            // Try again in 2 seconds
            setTimeout(() => {
              navigate(`/${path}`);
            }, 5000);
          }
        } catch (error) {
          console.error('Payment verification error:', error);
          setStatus('Payment verification failed. Redirecting...');
          setTimeout(() => {
            navigate(`/${path}`);
          }, 3000);
        }
      } else if (path) {
        // Regular loading redirect
        setTimeout(() => {
          navigate(`/${path}`);
        }, 2000);
      }
    };

    processPayment();
  }, [path, navigate, searchParams]);

  return (
    <div className="flex flex-col justify-center items-center min-h-screen bg-gray-50">
      <div className="text-center">
        <div className="w-16 sm:w-20 aspect-square border-4 border-t-blue-500 border-gray-300 rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg text-gray-700">{status}</p>
      </div>
    </div>
  )
}

export default Loading
