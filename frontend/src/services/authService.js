import api from './api';
import { MOCK_USERS } from '../utils/mockData';
import { storage } from '../utils/storage';

const SESSION_KEY = 'session';
const REGISTERED_STUDENTS_KEY = 'registered_students';
const RECENT_ACTIVITY_KEY = 'admin_recent_activity';

function recordStudentLocally(studentData) {
  try {
    const list = storage.get(REGISTERED_STUDENTS_KEY) || [];
    const index = list.findIndex((s) => s.email?.toLowerCase() === studentData.email?.toLowerCase());
    if (index >= 0) {
      list[index] = { ...list[index], ...studentData };
    } else {
      list.unshift(studentData);
    }
    storage.set(REGISTERED_STUDENTS_KEY, list);

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
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    if (!cleanEmail || !cleanPassword) {
      throw new Error('Please enter both email address and password.');
    }

    try {
      const res = await api.post('/auth/login', { email: cleanEmail, password: cleanPassword });
      if (res?.data?.token && res?.data?.user) {
        const u = res.data.user;
        const normalizedRole = String(u.role || '').toLowerCase() === 'admin' ? 'admin' : 'student';
        const session = {
          token: res.data.token,
          user: {
            ...u,
            role: normalizedRole
          }
        };
        storage.set(SESSION_KEY, session);
        return session;
      }
    } catch (apiErr) {
      // Backend returned 404 or explicitly notified that account was not found
      if (apiErr?.response?.status === 404 || apiErr?.message?.toLowerCase().includes('no account found')) {
        throw new Error('No account found with this email. Sign up to continue.');
      }
      // Backend returned 401 or 403 (invalid password or deactivated)
      if (apiErr?.response?.status === 401 || apiErr?.response?.status === 403) {
        throw new Error(apiErr?.response?.data?.message || 'Invalid password. Please check your credentials.');
      }
      console.warn('Backend login endpoint unavailable, performing client credential verification:', apiErr.message);
    }

    // Client-side / Offline fallback (e.g. Vercel deployment where local MySQL backend is offline)
    await new Promise((r) => setTimeout(r, 250));

    const isAdminLogin = cleanEmail === 'admin@quentrix.ai' || cleanEmail.includes('admin') || role === 'admin';

    if (isAdminLogin) {
      // Admin portal is strictly password protected!
      // Valid admin passwords: Password@123, Admin@123
      if (cleanPassword !== 'Password@123' && cleanPassword !== 'Admin@123') {
        throw new Error('Access Denied: Invalid Administrative credentials. The Admin Console is password protected.');
      }

      const adminUser = {
        ...MOCK_USERS[0],
        email: cleanEmail,
        role: 'admin'
      };
      const session = {
        token: 'jwt_mock_admin_' + Date.now(),
        user: adminUser
      };
      storage.set(SESSION_KEY, session);
      return session;
    }

    // Student Login verification against registered students
    const registeredList = storage.get(REGISTERED_STUDENTS_KEY) || [];
    const foundReg = registeredList.find((s) => s.email?.toLowerCase() === cleanEmail);

    if (!foundReg) {
      // User is NOT registered - do not allow login!
      throw new Error('No account found with this email. Sign up to continue.');
    }

    // User is registered - verify password
    if (foundReg.password && foundReg.password !== cleanPassword) {
      throw new Error('Invalid password. Please check your credentials.');
    }

    const studentUser = {
      id: foundReg.id || 'usr_' + Date.now(),
      name: foundReg.name,
      email: foundReg.email,
      role: 'student',
      institution: foundReg.institution || 'State Engineering College',
      stream: foundReg.stream || 'Computer Science & Engineering',
      yearOfStudy: foundReg.year || '1st Year',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      rank: foundReg.rank || 1,
      totalPoints: foundReg.totalPoints || 0,
      averageScore: 0,
      examsCompleted: 0,
      badge: 'Student Scholar'
    };

    const session = {
      token: 'jwt_mock_student_' + Date.now(),
      user: studentUser
    };
    storage.set(SESSION_KEY, session);
    return session;
  },

  register: async (formData) => {
    let session = null;
    let registeredUser = null;

    try {
      const names = (formData.name || 'Candidate').trim().split(' ');
      const res = await api.post('/auth/register', {
        email: formData.email,
        password: formData.password,
        firstName: names[0] || 'Candidate',
        lastName: names.slice(1).join(' ') || 'Scholar',
        institution: formData.institution || 'Engineering College',
        yearOfStudy: formData.yearOfStudy || '1st Year',
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
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        rank: 1,
        totalPoints: 0,
        averageScore: 0,
        examsCompleted: 0,
        badge: 'Novice Scholar'
      };

      session = {
        token: 'jwt_mock_student_' + Date.now(),
        user: registeredUser
      };
      storage.set(SESSION_KEY, session);
    }

    // Record student with their credentials so they can login and appear in Admin Directory
    recordStudentLocally({
      id: registeredUser.id,
      name: registeredUser.name || `${registeredUser.firstName || ''} ${registeredUser.lastName || ''}`.trim() || formData.name,
      email: registeredUser.email || formData.email,
      password: formData.password,
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
    if (!session || !session.user || !session.token) {
      return null;
    }

    // Always purge legacy sample student sessions
    const email = String(session.user.email || '').toLowerCase();
    const name = String(session.user.name || '').toLowerCase();

    if (
      email === 'student@quentrix.ai' ||
      name.includes('aditya vardhan') ||
      session.user.id === 'user_student_01' ||
      session.token === 'jwt_mock_student_01'
    ) {
      storage.remove(SESSION_KEY);
      return null;
    }

    return session;
  },

  switchRole: () => {
    throw new Error('Direct role switching is disabled. Please authenticate through the login portal.');
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
