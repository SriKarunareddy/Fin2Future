const BASE_URL = '/api/gov';

async function handleResponse(response) {
  if (!response.ok) {
    const errObj = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errObj.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const govApi = {
  async getPosts() {
    const res = await fetch(`${BASE_URL}/posts`);
    return handleResponse(res);
  },
  async getGovData(token) {
    const res = await fetch(`${BASE_URL}/data`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  },
  async createPost(data, token) {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async deletePost(id, token) {
    const res = await fetch(`${BASE_URL}/posts/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  }
};

export default govApi;
