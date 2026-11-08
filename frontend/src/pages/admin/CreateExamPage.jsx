import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { STREAMS, SUBJECTS_BY_STREAM } from '../../utils/mockData';
import { aiService } from '../../services/aiService';
import { examService } from '../../services/examService';
import { useToast } from '../../hooks/useToast';
import Card from '../../components/common/Card';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import Modal from '../../components/common/Modal';
import {
  Sparkles,
  CheckCircle2,
  Trash2,
  Edit3,
  RefreshCw,
  PlusCircle,
  FileCheck,
  AlertTriangle,
  Code2,
  HelpCircle,
  Clock,
  ShieldCheck,
  Shuffle
} from 'lucide-react';

export default function CreateExamPage() {
  const navigate = useNavigate();
  const { success, warning, error: toastError } = useToast();

  // 12 Configuration Fields
  const [stream, setStream] = useState('cse');
  const [subject, setSubject] = useState('Data Structures');
  const [topic, setTopic] = useState('Trees');
  const [numberOfQuestions, setNumberOfQuestions] = useState(5);
  const [duration, setDuration] = useState(45);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('Mixed');
  const [marksPerQuestion, setMarksPerQuestion] = useState(2);
  const [negativeMarking, setNegativeMarking] = useState(true);
  const [negativeMarks, setNegativeMarks] = useState(0.5);
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 16));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 86400000).toISOString().slice(0, 16));
  const [maxAttempts, setMaxAttempts] = useState(1);
  const [examTitle, setExamTitle] = useState('');

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState([]);
  const [hasGenerated, setHasGenerated] = useState(false);

  // Edit/Add Question Modal
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentEditQuestion, setCurrentEditQuestion] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const availableSubjects = SUBJECTS_BY_STREAM[stream] || [];
  const selectedSubjectObj = availableSubjects.find((s) => s.name === subject) || availableSubjects[0];
  const availableTopics = selectedSubjectObj?.topics || ['General'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const questions = await aiService.generateExamQuestions({
        stream,
        subject,
        topic,
        numberOfQuestions: Number(numberOfQuestions),
        difficulty,
        questionType,
        marksPerQuestion: Number(marksPerQuestion),
        negativeMarks: Number(negativeMarks)
      });
      setGeneratedQuestions(questions);
      setHasGenerated(true);
      if (!examTitle) {
        setExamTitle(`${subject} - ${topic} Midterm Evaluation`);
      }
      success(`Synthesized ${questions.length} questions! Please review and approve each before publishing.`);
    } catch (err) {
      toastError('Failed to generate questions: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleRegenerateSingle = async (index) => {
    const q = generatedQuestions[index];
    try {
      const refreshed = await aiService.regenerateSingleQuestion(q);
      setGeneratedQuestions((prev) => {
        const next = [...prev];
        next[index] = refreshed;
        return next;
      });
      success(`Regenerated Question ${index + 1} variation.`);
    } catch (err) {
      toastError('Regeneration failed');
    }
  };

  const handleDeleteQuestion = (index) => {
    setGeneratedQuestions((prev) => prev.filter((_, i) => i !== index));
    warning(`Question ${index + 1} removed.`);
  };

  const handleToggleApprove = (index) => {
    setGeneratedQuestions((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], isApproved: !next[index].isApproved };
      return next;
    });
  };

  const handleApproveAll = () => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => ({ ...q, isApproved: true }))
    );
    success('All synthesized questions approved for examination publishing.');
  };

  const handleJumbleAllOptions = () => {
    setGeneratedQuestions((prev) =>
      prev.map((q) => aiService.shuffleQuestionOptions(q))
    );
    success('Jumbled and randomized all question options with updated correct answer keys!');
  };

  const handleOpenEdit = (q, index) => {
    setCurrentEditQuestion({ ...q, _index: index });
    setIsEditModalOpen(true);
  };

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (currentEditQuestion._index != null) {
      setGeneratedQuestions((prev) => {
        const next = [...prev];
        next[currentEditQuestion._index] = { ...currentEditQuestion, isApproved: true };
        return next;
      });
    } else {
      // Add manual question
      setGeneratedQuestions((prev) => [
        ...prev,
        {
          ...currentEditQuestion,
          id: 'q_man_' + Date.now(),
          isApproved: true,
          timesUsed: 0
        }
      ]);
    }
    setIsEditModalOpen(false);
    success('Question saved and marked approved.');
  };

  const handlePublishExam = async () => {
    // Guardrail: Never automatically publish AI-generated questions without admin review and approval.
    const unapprovedCount = generatedQuestions.filter((q) => !q.isApproved).length;
    if (unapprovedCount > 0) {
      warning(`Academic Guardrail: ${unapprovedCount} question(s) have not been reviewed and approved. Please approve all questions before publishing.`);
      return;
    }

    if (generatedQuestions.length === 0) {
      warning('Cannot publish an examination with 0 questions.');
      return;
    }

    setIsPublishing(true);
    try {
      const streamName = STREAMS.find((s) => s.id === stream)?.name || 'Engineering';
      const newExam = await examService.createExam({
        title: examTitle || `${subject} Assessment`,
        stream,
        streamName,
        subject,
        topic,
        numberOfQuestions: generatedQuestions.length,
        duration,
        marksPerQuestion,
        negativeMarking,
        negativeMarks,
        difficulty,
        questionType,
        startDate,
        endDate,
        maxAttempts,
        questions: generatedQuestions
      });

      success(`Examination '${newExam.title}' published successfully!`);
      navigate('/admin/manage-exams');
    } catch (err) {
      toastError(err.message || 'Failed to publish examination');
    } finally {
      setIsPublishing(false);
    }
  };

  const approvedCount = generatedQuestions.filter((q) => q.isApproved).length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Page Header */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>AI-Powered Examination Creator</h1>
          <Badge variant="primary" dot>Human-in-the-Loop</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Configure rigorous curriculum parameters. Synthesize questions, review solutions, enforce approval, and publish.
        </p>
      </div>

      {/* Step 1: 12 Configuration Parameters Form */}
      <Card title="1. Academic Assessment Configuration" subtitle="Define the 12 core examination specifications">
        <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
            {/* 1. Engineering Stream */}
            <Input
              as="select"
              label="1. Engineering Stream"
              value={stream}
              onChange={(e) => {
                const newStream = e.target.value;
                setStream(newStream);
                const subs = SUBJECTS_BY_STREAM[newStream] || [];
                const firstSub = subs[0]?.name || 'Core';
                setSubject(firstSub);
                const firstTopics = subs[0]?.topics || ['General'];
                setTopic(firstTopics[0] || 'General');
              }}
            >
              {STREAMS.map((s) => (
                <option key={s.id} value={s.id} style={{ background: '#252923' }}>
                  {s.name}
                </option>
              ))}
            </Input>

            {/* 2. Subject */}
            <Input
              as="select"
              label="2. Subject"
              value={subject}
              onChange={(e) => {
                const newSub = e.target.value;
                setSubject(newSub);
                const subObj = availableSubjects.find((s) => s.name === newSub);
                const topics = subObj?.topics || ['General'];
                setTopic(topics[0] || 'General');
              }}
            >
              {availableSubjects.map((s) => (
                <option key={s.id} value={s.name} style={{ background: '#252923' }}>
                  {s.name}
                </option>
              ))}
            </Input>

            {/* 3. Unit or Topic */}
            <Input
              as="select"
              label="3. Unit or Topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              {availableTopics.map((t, idx) => (
                <option key={idx} value={t} style={{ background: '#252923' }}>
                  {t}
                </option>
              ))}
            </Input>

            {/* 4. Number of Questions */}
            <Input
              type="number"
              min={1}
              max={100}
              label="4. Number of Questions"
              value={numberOfQuestions}
              onChange={(e) => setNumberOfQuestions(e.target.value)}
            />

            {/* 5. Examination Duration */}
            <Input
              type="number"
              min={10}
              max={180}
              label="5. Duration (Minutes)"
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
            />

            {/* 6. Difficulty Level */}
            <Input
              as="select"
              label="6. Difficulty Level"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
            >
              <option value="Easy" style={{ background: '#252923' }}>Easy (Knowledge recall)</option>
              <option value="Medium" style={{ background: '#252923' }}>Medium (Standard Midterm)</option>
              <option value="Hard" style={{ background: '#252923' }}>Hard (Deep Edge-cases)</option>
              <option value="Mixed" style={{ background: '#252923' }}>Mixed (Balanced Distribution)</option>
            </Input>

            {/* 7. Question Type */}
            <Input
              as="select"
              label="7. Question Type"
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value)}
            >
              <option value="MCQ" style={{ background: '#252923' }}>Single-Choice MCQ</option>
              <option value="Multiple select" style={{ background: '#252923' }}>Multiple Select (Multi-choice)</option>
              <option value="True/False" style={{ background: '#252923' }}>True / False</option>
              <option value="Programming" style={{ background: '#252923' }}>Programming Assessment</option>
              <option value="Mixed" style={{ background: '#252923' }}>Mixed Types</option>
            </Input>

            {/* 8. Marks per Question */}
            <Input
              type="number"
              step="0.5"
              min={0.5}
              max={20}
              label="8. Marks Per Question"
              value={marksPerQuestion}
              onChange={(e) => setMarksPerQuestion(e.target.value)}
            />

            {/* 9. Negative Marking */}
            <div>
              <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                9. Negative Marking
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', height: '42px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={negativeMarking}
                    onChange={(e) => setNegativeMarking(e.target.checked)}
                    style={{ accentColor: 'var(--accent-primary)' }}
                  />
                  <span>Enable penalty</span>
                </label>
                {negativeMarking && (
                  <input
                    type="number"
                    step="0.25"
                    min={0.1}
                    max={5}
                    value={negativeMarks}
                    onChange={(e) => setNegativeMarks(e.target.value)}
                    style={{
                      width: '80px',
                      padding: '0.35rem 0.6rem',
                      borderRadius: 'var(--radius-xs)',
                      background: 'var(--bg-secondary)',
                      border: '1px solid var(--border-medium)',
                      color: 'var(--status-danger)'
                    }}
                  />
                )}
              </div>
            </div>

            {/* 10. Start Date and Time */}
            <Input
              type="datetime-local"
              label="10. Start Date & Time"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />

            {/* 11. End Date and Time */}
            <Input
              type="datetime-local"
              label="11. End Date & Time"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />

            {/* 12. Maximum Attempts */}
            <Input
              type="number"
              min={1}
              max={5}
              label="12. Maximum Attempts"
              value={maxAttempts}
              onChange={(e) => setMaxAttempts(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1.25rem' }}>
            <Button
              type="submit"
              variant="primary"
              size="lg"
              isLoading={isGenerating}
              rightIcon={<Sparkles size={18} />}
            >
              {isGenerating ? 'Synthesizing with Quentrix AI...' : 'Generate Exam Questions Preview'}
            </Button>
          </div>
        </form>
      </Card>

      {/* Step 2: Question Review, Approval & Guardrails */}
      {hasGenerated && (
        <Card
          title="2. Faculty Question Review & Approval Panel"
          subtitle={`Mandatory editorial approval: ${approvedCount} of ${generatedQuestions.length} approved`}
          action={
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleJumbleAllOptions}
                leftIcon={<Shuffle size={15} />}
                title="Randomly jumble all choices across A, B, C, D"
              >
                Jumble Options
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentEditQuestion({
                    text: '',
                    type: 'MCQ',
                    difficulty: 'Medium',
                    marks: marksPerQuestion,
                    negativeMarks,
                    subject,
                    topic,
                    stream,
                    options: [
                      { id: 'A', text: '' },
                      { id: 'B', text: '' },
                      { id: 'C', text: '' },
                      { id: 'D', text: '' }
                    ],
                    correctAnswer: 'A',
                    explanation: ''
                  });
                  setIsEditModalOpen(true);
                }}
                leftIcon={<PlusCircle size={15} />}
              >
                Add Question Manually
              </Button>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleApproveAll}
                leftIcon={<CheckCircle2 size={15} color="var(--accent-secondary)" />}
              >
                Approve All Questions
              </Button>
            </div>
          }
        >
          {/* Strict Notice Alert */}
          <div
            style={{
              padding: '0.85rem 1.1rem',
              borderRadius: 'var(--radius-sm)',
              backgroundColor: 'rgba(232, 197, 141, 0.1)',
              border: '1px solid rgba(232, 197, 141, 0.3)',
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              color: 'var(--accent-highlight)'
            }}
          >
            <ShieldCheck size={20} style={{ flexShrink: 0 }} />
            <span>
              <strong>Quentrix Guardrail:</strong> AI-generated questions are never published automatically. Review each question, verify the correct option, and mark approved.
            </span>
          </div>

          {/* List of Questions */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {generatedQuestions.map((q, idx) => (
              <div
                key={q.id || idx}
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1.5px solid ${q.isApproved ? 'rgba(184, 213, 139, 0.4)' : 'var(--border-medium)'}`,
                  borderRadius: 'var(--radius-md)',
                  padding: '1.25rem'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <span style={{ fontWeight: 800, color: 'var(--text-primary)' }}>Q{idx + 1}.</span>
                    <Badge variant="primary">{q.type}</Badge>
                    <Badge variant={q.difficulty === 'Hard' ? 'danger' : q.difficulty === 'Medium' ? 'highlight' : 'secondary'}>
                      {q.difficulty}
                    </Badge>
                    <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                      +{q.marks} Marks
                    </span>
                  </div>

                  {/* Actions for individual question */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button
                      onClick={() => handleToggleApprove(idx)}
                      style={{
                        padding: '0.35rem 0.75rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: q.isApproved ? 'rgba(184, 213, 139, 0.2)' : 'var(--bg-card)',
                        border: `1px solid ${q.isApproved ? 'var(--accent-secondary)' : 'var(--border-medium)'}`,
                        color: q.isApproved ? 'var(--accent-secondary)' : 'var(--text-muted)',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px'
                      }}
                    >
                      <CheckCircle2 size={14} />
                      {q.isApproved ? 'Approved' : 'Mark Approved'}
                    </button>

                    <button
                      onClick={() => handleRegenerateSingle(idx)}
                      style={{
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                      title="Regenerate single question"
                    >
                      <RefreshCw size={14} />
                    </button>

                    <button
                      onClick={() => handleOpenEdit(q, idx)}
                      style={{
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--text-secondary)',
                        cursor: 'pointer'
                      }}
                      title="Edit question"
                    >
                      <Edit3 size={14} />
                    </button>

                    <button
                      onClick={() => handleDeleteQuestion(idx)}
                      style={{
                        padding: '0.35rem',
                        borderRadius: 'var(--radius-xs)',
                        backgroundColor: 'var(--bg-card)',
                        border: '1px solid var(--border-medium)',
                        color: 'var(--status-danger)',
                        cursor: 'pointer'
                      }}
                      title="Delete question"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <p style={{ fontSize: '0.95rem', lineHeight: 1.5, color: 'var(--text-primary)', marginBottom: '1rem', fontWeight: 500 }}>
                  {q.text}
                </p>

                {/* Options List */}
                {q.options && q.options.length > 0 && (
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.5rem', marginBottom: '0.75rem' }}>
                    {q.options.map((opt) => {
                      const isCorrect = Array.isArray(q.correctAnswer)
                        ? q.correctAnswer.includes(opt.id)
                        : q.correctAnswer === opt.id;

                      return (
                        <div
                          key={opt.id}
                          style={{
                            padding: '0.5rem 0.75rem',
                            backgroundColor: isCorrect ? 'rgba(184, 213, 139, 0.12)' : 'var(--bg-card)',
                            border: `1px solid ${isCorrect ? 'var(--accent-secondary)' : 'var(--border-subtle)'}`,
                            borderRadius: 'var(--radius-xs)',
                            fontSize: '0.85rem',
                            color: isCorrect ? 'var(--accent-secondary)' : 'var(--text-secondary)',
                            fontWeight: isCorrect ? 600 : 400
                          }}
                        >
                          <strong>{opt.id}.</strong> {opt.text}
                          {isCorrect && ' ✓ (Correct Key)'}
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Explanation */}
                {q.explanation && (
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', backgroundColor: 'var(--bg-card)', padding: '0.6rem 0.85rem', borderRadius: 'var(--radius-xs)' }}>
                    <strong>Pedagogical Solution Key:</strong> {q.explanation}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Publishing Bar */}
          <div
            style={{
              marginTop: '2rem',
              paddingTop: '1.5rem',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '1rem'
            }}
          >
            <div>
              <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                Total Questions: {generatedQuestions.length} | Approved: {approvedCount}
              </div>
              <div style={{ fontSize: '0.78rem', color: approvedCount === generatedQuestions.length ? 'var(--accent-secondary)' : 'var(--accent-highlight)' }}>
                {approvedCount === generatedQuestions.length
                  ? 'All questions approved. Ready to deploy.'
                  : `Please approve the remaining ${generatedQuestions.length - approvedCount} question(s) to publish.`}
              </div>
            </div>

            <Button
              variant="primary"
              size="lg"
              disabled={approvedCount !== generatedQuestions.length || generatedQuestions.length === 0}
              onClick={handlePublishExam}
              isLoading={isPublishing}
              rightIcon={<FileCheck size={18} />}
            >
              Approve Questions & Publish Examination
            </Button>
          </div>
        </Card>
      )}

      {/* Edit / Add Question Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={currentEditQuestion?._index != null ? `Edit Question ${currentEditQuestion._index + 1}` : 'Add Custom Question'}
        size="large"
      >
        {currentEditQuestion && (
          <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <Input
              as="textarea"
              label="Question Statement"
              required
              value={currentEditQuestion.text}
              onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, text: e.target.value })}
            />

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              <Input
                as="select"
                label="Question Type"
                value={currentEditQuestion.type}
                onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, type: e.target.value })}
              >
                <option value="MCQ">MCQ</option>
                <option value="Multiple select">Multiple select</option>
                <option value="True/False">True/False</option>
                <option value="Programming">Programming</option>
              </Input>

              <Input
                as="select"
                label="Difficulty"
                value={currentEditQuestion.difficulty}
                onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, difficulty: e.target.value })}
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </Input>

              <Input
                type="number"
                label="Marks"
                value={currentEditQuestion.marks || 2}
                onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, marks: Number(e.target.value) })}
              />
            </div>

            {/* Options */}
            {currentEditQuestion.type !== 'Programming' && (
              <div>
                <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '0.4rem', display: 'block' }}>
                  Options & Correct Answer Key
                </label>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {(currentEditQuestion.options || []).map((opt, oIdx) => (
                    <div key={opt.id} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: 700, width: '20px' }}>{opt.id}.</span>
                      <Input
                        value={opt.text}
                        onChange={(e) => {
                          const updated = [...currentEditQuestion.options];
                          updated[oIdx] = { ...opt, text: e.target.value };
                          setCurrentEditQuestion({ ...currentEditQuestion, options: updated });
                        }}
                        placeholder={`Option ${opt.id}`}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Correct Answer (e.g. A, or A,B for multi-select)"
              value={Array.isArray(currentEditQuestion.correctAnswer) ? currentEditQuestion.correctAnswer.join(',') : currentEditQuestion.correctAnswer}
              onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, correctAnswer: e.target.value })}
            />

            <Input
              as="textarea"
              label="Pedagogical Solution / Explanation"
              value={currentEditQuestion.explanation || ''}
              onChange={(e) => setCurrentEditQuestion({ ...currentEditQuestion, explanation: e.target.value })}
            />

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
              <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>Cancel</Button>
              <Button type="submit" variant="primary">Save Question</Button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

