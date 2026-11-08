import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../../components/admin/StatCard';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import SubjectAccuracyChart from '../../components/analytics/SubjectAccuracyChart';
import {
  Users,
  FileCheck2,
  Clock,
  Database,
  PlusCircle,
  TrendingUp,
  BrainCircuit,
  Award,
  ArrowRight,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getAdminPlatformAnalytics();
        setAnalytics(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome & Quick Action Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="heading-2" style={{ margin: 0 }}>Academic Command Center</h1>
            <Badge variant="primary">Admin</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Real-time examination telemetry, candidate participation metrics, and AI synthesis control.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/admin/question-bank')}
            leftIcon={<Database size={16} />}
          >
            Question Bank
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/admin/create-exam')}
            leftIcon={<Sparkles size={16} />}
          >
            Create Exam with AI
          </Button>
        </div>
      </div>

      {/* Top Level Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Total Students"
          value={analytics?.totalStudents || 1480}
          subtitle="Enrolled across 5 engineering streams"
          trend="+8.4% this month"
          icon={<Users size={20} />}
          color="var(--accent-primary)"
          onClick={() => navigate('/admin/students')}
        />
        <StatCard
          title="Total Examinations"
          value={analytics?.totalExaminations || 4}
          subtitle="Proctored course evaluations"
          trend="2 live active now"
          icon={<FileCheck2 size={20} />}
          color="var(--accent-secondary)"
          onClick={() => navigate('/admin/manage-exams')}
        />
        <StatCard
          title="Active Exams"
          value={analytics?.activeExaminations || 2}
          subtitle="Candidates currently submitting"
          trend="Zero proctoring flags"
          icon={<Clock size={20} />}
          color="var(--accent-highlight)"
          onClick={() => navigate('/admin/manage-exams')}
        />
        <StatCard
          title="Question Bank Repository"
          value={analytics?.totalQuestions || 120}
          subtitle="Vetted curriculum items"
          trend="85% AI-assisted"
          icon={<Database size={20} />}
          color="var(--accent-muted)"
          onClick={() => navigate('/admin/question-bank')}
        />
      </div>

      {/* Analytics & Activity Split Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '1.5rem' }}>
        {/* Subject-Wise Performance Chart */}
        <Card
          title="Subject-Wise Examination Performance"
          subtitle="Average cohort score and historical participation breakdown"
          action={
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate('/admin/analytics')}
              rightIcon={<ArrowRight size={14} />}
            >
              Full Analytics
            </Button>
          }
        >
          <div style={{ marginTop: '1rem' }}>
            <SubjectAccuracyChart />
          </div>
        </Card>

        {/* Live Examination Activity Feed */}
        <Card
          title="Recent Examination Telemetry"
          subtitle="Live audit trail of submissions and question synthesis"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', marginTop: '1rem' }}>
            {(analytics?.recentActivity || []).map((act) => (
              <div
                key={act.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.85rem 1rem',
                  backgroundColor: 'var(--bg-secondary)',
                  borderRadius: 'var(--radius-sm)',
                  border: '1px solid var(--border-subtle)',
                  fontSize: '0.85rem'
                }}
              >
                <div>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{act.user}</div>
                  <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{act.action}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: 'var(--accent-secondary)' }}>{act.score}</div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem' }}>{act.time}</div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Launchpad & Platform Controls */}
      <Card title="Administrative Operations & Examination Deployment" subtitle="Execute core administrative functions">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
          <div
            onClick={() => navigate('/admin/create-exam')}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-primary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <Sparkles size={20} color="var(--accent-primary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Launch AI Question Synthesis</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Generate complete balanced midterms with multi-select and coding items in 30 seconds.
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/question-bank')}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-secondary)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <Database size={20} color="var(--accent-secondary)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Batch Import Question Bank</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Upload departmental JSON/CSV files or organize questions by engineering category.
            </p>
          </div>

          <div
            onClick={() => navigate('/admin/results')}
            style={{
              padding: '1.25rem',
              backgroundColor: 'var(--bg-secondary)',
              borderRadius: 'var(--radius-sm)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'border-color var(--transition-fast)'
            }}
            onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--accent-highlight)')}
            onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border-subtle)')}
          >
            <Award size={20} color="var(--accent-highlight)" style={{ marginBottom: '0.5rem' }} />
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.25rem' }}>Export Examination Grades</h4>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
              Download official grade rosters and analyze negative marking impact across cohorts.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}

