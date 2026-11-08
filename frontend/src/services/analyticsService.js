import api from './api';
import { MOCK_PERFORMANCE_ANALYTICS, MOCK_LEADERBOARD, MOCK_STUDENTS_LIST } from '../utils/mockData';
import { storage } from '../utils/storage';

const REGISTERED_STUDENTS_KEY = 'registered_students';
const RECENT_ACTIVITY_KEY = 'admin_recent_activity';

export const analyticsService = {
  getStudentAnalytics: async (studentId = 'user_student_01') => {
    try {
      const res = await api.get('/analytics/student');
      if (res?.data) {
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend student analytics deferred, using local computations:', apiErr.message);
    }

    // Local fallback
    await new Promise((r) => setTimeout(r, 200));
    const history = storage.get('exam_history') || [];
    const base = { ...MOCK_PERFORMANCE_ANALYTICS };

    if (history.length > 0) {
      const recent = history[0];
      base.recentExam = recent;
    }

    return base;
  },

  getAdminPlatformAnalytics: async () => {
    let apiData = null;
    try {
      const res = await api.get('/analytics/admin');
      if (res?.data) {
        apiData = res.data;
      }
    } catch (apiErr) {
      console.warn('Backend admin platform analytics deferred, using local computations:', apiErr.message);
    }

    const localRegistered = storage.get(REGISTERED_STUDENTS_KEY) || [];
    const exams = storage.get('exams_list') || [];
    const questions = storage.get('questions_bank') || [];
    const customActivities = storage.get(RECENT_ACTIVITY_KEY) || [];

    const defaultActivities = [
      { id: 1, user: 'Aditya Vardhan', action: 'Completed Data Structures Mid-Term', time: '12 mins ago', score: '90%' },
      { id: 2, user: 'Dr. Aris Thorne', action: 'Generated AI Questions for Examination', time: '45 mins ago', score: '-' },
      { id: 3, user: 'Ananya Sharma', action: 'Submitted Two Sum C++ Solution', time: '1 hour ago', score: '100%' },
      { id: 4, user: 'System', action: 'Automated Plagiarism & Anomaly Scan', time: '2 hours ago', score: 'Clean' }
    ];

    const mergedActivities = [...customActivities, ...(apiData?.recentActivity || defaultActivities)].slice(0, 10);

    const baseStudentCount = apiData?.totalStudents != null ? apiData.totalStudents : 1480;
    const totalStudents = baseStudentCount + localRegistered.length;

    return {
      ...(apiData || {}),
      totalStudents,
      activeStudentsNow: (apiData?.activeStudentsNow || 134) + localRegistered.length,
      totalExaminations: exams.length || apiData?.totalExaminations || 4,
      activeExaminations: exams.filter((e) => e.status === 'active').length || apiData?.activeExaminations || 2,
      upcomingExaminations: exams.filter((e) => e.status === 'upcoming').length || apiData?.upcomingExaminations || 1,
      totalQuestions: questions.length || apiData?.totalQuestions || 120,
      averagePassPercentage: apiData?.averagePassPercentage || 78.4,
      examParticipationRate: apiData?.examParticipationRate || '86.2%',
      subjectBreakdown: apiData?.subjectBreakdown || [
        { name: 'Data Structures', examsCount: 8, avgScore: 76.5, participants: 420 },
        { name: 'Algorithms', examsCount: 6, avgScore: 68.2, participants: 380 },
        { name: 'Operating Systems', examsCount: 5, avgScore: 82.4, participants: 310 },
        { name: 'DBMS', examsCount: 4, avgScore: 88.0, participants: 290 },
        { name: 'Web Technologies', examsCount: 7, avgScore: 74.3, participants: 350 }
      ],
      recentActivity: mergedActivities
    };
  },

  getLeaderboard: async ({ type = 'global', stream = 'all' } = {}) => {
    try {
      const res = await api.get('/leaderboard', { params: { type, stream } });
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend leaderboard deferred, using cached rankings:', apiErr.message);
    }

    await new Promise((r) => setTimeout(r, 200));
    let list = [...MOCK_LEADERBOARD];
    if (stream && stream !== 'all') {
      list = list.filter((item) => item.stream?.toLowerCase().includes(stream.toLowerCase()));
    }
    return list;
  },

  getStudentsList: async () => {
    let apiStudents = [];

    try {
      const res = await api.get('/admin/students');
      if (res?.data?.students && Array.isArray(res.data.students)) {
        apiStudents = res.data.students;
      } else if (Array.isArray(res?.data)) {
        apiStudents = res.data;
      }
    } catch (apiErr) {
      console.warn('Backend students list deferred, using local dataset:', apiErr.message);
    }

    const localRegistered = storage.get(REGISTERED_STUDENTS_KEY) || [];
    const baseList = apiStudents.length > 0 ? apiStudents : MOCK_STUDENTS_LIST;

    // Merge registered students at the top, avoiding duplicate emails
    const seenEmails = new Set();
    const merged = [];

    for (const student of [...localRegistered, ...baseList]) {
      const emailLower = student.email?.toLowerCase();
      if (emailLower && !seenEmails.has(emailLower)) {
        seenEmails.add(emailLower);
        merged.push(student);
      }
    }

    return merged;
  }
};
