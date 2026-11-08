import React from 'react';
import Card from '../common/Card';
import { CheckCircle2, XCircle, MinusCircle, Clock, Award, Target } from 'lucide-react';

export default function ScoreBreakdown({ result }) {
  if (!result) return null;

  const cards = [
    {
      title: 'Score Obtained',
      value: `${result.totalScore} / ${result.maxMarks || result.totalMarks}`,
      subtitle: `${result.percentage}% Overall Score`,
      icon: <Award size={22} color="var(--accent-primary)" />,
      border: 'var(--accent-primary)'
    },
    {
      title: 'Accuracy Rate',
      value: `${result.percentage}%`,
      subtitle: `${result.correctCount || result.correct} Correct Answers`,
      icon: <Target size={22} color="var(--accent-secondary)" />,
      border: 'var(--accent-secondary)'
    },
    {
      title: 'Correct',
      value: result.correctCount || result.correct || 0,
      subtitle: 'Awarded positive marks',
      icon: <CheckCircle2 size={22} color="var(--accent-secondary)" />,
      border: 'var(--accent-secondary)'
    },
    {
      title: 'Incorrect',
      value: result.incorrectCount || result.incorrect || 0,
      subtitle: 'Negative penalty applied',
      icon: <XCircle size={22} color="var(--status-danger)" />,
      border: 'var(--status-danger)'
    },
    {
      title: 'Unanswered',
      value: result.unansweredCount || result.unanswered || 0,
      subtitle: 'Zero penalty',
      icon: <MinusCircle size={22} color="var(--text-disabled)" />,
      border: 'var(--border-medium)'
    },
    {
      title: 'Time Taken',
      value: `${result.timeSpentMinutes || Math.round((result.timeSpentSeconds || 0) / 60) || 1} mins`,
      subtitle: 'Paced effectively',
      icon: <Clock size={22} color="var(--accent-highlight)" />,
      border: 'var(--accent-highlight)'
    }
  ];

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
        gap: '1rem',
        marginBottom: '2rem'
      }}
    >
      {cards.map((c, i) => (
        <Card
          key={i}
          hoverable
          style={{
            borderLeft: `3px solid ${c.border}`,
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              {c.title}
            </span>
            {c.icon}
          </div>
          <div style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.2rem' }}>
            {c.value}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            {c.subtitle}
          </div>
        </Card>
      ))}
    </div>
  );
}

