import React from 'react';
import { Bot } from 'lucide-react';

export default function TypingIndicator() {
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'center',
        marginBottom: '1rem',
        maxWidth: '80%'
      }}
    >
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: 'var(--accent-primary)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0
        }}
      >
        <Bot size={18} />
      </div>

      <div
        style={{
          backgroundColor: 'var(--bg-card)',
          padding: '0.75rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: '1px solid var(--border-subtle)',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        }}
      >
        <span
          className="live-pulse"
          style={{ width: '8px', height: '8px', backgroundColor: 'var(--accent-primary)' }}
        />
        <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Quentrix AI is analyzing academic knowledge base...
        </span>
      </div>
    </div>
  );
}

