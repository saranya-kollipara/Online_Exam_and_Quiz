import React from 'react';
import { useExam } from '../../hooks/useExam';

export default function QuestionPalette() {
  const {
    questions,
    currentIndex,
    answers,
    markedForReview,
    visitedQuestions,
    navigateToQuestion,
    stats
  } = useExam();

  return (
    <aside
      style={{
        width: '320px',
        backgroundColor: 'var(--bg-secondary)',
        borderLeft: '1px solid var(--border-subtle)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 68px)',
        overflowY: 'auto',
        padding: '1.25rem'
      }}
    >
      <h3 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>
        Question Palette
      </h3>

      {/* Summary Stats Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '0.6rem',
          marginBottom: '1.25rem'
        }}
      >
        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.answeredCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Answered</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-muted)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.markedCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Marked for Review</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--text-disabled)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{stats.unansweredCount}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Unanswered</div>
          </div>
        </div>

        <div
          style={{
            backgroundColor: 'var(--bg-card)',
            padding: '0.6rem 0.8rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)' }} />
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>{questions.length}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Total Questions</div>
          </div>
        </div>
      </div>

      {/* Grid of question buttons */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 1fr)',
          gap: '0.5rem',
          marginBottom: '1.5rem'
        }}
      >
        {questions.map((q, idx) => {
          const ans = answers[q.id];
          const hasAnswer = ans != null && (Array.isArray(ans) ? ans.length > 0 : ans !== '');
          const isMarked = !!markedForReview[q.id];
          const isCurrent = idx === currentIndex;

          let bg = 'var(--bg-card)';
          let color = 'var(--text-secondary)';
          let border = '1px solid var(--border-subtle)';

          if (isMarked && hasAnswer) {
            bg = 'rgba(232, 197, 141, 0.25)';
            color = 'var(--accent-highlight)';
            border = '1px solid var(--accent-highlight)';
          } else if (isMarked) {
            bg = 'rgba(130, 118, 157, 0.3)';
            color = 'var(--accent-muted)';
            border = '1px solid var(--accent-muted)';
          } else if (hasAnswer) {
            bg = 'rgba(184, 213, 139, 0.2)';
            color = 'var(--accent-secondary)';
            border = '1px solid var(--accent-secondary)';
          }

          return (
            <button
              key={q.id || idx}
              onClick={() => navigateToQuestion(idx)}
              style={{
                height: '42px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: bg,
                color,
                border: isCurrent ? '2px solid var(--accent-primary)' : border,
                fontWeight: isCurrent ? 800 : 600,
                fontSize: '0.88rem',
                cursor: 'pointer',
                transition: 'all var(--transition-fast)',
                transform: isCurrent ? 'scale(1.05)' : 'none',
                boxShadow: isCurrent ? '0 0 10px var(--accent-primary-glow)' : 'none',
                position: 'relative'
              }}
              title={`Question ${idx + 1}`}
            >
              {idx + 1}
              {isMarked && (
                <span
                  style={{
                    position: 'absolute',
                    top: '2px',
                    right: '3px',
                    width: '5px',
                    height: '5px',
                    borderRadius: '50%',
                    backgroundColor: 'var(--accent-muted)'
                  }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Instructions Note */}
      <div
        style={{
          marginTop: 'auto',
          backgroundColor: 'rgba(37, 41, 35, 0.5)',
          padding: '0.85rem',
          borderRadius: 'var(--radius-sm)',
          border: '1px solid var(--border-subtle)',
          fontSize: '0.78rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5
        }}
      >
        Click any number to jump directly. Marked questions can be reviewed anytime before submitting.
      </div>
    </aside>
  );
}

