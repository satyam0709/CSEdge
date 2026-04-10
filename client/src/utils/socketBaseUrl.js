/**
 * Base URL for Socket.io (same host as REST API in production).
 * Optional: VITE_SOCKET_URL if the socket server differs from VITE_API_URL.
 */
export function getSocketBaseUrl() {
  const explicit = import.meta.env.VITE_SOCKET_URL?.replace(/\/$/, '')
  if (explicit) return explicit

  let base = import.meta.env.VITE_API_URL
  if (!base) {
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      return 'http://localhost:5000'
    }
    return typeof window !== 'undefined' ? window.location.origin : ''
  }
  return base.replace(/\/$/, '')
}
