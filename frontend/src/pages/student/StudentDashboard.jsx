import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { examService } from '../../services/examService';
import { analyticsService } from '../../services/analyticsService';
import StatCard from '../../components/admin/StatCard';
import ExamCard from '../../components/student/ExamCard';
import SubjectMasteryCard from '../../components/student/SubjectMasteryCard';
import AIRecommendations from '../../components/analytics/AIRecommendations';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Trophy,
  Award,
  Sparkles,
  BookOpen,
  Code2,
  TrendingUp,
  Target,
  ArrowRight,
  Flame,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [examList, analyticsData] = await Promise.all([
          examService.getAllExams(),
          analyticsService.getStudentAnalytics()
        ]);
        setExams(examList);
        setAnalytics(analyticsData);
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  const activeExams = exams.filter((e) => e.status === 'active');
  const upcomingExams = exams.filter((e) => e.status === 'upcoming');
  const completedExams = exams.filter((e) => e.status === 'completed' || e.attemptsMade > 0);

  const handleStartExam = (exam) => {
    navigate(`/exam/${exam.id}/instructions`);
  };

  const handleReviewExam = (exam) => {
    navigate(`/exam/${exam.id}/result`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div
        style={{
          background: 'linear-gradient(135deg, rgba(216, 120, 85, 0.15) 0%, rgba(37, 41, 35, 0.9) 100%)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-lg)',
          padding: '2rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1.5rem',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '1.5rem' }}>👋</span>
            <h1 className="heading-2" style={{ margin: 0 }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Aditya'}!
            </h1>
            <Badge variant="highlight">Rank #{user?.rank || 4} Overall</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', maxWidth: '640px', lineHeight: 1.5, margin: 0 }}>
            You have <strong>{activeExams.length} active examination</strong> waiting for your submission. Your mastery in Data Structures is currently at <strong>72%</strong>.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => navigate('/student/mock-tests')}
            leftIcon={<Sparkles size={16} color="var(--accent-primary)" />}
          >
            Start AI Practice Drill
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate('/student/coding-practice')}
            leftIcon={<Code2 size={16} />}
          >
            Code Sandbox
          </Button>
        </div>
      </div>

      {/* Top Academic KPIs */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '1.25rem' }}>
        <StatCard
          title="Overall Average"
          value={`${analytics?.overallScore || 84.5}%`}
          subtitle="Top 5% in your stream cohort"
          trend="+3.2% vs last quiz"
          icon={<Award size={20} />}
          color="var(--accent-primary)"
        />
        <StatCard
          title="Leaderboard Position"
          value={`Rank #${user?.rank || 4}`}
          subtitle={`${user?.totalPoints || 2840} Points Accumulated`}
          trend="Platinum Pro"
          icon={<Trophy size={20} />}
          color="var(--accent-highlight)"
          onClick={() => navigate('/student/leaderboard')}
        />
        <StatCard
          title="Assessments Finished"
          value={user?.examsCompleted || 14}
          subtitle="Across Core Computer Science"
          trend="100% submission rate"
          icon={<CheckCircle2 size={20} />}
          color="var(--accent-secondary)"
          onClick={() => navigate('/student/my-exams')}
        />
        <StatCard
          title="Accuracy Rate"
          value={`${analytics?.accuracyRate || 86.8}%`}
          subtitle="Avg 1m 24s per question"
          trend="Steady pacing"
          icon={<Target size={20} />}
          color="var(--accent-muted)"
          onClick={() => navigate('/student/performance')}
        />
      </div>

      {/* Available & Live Examinations Section */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, margin: 0 }}>Active & Available Examinations</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem', margin: 0 }}>Official assessments scheduled by course faculty</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/student/available-exams')}
            rightIcon={<ArrowRight size={14} />}
          >
            Browse All ({exams.length})
          </Button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {activeExams.length === 0 ? (
            <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No active exams scheduled at this moment. Try an AI Practice Mock test!
            </Card>
          ) : (
            activeExams.slice(0, 2).map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onStart={handleStartExam}
                onReview={handleReviewExam}
              />
            ))
          )}
        </div>
      </div>

      {/* Cognitive Mastery Breakdown & AI Insights */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <SubjectMasteryCard topicBreakdown={analytics?.topicBreakdown} />
        <AIRecommendations insights={analytics?.aiDiagnosticInsights} />
      </div>
    </div>
  );
}

