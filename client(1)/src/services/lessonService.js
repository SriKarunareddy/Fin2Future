import api from '../utils/api.js';

class LessonService {
  async getAllLessons(filters = {}) {
    const params = new URLSearchParams();
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    const response = await api.get(`/lessons?${params.toString()}`);
    return response.data.data;
  }

  async getLessonById(id) {
    const response = await api.get(`/lessons/${id}`);
    return response.data.data;
  }

  async searchLessons(searchTerm, filters = {}) {
    const params = new URLSearchParams();
    params.append('q', searchTerm);
    if (filters.category) {
      params.append('category', filters.category);
    }
    
    const response = await api.get(`/lessons/search?${params.toString()}`);
    return response.data.data;
  }

  async createLesson(lessonData) {
    const response = await api.post('/lessons', lessonData);
    return response.data.data;
  }

  async updateLesson(id, lessonData) {
    const response = await api.put(`/lessons/${id}`, lessonData);
    return response.data.data;
  }

  async deleteLesson(id) {
    const response = await api.delete(`/lessons/${id}`);
    return response.data;
  }
}

export default new LessonService();
