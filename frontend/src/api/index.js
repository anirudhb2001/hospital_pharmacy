// Central Axios wrapper for all hospital_pharmacy API calls
import axios from 'axios';

export const api = axios.create({
  baseURL: '/',
  withCredentials: true,
  headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const csrf = window.csrf_token;
  if (csrf && csrf !== 'undefined') config.headers['X-Frappe-CSRF-Token'] = csrf;
  return config;
});

// Parse nested Frappe server messages for readable errors
export function parseFrappeError(error) {
  try {
    const msgs = JSON.parse(error.response?.data?._server_messages || '[]');
    if (msgs.length) return JSON.parse(msgs[0]).message;
  } catch (_) { /**/ }
  return error.response?.data?.exc_type || error.message || 'Something went wrong.';
}

// Convenience wrapper around Frappe's whitelisted method endpoint
export async function callMethod(method, params = {}) {
  const { data } = await api.post(`/api/method/${method}`, params);
  return data.message;
}
