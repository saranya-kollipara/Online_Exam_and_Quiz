import React from 'react';
import Card from '../common/Card';

export default function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendPositive = true,
  color = 'var(--accent-primary)',
  onClick
}) {
  return (
    <Card
      hoverable
      interactive={!!onClick}
      onClick={onClick}
      style={{
        padding: '1.25rem 1.5rem',
        borderLeft: `3px solid ${color}`
      }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.85rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
          {title}
        </span>
        {icon && (
          <div
            style={{
              padding: '0.5rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-secondary)',
              color
            }}
          >
            {icon}
          </div>
        )}
      </div>

      <div style={{ fontSize: '1.85rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.35rem', letterSpacing: '-0.02em' }}>
        {value}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', fontSize: '0.78rem' }}>
        <span style={{ color: 'var(--text-muted)' }}>{subtitle}</span>
        {trend && (
          <span
            style={{
              color: trendPositive ? 'var(--accent-secondary)' : 'var(--status-danger)',
              fontWeight: 700
            }}
          >
            {trend}
          </span>
        )}
      </div>
    </Card>
  );
}

