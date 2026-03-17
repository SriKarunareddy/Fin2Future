const MODULES_URL = '/api/modules';
const LESSONS_URL = '/api/lessons';

async function handleResponse(response) {
  if (!response.ok) {
    const errObj = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errObj.message || `HTTP error ${response.status}`);
  }
  return response.json();
}

export const learningApi = {
  // Modules
  async getModules() {
    const res = await fetch(MODULES_URL);
    return handleResponse(res);
  },
  async getModule(id) {
    const res = await fetch(`${MODULES_URL}/${id}`);
    return handleResponse(res);
  },
  async createModule(data, token) {
    const res = await fetch(MODULES_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async updateModule(id, data, token) {
    const res = await fetch(`${MODULES_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async deleteModule(id, token) {
    const res = await fetch(`${MODULES_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  },

  // Lessons
  async getLesson(id, token) {
    const res = await fetch(`${LESSONS_URL}/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  },
  async createLesson(data, token) {
    const res = await fetch(LESSONS_URL, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async updateLesson(id, data, token) {
    const res = await fetch(`${LESSONS_URL}/${id}`, {
      method: 'PUT',
      headers: { 
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}` 
      },
      body: JSON.stringify(data)
    });
    return handleResponse(res);
  },
  async deleteLesson(id, token) {
    const res = await fetch(`${LESSONS_URL}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    });
    return handleResponse(res);
  }
};

export default learningApi;
