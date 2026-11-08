import React from 'react';
import Badge from '../common/Badge';
import { Clock, Cpu, Tag } from 'lucide-react';

export default function ProblemDescription({ problem }) {
  if (!problem) return null;

  return (
    <div
      style={{
        padding: '1.5rem',
        overflowY: 'auto',
        height: '100%',
        color: 'var(--text-primary)'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 800 }}>{problem.title}</h2>
        <Badge
          variant={
            problem.difficulty === 'Hard'
              ? 'danger'
              : problem.difficulty === 'Medium'
              ? 'highlight'
              : 'secondary'
          }
        >
          {problem.difficulty}
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: '1.25rem', marginBottom: '1.5rem', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={14} /> Time: {problem.timeLimit || '1.0s'}
        </span>
        <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Cpu size={14} /> Memory: {problem.memoryLimit || '256 MB'}
        </span>
      </div>

      {/* Description */}
      <div style={{ marginBottom: '1.75rem' }}>
        <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-highlight)', marginBottom: '0.5rem' }}>
          Problem Statement
        </h4>
        <p style={{ lineHeight: 1.6, color: 'var(--text-secondary)', whiteSpace: 'pre-line' }}>
          {problem.description}
        </p>
      </div>

      {/* Input / Output Format */}
      {problem.inputFormat && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Input Format
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {problem.inputFormat}
          </p>
        </div>
      )}

      {problem.outputFormat && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
            Output Format
          </h4>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
            {problem.outputFormat}
          </p>
        </div>
      )}

      {/* Constraints */}
      {problem.constraints && problem.constraints.length > 0 && (
        <div style={{ marginBottom: '1.75rem' }}>
          <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>
            Constraints
          </h4>
          <ul style={{ paddingLeft: '1.25rem', fontSize: '0.88rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
            {problem.constraints.map((c, i) => (
              <li key={i}>
                <code style={{ background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: '4px', color: 'var(--accent-highlight)' }}>
                  {c}
                </code>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sample Cases */}
      {problem.sampleCases && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-highlight)', marginBottom: '0.75rem' }}>
            Sample Test Cases
          </h4>
          {problem.sampleCases.map((sample, idx) => (
            <div
              key={idx}
              style={{
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                padding: '1rem',
                marginBottom: '1rem'
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sample Input:</span>
                <pre style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '4px', overflowX: 'auto' }}>
                  {sample.input}
                </pre>
              </div>
              <div style={{ marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Sample Output:</span>
                <pre style={{ backgroundColor: 'var(--bg-card)', padding: '0.5rem', borderRadius: '4px', fontSize: '0.85rem', marginTop: '4px', color: 'var(--accent-secondary)' }}>
                  {sample.output}
                </pre>
              </div>
              {sample.explanation && (
                <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <strong>Explanation:</strong> {sample.explanation}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Tags */}
      {problem.tags && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginTop: '1rem' }}>
          {problem.tags.map((t) => (
            <span
              key={t}
              style={{
                fontSize: '0.75rem',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                padding: '0.2rem 0.5rem',
                borderRadius: '4px',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                gap: '3px'
              }}
            >
              <Tag size={11} /> {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

