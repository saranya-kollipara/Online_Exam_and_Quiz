import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import ExamCard from '../../components/student/ExamCard';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Badge from '../../components/common/Badge';
import { BookOpen, Search, Filter } from 'lucide-react';

export default function AvailableExamsPage() {
  const navigate = useNavigate();
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await examService.getAllExams();
        setExams(data);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, []);

  const filtered = exams.filter((e) => {
    const matchSearch =
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.subject.toLowerCase().includes(search.toLowerCase()) ||
      e.topic.toLowerCase().includes(search.toLowerCase());
    const matchDiff = difficultyFilter === 'all' || e.difficulty === difficultyFilter;
    return matchSearch && matchDiff;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>Available Examinations</h1>
          <Badge variant="primary">{filtered.length} Assessments</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Browse scheduled departmental midterms, quizzes, and live programming evaluations.
        </p>
      </div>

      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            placeholder="Search by exam title, subject, or unit..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <Input
            as="select"
            value={difficultyFilter}
            onChange={(e) => setDifficultyFilter(e.target.value)}
          >
            <option value="all">All Difficulties</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </Input>
        </div>
      </Card>

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

