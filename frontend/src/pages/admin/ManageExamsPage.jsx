import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { examService } from '../../services/examService';
import { formatDate } from '../../utils/formatters';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  FileCheck2,
  Search,
  PlusCircle,
  Play,
  Pause,
  Archive,
  Eye,
  Edit,
  Trash2,
  Users,
  Award,
  Clock
} from 'lucide-react';

export default function ManageExamsPage() {
  const navigate = useNavigate();
  const { success, warning, error: toastError } = useToast();
  const [exams, setExams] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedExamDetails, setSelectedExamDetails] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const loadExams = async () => {
    setIsLoading(true);
    try {
      const data = await examService.getAllExams({ search, status: statusFilter });
      setExams(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadExams();
  }, [search, statusFilter]);

  const handleToggleStatus = async (exam) => {
    const nextStatus = exam.status === 'active' ? 'draft' : 'active';
    await examService.updateExamStatus(exam.id, nextStatus);
    success(`Exam status updated to ${nextStatus.toUpperCase()}`);
    loadExams();
  };

  const handleArchive = async (examId) => {
    await examService.updateExamStatus(examId, 'completed');
    success('Exam archived and moved to completed history.');
    loadExams();
  };

  const handleDelete = async (examId) => {
    await examService.deleteExam(examId);
    warning('Examination deleted.');
    loadExams();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="heading-2" style={{ margin: 0 }}>Examination Management</h1>
            <Badge variant="primary">{exams.length} Total</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Control scheduled examinations, toggle active proctoring, view attempt rosters, and archive past sessions.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => navigate('/admin/create-exam')}
          leftIcon={<PlusCircle size={16} />}
        >
          Create New Exam
        </Button>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          <Input
            placeholder="Search exam title or subject..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <Input
            as="select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all" style={{ background: '#252923' }}>All Lifecycle States</option>
            <option value="active" style={{ background: '#252923' }}>Active (Live)</option>
            <option value="upcoming" style={{ background: '#252923' }}>Upcoming (Scheduled)</option>
            <option value="completed" style={{ background: '#252923' }}>Completed / Archived</option>
          </Input>
        </div>
      </Card>

      {/* Exams Table / Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {exams.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}>
            <FileCheck2 size={36} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h3>No examinations match this filter</h3>
            <p style={{ fontSize: '0.88rem' }}>Adjust search or generate a new exam from the creator.</p>
          </Card>
        ) : (
          exams.map((exam) => (
            <Card key={exam.id} hoverable style={{ padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                      {exam.title}
                    </h3>
                    <Badge
                      variant={
                        exam.status === 'active'
                          ? 'secondary'
                          : exam.status === 'completed'
                          ? 'muted'
                          : 'highlight'
                      }
                      dot={exam.status === 'active'}
                    >
                      {exam.status}
                    </Badge>
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--accent-highlight)' }}>
                    {exam.stream} • <span style={{ color: 'var(--text-secondary)' }}>{exam.subject} ({exam.topic})</span>
                  </div>
                </div>

                {/* Operations Toolbar */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedExamDetails(exam)}
                    leftIcon={<Eye size={14} />}
                  >
                    Details
                  </Button>

                  <Button
                    variant={exam.status === 'active' ? 'secondary' : 'accent'}
                    size="sm"
                    onClick={() => handleToggleStatus(exam)}
                    leftIcon={exam.status === 'active' ? <Pause size={14} /> : <Play size={14} />}
                  >
                    {exam.status === 'active' ? 'Deactivate' : 'Activate'}
                  </Button>

                  {exam.status !== 'completed' && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleArchive(exam.id)}
                      leftIcon={<Archive size={14} />}
                    >
                      Archive
                    </Button>
                  )}

                  <button
                    onClick={() => handleDelete(exam.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '6px' }}
                    title="Delete Exam"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Metrics Row */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                  gap: '0.75rem',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.85rem',
                  borderRadius: 'var(--radius-sm)',
                  fontSize: '0.8rem'
                }}
              >
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Duration:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{exam.durationMinutes}m</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Questions:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{exam.totalQuestions}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Enrolled:</span>{' '}
                  <strong style={{ color: 'var(--text-primary)' }}>{exam.totalEnrolled || 140}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Completed:</span>{' '}
                  <strong style={{ color: 'var(--accent-secondary)' }}>{exam.participated || 0}</strong>
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>Average Score:</span>{' '}
                  <strong style={{ color: 'var(--accent-highlight)' }}>{exam.averageScore || 0}%</strong>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Exam Details Modal */}
      <Modal
        isOpen={!!selectedExamDetails}
        onClose={() => setSelectedExamDetails(null)}
        title="Examination Configuration & Attempt Audit"
        size="large"
      >
        {selectedExamDetails && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {selectedExamDetails.title}
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.5 }}>
                {selectedExamDetails.description}
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', backgroundColor: 'var(--bg-secondary)', padding: '1rem', borderRadius: 'var(--radius-sm)', fontSize: '0.85rem' }}>
              <div><strong>Subject:</strong> {selectedExamDetails.subject}</div>
              <div><strong>Topic:</strong> {selectedExamDetails.topic}</div>
              <div><strong>Difficulty:</strong> {selectedExamDetails.difficulty}</div>
              <div><strong>Format:</strong> {selectedExamDetails.questionType}</div>
              <div><strong>Negative Marking:</strong> {selectedExamDetails.negativeMarking ? `Yes (-${selectedExamDetails.negativeMarks})` : 'Disabled'}</div>
              <div><strong>Max Attempts:</strong> {selectedExamDetails.maxAttempts}</div>
              <div><strong>Start Date:</strong> {formatDate(selectedExamDetails.startDate)}</div>
              <div><strong>End Date:</strong> {formatDate(selectedExamDetails.endDate)}</div>
            </div>

            <div>
              <h4 style={{ fontSize: '0.95rem', fontWeight: 700, marginBottom: '0.5rem' }}>Student Participation Status</h4>
              <div style={{ display: 'flex', gap: '1.5rem', fontSize: '0.85rem' }}>
                <div>Total Candidates: <strong>{selectedExamDetails.totalEnrolled || 140}</strong></div>
                <div>Submissions Logged: <strong>{selectedExamDetails.participated || 0}</strong></div>
                <div>Highest Score: <strong>{selectedExamDetails.highestScore || 0} pts</strong></div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setSelectedExamDetails(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}

