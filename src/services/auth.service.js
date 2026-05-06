import api from './api';
import mockBackend from './mockBackend';

const useMock = !process.env.REACT_APP_API_URL || process.env.REACT_APP_USE_MOCK_API === 'true';

const authService = {
  login: async (email, password) => {
    if (useMock) {
      return mockBackend.login(email, password);
    }

    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Login failed' };
    }
  },

  logout: async () => {
    if (useMock) {
      return mockBackend.logout();
    }

    try {
      await api.post('/auth/logout');
    } catch (error) {
      console.error('Logout error:', error);
    }
  },

  verifyToken: async () => {
    if (useMock) {
      return mockBackend.verifyToken();
    }

    try {
      const response = await api.get('/auth/verify');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Token verification failed' };
    }
  },
};

export default authService;