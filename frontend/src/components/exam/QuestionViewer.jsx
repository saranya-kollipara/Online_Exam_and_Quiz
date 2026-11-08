import React, { useState } from 'react';
import { useExam } from '../../hooks/useExam';
import Button from '../common/Button';
import Badge from '../common/Badge';
import CodeEditor from '../coding/CodeEditor';
import {
  ChevronLeft,
  ChevronRight,
  Bookmark,
  RotateCcw,
  CheckCircle2,
  Code2,
  AlertCircle
} from 'lucide-react';

export default function QuestionViewer() {
  const {
    currentQuestion,
    currentIndex,
    totalQuestions,
    answers,
    markedForReview,
    selectAnswer,
    toggleMultipleSelect,
    clearAnswer,
    toggleMarkForReview,
    nextQuestion,
    prevQuestion,
    exam
  } = useExam();

  const [codeAnswer, setCodeAnswer] = useState(
    '// Write your algorithmic solution below\nfunction solve() {\n  return 0;\n}'
  );

  if (!currentQuestion) {
    return (
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>
        No question active.
      </div>
    );
  }

  const qId = currentQuestion.id;
  const currentAnswer = answers[qId];
  const isMarked = !!markedForReview[qId];
  const isMultiple = currentQuestion.type === 'Multiple select';
  const isProgramming = currentQuestion.type === 'Programming';
  const isTrueFalse = currentQuestion.type === 'True/False';

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - 68px)',
        overflowY: 'auto',
        padding: '2rem 2.5rem',
        backgroundColor: 'var(--bg-primary)'
      }}
    >
      {/* Top Question Meta Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          borderBottom: '1px solid var(--border-subtle)',
          paddingBottom: '1rem',
          marginBottom: '1.5rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Question {currentIndex + 1}
          </span>
          <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>of {totalQuestions}</span>
          <Badge variant="primary">{currentQuestion.type || 'MCQ'}</Badge>
          <Badge variant={currentQuestion.difficulty === 'Hard' ? 'danger' : currentQuestion.difficulty === 'Medium' ? 'highlight' : 'secondary'}>
            {currentQuestion.difficulty || 'Medium'}
          </Badge>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
          <span style={{ color: 'var(--accent-secondary)', fontWeight: 600 }}>
            +{currentQuestion.marks || 2} Marks
          </span>
          {exam?.negativeMarking && (
            <span style={{ color: 'var(--status-danger)', fontWeight: 500 }}>
              -{currentQuestion.negativeMarks || 0.5} Negative
            </span>
          )}
        </div>
      </div>

      {/* Question Statement Body */}
      <div style={{ marginBottom: '2rem' }}>
        <p
          style={{
            fontSize: '1.15rem',
            lineHeight: 1.6,
            color: 'var(--text-primary)',
            fontWeight: 500,
            whiteSpace: 'pre-wrap'
          }}
        >
          {currentQuestion.text}
        </p>
      </div>

      {/* Question Options or Programming Canvas */}
      <div style={{ flex: 1, marginBottom: '2.5rem' }}>
        {isProgramming ? (
          <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-md)', overflow: 'hidden' }}>
            <div style={{ padding: '0.75rem 1rem', backgroundColor: 'var(--bg-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border-subtle)' }}>
              <Code2 size={16} color="var(--accent-primary)" />
              <span style={{ fontSize: '0.85rem', fontWeight: 600 }}>Programming Implementation Sandbox</span>
            </div>
            <div style={{ height: '320px' }}>
              <CodeEditor
                language="javascript"
                value={typeof currentAnswer === 'string' ? currentAnswer : codeAnswer}
                onChange={(newCode) => {
                  setCodeAnswer(newCode);
                  selectAnswer(qId, newCode);
                }}
              />
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {(currentQuestion.options || []).map((opt, optIdx) => {
              const optId = typeof opt === 'object' && opt !== null ? (opt.id || opt.optionKey || String.fromCharCode(65 + optIdx)) : String.fromCharCode(65 + optIdx);
              const optText = typeof opt === 'object' && opt !== null ? (opt.text || opt.title || '') : String(opt);
              const isSelected = isMultiple
                ? Array.isArray(currentAnswer) && currentAnswer.includes(optId)
                : currentAnswer === optId;

              return (
                <div
                  key={optId}
                  onClick={() => {
                    if (isMultiple) {
                      toggleMultipleSelect(qId, optId);
                    } else {
                      selectAnswer(qId, optId);
                    }
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem 1.25rem',
                    borderRadius: 'var(--radius-md)',
                    backgroundColor: isSelected ? 'rgba(216, 120, 85, 0.12)' : 'var(--bg-card)',
                    border: `1.5px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                    cursor: 'pointer',
                    transition: 'all var(--transition-fast)'
                  }}
                >
                  <div
                    style={{
                      width: '26px',
                      height: '26px',
                      borderRadius: isMultiple ? '4px' : '50%',
                      border: `2px solid ${isSelected ? 'var(--accent-primary)' : 'var(--border-medium)'}`,
                      backgroundColor: isSelected ? 'var(--accent-primary)' : 'transparent',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#ffffff',
                      fontWeight: 700,
                      fontSize: '0.85rem',
                      flexShrink: 0
                    }}
                  >
                    {isSelected ? (isMultiple ? '✓' : '●') : optId}
                  </div>
                  <div style={{ fontSize: '0.98rem', color: isSelected ? 'var(--text-primary)' : 'var(--text-secondary)' }}>
                    {optText}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div
        style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: '1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant={isMarked ? 'secondary' : 'outline'}
            size="md"
            onClick={() => toggleMarkForReview(qId)}
            leftIcon={<Bookmark size={16} />}
            style={{
              color: isMarked ? 'var(--accent-muted)' : undefined,
              borderColor: isMarked ? 'var(--accent-muted)' : undefined
            }}
          >
            {isMarked ? 'Marked for Review' : 'Mark for Review'}
          </Button>

          {currentAnswer && (
            <Button
              variant="ghost"
              size="md"
              onClick={() => clearAnswer(qId)}
              leftIcon={<RotateCcw size={15} />}
            >
              Clear Response
            </Button>
          )}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Button
            variant="secondary"
            size="md"
            disabled={currentIndex === 0}
            onClick={prevQuestion}
            leftIcon={<ChevronLeft size={16} />}
          >
            Previous
          </Button>

          <Button
            variant="primary"
            size="md"
            onClick={nextQuestion}
            rightIcon={<ChevronRight size={16} />}
          >
            {currentIndex === totalQuestions - 1 ? 'Save & Finish Later' : 'Save & Next'}
          </Button>
        </div>
      </div>
    </div>
  );
}

