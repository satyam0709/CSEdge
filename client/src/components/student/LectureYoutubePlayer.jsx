import React, { useCallback, useEffect, useRef, useState } from 'react'
import YouTube from 'react-youtube'
import { Gauge, MonitorPlay } from 'lucide-react'

const RATE_PRESETS = [0.25, 0.5, 0.75, 1, 1.25, 1.5, 1.75, 2]

const QUALITY_LABELS = {
  auto: 'Auto',
  default: 'Auto',
  highres: 'Highest available',
  hd1080: '1080p',
  hd720: '720p',
  large: '480p',
  medium: '360p',
  small: '240p',
  tiny: '144p',
}

const RATE_STORAGE_KEY = 'lms_youtube_playback_rate_v1'

function formatQuality(q) {
  if (!q) return 'Auto'
  return QUALITY_LABELS[q] || q
}

/**
 * YouTube lecture embed with LMS toolbar: playback speed + quality (IFrame API).
 */
export default function LectureYoutubePlayer({ videoId, title }) {
  const playerRef = useRef(null)
  const [playbackRate, setPlaybackRate] = useState(() => {
    try {
      const s = localStorage.getItem(RATE_STORAGE_KEY)
      const n = parseFloat(s)
      return RATE_PRESETS.includes(n) ? n : 1
    } catch {
      return 1
    }
  })
  const [qualityLevels, setQualityLevels] = useState([])
  const [playbackQuality, setPlaybackQuality] = useState('default')

  const applyRate = useCallback((rate) => {
    const p = playerRef.current
    if (!p || typeof p.setPlaybackRate !== 'function') return
    try {
      p.setPlaybackRate(rate)
      setPlaybackRate(rate)
      try {
        localStorage.setItem(RATE_STORAGE_KEY, String(rate))
      } catch {
        /* ignore */
      }
    } catch {
      /* YouTube may reject some rates on rare embeds */
    }
  }, [])

  const applyQuality = useCallback((q) => {
    const p = playerRef.current
    if (!p || typeof p.setPlaybackQuality !== 'function') return
    try {
      p.setPlaybackQuality(q)
      setPlaybackQuality(q)
    } catch {
      /* ignored */
    }
  }, [])

  const onReady = useCallback(
    (event) => {
      const p = event.target
      playerRef.current = p

      let savedRate = 1
      try {
        const s = localStorage.getItem(RATE_STORAGE_KEY)
        const n = parseFloat(s)
        if (RATE_PRESETS.includes(n)) savedRate = n
      } catch {
        /* ignore */
      }

      try {
        const rates =
          typeof p.getAvailablePlaybackRates === 'function'
            ? p.getAvailablePlaybackRates()
            : null
        const useRate =
          rates && rates.length
            ? RATE_PRESETS.filter((r) => rates.includes(r))
            : RATE_PRESETS
        const initialRate = useRate.includes(savedRate) ? savedRate : 1
        applyRate(initialRate)
      } catch {
        applyRate(1)
      }

      try {
        const levels =
          typeof p.getAvailableQualityLevels === 'function'
            ? p.getAvailableQualityLevels()
            : []
        const uniq = [...new Set(levels)].filter(Boolean)
        setQualityLevels(uniq.length ? uniq : [])
        const current =
          typeof p.getPlaybackQuality === 'function' ? p.getPlaybackQuality() : 'default'
        setPlaybackQuality(current || 'default')
      } catch {
        setQualityLevels([])
      }
    },
    [applyRate]
  )

  const onPlaybackQualityChange = useCallback((event) => {
    const q = event.data
    if (q) setPlaybackQuality(q)
  }, [])

  const onPlaybackRateChange = useCallback((event) => {
    const r = event.data
    if (typeof r === 'number' && RATE_PRESETS.includes(r)) {
      setPlaybackRate(r)
      try {
        localStorage.setItem(RATE_STORAGE_KEY, String(r))
      } catch {
        /* ignore */
      }
    }
  }, [])

  useEffect(() => {
    playerRef.current = null
    setQualityLevels([])
    setPlaybackQuality('default')
  }, [videoId])

  const origin =
    typeof window !== 'undefined' ? window.location.origin : ''

  const opts = {
    width: '100%',
    height: '100%',
    playerVars: {
      autoplay: 1,
      rel: 0,
      modestbranding: 1,
      enablejsapi: 1,
      ...(origin ? { origin } : {}),
    },
  }

  return (
    <div className="w-full bg-black">
      <div className="w-full aspect-video max-h-[70vh] relative">
        <YouTube
          key={videoId}
          videoId={videoId}
          title={title || 'Lecture video'}
          className="absolute inset-0 w-full h-full [&>div]:!w-full [&>div]:!h-full [&_iframe]:absolute [&_iframe]:inset-0 [&_iframe]:w-full [&_iframe]:h-full"
          opts={opts}
          onReady={onReady}
          onPlaybackQualityChange={onPlaybackQualityChange}
          onPlaybackRateChange={onPlaybackRateChange}
        />
      </div>

      <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-3 px-3 py-2.5 bg-gray-900 text-gray-100 text-sm border-t border-gray-800">
        <div className="flex items-center gap-2 min-w-0">
          <Gauge className="w-4 h-4 text-cyan-400 flex-shrink-0" aria-hidden />
          <label htmlFor={`yt-speed-${videoId}`} className="text-gray-400 whitespace-nowrap">
            Speed
          </label>
          <select
            id={`yt-speed-${videoId}`}
            value={playbackRate}
            onChange={(e) => applyRate(parseFloat(e.target.value) || 1)}
            className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent max-w-[8rem]"
          >
            {RATE_PRESETS.map((r) => (
              <option key={r} value={r}>
                {r === 1 ? 'Normal (1×)' : `${r}×`}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-2 min-w-0 flex-1 sm:flex-initial">
          <MonitorPlay className="w-4 h-4 text-cyan-400 flex-shrink-0" aria-hidden />
          <label htmlFor={`yt-quality-${videoId}`} className="text-gray-400 whitespace-nowrap">
            Quality
          </label>
          <select
            id={`yt-quality-${videoId}`}
            value={
              qualityLevels.length && qualityLevels.includes(playbackQuality)
                ? playbackQuality
                : 'default'
            }
            onChange={(e) => {
              const v = e.target.value
              if (v === 'default') applyQuality('default')
              else applyQuality(v)
            }}
            className="bg-gray-800 border border-gray-700 rounded-md px-2 py-1.5 text-white text-sm focus:ring-2 focus:ring-cyan-600 focus:border-transparent min-w-0 flex-1 sm:max-w-[14rem]"
          >
            <option value="default">{formatQuality('default')}</option>
            {qualityLevels.map((q) => (
              <option key={q} value={q}>
                {formatQuality(q)}
              </option>
            ))}
          </select>
        </div>

        <p className="text-xs text-gray-500 sm:ml-auto">
          Quality follows YouTube and your connection; we send a preference to the player.
        </p>
      </div>
    </div>
  )
}
