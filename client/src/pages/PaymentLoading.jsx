import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useAuth } from '@clerk/clerk-react'
import axiosInstance from '../utils/axios'
import { CheckCircle, XCircle, Loader } from 'lucide-react'

export default function PaymentLoading() {
  const { path } = useParams()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { getToken } = useAuth()

  const [status, setStatus] = useState('verifying')
  const [message, setMessage] = useState('Verifying your payment...')
  const hasFired = useRef(false) 

  useEffect(() => {
    if (hasFired.current) return
    hasFired.current = true

    const sessionId  = searchParams.get('session_id')
    const purchaseId = searchParams.get('purchase_id')

    if (!sessionId) {
      setStatus('redirect')
      setMessage('Redirecting...')
      setTimeout(() => navigate(`/${path || ''}`), 1500)
      return
    }
    const verify = async (attempt = 1) => {
      try {
        setMessage(`Verifying payment${attempt > 1 ? ` (${attempt}/4)` : ''}...`)
        await new Promise(r => setTimeout(r, attempt === 1 ? 3000 : 2000))
        const token = await getToken()
        const { data } = await axiosInstance.post(
          '/api/user/verify-purchase',
          { sessionId },
          { headers: { Authorization: `Bearer ${token}` } }
        )

        if (data.success && data.status === 'completed') {
          setStatus('success')
          setMessage('Payment confirmed! Taking you to your courses...')
          setTimeout(() => navigate('/my-enrollments'), 2000)
          return
        }
        if (attempt < 4) {
          verify(attempt + 1)
        } else {
          setStatus('success')
          setMessage('Payment received! Redirecting to your courses...')
          setTimeout(() => navigate('/my-enrollments'), 2000)
        }
      } catch (err) {
        console.error('Payment verification error:', err)
        if (attempt < 4) {
          verify(attempt + 1)
        } else {
          setStatus('failed')
          setMessage('Could not verify payment. Please check My Enrollments.')
          setTimeout(() => navigate('/my-enrollments'), 3000)
        }
      }
    }

    verify()
  }, [])
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="bg-white rounded-3xl shadow-xl p-10 max-w-sm w-full text-center mx-4">

        {/* Icon */}
        <div className="flex justify-center mb-6">
          {status === 'success' ? (
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle size={48} className="text-green-500" />
            </div>
          ) : status === 'failed' ? (
            <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle size={48} className="text-red-500" />
            </div>
          ) : (
            <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center">
              <Loader size={40} className="text-blue-500 animate-spin" />
            </div>
          )}
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          {status === 'success'
            ? 'Payment Successful!'
            : status === 'failed'
            ? 'Verification Issue'
            : 'Processing Payment'}
        </h2>
        <p className="text-gray-500 text-sm mb-6">{message}</p>

        {status === 'verifying' && (
          <div className="flex justify-center gap-1.5">
            {[0, 1, 2].map(i => (
              <div
                key={i}
                className="w-2 h-2 bg-blue-400 rounded-full animate-bounce"
                style={{ animationDelay: `${i * 0.15}s` }}
              />
            ))}
          </div>
        )}

        {(status === 'success' || status === 'failed') && (
          <button
            onClick={() => navigate('/my-enrollments')}
            className="mt-4 text-sm text-blue-600 hover:underline font-semibold"
          >
            Go to My Enrollments →
          </button>
        )}

        <p className="text-xs text-gray-300 mt-6">Please don't close this tab</p>
      </div>
    </div>
  )
}