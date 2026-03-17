const API_BASE_URL = '/api/books';

async function handleResponse(response) {
  if (!response.ok) {
    const errObj = await response.json().catch(() => ({ message: 'Unknown error' }));
    const errorMsg = errObj?.error?.message || errObj.message || errObj.error || `HTTP error ${response.status}`;
    throw new Error(errorMsg);
  }
  return response.json();
}

export const booksApi = {
  async getBooks() {
    const res = await fetch(API_BASE_URL);
    return handleResponse(res);
  },

  async uploadBook(formData, token) {
    const res = await fetch(`${API_BASE_URL}/upload`, {
      method: 'POST',
      headers: { 
        Authorization: `Bearer ${token}`
        // Don't set Content-Type, let the browser set it for FormData
      },
      body: formData
    });
    return handleResponse(res);
  },

  async deleteBook(id, token) {
    const res = await fetch(`${API_BASE_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  }
};

export default booksApi;
