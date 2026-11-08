import React, { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { useExam } from '../../hooks/useExam';
import ScoreBreakdown from '../../components/analytics/ScoreBreakdown';
import AIRecommendations from '../../components/analytics/AIRecommendations';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Award,
  CheckCircle2,
  XCircle,
  MinusCircle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Home
} from 'lucide-react';

export default function ExamResultPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { submissionResult } = useExam();

  // Fallback synthetic submission result if accessed directly
  const result = submissionResult || {
    submissionId: 'sub_demo_01',
    examId,
    examTitle: 'Data Structures Mid-Term Comprehensive Evaluation',
    subject: 'Data Structures',
    totalQuestions: 25,
    correctCount: 22,
    incorrectCount: 2,
    unansweredCount: 1,
    totalScore: 43,
    maxMarks: 50,
    percentage: 86.0,
    timeSpentMinutes: 34,
    aiAnalysis: {
      accuracy: '86%',
      speedRating: 'Methodical & Steady',
      strongArea: 'Array memory offsets & Linked lists',
      focusArea: 'Review AVL balance rotation formulas and recursion depth.',
      percentile: 94
    },
    questionReview: [
      {
        questionId: 'q1',
        text: 'What is the maximum number of nodes in a binary tree of height h?',
        studentAns: 'B',
        correctAnswer: 'B',
        status: 'correct',
        marksAwarded: 2,
        explanation: 'Sum of 2^0 + 2^1 + ... + 2^h = 2^(h+1) - 1 nodes.'
      },
      {
        questionId: 'q2',
        text: 'In an AVL Tree, what is the maximum permissible difference between the heights of the left and right subtrees?',
        studentAns: 'C',
        correctAnswer: 'B',
        status: 'incorrect',
        marksAwarded: -0.5,
        explanation: 'The balance factor BF(k) must belong to {-1, 0, 1}. Maximum allowable absolute difference is 1.'
      }
    ]
  };

  useEffect(() => {
    if (result.percentage >= 70) {
      confetti({
        particleCount: 90,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [result.percentage]);

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '1000px' }}>
      {/* Celebration Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: 'rgba(184, 213, 139, 0.15)',
            color: 'var(--accent-secondary)',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            marginBottom: '1rem',
            border: '2px solid var(--accent-secondary)'
          }}
        >
          <Award size={32} />
        </div>
        <h1 className="heading-1" style={{ marginBottom: '0.4rem' }}>
          Examination Completed Successfully
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', margin: 0 }}>
          {result.examTitle} • Final Score Processed
        </p>
      </div>

      {/* Aggregate Score Breakdown */}
      <ScoreBreakdown result={result} />

      {/* Cognitive AI Performance Feedback */}
      <Card
        title="Quentrix AI Performance Assessment"
        subtitle="Automated academic evaluation synthesized from this attempt"
        glow
        style={{ marginBottom: '2.5rem' }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Class Percentile</span>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: 'var(--accent-highlight)' }}>
              Top {100 - (result.aiAnalysis?.percentile || 94)}%
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Pacing Velocity</span>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              {result.aiAnalysis?.speedRating || 'Optimal'}
            </div>
          </div>
          <div style={{ backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
            <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Primary Mastery</span>
            <div style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {result.aiAnalysis?.strongArea || 'Core Syllabus'}
            </div>
          </div>
        </div>

        <div style={{ marginTop: '1.25rem', padding: '1rem', backgroundColor: 'rgba(232, 197, 141, 0.08)', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(232, 197, 141, 0.25)', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
          <strong>Actionable Suggestion:</strong> {result.aiAnalysis?.focusArea || 'Practice boundary cases in AVL balance rotations.'}
        </div>
      </Card>

      {/* Item-by-Item Review */}
      {result.questionReview && result.questionReview.length > 0 && (
        <Card title="Item Review & Solution Explanations" subtitle="Detailed pedagogical breakdown of each question response" style={{ marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            {result.questionReview.map((item, idx) => {
              const isCorrect = item.status === 'correct';
              const isUnanswered = item.status === 'unanswered';

              return (
                <div
                  key={idx}
                  style={{
                    backgroundColor: 'var(--bg-secondary)',
                    borderRadius: 'var(--radius-sm)',
                    border: `1.5px solid ${
                      isCorrect
                        ? 'rgba(184, 213, 139, 0.3)'
                        : isUnanswered
                        ? 'var(--border-subtle)'
                        : 'rgba(224, 108, 117, 0.3)'
                    }`,
                    padding: '1.25rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.6rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 800 }}>Q{idx + 1}.</span>
                      <Badge variant={isCorrect ? 'secondary' : isUnanswered ? 'muted' : 'danger'}>
                        {isCorrect ? 'Correct' : isUnanswered ? 'Unanswered' : 'Incorrect'}
                      </Badge>
                    </div>
                    <span style={{ fontWeight: 700, fontSize: '0.85rem', color: isCorrect ? 'var(--accent-secondary)' : 'var(--status-danger)' }}>
                      {item.marksAwarded > 0 ? `+${item.marksAwarded}` : item.marksAwarded} Marks
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', color: 'var(--text-primary)', marginBottom: '0.85rem', lineHeight: 1.5 }}>
                    {item.text}
                  </p>

                  <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem', marginBottom: '0.85rem' }}>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Your Response: </span>
                      <strong style={{ color: isCorrect ? 'var(--accent-secondary)' : 'var(--status-danger)' }}>
                        {item.studentAns ? (Array.isArray(item.studentAns) ? item.studentAns.join(', ') : item.studentAns) : 'None'}
                      </strong>
                    </div>
                    <div>
                      <span style={{ color: 'var(--text-muted)' }}>Correct Key: </span>
                      <strong style={{ color: 'var(--accent-secondary)' }}>
                        {Array.isArray(item.correctAnswer) ? item.correctAnswer.join(', ') : item.correctAnswer}
                      </strong>
                    </div>
                  </div>

                  <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', backgroundColor: 'var(--bg-card)', padding: '0.65rem 0.85rem', borderRadius: '4px', lineHeight: 1.5 }}>
                    <strong>Explanation:</strong> {item.explanation}
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Navigation Footer */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate('/student/dashboard')}
          leftIcon={<Home size={18} />}
        >
          Return to Dashboard
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate('/student/mock-tests')}
          leftIcon={<RotateCcw size={18} />}
        >
          Practice Weak Topics With AI
        </Button>
      </div>
    </div>
  );
}

