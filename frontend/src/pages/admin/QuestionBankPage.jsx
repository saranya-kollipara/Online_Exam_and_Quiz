import React, { useState, useEffect } from 'react';
import { questionService } from '../../services/questionService';
import { STREAMS, SUBJECTS_BY_STREAM } from '../../utils/mockData';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Database,
  PlusCircle,
  Upload,
  Search,
  Filter,
  Trash2,
  Edit3,
  Clock,
  Layers,
  Code2,
  CheckCircle2,
  FileSpreadsheet
} from 'lucide-react';

export default function QuestionBankPage() {
  const { success, warning, error: toastError } = useToast();
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Filters
  const [search, setSearch] = useState('');
  const [selectedStream, setSelectedStream] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedType, setSelectedType] = useState('all');

  // Modals
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [activeQuestion, setActiveQuestion] = useState(null);

  const loadQuestions = async () => {
    setIsLoading(true);
    try {
      const data = await questionService.getAllQuestions({
        search,
        stream: selectedStream,
        difficulty: selectedDifficulty,
        type: selectedType
      });
      setQuestions(data);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [search, selectedStream, selectedDifficulty, selectedType]);

  const handleDelete = async (id) => {
    await questionService.deleteQuestion(id);
    success('Question removed from question repository.');
    loadQuestions();
  };

  const handleImport = async (e) => {
    e.preventDefault();
    try {
      await questionService.importQuestions(importJsonText);
      success('Question batch imported into repository successfully!');
      setIsImportModalOpen(false);
      setImportJsonText('');
      loadQuestions();
    } catch (err) {
      toastError(err.message);
    }
  };

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    if (activeQuestion.id) {
      await questionService.updateQuestion(activeQuestion.id, activeQuestion);
      success('Question updated successfully.');
    } else {
      await questionService.addQuestion(activeQuestion);
      success('Question added to Question Bank.');
    }
    setIsAddModalOpen(false);
    loadQuestions();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="heading-2" style={{ margin: 0 }}>Curriculum Question Bank</h1>
            <Badge variant="primary">{questions.length} Items</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Curate, organize, search, and batch-import accredited items across engineering streams.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="md"
            onClick={() => setIsImportModalOpen(true)}
            leftIcon={<Upload size={16} />}
          >
            Import File (JSON/CSV)
          </Button>
          <Button
            variant="primary"
            size="md"
            onClick={() => {
              setActiveQuestion({
                text: '',
                stream: 'cse',
                subject: 'Data Structures',
                topic: 'Trees',
                type: 'MCQ',
                difficulty: 'Medium',
                marks: 2,
                negativeMarks: 0.5,
                options: [
                  { id: 'A', text: '' },
                  { id: 'B', text: '' },
                  { id: 'C', text: '' },
                  { id: 'D', text: '' }
                ],
                correctAnswer: 'A',
                explanation: ''
              });
              setIsAddModalOpen(true);
            }}
            leftIcon={<PlusCircle size={16} />}
          >
            Add Question
          </Button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <Card style={{ padding: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <Input
            placeholder="Search questions or topics..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            leftIcon={<Search size={16} />}
          />

          <Input
            as="select"
            value={selectedStream}
            onChange={(e) => setSelectedStream(e.target.value)}
          >
            <option value="all" style={{ background: '#252923' }}>All Engineering Streams</option>
            {STREAMS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#252923' }}>
                {s.name}
              </option>
            ))}
          </Input>

          <Input
            as="select"
            value={selectedDifficulty}
            onChange={(e) => setSelectedDifficulty(e.target.value)}
          >
            <option value="all" style={{ background: '#252923' }}>All Difficulties</option>
            <option value="Easy" style={{ background: '#252923' }}>Easy</option>
            <option value="Medium" style={{ background: '#252923' }}>Medium</option>
            <option value="Hard" style={{ background: '#252923' }}>Hard</option>
          </Input>

          <Input
            as="select"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
          >
            <option value="all" style={{ background: '#252923' }}>All Types</option>
            <option value="MCQ" style={{ background: '#252923' }}>Single-Choice MCQ</option>
            <option value="Multiple select" style={{ background: '#252923' }}>Multiple Select</option>
            <option value="True/False" style={{ background: '#252923' }}>True/False</option>
            <option value="Programming" style={{ background: '#252923' }}>Programming</option>
          </Input>
        </div>
      </Card>

      {/* Questions Listing */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {questions.length === 0 ? (
          <Card style={{ textAlign: 'center', padding: '3rem 1.5rem', color: 'var(--text-secondary)' }}>
            <Database size={36} color="var(--accent-primary)" style={{ marginBottom: '1rem' }} />
            <h3>No questions found in this filter view</h3>
            <p style={{ fontSize: '0.88rem' }}>Try clearing your search query or adjusting stream filters.</p>
          </Card>
        ) : (
          questions.map((q, idx) => (
            <Card key={q.id || idx} hoverable style={{ padding: '1.25rem 1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <Badge variant="primary">{q.type || 'MCQ'}</Badge>
                  <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'highlight' : 'secondary'}>
                    {q.difficulty}
                  </Badge>
                  <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--accent-highlight)' }}>
                    {q.subject}
                  </span>
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>• {q.topic}</span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Clock size={12} /> Used in {q.timesUsed || 0} exams
                  </span>
                  <button
                    onClick={() => {
                      setActiveQuestion(q);
                      setIsAddModalOpen(true);
                    }}
                    style={{ background: 'none', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', padding: '4px' }}
                    title="Edit Question"
                  >
                    <Edit3 size={15} />
                  </button>
                  <button
                    onClick={() => handleDelete(q.id)}
                    style={{ background: 'none', border: 'none', color: 'var(--status-danger)', cursor: 'pointer', padding: '4px' }}
                    title="Delete Question"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              <p style={{ fontSize: '0.98rem', fontWeight: 500, color: 'var(--text-primary)', marginBottom: '1rem', lineHeight: 1.5 }}>
                {q.text}
              </p>

              {q.options && q.options.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  {q.options.map((opt) => {
                    const isKey = Array.isArray(q.correctAnswer)
                      ? q.correctAnswer.includes(opt.id)
                      : q.correctAnswer === opt.id;
                    return (
                      <div
                        key={opt.id}
                        style={{
                          padding: '0.45rem 0.75rem',
                          backgroundColor: isKey ? 'rgba(184, 213, 139, 0.12)' : 'var(--bg-secondary)',
                          border: `1px solid ${isKey ? 'var(--accent-secondary)' : 'var(--border-subtle)'}`,
                          borderRadius: 'var(--radius-xs)',
                          fontSize: '0.82rem',
                          color: isKey ? 'var(--accent-secondary)' : 'var(--text-secondary)'
                        }}
                      >
                        <strong>{opt.id}.</strong> {opt.text} {isKey && '✓'}
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          ))
        )}
      </div>

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Batch Import Questions"
        size="large"
      >
        <form onSubmit={handleImport} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', margin: 0 }}>
            Paste raw JSON array of curriculum questions, or click "Load Sample Dataset" to populate immediately.
          </p>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => {
              setImportJsonText(JSON.stringify([
                {
                  text: 'Which memory allocation scheme is prone to external fragmentation?',
                  subject: 'Operating Systems',
                  topic: 'Memory Management',
                  stream: 'cse',
                  type: 'MCQ',
                  difficulty: 'Medium',
                  marks: 2,
                  negativeMarks: 0.5,
                  options: [
                    { id: 'A', text: 'Paging' },
                    { id: 'B', text: 'Segmentation' },
                    { id: 'C', text: 'Inverted Paging' },
                    { id: 'D', text: 'Virtual Memory Swapping' }
                  ],
                  correctAnswer: 'B',
                  explanation: 'Segmentation allocates variable-sized blocks.'
                }
              ], null, 2));
            }}
          >
            Insert Sample JSON Template
          </Button>

          <Input
            as="textarea"
            style={{ minHeight: '220px', fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}
            value={importJsonText}
            onChange={(e) => setImportJsonText(e.target.value)}
            placeholder="[ { text: '...', options: [...], correctAnswer: 'A' } ]"
          />

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <Button variant="secondary" onClick={() => setIsImportModalOpen(false)}>Cancel</Button>
            <Button type="submit" variant="primary">Import Items</Button>
          </div>
        </form>
      </Modal>

      {/* Add / Edit Question Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title={activeQuestion?.id ? 'Edit Question' : 'Add Question'}
        size="large"
      >
        {activeQuestion && (
          <form onSubmit={handleSaveQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              as="textarea"
              label="Question Statement"
              required
              value={activeQuestion.text}
              onChange={(e) => setActiveQuestion({ ...activeQuestion, text: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <Input
                as="select"
                label="Stream"
                value={activeQuestion.stream}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, stream: e.target.value })}
              >
                {STREAMS.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </Input>

              <Input
                label="Subject"
                value={activeQuestion.subject}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, subject: e.target.value })}
              />

              <Input
                label="Topic"
                value={activeQuestion.topic}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, topic: e.target.value })}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <Input
                as="select"
                label="Type"
                value={activeQuestion.type}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, type: e.target.value })}
              >
                <option value="MCQ">MCQ</option>
                <option value="Multiple select">Multiple select</option>
                <option value="True/False">True/False</option>
                <option value="Programming">Programming</option>
              </Input>

              <Input
                as="select"
                label="Difficulty"
                value={activeQuestion.difficulty}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Input>

              <Input
                type="number"
                label="Marks"
                value={activeQuestion.marks || 2}
                onChange={(e) => setActiveQuestion({ ...activeQuestion, marks: Number(e.target.value) })}
              />
            </div>

            <Input
              label="Correct Answer Key (e.g. A, B)"
              value={activeQuestion.correctAnswer}
              onChange={(e) => setActiveQuestion({ ...activeQuestion, correctAnswer: e.target.value })}
            />

            <Input
              as="textarea"
              label="Solution Explanation"
              value={activeQuestion.explanation || ''}
              onChange={(e) => setActiveQuestion({ ...activeQuestion, explanation: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save to Bank</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

