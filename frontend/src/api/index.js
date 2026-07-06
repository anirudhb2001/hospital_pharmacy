import axios from 'axios';

// Base Axios instance
export const api = axios.create({
  baseURL: '/',
  withCredentials: true, // Crucial for Frappe session cookies (sid)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Interceptor for handling CSRF or adding auth token if needed
api.interceptors.request.use((config) => {
  // Frappe automatically issues csrf_token cookie which we can extract if needed,
  // but generally Frappe allows API calls via session cookie out of the box for same-origin.
  if (window.csrf_token && window.csrf_token !== 'undefined') {
    config.headers['X-Frappe-CSRF-Token'] = window.csrf_token;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle global errors, e.g., 401 Unauthorized
    if (error.response && error.response.status === 401) {
      // Redirect to login or clear auth store
      console.warn('Unauthorized. Session might have expired.');
    }
    return Promise.reject(error);
  }
);
