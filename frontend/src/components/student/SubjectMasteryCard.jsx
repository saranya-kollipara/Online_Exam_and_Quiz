import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';

export default function SubjectMasteryCard({ topicBreakdown = [] }) {
  const topics = topicBreakdown.length > 0 ? topicBreakdown : [
    { subject: 'Data Structures', topic: 'Arrays', accuracy: 85, status: 'Strong' },
    { subject: 'Data Structures', topic: 'Linked Lists', accuracy: 60, status: 'Moderate' },
    { subject: 'Data Structures', topic: 'Trees', accuracy: 40, status: 'Weak' },
    { subject: 'Data Structures', topic: 'Graphs', accuracy: 75, status: 'Strong' }
  ];

  return (
    <Card
      title="Topic Accuracy & Mastery Breakdown"
      subtitle="Evaluated across recent quizzes and programming assessments"
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '1rem' }}>
        {topics.map((t, idx) => {
          const isWeak = t.accuracy < 50;
          const isModerate = t.accuracy >= 50 && t.accuracy < 75;
          const isStrong = t.accuracy >= 75;

          const barColor = isStrong
            ? 'var(--accent-secondary)'
            : isModerate
            ? 'var(--accent-highlight)'
            : 'var(--status-danger)';

          return (
            <div key={idx}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{t.topic}</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({t.subject})</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: 700, color: barColor }}>{t.accuracy}%</span>
                  <Badge variant={isStrong ? 'secondary' : isModerate ? 'highlight' : 'danger'}>
                    {t.status || (isStrong ? 'Strong' : isModerate ? 'Moderate' : 'Needs Practice')}
                  </Badge>
                </div>
              </div>

              {/* Custom Progress Bar */}
              <div
                style={{
                  height: '7px',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-full)',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    width: `${t.accuracy}%`,
                    height: '100%',
                    backgroundColor: barColor,
                    borderRadius: 'var(--radius-full)',
                    transition: 'width 0.8s ease'
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

