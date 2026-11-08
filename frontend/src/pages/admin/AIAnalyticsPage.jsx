import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import SubjectAccuracyChart from '../../components/analytics/SubjectAccuracyChart';
import TopicRadarChart from '../../components/analytics/TopicRadarChart';
import {
  BrainCircuit,
  TrendingUp,
  AlertTriangle,
  ShieldCheck,
  Zap,
  Target,
  Sparkles
} from 'lucide-react';

export default function AIAnalyticsPage() {
  const riskCohort = [
    { name: 'Rohan Kulkarni', stream: 'CSE', riskLevel: 'High Risk (56% Avg)', weakTopic: 'Binary Search Trees & Heap Memory', recommendedIntervention: 'Assign 1-on-1 TA Review + 5 diagnostic tree drills' },
    { name: 'Karthik Raja', stream: 'MECH', riskLevel: 'Medium Risk (64% Avg)', weakTopic: 'Thermodynamic Gas Cycles', recommendedIntervention: 'Automated remediation practice test scheduled' },
    { name: 'Divya Reddy', stream: 'IT', riskLevel: 'Moderate (71% Avg)', weakTopic: 'Asynchronous Event Loop in Node.js', recommendedIntervention: 'Provide interactive code sandbox examples' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>Predictive AI & Cohort Diagnostics</h1>
          <Badge variant="primary" dot>Cognitive ML Engine</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Advanced neural modeling predicting candidate failure risk, item discrimination indices, and syllabus mastery.
        </p>
      </div>

      {/* Top 3 Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <Card hoverable style={{ borderLeft: '3px solid var(--accent-primary)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Curriculum Retention Score
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
            82.4%
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
            +4.2% higher than last academic semester
          </div>
        </Card>

        <Card hoverable style={{ borderLeft: '3px solid var(--status-danger)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            Identified At-Risk Candidates
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--status-danger)', marginBottom: '0.25rem' }}>
            14 Students
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Triggered early automated intervention
          </div>
        </Card>

        <Card hoverable style={{ borderLeft: '3px solid var(--accent-highlight)', padding: '1.25rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
            AI Question Discrimination Index
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--accent-highlight)', marginBottom: '0.25rem' }}>
            0.42 (Optimal)
          </div>
          <div style={{ fontSize: '0.78rem', color: 'var(--accent-secondary)' }}>
            High reliability in distinguishing skill tiers
          </div>
        </Card>
      </div>

      {/* Charts Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <Card title="Subject Accuracy Distribution" subtitle="Cohort performance across major engineering courses">
          <SubjectAccuracyChart />
        </Card>

        <Card title="Concept Mastery Radar" subtitle="Relative strength across core computer science competencies">
          <TopicRadarChart />
        </Card>
      </div>

      {/* Early Intervention Roster */}
      <Card
        title="Predictive Student Risk Intervention Queue"
        subtitle="Identified automatically by response hesitation times, incorrect error trails, and negative marking ratios"
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
          {riskCohort.map((r, i) => (
            <div
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '1rem 1.25rem',
                backgroundColor: 'var(--bg-secondary)',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  <span style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{r.name}</span>
                  <Badge variant="primary">{r.stream}</Badge>
                  <Badge variant="danger">{r.riskLevel}</Badge>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Struggling with: <span style={{ color: 'var(--accent-highlight)' }}>{r.weakTopic}</span>
                </div>
              </div>

              <div style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                {r.recommendedIntervention}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

