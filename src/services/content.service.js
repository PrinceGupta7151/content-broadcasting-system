import api from './api';
import mockBackend from './mockBackend';

const useMock = !process.env.REACT_APP_API_URL || process.env.REACT_APP_USE_MOCK_API === 'true';

const contentService = {
  // Teacher endpoints
  uploadContent: async (formData) => {
    if (useMock) {
      return mockBackend.uploadContent(formData);
    }

    try {
      const response = await api.post('/content/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Upload failed' };
    }
  },

  getTeacherContent: async (params = {}) => {
    if (useMock) {
      return mockBackend.getTeacherContent(params);
    }

    try {
      const response = await api.get('/content/teacher', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  getContentById: async (id) => {
    if (useMock) {
      const state = mockBackend.getState?.();
      const item = state?.contents?.find((content) => content.id === id);
      if (!item) {
        throw { message: 'Content not found' };
      }
      return item;
    }

    try {
      const response = await api.get(`/content/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  // Principal endpoints
  getAllContent: async (params = {}) => {
    if (useMock) {
      return mockBackend.getAllContent(params);
    }

    try {
      const response = await api.get('/content/all', { params });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch content' };
    }
  },

  // Public endpoints
  getLiveContent: async (teacherId) => {
    if (useMock) {
      return mockBackend.getLiveContent(teacherId);
    }

    try {
      const response = await api.get(`/content/live/${teacherId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch live content' };
    }
  },
};

export default contentService;