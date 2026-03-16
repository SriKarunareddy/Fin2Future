import api from '../utils/api.js';

class ProgressService {
  async startLesson(userId, lessonId) {
    const response = await api.post('/progress/start', { userId, lessonId });
    return response.data.data;
  }

  async updateProgress(userId, lessonId, progress) {
    const response = await api.post('/progress/update', { userId, lessonId, progress });
    return response.data.data;
  }

  async getUserProgress(userId) {
    const response = await api.get(`/progress/user/${userId}`);
    return response.data.data;
  }

  async getProgressStats(userId) {
    const response = await api.get(`/progress/stats/${userId}`);
    return response.data.data;
  }
}

export default new ProgressService();
