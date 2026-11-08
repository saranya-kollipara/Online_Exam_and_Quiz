import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { examService } from '../services/examService';

const ExamContext = createContext(null);

export function ExamProvider({ children }) {
  const [exam, setExam] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { [qId]: value }
  const [markedForReview, setMarkedForReview] = useState({}); // { [qId]: boolean }
  const [visitedQuestions, setVisitedQuestions] = useState({}); // { [qId]: boolean }
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isExamCompleted, setIsExamCompleted] = useState(false);
  const [submissionResult, setSubmissionResult] = useState(null);
  const [autosaveStatus, setAutosaveStatus] = useState('saved'); // 'saved', 'saving'
  const timerRef = useRef(null);
  const totalDurationSecondsRef = useRef(0);

  const startExam = useCallback((examData) => {
    setExam(examData);
    const qList = examData.populatedQuestions || [];
    setQuestions(qList);
    setCurrentIndex(0);
    setAnswers({});
    setMarkedForReview({});
    setVisitedQuestions({ [qList[0]?.id]: true });
    setIsSubmitting(false);
    setIsExamCompleted(false);
    setSubmissionResult(null);

    const totalSecs = (examData.durationMinutes || 45) * 60;
    totalDurationSecondsRef.current = totalSecs;
    setTimeRemaining(totalSecs);
  }, []);

  // Timer countdown
  useEffect(() => {
    if (!exam || isExamCompleted || timeRemaining <= 0) return;

    timerRef.current = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [exam, isExamCompleted]);

  const handleAutoSubmit = useCallback(async () => {
    if (isSubmitting || isExamCompleted || !exam) return;
    await submitExam(true);
  }, [isSubmitting, isExamCompleted, exam]);

  const submitExam = useCallback(async (isAuto = false) => {
    if (!exam) return;
    setIsSubmitting(true);
    try {
      const timeSpentSeconds = totalDurationSecondsRef.current - timeRemaining;
      const result = await examService.submitExamAttempt({
        examId: exam.id,
        answers,
        timeSpentSeconds
      });
      setSubmissionResult({ ...result, isAutoSubmitted: isAuto });
      setIsExamCompleted(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return result;
    } catch (err) {
      console.error('Submission error:', err);
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  }, [exam, answers, timeRemaining]);

  const selectAnswer = useCallback((questionId, value) => {
    setAutosaveStatus('saving');
    setAnswers((prev) => {
      const next = { ...prev, [questionId]: value };
      return next;
    });
    setTimeout(() => setAutosaveStatus('saved'), 400);
  }, []);

  const toggleMultipleSelect = useCallback((questionId, optionId) => {
    setAutosaveStatus('saving');
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      let updated;
      if (current.includes(optionId)) {
        updated = current.filter((id) => id !== optionId);
      } else {
        updated = [...current, optionId];
      }
      return { ...prev, [questionId]: updated };
    });
    setTimeout(() => setAutosaveStatus('saved'), 400);
  }, []);

  const clearAnswer = useCallback((questionId) => {
    setAutosaveStatus('saving');
    setAnswers((prev) => {
      const next = { ...prev };
      delete next[questionId];
      return next;
    });
    setTimeout(() => setAutosaveStatus('saved'), 400);
  }, []);

  const toggleMarkForReview = useCallback((questionId) => {
    setMarkedForReview((prev) => ({
      ...prev,
      [questionId]: !prev[questionId]
    }));
  }, []);

  const navigateToQuestion = useCallback((index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentIndex(index);
      const qId = questions[index]?.id;
      if (qId) {
        setVisitedQuestions((prev) => ({ ...prev, [qId]: true }));
      }
    }
  }, [questions]);

  const nextQuestion = useCallback(() => {
    navigateToQuestion(currentIndex + 1);
  }, [currentIndex, navigateToQuestion]);

  const prevQuestion = useCallback(() => {
    navigateToQuestion(currentIndex - 1);
  }, [currentIndex, navigateToQuestion]);

  // Statistics calculation for Question Palette
  const answeredCount = Object.keys(answers).filter((k) => {
    const val = answers[k];
    if (Array.isArray(val)) return val.length > 0;
    return val != null && val !== '';
  }).length;

  const markedCount = Object.keys(markedForReview).filter((k) => markedForReview[k]).length;
  const unansweredCount = questions.length - answeredCount;

  return (
    <ExamContext.Provider
      value={{
        exam,
        questions,
        currentQuestion: questions[currentIndex] || null,
        currentIndex,
        totalQuestions: questions.length,
        answers,
        markedForReview,
        visitedQuestions,
        timeRemaining,
        autosaveStatus,
        isSubmitting,
        isExamCompleted,
        submissionResult,
        stats: {
          answeredCount,
          unansweredCount,
          markedCount,
          totalCount: questions.length
        },
        startExam,
        submitExam,
        selectAnswer,
        toggleMultipleSelect,
        clearAnswer,
        toggleMarkForReview,
        navigateToQuestion,
        nextQuestion,
        prevQuestion
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}

