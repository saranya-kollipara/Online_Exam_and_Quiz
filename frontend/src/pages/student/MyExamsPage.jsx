import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import ExamCard from '../../components/student/ExamCard';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import { History, CheckCircle2, Clock, Calendar } from 'lucide-react';

export default function MyExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'active', 'upcoming', 'completed'

  useEffect(() => {
    async function load() {
      const data = await examService.getAllExams();
      setExams(data);
    }
    load();
  }, []);

  const filtered = exams.filter((e) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'completed') return e.status === 'completed' || e.attemptsMade > 0;
    return e.status === activeTab;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h1 className="heading-2" style={{ margin: 0 }}>My Examination Records</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Track scheduled dates, active sessions, and review submitted assessment solutions.
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
        {[
          { id: 'all', label: 'All Records', count: exams.length },
          { id: 'active', label: 'Active Live', count: exams.filter((e) => e.status === 'active').length },
          { id: 'upcoming', label: 'Upcoming', count: exams.filter((e) => e.status === 'upcoming').length },
          { id: 'completed', label: 'Completed History', count: exams.filter((e) => e.status === 'completed' || e.attemptsMade > 0).length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '0.5rem 1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: activeTab === tab.id ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
              color: activeTab === tab.id ? '#191B18' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.85rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <span>{tab.label}</span>
            <span
              style={{
                fontSize: '0.72rem',
                backgroundColor: activeTab === tab.id ? 'rgba(0,0,0,0.15)' : 'var(--bg-card)',
                padding: '1px 6px',
                borderRadius: '9999px'
              }}
            >
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
        {filtered.map((exam) => (
          <ExamCard
            key={exam.id}
            exam={exam}
            onStart={(ex) => navigate(`/exam/${ex.id}/instructions`)}
            onReview={(ex) => navigate(`/exam/${ex.id}/result`)}
          />
        ))}
      </div>
    </div>
  );
}
