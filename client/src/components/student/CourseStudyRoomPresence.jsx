import React from 'react'
import { Users, Wifi, WifiOff } from 'lucide-react'
import { useCoursePresence } from '../../hooks/useCoursePresence'

/**
 * Virtual study room: live count of other enrolled learners on the same course (Socket.io).
 */
export default function CourseStudyRoomPresence({
  courseId,
  lectureId,
  getToken,
  enabled = true,
  variant = 'card',
}) {
  const { studyingCount, othersCount, sameLectureCount, connected, error } = useCoursePresence(
    courseId,
    getToken,
    { enabled: Boolean(enabled && courseId), lectureId }
  )

  if (!enabled || !courseId) return null

  const isInline = variant === 'inline'

  const body = () => {
    if (error === 'auth') return null
    if (error === 'server_misconfigured' || error?.includes?.('CLERK')) {
      return (
        <p className="text-xs text-amber-800">
          Study room is offline (server needs CLERK_SECRET_KEY for live presence).
        </p>
      )
    }
    if (error && error !== 'connect_error') {
      return <p className="text-xs text-gray-600">{error}</p>
    }
    if (!connected) {
      return (
        <p className="text-xs text-gray-500 flex items-center gap-1.5">
          <WifiOff className="w-3.5 h-3.5 shrink-0" aria-hidden />
          {error === 'connect_error' ? 'Reconnecting to study room…' : 'Connecting…'}
        </p>
      )
    }
    const sameLectureOthers =
      lectureId && sameLectureCount > 0 ? Math.max(0, sameLectureCount - 1) : 0
    if (lectureId && sameLectureOthers > 0) {
      return (
        <div className="space-y-1">
          <p className="text-sm text-gray-800">
            <span className="font-semibold tabular-nums">{sameLectureOthers}</span>
            {sameLectureOthers === 1
              ? ' other student is on this same lecture right now.'
              : ' other students are on this same lecture right now.'}
          </p>
          {othersCount > 0 && (
            <p className="text-xs text-gray-500">
              <span className="font-medium tabular-nums">{othersCount}</span> others active in this
              course overall.
            </p>
          )}
        </div>
      )
    }
    if (othersCount > 0) {
      return (
        <p className="text-sm text-gray-800">
          <span className="font-semibold tabular-nums">{othersCount}</span>
          {othersCount === 1
            ? ' other student is studying this course right now.'
            : ' other students are studying this course right now.'}
        </p>
      )
    }
    if (studyingCount <= 1) {
      return (
        <p className="text-sm text-gray-700">
          You&apos;re the only one here at the moment — still, you&apos;re part of this course
          community.
        </p>
      )
    }
    return null
  }

  const content = body()
  if (content === null && error === 'auth') return null

  if (isInline) {
    return (
      <div className="flex items-start gap-2 text-sm text-gray-700 py-1">
        <Users className="w-4 h-4 text-violet-600 shrink-0 mt-0.5" aria-hidden />
        <div className="min-w-0">
          <span className="font-semibold text-gray-900">Study room</span>
          <div className="mt-0.5">{content}</div>
        </div>
        {connected && (
          <Wifi className="w-3.5 h-3.5 text-green-600 shrink-0 ml-auto" aria-hidden title="Live" />
        )}
      </div>
    )
  }

  return (
    <div className="rounded-xl border border-violet-200 bg-gradient-to-br from-violet-50/90 to-white px-4 py-3 shadow-sm">
      <div className="flex items-center gap-2 mb-1.5">
        <Users className="w-5 h-5 text-violet-600 shrink-0" aria-hidden />
        <h3 className="text-sm font-bold text-gray-900">Virtual study room</h3>
        {connected ? (
          <span className="ml-auto flex items-center gap-1 text-xs font-medium text-green-700">
            <Wifi className="w-3.5 h-3.5" aria-hidden />
            Live
          </span>
        ) : (
          <span className="ml-auto text-xs text-gray-400">…</span>
        )}
      </div>
      {content}
      {connected && studyingCount > 0 && (
        <p className="text-xs text-gray-500 mt-2 tabular-nums">
          {studyingCount} learner{studyingCount === 1 ? '' : 's'} online in this course
        </p>
      )}
    </div>
  )
}
