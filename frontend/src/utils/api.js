import { getToken, clearSession } from './session';

// Centralized fetch wrapper for student pages
// - Always returns an object: { data, error, status }
// - Attaches Authorization header when token is present
// - On 401/403 it clears the session (forces logout)
// - On network or other errors returns an error message but does not throw

const _loggedErrors = new Set();

function _logErrorOnce(key, value) {
  if (!_loggedErrors.has(key)) {
    _loggedErrors.add(key);
    console.error(value);
  }
}

export async function fetchJSON(url, options = {}) {
  const token = getToken();
  const opt = { ...options };
  opt.headers = {
    'Content-Type': 'application/json',
    ...(opt.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };

  let res;
  try {
    res = await fetch(url, opt);
  } catch (e) {
    const message = 'Unable to reach the server. Please check your connection.';
    _logErrorOnce('network:' + message, e);
    return { data: null, error: message, status: 0 };
  }

  // If unauthorized, clear session so app can redirect to login
  if (res.status === 401 || res.status === 403) {
    _logErrorOnce('auth:' + res.status, `Auth failed with status ${res.status} for ${url}`);
    clearSession();
    return { data: null, error: 'Unauthorized', status: res.status };
  }

  // Try to parse JSON. Some endpoints may return empty 204
  let payload = null;
  try {
    // attempt to parse JSON; if empty body, this will throw and we treat as null
    payload = await res.json();
  } catch (e) {
    // Non-JSON or empty body
    payload = null;
  }

  if (!res.ok) {
    const message = (payload && (payload.detail || payload.message)) || res.statusText || `HTTP ${res.status}`;
    _logErrorOnce('http:' + url + ':' + (message || res.status), `Request ${url} failed: ${message}`);
    return { data: null, error: message || `HTTP ${res.status}`, status: res.status };
  }

  // Successful response (may be null for empty 204 responses)
  // Log the response once for debugging
  _logErrorOnce('resp:' + url + ':' + (res.status || 200), `Response ${url} status=${res.status}; payload=${JSON.stringify(payload)}`);

  return { data: payload === undefined ? null : payload, error: null, status: res.status };
}
