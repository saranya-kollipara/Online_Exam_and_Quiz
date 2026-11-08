import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import Button from '../common/Button';
import { Clock, HelpCircle, Award, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function ExamCard({ exam, onStart, onReview }) {
  if (!exam) return null;

  const isActive = exam.status === 'active';
  const isCompleted = exam.status === 'completed' || exam.attemptsMade > 0;
  const isUpcoming = exam.status === 'upcoming';

  return (
    <Card hoverable glow={isActive} style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Header tags */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <Badge variant={exam.difficulty === 'Hard' ? 'danger' : exam.difficulty === 'Medium' ? 'highlight' : 'secondary'}>
          {exam.difficulty}
        </Badge>
        <Badge
          variant={
            isActive ? 'secondary' : isCompleted ? 'muted' : 'highlight'
          }
          dot={isActive}
        >
          {isActive ? 'Active Exam' : isCompleted ? 'Completed' : 'Upcoming'}
        </Badge>
      </div>

      {/* Title & Subject */}
      <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.4rem', lineHeight: 1.35 }}>
        {exam.title}
      </h3>
      <div style={{ fontSize: '0.85rem', color: 'var(--accent-highlight)', fontWeight: 600, marginBottom: '0.85rem' }}>
        {exam.subject} • <span style={{ color: 'var(--text-secondary)' }}>{exam.topic}</span>
      </div>

      {/* Description */}
      <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.25rem', flex: 1 }}>
        {exam.description || 'Comprehensive evaluation covering fundamental and advanced course concepts.'}
      </p>

      {/* Meta Specifications */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '0.5rem',
          backgroundColor: 'var(--bg-secondary)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.75rem',
          marginBottom: '1.25rem',
          fontSize: '0.78rem'
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Duration</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Clock size={12} /> {exam.durationMinutes}m
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Questions</span>
          <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <HelpCircle size={12} /> {exam.totalQuestions}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          <span style={{ color: 'var(--text-muted)' }}>Max Score</span>
          <span style={{ fontWeight: 700, color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <Award size={12} /> {exam.totalMarks} pts
          </span>
        </div>
      </div>

      {/* Action Footer */}
      <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {isUpcoming ? (
            <span>Opens {formatDate(exam.startDate)}</span>
          ) : isCompleted ? (
            <span style={{ color: 'var(--accent-secondary)' }}>Score: {exam.studentResult?.score || 36}/{exam.totalMarks}</span>
          ) : (
            <span style={{ color: 'var(--accent-secondary)' }}>Attempts: 0/{exam.maxAttempts || 1}</span>
          )}
        </div>

        {isActive && (
          <Button
            variant="primary"
            size="sm"
            onClick={() => onStart && onStart(exam)}
            rightIcon={<ArrowRight size={14} />}
          >
            Start Exam
          </Button>
        )}

        {isCompleted && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onReview && onReview(exam)}
            leftIcon={<CheckCircle2 size={14} color="var(--accent-secondary)" />}
          >
            View Result
          </Button>
        )}

        {isUpcoming && (
          <Button variant="secondary" size="sm" disabled>
            Scheduled
          </Button>
        )}
      </div>
    </Card>
  );
}

