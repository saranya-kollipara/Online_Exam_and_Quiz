import React, { useState } from 'react';
import { Bot, User, Copy, Check } from 'lucide-react';

export default function ChatMessage({ message }) {
  const isAssistant = message.role === 'assistant';
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        gap: '0.85rem',
        alignItems: 'flex-start',
        marginBottom: '1.25rem',
        alignSelf: isAssistant ? 'flex-start' : 'flex-end',
        maxWidth: isAssistant ? '88%' : '75%'
      }}
    >
      {/* Avatar */}
      <div
        style={{
          width: '32px',
          height: '32px',
          borderRadius: 'var(--radius-xs)',
          backgroundColor: isAssistant ? 'var(--accent-primary)' : 'var(--bg-card-hover)',
          color: '#fff',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexShrink: 0,
          boxShadow: isAssistant ? '0 0 10px var(--accent-primary-glow)' : 'none'
        }}
      >
        {isAssistant ? <Bot size={18} /> : <User size={18} />}
      </div>

      {/* Bubble */}
      <div
        style={{
          backgroundColor: isAssistant ? 'var(--bg-card)' : 'var(--accent-primary)',
          color: isAssistant ? 'var(--text-primary)' : '#ffffff',
          padding: '1rem 1.25rem',
          borderRadius: 'var(--radius-md)',
          border: isAssistant ? '1px solid var(--border-subtle)' : 'none',
          boxShadow: 'var(--shadow-sm)',
          position: 'relative'
        }}
      >
        {/* Header bar for assistant with copy button */}
        {isAssistant && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '0.5rem',
              paddingBottom: '0.35rem',
              borderBottom: '1px solid var(--border-subtle)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--accent-highlight)' }}>
                Quentrix Academic AI
              </span>
              {message.language === 'te' && (
                <span
                  style={{
                    fontSize: '0.68rem',
                    backgroundColor: 'rgba(184, 213, 139, 0.2)',
                    color: 'var(--accent-secondary)',
                    padding: '1px 6px',
                    borderRadius: '4px'
                  }}
                >
                  తెలుగు
                </span>
              )}
            </div>

            <button
              onClick={handleCopy}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '3px',
                fontSize: '0.72rem'
              }}
              title="Copy answer"
            >
              {copied ? <Check size={13} color="var(--accent-secondary)" /> : <Copy size={13} />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        )}

        {/* Content body */}
        <div
          style={{
            fontSize: '0.92rem',
            lineHeight: 1.6,
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word'
          }}
        >
          {message.content}
        </div>
      </div>
    </div>
  );
}

