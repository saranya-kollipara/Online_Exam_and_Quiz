import React, { useState } from 'react';
import Modal from '../common/Modal';
import Button from '../common/Button';
import Input from '../common/Input';
import { STREAMS, SUBJECTS_BY_STREAM } from '../../utils/mockData';
import { aiService } from '../../services/aiService';
import { Sparkles, BrainCircuit } from 'lucide-react';

export default function MockTestGeneratorModal({ isOpen, onClose, onGenerated }) {
  const [stream, setStream] = useState('cse');
  const [subject, setSubject] = useState('Data Structures');
  const [topic, setTopic] = useState('Trees');
  const [numberOfQuestions, setNumberOfQuestions] = useState(10);
  const [duration, setDuration] = useState(20);
  const [difficulty, setDifficulty] = useState('Medium');
  const [questionType, setQuestionType] = useState('MCQ');
  const [isGenerating, setIsGenerating] = useState(false);

  const availableSubjects = SUBJECTS_BY_STREAM[stream] || [];
  const selectedSubjectObj = availableSubjects.find((s) => s.name === subject) || availableSubjects[0];
  const availableTopics = selectedSubjectObj?.topics || ['General'];

  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const mockTest = await aiService.generateStudentMockTest({
        stream,
        subject,
        topic,
        numberOfQuestions: Number(numberOfQuestions) || 10,
        duration: Number(duration) || 20,
        difficulty,
        questionType
      });
      if (mockTest) {
        onGenerated(mockTest);
        onClose();
      }
    } catch (err) {
      console.error('Failed to generate mock test:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Generate AI Practice Mock Test"
      size="large"
    >
      <form onSubmit={handleGenerate} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Configure your targeted practice session. The Quentrix AI engine will synthesize unique, curriculum-aligned questions with detailed step-by-step explanations.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
          {/* Engineering Stream */}
          <Input
            as="select"
            label="Engineering Stream"
            value={stream}
            onChange={(e) => {
              const newStream = e.target.value;
              setStream(newStream);
              const subs = SUBJECTS_BY_STREAM[newStream] || [];
              const firstSub = subs[0]?.name || 'Core';
              setSubject(firstSub);
              const topics = subs[0]?.topics || ['General'];
              setTopic(topics[0] || 'General');
            }}
          >
            {STREAMS.map((s) => (
              <option key={s.id} value={s.id} style={{ background: '#252923' }}>
                {s.name}
              </option>
            ))}
          </Input>

          {/* Subject */}
          <Input
            as="select"
            label="Subject"
            value={subject}
            onChange={(e) => {
              const newSub = e.target.value;
              setSubject(newSub);
              const foundObj = availableSubjects.find((s) => s.name === newSub);
              const topics = foundObj?.topics || ['General'];
              setTopic(topics[0] || 'General');
            }}
          >
            {availableSubjects.map((s) => (
              <option key={s.id} value={s.name} style={{ background: '#252923' }}>
                {s.name}
              </option>
            ))}
          </Input>

          {/* Topic */}
          <Input
            as="select"
            label="Specific Topic / Unit"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          >
            {availableTopics.map((t, idx) => (
              <option key={idx} value={t} style={{ background: '#252923' }}>
                {t}
              </option>
            ))}
          </Input>

          {/* Difficulty */}
          <Input
            as="select"
            label="Target Difficulty"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="Easy" style={{ background: '#252923' }}>Easy (Fundamental check)</option>
            <option value="Medium" style={{ background: '#252923' }}>Medium (Standard Exam Level)</option>
            <option value="Hard" style={{ background: '#252923' }}>Hard (Deep Edge-cases)</option>
            <option value="Mixed" style={{ background: '#252923' }}>Mixed (Adaptive Curve)</option>
          </Input>

          {/* Question Type */}
          <Input
            as="select"
            label="Question Format"
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value)}
          >
            <option value="MCQ" style={{ background: '#252923' }}>Single-Choice MCQ</option>
            <option value="Multiple select" style={{ background: '#252923' }}>Multiple Select</option>
            <option value="True/False" style={{ background: '#252923' }}>True / False</option>
            <option value="Programming" style={{ background: '#252923' }}>Programming Assessment</option>
            <option value="Mixed" style={{ background: '#252923' }}>Comprehensive Mixed</option>
          </Input>

          {/* Question Count */}
          <Input
            type="number"
            min={3}
            max={30}
            label="Question Count"
            value={numberOfQuestions}
            onChange={(e) => setNumberOfQuestions(e.target.value)}
          />

          {/* Duration */}
          <Input
            type="number"
            min={5}
            max={120}
            label="Duration (Minutes)"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </div>

        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1rem' }}>
          <Button variant="secondary" onClick={onClose} disabled={isGenerating}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="primary"
            isLoading={isGenerating}
            rightIcon={<Sparkles size={16} />}
          >
            {isGenerating ? 'Synthesizing Questions...' : 'Generate & Launch Mock Test'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

