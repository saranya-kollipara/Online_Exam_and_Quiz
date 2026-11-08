import React from 'react';
import Card from '../common/Card';
import Badge from '../common/Badge';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, BookOpen } from 'lucide-react';

export default function AIRecommendations({ insights }) {
  if (!insights) return null;

  return (
    <Card
      title="Quentrix AI Cognitive Diagnostic Insights"
      subtitle="Personalized performance evaluation synthesized from your response patterns"
      glow
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Strengths */}
        <div
          style={{
            backgroundColor: 'rgba(184, 213, 139, 0.08)',
            border: '1px solid rgba(184, 213, 139, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <CheckCircle2 size={18} color="var(--accent-secondary)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
              Demonstrated Strengths
            </h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {insights.strengthsSummary || 'Strong conceptual understanding of primitive operations and linear algorithms.'}
          </p>
        </div>

        {/* Critical Gaps */}
        <div
          style={{
            backgroundColor: 'rgba(232, 197, 141, 0.08)',
            border: '1px solid rgba(232, 197, 141, 0.25)',
            borderRadius: 'var(--radius-sm)',
            padding: '1.25rem'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <AlertTriangle size={18} color="var(--accent-highlight)" />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--accent-highlight)' }}>
              Identified Focus Areas
            </h4>
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, margin: 0 }}>
            {insights.criticalGaps || 'Subtree height rebalancing and overlapping subproblems require targeted drill.'}
          </p>
        </div>
      </div>

      {/* Recommended Action Steps */}
      {insights.recommendedActions && (
        <div style={{ marginTop: '1.5rem' }}>
          <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Sparkles size={16} color="var(--accent-primary)" />
            Recommended Practice Actions:
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {insights.recommendedActions.map((action, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  padding: '0.65rem 0.85rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-xs)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.88rem',
                  color: 'var(--text-secondary)'
                }}
              >
                <span
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: 'rgba(216, 120, 85, 0.2)',
                    color: 'var(--accent-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    flexShrink: 0
                  }}
                >
                  {i + 1}
                </span>
                <span style={{ flex: 1 }}>{action}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}

