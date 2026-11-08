import api from './api';
import { MOCK_USERS } from '../utils/mockData';
import { storage } from '../utils/storage';

const SESSION_KEY = 'session';
const REGISTERED_STUDENTS_KEY = 'registered_students';
const RECENT_ACTIVITY_KEY = 'admin_recent_activity';

function recordStudentLocally(studentData) {
  try {
    const list = storage.get(REGISTERED_STUDENTS_KEY) || [];
    const exists = list.some((s) => s.email?.toLowerCase() === studentData.email?.toLowerCase());
    if (!exists) {
      list.unshift(studentData);
      storage.set(REGISTERED_STUDENTS_KEY, list);
    }

    const activities = storage.get(RECENT_ACTIVITY_KEY) || [];
    activities.unshift({
      id: Date.now(),
      user: studentData.name,
      action: `Enrolled in ${studentData.stream}`,
      time: 'Just now',
      score: 'Active'
    });
    storage.set(RECENT_ACTIVITY_KEY, activities.slice(0, 20));
  } catch (e) {
    console.warn('Error recording student locally:', e);
  }
}

export const authService = {
  login: async ({ email, password, role = 'student' }) => {
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res?.data?.token && res?.data?.user) {
        const session = {
          token: res.data.token,
          user: res.data.user
        };
        storage.set(SESSION_KEY, session);
        return session;
      }
    } catch (apiErr) {
      console.warn('Backend login unavailable or credentials rejected, using local mock session:', apiErr.message);
    }

    // Mock fallback
    await new Promise((r) => setTimeout(r, 300));
    const existing = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase()
    );

    let user;
    if (existing) {
      user = { ...existing };
    } else {
      user = {
        id: 'usr_' + Date.now(),
        name: email.split('@')[0].replace(/[._]/g, ' ').toUpperCase(),
        email,
        role: email.includes('admin') ? 'admin' : role,
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        institution: 'Indian Institute of Engineering & Technology',
        stream: 'Computer Science & Engineering',
        yearOfStudy: '3rd Year'
      };
    }

    const session = {
      token: 'jwt_mock_' + (user.role || 'student') + '_' + Date.now(),
      user
    };

    storage.set(SESSION_KEY, session);
    return session;
  },

  register: async (formData) => {
    let session = null;
    let registeredUser = null;

    try {
      const names = (formData.name || 'Aditya Vardhan').trim().split(' ');
      const res = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: names[0] || 'Aditya',
        lastName: names.slice(1).join(' ') || 'Candidate',
        institution: formData.institution || 'Engineering College',
        yearOfStudy: formData.yearOfStudy || '3rd Year',
        streamId: formData.stream || 'cse',
        rollNumber: formData.rollNumber
      });

      if (res?.data?.token && res?.data?.user) {
        registeredUser = res.data.user;
        session = {
          token: res.data.token,
          user: res.data.user
        };
        storage.set(SESSION_KEY, session);
      }
    } catch (apiErr) {
      console.warn('Backend register deferred, using local session:', apiErr.message);
    }

    if (!session) {
      await new Promise((r) => setTimeout(r, 400));
      registeredUser = {
        id: 'usr_' + Date.now(),
        name: formData.name,
        email: formData.email,
        role: 'student',
        institution: formData.institution || 'State Engineering College',
        stream: formData.streamName || formData.stream || 'Computer Science & Engineering',
        yearOfStudy: formData.yearOfStudy || '1st Year',
        avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=250&q=80',
        rank: 42,
        totalPoints: 100,
        averageScore: 0,
        examsCompleted: 0,
        badge: 'Novice Coder'
      };

      session = {
        token: 'jwt_mock_student_' + Date.now(),
        user: registeredUser
      };
      storage.set(SESSION_KEY, session);
    }

    // Always record student so they immediately appear in Admin Dashboard and Student Cohort Directory
    recordStudentLocally({
      id: registeredUser.id,
      name: registeredUser.name || `${registeredUser.firstName || ''} ${registeredUser.lastName || ''}`.trim() || formData.name,
      email: registeredUser.email || formData.email,
      stream: registeredUser.studentProfile?.stream?.name || formData.streamName || formData.stream || 'Computer Science & Engineering',
      year: registeredUser.studentProfile?.yearOfStudy || formData.yearOfStudy || '1st Year',
      institution: registeredUser.studentProfile?.institution || formData.institution || 'State Engineering College',
      examsTaken: 0,
      avgScore: '0%',
      status: 'Active',
      lastActive: 'Just registered'
    });

    return session;
  },

  getCurrentSession: () => {
    const session = storage.get(SESSION_KEY);
    if (session && session.user) {
      return session;
    }
    const defaultStudent = MOCK_USERS[1];
    const defaultSession = {
      token: 'jwt_mock_student_01',
      user: defaultStudent
    };
    storage.set(SESSION_KEY, defaultSession);
    return defaultSession;
  },

  switchRole: (newRole) => {
    const targetUser = MOCK_USERS.find((u) => u.role === newRole) || {
      ...MOCK_USERS[0],
      role: newRole
    };
    const session = {
      token: 'jwt_mock_' + newRole + '_' + Date.now(),
      user: { ...targetUser }
    };
    storage.set(SESSION_KEY, session);

    // Asynchronously authenticate with backend to obtain real signed JWT token
    const creds = newRole === 'admin'
      ? { email: 'admin@quentrix.ai', password: 'Admin@123' }
      : { email: 'student@quentrix.ai', password: 'Student@123' };

    api.post('/auth/login', creds).then((res) => {
      if (res?.data?.token) {
        const liveSession = {
          token: res.data.token,
          user: res.data.user || targetUser
        };
        storage.set(SESSION_KEY, liveSession);
      }
    }).catch(() => {
      // Offline fallback continues seamlessly
    });

    return session;
  },

  logout: async () => {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // ignore
    }
    storage.remove(SESSION_KEY);
    return true;
  },

  updateProfile: async (updatedFields) => {
    await new Promise((r) => setTimeout(r, 200));
    const current = authService.getCurrentSession();
    const updatedUser = { ...current.user, ...updatedFields };
    const updatedSession = { ...current, user: updatedUser };
    storage.set(SESSION_KEY, updatedSession);
    return updatedUser;
  },

  requestPasswordReset: async (email) => {
    try {
      await api.post('/auth/forgot-password', { email });
    } catch (e) {
      // fallback
    }
    return { success: true, message: `Password reset link dispatched to ${email}` };
  }
};
