import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const instance = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  timeout: 10000
});

export default instance;
