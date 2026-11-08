import React from 'react';
import { Sparkles } from 'lucide-react';

export default function SuggestedPrompts({ onSelectPrompt }) {
  const prompts = [
    { label: 'Explain AVL tree balance factors & rotations', lang: 'en' },
    { label: 'How does Banker\'s algorithm prevent OS deadlocks?', lang: 'en' },
    { label: 'Optimal Two Sum in O(n) JavaScript/Python', lang: 'en' },
    { label: 'బైనరీ ట్రీ మరియు BST మధ్య తేడాలు ఏమిటి? (Telugu)', lang: 'te' },
    { label: 'పరీక్షలలో నెగెటివ్ మార్కింగ్ వ్యూహాలు (Exam Strategy)', lang: 'te' }
  ];

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '0.6rem' }}>
        <Sparkles size={13} color="var(--accent-highlight)" />
        <span>Suggested Academic Queries:</span>
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {prompts.map((p, i) => (
          <button
            key={i}
            onClick={() => onSelectPrompt(p.label, p.lang)}
            style={{
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-full)',
              fontSize: '0.8rem',
              cursor: 'pointer',
              transition: 'all var(--transition-fast)',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = 'var(--accent-primary)';
              e.currentTarget.style.color = 'var(--text-primary)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = 'var(--border-subtle)';
              e.currentTarget.style.color = 'var(--text-secondary)';
            }}
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

