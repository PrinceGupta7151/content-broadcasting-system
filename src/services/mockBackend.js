import { getToken, setToken, removeToken, getUser, setUser, removeUser } from '../utils/storage';

const STORAGE_KEY = 'content_broadcasting_state';

const getInitialState = () => ({
  users: [
    {
      id: 'teacher-1',
      name: 'Teacher One',
      email: 'teacher@test.com',
      password: '123456',
      role: 'teacher',
    },
    {
      id: 'principal-1',
      name: 'Principal One',
      email: 'principal@test.com',
      password: '123456',
      role: 'principal',
    },
  ],
  tokens: {},
  contents: [
    {
      id: 'content-1',
      title: 'Math Lesson 1',
      subject: 'Mathematics',
      description: 'Introductory lesson on algebraic expressions.',
      teacherId: 'teacher-1',
      teacherName: 'Teacher One',
      status: 'approved',
      rejectionReason: '',
      fileUrl: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&w=800&q=80',
      startTime: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 2).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
      rotationDuration: 30,
    },
    {
      id: 'content-2',
      title: 'Science Experiment',
      subject: 'Science',
      description: 'A live experiment demonstration for science class.',
      teacherId: 'teacher-1',
      teacherName: 'Teacher One',
      status: 'pending',
      rejectionReason: '',
      fileUrl: 'https://images.unsplash.com/photo-1581093448798-86a14fa71d0b?auto=format&fit=crop&w=800&q=80',
      startTime: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      endTime: new Date(Date.now() + 1000 * 60 * 60 * 3).toISOString(),
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      rotationDuration: 45,
    },
  ],
});

const loadState = () => {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    const initialState = getInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }

  try {
    const state = JSON.parse(raw);

    const migratedUsers = state.users.map((user) => {
      if (user.id === 'teacher-1') {
        return { ...user, email: 'teacher@test.com', password: '123456' };
      }
      if (user.id === 'principal-1') {
        return { ...user, email: 'principal@test.com', password: '123456' };
      }
      return user;
    });

    const migratedState = { ...state, users: migratedUsers };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(migratedState));
    return migratedState;
  } catch (error) {
    const initialState = getInitialState();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialState));
    return initialState;
  }
};

const saveState = (state) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const delay = (ms = 350) =>
  new Promise((resolve) => {
    setTimeout(resolve, ms);
  });

const getCurrentUser = () => {
  const token = getToken();
  if (!token) return null;

  const state = loadState();
  const userId = state.tokens[token];
  if (!userId) return null;
  return state.users.find((user) => user.id === userId) || null;
};

const mockBackend = {
  login: async (email, password) => {
    await delay();
    const state = loadState();
    const user = state.users.find(
      (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password
    );

    if (!user) {
      throw { message: 'Invalid email or password' };
    }

    const token = `mock-token-${Math.random().toString(36).slice(2, 12)}`;
    state.tokens[token] = user.id;
    saveState(state);
    setToken(token);
    setUser({ id: user.id, name: user.name, email: user.email, role: user.role });
    return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  verifyToken: async () => {
    await delay();
    const user = getCurrentUser();
    if (!user) {
      throw { message: 'Invalid or expired token' };
    }
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role } };
  },

  logout: async () => {
    await delay();
    const token = getToken();
    const state = loadState();
    if (token) {
      delete state.tokens[token];
      saveState(state);
    }
    removeToken();
    removeUser();
    return {};
  },

  getTeacherContent: async () => {
    await delay();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw { message: 'Unauthorized' };
    }

    const state = loadState();
    return state.contents
      .filter((item) => item.teacherId === currentUser.id)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getAllContent: async ({ status, search } = {}) => {
    await delay();
    const state = loadState();
    return state.contents
      .filter((item) => {
        const matchesStatus = !status || status === 'all' || item.status === status;
        const matchesSearch = !search ||
          item.title.toLowerCase().includes(search.toLowerCase()) ||
          item.subject.toLowerCase().includes(search.toLowerCase()) ||
          item.teacherName.toLowerCase().includes(search.toLowerCase());
        return matchesStatus && matchesSearch;
      })
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  getLiveContent: async (teacherId) => {
    await delay();
    const state = loadState();
    const now = new Date();
    const activeContent = state.contents.find((item) =>
      item.teacherId === teacherId &&
      new Date(item.startTime) <= now &&
      new Date(item.endTime) >= now &&
      item.status === 'approved'
    );

    return activeContent || null;
  },

  uploadContent: async (formData) => {
    await delay();
    const currentUser = getCurrentUser();
    if (!currentUser) {
      throw { message: 'Unauthorized' };
    }

    const file = formData.get('file');
    const title = formData.get('title');
    const subject = formData.get('subject');
    const description = formData.get('description');
    const startTime = formData.get('startTime');
    const endTime = formData.get('endTime');
    const rotationDuration = Number(formData.get('rotationDuration') || 0);

    const state = loadState();

    const newContent = {
      id: `content-${Date.now()}`,
      title,
      subject,
      description,
      teacherId: currentUser.id,
      teacherName: currentUser.name,
      status: 'pending',
      rejectionReason: '',
      fileUrl: file instanceof File
        ? URL.createObjectURL(file)
        : 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80',
      startTime,
      endTime,
      createdAt: new Date().toISOString(),
      rotationDuration,
    };

    state.contents.unshift(newContent);
    saveState(state);
    return newContent;
  },

  getPendingApprovals: async () => {
    await delay();
    const state = loadState();
    return state.contents
      .filter((item) => item.status === 'pending')
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },

  approveContent: async (contentId) => {
    await delay();
    const state = loadState();
    const item = state.contents.find((entry) => entry.id === contentId);
    if (!item) {
      throw { message: 'Content not found' };
    }
    item.status = 'approved';
    item.rejectionReason = '';
    saveState(state);
    return item;
  },

  rejectContent: async (contentId, reason) => {
    await delay();
    const state = loadState();
    const item = state.contents.find((entry) => entry.id === contentId);
    if (!item) {
      throw { message: 'Content not found' };
    }
    item.status = 'rejected';
    item.rejectionReason = reason;
    saveState(state);
    return item;
  },

  getApprovalStats: async () => {
    await delay();
    const state = loadState();
    const total = state.contents.length;
    const pending = state.contents.filter((item) => item.status === 'pending').length;
    const approved = state.contents.filter((item) => item.status === 'approved').length;
    const rejected = state.contents.filter((item) => item.status === 'rejected').length;

    return { total, pending, approved, rejected };
  },
};

export default mockBackend;
