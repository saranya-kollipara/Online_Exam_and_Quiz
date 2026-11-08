import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import ScoreBreakdown from '../../components/analytics/ScoreBreakdown';
import SubjectAccuracyChart from '../../components/analytics/SubjectAccuracyChart';
import TopicRadarChart from '../../components/analytics/TopicRadarChart';
import SubjectMasteryCard from '../../components/student/SubjectMasteryCard';
import AIRecommendations from '../../components/analytics/AIRecommendations';
import { LineChart, BarChart3, Target, Sparkles, BrainCircuit } from 'lucide-react';

export default function PerformanceAnalysisPage() {
  const [analytics, setAnalytics] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await analyticsService.getStudentAnalytics();
        setAnalytics(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const recentSubmissionResult = analytics?.recentExam || {
    totalScore: 42,
    maxMarks: 50,
    percentage: 84,
    correctCount: 21,
    incorrectCount: 3,
    unansweredCount: 1,
    timeSpentMinutes: 32
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>Cognitive AI Performance Analysis</h1>
          <Badge variant="primary" dot>Structured Analytics Engine</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          In-depth algorithmic decomposition of your examination attempts, topic mastery percentages, and revision roadmap.
        </p>
      </div>

      {/* Aggregate Score Breakdown */}
      <div>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.85rem' }}>Latest Examination Metric Roster</h3>
        <ScoreBreakdown result={recentSubmissionResult} />
      </div>

      {/* Topic Accuracy Breakdown & Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        <SubjectMasteryCard topicBreakdown={analytics?.topicBreakdown} />
        <Card title="Multi-Axis Concept Mastery Radar" subtitle="Topic competency mapped across core syllabus">
          <TopicRadarChart />
        </Card>
      </div>

      {/* Course Subject Accuracy */}
      <Card title="Subject Accuracy Rates (%)" subtitle="Performance across computer science curriculum">
        <SubjectAccuracyChart />
      </Card>

      {/* AI Diagnostic Insights & Action Plan */}
      <AIRecommendations insights={analytics?.aiDiagnosticInsights} />
    </div>
  );
}

