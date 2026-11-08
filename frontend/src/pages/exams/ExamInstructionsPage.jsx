import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import { useExam } from '../../hooks/useExam';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  ShieldCheck,
  Clock,
  HelpCircle,
  Award,
  AlertTriangle,
  Play,
  CheckSquare,
  AlertCircle
} from 'lucide-react';

export default function ExamInstructionsPage() {
  const { examId } = useParams();
  const navigate = useNavigate();
  const { startExam } = useExam();
  const [exam, setExam] = useState(null);
  const [agreed, setAgreed] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const data = await examService.getExamById(examId);
        setExam(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [examId]);

  const handleBegin = () => {
    if (!agreed) return;
    startExam(exam);
    navigate(`/exam/${exam.id}`);
  };

  if (isLoading || !exam) {
    return (
      <div className="container" style={{ padding: '4rem 1.5rem', textAlign: 'center' }}>
        Loading examination specifications...
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '3.5rem 1.5rem', maxWidth: '850px' }}>
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <Badge variant="primary" style={{ marginBottom: '0.6rem' }}>Proctored Evaluation Room</Badge>
        <h1 className="heading-1" style={{ marginBottom: '0.5rem' }}>{exam.title}</h1>
        <p style={{ color: 'var(--accent-highlight)', fontSize: '1rem', fontWeight: 600 }}>
          {exam.stream} • {exam.subject} ({exam.topic})
        </p>
      </div>

      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1.25rem', color: 'var(--text-primary)' }}>
          Examination Parameters
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.75rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)' }}>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Duration</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{exam.durationMinutes} Minutes</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Questions</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{exam.totalQuestions} Items</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Total Marks</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--accent-secondary)' }}>{exam.totalMarks} Marks</div>
          </div>
          <div>
            <div style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>Negative Penalty</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', color: exam.negativeMarking ? 'var(--status-danger)' : 'var(--text-secondary)' }}>
              {exam.negativeMarking ? `-${exam.negativeMarks || 0.5} per wrong` : 'None'}
            </div>
          </div>
        </div>

        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem', color: 'var(--text-primary)' }}>
          Mandatory Candidate Regulations:
        </h4>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.75rem' }}>
          <div>1. <strong>Single Active Window:</strong> Switching tabs or minimizing the browser window will generate an automated proctoring telemetry alert.</div>
          <div>2. <strong>Auto-Save:</strong> Your answers are saved continuously in real-time. You can revise any response prior to final submission.</div>
          <div>3. <strong>Auto-Submission:</strong> When the timer expires, all saved answers are submitted automatically to the grading cluster.</div>
          <div>4. <strong>Question Palette:</strong> Use the right-hand palette to mark questions for review or jump directly between question numbers.</div>
        </div>

        {/* Agreement Checkbox */}
        <label
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            padding: '1rem',
            backgroundColor: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-medium)',
            cursor: 'pointer',
            fontSize: '0.9rem',
            color: 'var(--text-primary)',
            marginBottom: '1.5rem'
          }}
        >
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            style={{ width: '18px', height: '18px', accentColor: 'var(--accent-primary)' }}
          />
          <span>I have read and agree to comply with the academic honesty honor code and examination regulations.</span>
        </label>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
          <Button variant="secondary" onClick={() => navigate('/student/available-exams')}>
            Return to Dashboard
          </Button>
          <Button
            variant="primary"
            size="lg"
            disabled={!agreed}
            onClick={handleBegin}
            rightIcon={<Play size={18} />}
          >
            Enter Examination Room
          </Button>
        </div>
      </Card>
    </div>
  );
}

