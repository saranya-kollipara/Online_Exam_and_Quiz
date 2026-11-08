import React from 'react';
import Badge from '../common/Badge';
import { Terminal, CheckCircle2, XCircle, Clock, Cpu } from 'lucide-react';

export default function ConsoleOutput({ outputData, isRunning = false }) {
  if (isRunning) {
    return (
      <div
        style={{
          height: '100%',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.75rem',
          color: 'var(--text-secondary)'
        }}
      >
        <span className="live-pulse" style={{ width: '12px', height: '12px' }} />
        <span style={{ fontSize: '0.88rem', fontFamily: 'var(--font-code)' }}>
          Compiling & executing code in isolated sandboxed runtime...
        </span>
      </div>
    );
  }

  if (!outputData) {
    return (
      <div
        style={{
          height: '100%',
          padding: '1.25rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.88rem'
        }}
      >
        <Terminal size={24} style={{ marginBottom: '0.5rem', opacity: 0.6 }} />
        <span>Click 'Run Code' or 'Submit Code' to see compiler execution results.</span>
      </div>
    );
  }

  const isSuccess = outputData.success || outputData.status === 'Accepted';

  return (
    <div
      style={{
        padding: '1.25rem',
        height: '100%',
        overflowY: 'auto',
        fontFamily: 'var(--font-code)',
        fontSize: '0.85rem'
      }}
    >
      {/* Status Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
          paddingBottom: '0.75rem',
          borderBottom: '1px solid var(--border-subtle)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          {isSuccess ? (
            <CheckCircle2 size={18} color="var(--accent-secondary)" />
          ) : (
            <XCircle size={18} color="var(--status-danger)" />
          )}
          <span
            style={{
              fontWeight: 700,
              color: isSuccess ? 'var(--accent-secondary)' : 'var(--status-danger)'
            }}
          >
            {outputData.status || (isSuccess ? 'Accepted' : 'Runtime Error')}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          {outputData.executionTime && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Clock size={13} /> {outputData.executionTime}
            </span>
          )}
          {outputData.memoryUsed && (
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <Cpu size={13} /> {outputData.memoryUsed}
            </span>
          )}
        </div>
      </div>

      {/* Stdout / Stderr Terminal View */}
      <div style={{ marginBottom: '1rem' }}>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.35rem' }}>
          Standard Output:
        </div>
        <pre
          style={{
            backgroundColor: 'var(--bg-secondary)',
            padding: '0.85rem',
            borderRadius: 'var(--radius-sm)',
            border: '1px solid var(--border-subtle)',
            color: isSuccess ? 'var(--text-primary)' : 'var(--status-danger)',
            whiteSpace: 'pre-wrap',
            maxHeight: '180px',
            overflowY: 'auto'
          }}
        >
          {outputData.output || outputData.rawStdout || 'No output stream detected.'}
        </pre>
      </div>

      {/* Test cases passed breakdown if submitCode */}
      {outputData.testCaseResults && (
        <div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
            Test Cases ({outputData.passedTestCases}/{outputData.totalTestCases} Passed):
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {outputData.testCaseResults.map((tc) => (
              <div
                key={tc.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.5rem 0.75rem',
                  borderRadius: 'var(--radius-xs)',
                  backgroundColor: 'var(--bg-secondary)',
                  border: `1px solid ${tc.passed ? 'rgba(184, 213, 139, 0.3)' : 'rgba(224, 108, 117, 0.3)'}`
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {tc.passed ? (
                    <CheckCircle2 size={14} color="var(--accent-secondary)" />
                  ) : (
                    <XCircle size={14} color="var(--status-danger)" />
                  )}
                  <span>{tc.name}</span>
                </div>
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{tc.executionTime}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

