// Authorization API client
// Handles signup, login, and fetching current user information.

const API_BASE_URL = '/api/auth';

async function handleResponse(response) {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(error.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const authApi = {
  async signup(email, password, name) {
    const res = await fetch(`${API_BASE_URL}/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name })
    });
    return handleResponse(res);
  },

  async login(email, password) {
    const res = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    return handleResponse(res);
  },

  async me(token) {
    const res = await fetch(`${API_BASE_URL}/me`, {
      method: 'GET',
      headers: { Authorization: token }
    });
    return handleResponse(res);
  }
};

export default authApi;
