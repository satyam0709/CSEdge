import axios from "axios";
import { viteConfiguredApiBase } from "./viteApiBaseUrl.js";

// Use VITE_API_URL or VITE_BACKEND_URL when set. Otherwise:
// - during local dev default to http://localhost:5000
// - in production use a relative URL (same-origin API / reverse proxy).
let baseURL = viteConfiguredApiBase();

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
  // Clerk auth uses Bearer tokens, not cross-site cookies — omitting credentials
  // avoids requiring Access-Control-Allow-Credentials on the API (fixes CORS with split Vercel/Render).
  withCredentials: false,
  timeout: 10000,
});

export default instance;
