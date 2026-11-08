import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useExam } from '../../hooks/useExam';
import { examService } from '../../services/examService';
import QuestionViewer from '../../components/exam/QuestionViewer';
import QuestionPalette from '../../components/exam/QuestionPalette';

export default function ExamTakingPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { exam, startExam, isExamCompleted } = useExam();

  useEffect(() => {
    // If user directly opened URL without state initialized, load and start exam
    if (!exam || exam.id !== examId) {
      examService.getExamById(examId).then((data) => {
        startExam(data);
      }).catch(() => {
        navigate('/student/available-exams');
      });
    }
  }, [examId, exam, startExam, navigate]);

  useEffect(() => {
    if (isExamCompleted && exam) {
      navigate(`/exam/${exam.id}/result`);
    }
  }, [isExamCompleted, exam, navigate]);

  return (
    <div style={{ flex: 1, display: 'flex', width: '100%', height: 'calc(100vh - 68px)', overflow: 'hidden' }}>
      <QuestionViewer />
      <QuestionPalette />
    </div>
  );
}

