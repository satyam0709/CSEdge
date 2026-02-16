import axios from "axios";

// Use explicit VITE_API_URL when provided (in dev or CI/CD). Otherwise:
// - during local dev default to http://localhost:5000
// - in production (no VITE_API_URL) use a relative URL so requests go to the
//   same host that served the frontend (useful when backend is proxied or
//   deployed under the same domain). This avoids failing calls to localhost
//   from the deployed frontend when environment variables weren't set.
let baseURL = import.meta.env.VITE_API_URL;

try {
  if (!baseURL) {
    // runtime check: if running locally, point to localhost backend
    if (typeof window !== 'undefined' && window.location.hostname.includes('localhost')) {
      baseURL = 'http://localhost:5000';
    } else {
      // production: use relative path so browser calls same origin
      baseURL = '';
    }
  }
} catch (e) {
  baseURL = baseURL || '';
}

const instance = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 10000,
});

export default instance;
