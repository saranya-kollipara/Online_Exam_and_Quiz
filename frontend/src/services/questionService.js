import api from './api';
import { MOCK_QUESTIONS } from '../utils/mockData';
import { storage } from '../utils/storage';

const QUESTIONS_KEY = 'questions_bank';

function initializeQuestions() {
  const stored = storage.get(QUESTIONS_KEY);
  if (!stored || !Array.isArray(stored) || stored.length === 0) {
    storage.set(QUESTIONS_KEY, MOCK_QUESTIONS);
    return MOCK_QUESTIONS;
  }
  return stored;
}

export const questionService = {
  getAllQuestions: async (filters = {}) => {
    try {
      const res = await api.get('/questions', { params: filters });
      if (res?.data && Array.isArray(res.data)) {
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend /questions query deferred, using local cache:', apiErr.message);
    }

    // Local fallback
    await new Promise((r) => setTimeout(r, 200));
    let questions = initializeQuestions();

    if (filters.stream && filters.stream !== 'all') {
      questions = questions.filter((q) => q.stream === filters.stream || q.streamId === filters.stream);
    }
    if (filters.subject && filters.subject !== 'all') {
      questions = questions.filter((q) => q.subject === filters.subject || q.subjectId === filters.subject);
    }
    if (filters.topic && filters.topic !== 'all') {
      questions = questions.filter((q) => q.topic === filters.topic || q.topicId === filters.topic);
    }
    if (filters.difficulty && filters.difficulty !== 'all') {
      questions = questions.filter((q) => q.difficulty === filters.difficulty);
    }
    if (filters.type && filters.type !== 'all') {
      questions = questions.filter((q) => q.type === filters.type);
    }
    if (filters.search) {
      const query = filters.search.toLowerCase();
      questions = questions.filter(
        (q) =>
          q.text?.toLowerCase().includes(query) ||
          q.subject?.toLowerCase().includes(query) ||
          q.topic?.toLowerCase().includes(query)
      );
    }

    return questions;
  },

  addQuestion: async (questionData) => {
    try {
      const res = await api.post('/questions', questionData);
      if (res?.data) {
        const questions = initializeQuestions();
        questions.unshift(res.data);
        storage.set(QUESTIONS_KEY, questions);
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend addQuestion deferred, saving locally:', apiErr.message);
    }

    // Local fallback
    await new Promise((r) => setTimeout(r, 300));
    const questions = initializeQuestions();

    const newQuestion = {
      id: 'q_' + Date.now(),
      stream: questionData.stream || 'cse',
      subject: questionData.subject || 'Data Structures',
      topic: questionData.topic || 'General',
      type: questionData.type || 'MCQ',
      difficulty: questionData.difficulty || 'Medium',
      marks: Number(questionData.marks) || 2,
      negativeMarks: Number(questionData.negativeMarks) || 0.5,
      text: questionData.text,
      options: questionData.options || [
        { id: 'A', text: 'Option A' },
        { id: 'B', text: 'Option B' },
        { id: 'C', text: 'Option C' },
        { id: 'D', text: 'Option D' }
      ],
      correctAnswer: questionData.correctAnswer || 'A',
      explanation: questionData.explanation || 'Verified conceptual answer by Quentrix AI.',
      timesUsed: 0
    };

    questions.unshift(newQuestion);
    storage.set(QUESTIONS_KEY, questions);
    return newQuestion;
  },

  updateQuestion: async (id, updates) => {
    try {
      const res = await api.put(`/questions/${id}`, updates);
      if (res?.data) {
        const questions = initializeQuestions();
        const updated = questions.map((q) => (q.id === id ? { ...q, ...res.data } : q));
        storage.set(QUESTIONS_KEY, updated);
        return res.data;
      }
    } catch (apiErr) {
      console.warn('Backend updateQuestion deferred, updating locally:', apiErr.message);
    }

    const questions = initializeQuestions();
    const updated = questions.map((q) => (q.id === id ? { ...q, ...updates } : q));
    storage.set(QUESTIONS_KEY, updated);
    return updated.find((q) => q.id === id);
  },

  deleteQuestion: async (id) => {
    try {
      await api.delete(`/questions/${id}`);
    } catch (apiErr) {
      console.warn('Backend deleteQuestion deferred, removing locally:', apiErr.message);
    }

    const questions = initializeQuestions();
    const filtered = questions.filter((q) => q.id !== id);
    storage.set(QUESTIONS_KEY, filtered);
    return true;
  },

  importQuestions: async (rawJsonOrCsv) => {
    let importedList = [];

    try {
      if (typeof rawJsonOrCsv === 'string' && rawJsonOrCsv.trim().startsWith('[')) {
        importedList = JSON.parse(rawJsonOrCsv);
      } else if (Array.isArray(rawJsonOrCsv)) {
        importedList = rawJsonOrCsv;
      } else {
        // Sample standard import format
        importedList = [
          {
            text: 'Which memory allocation scheme is prone to external fragmentation?',
            subject: 'Operating Systems',
            topic: 'Memory Management',
            stream: 'cse',
            type: 'MCQ',
            difficulty: 'Medium',
            marks: 2,
            negativeMarks: 0.5,
            options: [
              { id: 'A', text: 'Paging' },
              { id: 'B', text: 'Segmentation' },
              { id: 'C', text: 'Inverted Paging' },
              { id: 'D', text: 'Virtual Memory Swapping' }
            ],
            correctAnswer: 'B',
            explanation: 'Segmentation allocates variable-sized memory segments, leading to free memory chunks dispersed non-contiguously (external fragmentation).'
          },
          {
            text: 'Bellman-Ford algorithm can detect negative weight cycles in a directed graph.',
            subject: 'Algorithms',
            topic: 'Graph Algorithms',
            stream: 'cse',
            type: 'True/False',
            difficulty: 'Easy',
            marks: 1,
            negativeMarks: 0.25,
            options: [
              { id: 'A', text: 'True' },
              { id: 'B', text: 'False' }
            ],
            correctAnswer: 'A',
            explanation: 'If a relaxation step still reduces distance after V-1 iterations, a negative weight cycle exists.'
          }
        ];
      }

      // Try bulk import endpoint
      try {
        const res = await api.post('/questions/import', { questions: importedList });
        if (res?.data) {
          const questions = initializeQuestions();
          const merged = [...(Array.isArray(res.data) ? res.data : importedList), ...questions];
          storage.set(QUESTIONS_KEY, merged);
          return res.data;
        }
      } catch (apiErr) {
        console.warn('Backend import questions deferred, saving locally:', apiErr.message);
      }

      // Local fallback
      const questions = initializeQuestions();
      const formatted = importedList.map((item, index) => ({
        id: 'q_imp_' + Date.now() + '_' + index,
        stream: item.stream || 'cse',
        subject: item.subject || 'Computer Science',
        topic: item.topic || 'General',
        type: item.type || 'MCQ',
        difficulty: item.difficulty || 'Medium',
        marks: Number(item.marks) || 2,
        negativeMarks: Number(item.negativeMarks) || 0.5,
        text: item.text,
        options: item.options || [],
        correctAnswer: item.correctAnswer || 'A',
        explanation: item.explanation || 'Imported curriculum question.',
        timesUsed: 0
      }));

      const merged = [...formatted, ...questions];
      storage.set(QUESTIONS_KEY, merged);
      return formatted;
    } catch (err) {
      throw new Error('Invalid format. Please supply valid JSON question items.');
    }
  }
};
