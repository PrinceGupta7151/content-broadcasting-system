import api from './api';
import mockBackend from './mockBackend';

const useMock = !process.env.REACT_APP_API_URL || process.env.REACT_APP_USE_MOCK_API === 'true';

const approvalService = {
  getApprovalStats: async () => {
    if (useMock) {
      return mockBackend.getApprovalStats();
    }

    const response = await api.get('/approvals/stats');
    return response.data;
  },

  getPendingApprovals: async () => {
    if (useMock) {
      return mockBackend.getPendingApprovals();
    }

    const response = await api.get('/approvals/pending');
    return response.data;
  },

  approveContent: async (contentId, feedback) => {
    if (useMock) {
      return mockBackend.approveContent(contentId, feedback);
    }

    const response = await api.post(`/approvals/${contentId}/approve`, { feedback });
    return response.data;
  },

  rejectContent: async (contentId, feedback) => {
    if (useMock) {
      return mockBackend.rejectContent(contentId, feedback);
    }

    const response = await api.post(`/approvals/${contentId}/reject`, { feedback });
    return response.data;
  },

  getAllContent: async () => {
    if (useMock) {
      return mockBackend.getAllContent();
    }

    const response = await api.get('/content');
    return response.data;
  }
};

export default approvalService;