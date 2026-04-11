import { useEffect, useState, useRef } from 'react'
import { io } from 'socket.io-client'
import { getSocketBaseUrl } from '../utils/socketBaseUrl'

/**
 * Join a per-course Socket.io room; receive live unique-learner counts (enrolled users only).
 */
export function useCoursePresence(courseId, getToken, { enabled = true, lectureId } = {}) {
  const [studyingCount, setStudyingCount] = useState(0)
  const [othersCount, setOthersCount] = useState(0)
  const [sameLectureCount, setSameLectureCount] = useState(0)
  const [connected, setConnected] = useState(false)
  const [error, setError] = useState(null)
  const socketRef = useRef(null)
  const getTokenRef = useRef(getToken)
  getTokenRef.current = getToken

  useEffect(() => {
    if (!enabled || !courseId) {
      setStudyingCount(0)
      setOthersCount(0)
      setSameLectureCount(0)
      setConnected(false)
      return
    }

    let cancelled = false
    const socketUrl = getSocketBaseUrl()
    const cid = String(courseId)
    const lid = lectureId != null && lectureId !== '' ? String(lectureId) : null

    const run = async () => {
      let token
      try {
        token = await getTokenRef.current()
      } catch {
        if (!cancelled) setError('auth')
        return
      }
      if (!token || cancelled) return

      const socket = io(socketUrl, {
        path: '/socket.io',
        auth: { token },
        transports: ['websocket', 'polling'],
        reconnection: true,
        reconnectionAttempts: 8,
        reconnectionDelay: 1500,
      })
      socketRef.current = socket

      socket.on('connect', () => {
        if (cancelled) return
        setConnected(true)
        setError(null)
        socket.emit('presence:join', lid ? { courseId: cid, lectureId: lid } : { courseId: cid })
      })

      socket.on('presence:update', (payload) => {
        if (cancelled || String(payload?.courseId) !== cid) return
        setStudyingCount(Number(payload.studyingCount) || 0)
        setOthersCount(Math.max(0, Number(payload.othersCount) || 0))
        const lp = payload.lecturePresence && typeof payload.lecturePresence === 'object' ? payload.lecturePresence : {}
        if (lid && lp[lid] != null) {
          setSameLectureCount(Number(lp[lid]) || 0)
        } else {
          setSameLectureCount(0)
        }
      })

      socket.on('presence:error', (p) => {
        if (!cancelled) setError(p?.message || 'presence_error')
      })

      socket.on('connect_error', () => {
        if (!cancelled) setError('connect_error')
      })

      socket.on('disconnect', () => {
        if (!cancelled) setConnected(false)
      })
    }

    run()

    return () => {
      cancelled = true
      const s = socketRef.current
      if (s) {
        try {
          s.emit('presence:leave')
        } catch {
          /* ignore */
        }
        s.removeAllListeners()
        s.disconnect()
        socketRef.current = null
      }
      setConnected(false)
    }
  }, [courseId, enabled, lectureId])

  return { studyingCount, othersCount, sameLectureCount, connected, error }
}
