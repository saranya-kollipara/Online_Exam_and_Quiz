import React, { useState, useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useExam } from '../hooks/useExam';
import { formatTimeRemaining } from '../utils/formatters';
import Button from '../components/common/Button';
import Badge from '../components/common/Badge';
import ConfirmDialog from '../components/common/ConfirmDialog';
import {
  BrainCircuit,
  Clock,
  Maximize2,
  Minimize2,
  CheckCircle2,
  AlertCircle,
  LogOut,
  Send
} from 'lucide-react';

export default function ExamLayout() {
  const { exam, timeRemaining, autosaveStatus, isSubmitting, isExamCompleted, submitExam } = useExam();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
        setIsFullscreen(false);
      }
    }
  };

  const isLowTime = timeRemaining <= 300; // < 5 mins
  const isCriticalTime = timeRemaining <= 60; // < 1 min

  const handleSubmit = async () => {
    setShowSubmitConfirm(false);
    try {
      const res = await submitExam(false);
      navigate(`/exam/${res.examId}/result`);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      {/* Distraction-Free Exam Top Bar */}
      <header
        style={{
          height: '68px',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-medium)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 1.5rem',
          position: 'sticky',
          top: 0,
          zIndex: 100
        }}
      >
        {/* Left: Exam Info */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '34px',
              height: '34px',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <BrainCircuit size={18} />
          </div>
          <div>
            <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
              {exam?.title || 'Academic Examination'}
            </h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
              <span>{exam?.subject}</span>
              <span>•</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <span className="live-pulse" /> Live Proctored
              </span>
            </div>
          </div>
        </div>

        {/* Center: Timer & Autosave Status */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
          {/* Autosave Indicator */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            {autosaveStatus === 'saving' ? (
              <>
                <span className="skeleton-shimmer" style={{ width: '8px', height: '8px', borderRadius: '50%' }} />
                <span>Saving response...</span>
              </>
            ) : (
              <>
                <CheckCircle2 size={14} color="var(--accent-secondary)" />
                <span style={{ color: 'var(--text-secondary)' }}>Responses autosaved</span>
              </>
            )}
          </div>

          {/* Countdown Clock */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              backgroundColor: isCriticalTime
                ? 'rgba(224, 108, 117, 0.2)'
                : isLowTime
                ? 'rgba(232, 197, 141, 0.2)'
                : 'var(--bg-card)',
              border: `1px solid ${
                isCriticalTime
                  ? 'var(--status-danger)'
                  : isLowTime
                  ? 'var(--accent-highlight)'
                  : 'var(--border-medium)'
              }`,
              borderRadius: 'var(--radius-sm)',
              padding: '0.45rem 0.9rem',
              color: isCriticalTime
                ? 'var(--status-danger)'
                : isLowTime
                ? 'var(--accent-highlight)'
                : 'var(--text-primary)',
              fontWeight: 700,
              fontFamily: 'var(--font-code)',
              fontSize: '1.05rem',
              boxShadow: isCriticalTime ? '0 0 15px rgba(224,108,117,0.3)' : 'none'
            }}
          >
            <Clock size={16} />
            <span>{formatTimeRemaining(timeRemaining)}</span>
          </div>
        </div>

        {/* Right: Controls & Final Submit */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={toggleFullscreen}
            style={{
              background: 'transparent',
              border: '1px solid var(--border-medium)',
              color: 'var(--text-secondary)',
              padding: '0.45rem',
              borderRadius: 'var(--radius-sm)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
          </button>

          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowSubmitConfirm(true)}
            isLoading={isSubmitting}
            rightIcon={<Send size={14} />}
          >
            Submit Exam
          </Button>
        </div>
      </header>

      {/* Main Examination View */}
      <main style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
        <Outlet />
      </main>

      {/* Confirmation Dialog before Final Submission */}
      <ConfirmDialog
        isOpen={showSubmitConfirm}
        onClose={() => setShowSubmitConfirm(false)}
        onConfirm={handleSubmit}
        title="Submit Examination"
        message="Are you sure you wish to submit your answers? Once submitted, your scores will be computed and your attempt will be finalized."
        confirmText="Yes, Submit Examination"
        cancelText="Review Answers"
        isLoading={isSubmitting}
      />
    </div>
  );
}

