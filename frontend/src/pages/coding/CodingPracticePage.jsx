import React, { useState, useEffect } from 'react';
import { codingService } from '../../services/codingService';
import { useToast } from '../../hooks/useToast';
import ProblemDescription from '../../components/coding/ProblemDescription';
import CodeEditor from '../../components/coding/CodeEditor';
import ConsoleOutput from '../../components/coding/ConsoleOutput';
import WebPreview from '../../components/coding/WebPreview';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import {
  Code2,
  Play,
  Send,
  RotateCcw,
  Globe,
  Terminal,
  Layers,
  ChevronDown,
  Sparkles
} from 'lucide-react';

export default function CodingPracticePage() {
  const { success, warning, error: toastError } = useToast();
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);
  const [language, setLanguage] = useState('python');
  const [code, setCode] = useState('');

  // Web practice code states (HTML/CSS/JS)
  const [webHtml, setWebHtml] = useState('');
  const [webCss, setWebCss] = useState('');
  const [webJs, setWebJs] = useState('');
  const [activeWebTab, setActiveWebTab] = useState('html'); // 'html', 'css', 'js', 'preview'

  // Execution states
  const [isRunning, setIsRunning] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [outputData, setOutputData] = useState(null);
  const [bottomTab, setBottomTab] = useState('output'); // 'output', 'testcases'

  useEffect(() => {
    async function load() {
      const list = await codingService.getProblems();
      setProblems(list);
      if (list.length > 0) {
        selectProblem(list[0]);
      }
    }
    load();
  }, []);

  const selectProblem = (problem) => {
    setSelectedProblem(problem);
    setOutputData(null);
    if (problem.isWebProblem) {
      setLanguage('html');
      setWebHtml(problem.starterHtml || '');
      setWebCss(problem.starterCss || '');
      setWebJs(problem.starterJs || '');
    } else {
      setLanguage('python');
      setCode(problem.starterCode?.python || '');
    }
  };

  const handleLanguageChange = (newLang) => {
    setLanguage(newLang);
    if (selectedProblem?.starterCode?.[newLang]) {
      setCode(selectedProblem.starterCode[newLang]);
    }
  };

  const handleRunCode = async () => {
    if (!selectedProblem) return;
    setIsRunning(true);
    try {
      const activeCode = selectedProblem.isWebProblem
        ? `${webHtml}\n<style>${webCss}</style>\n<script>${webJs}</script>`
        : code;

      const res = await codingService.runCode({
        problemId: selectedProblem.id,
        language,
        code: activeCode
      });
      setOutputData(res);
      setBottomTab('output');
      if (res.success) {
        success('Sample execution finished with status: Accepted');
      }
    } catch (err) {
      toastError(err.message || 'Execution failed');
    } finally {
      setIsRunning(false);
    }
  };

  const handleSubmitCode = async () => {
    if (!selectedProblem) return;
    setIsSubmitting(true);
    try {
      const activeCode = selectedProblem.isWebProblem
        ? `${webHtml}\n<style>${webCss}</style>\n<script>${webJs}</script>`
        : code;

      const res = await codingService.submitCode({
        problemId: selectedProblem.id,
        language,
        code: activeCode
      });
      setOutputData(res);
      setBottomTab('output');
      if (res.allPassed) {
        success(`Submission Accepted! ${res.passedTestCases}/${res.totalTestCases} Test cases passed.`);
      } else {
        warning(`Evaluation incomplete: ${res.passedTestCases}/${res.totalTestCases} Test cases passed.`);
      }
    } catch (err) {
      toastError(err.message || 'Submission failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const isWeb = selectedProblem?.isWebProblem;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: 'calc(100vh - 120px)', gap: '0.75rem' }}>
      {/* Top Problem Switcher Bar */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '1rem',
          backgroundColor: 'var(--bg-secondary)',
          border: '1px solid var(--border-medium)',
          borderRadius: 'var(--radius-sm)',
          padding: '0.6rem 1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <Code2 size={20} color="var(--accent-primary)" />
          <span style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Problem:</span>
          <select
            value={selectedProblem?.id || ''}
            onChange={(e) => {
              const p = problems.find((item) => item.id === e.target.value);
              if (p) selectProblem(p);
            }}
            style={{
              padding: '0.4rem 0.8rem',
              borderRadius: 'var(--radius-xs)',
              backgroundColor: 'var(--bg-card)',
              color: 'var(--text-primary)',
              border: '1px solid var(--border-medium)',
              fontSize: '0.88rem',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            {problems.map((prob) => (
              <option key={prob.id} value={prob.id} style={{ background: '#252923' }}>
                {prob.title} ({prob.difficulty}) {prob.isWebProblem ? '— Web Canvas' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Language selector & action controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {!isWeb ? (
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              style={{
                padding: '0.4rem 0.8rem',
                borderRadius: 'var(--radius-xs)',
                backgroundColor: 'var(--bg-card)',
                color: 'var(--accent-secondary)',
                border: '1px solid var(--border-medium)',
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer'
              }}
            >
              <option value="python" style={{ background: '#252923' }}>Python 3.10</option>
              <option value="javascript" style={{ background: '#252923' }}>JavaScript (Node.js)</option>
              <option value="java" style={{ background: '#252923' }}>Java (OpenJDK 17)</option>
              <option value="cpp" style={{ background: '#252923' }}>C++ (GCC 11)</option>
              <option value="c" style={{ background: '#252923' }}>C (Clang 12)</option>
            </select>
          ) : (
            <div style={{ display: 'flex', gap: '4px', backgroundColor: 'var(--bg-card)', padding: '2px', borderRadius: 'var(--radius-xs)' }}>
              {['html', 'css', 'js', 'preview'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveWebTab(tab)}
                  style={{
                    padding: '0.25rem 0.6rem',
                    borderRadius: '3px',
                    backgroundColor: activeWebTab === tab ? 'var(--accent-primary)' : 'transparent',
                    color: activeWebTab === tab ? '#fff' : 'var(--text-secondary)',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    textTransform: 'uppercase'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          )}

          <Button
            variant="secondary"
            size="sm"
            onClick={handleRunCode}
            isLoading={isRunning}
            leftIcon={<Play size={14} color="var(--accent-secondary)" />}
          >
            Run Code
          </Button>

          <Button
            variant="primary"
            size="sm"
            onClick={handleSubmitCode}
            isLoading={isSubmitting}
            rightIcon={<Send size={14} />}
          >
            Submit Code
          </Button>
        </div>
      </div>

      {/* Main Split Layout: Left Problem Statement, Right Editor & Console */}
      <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(350px, 1fr) minmax(450px, 1.4fr)', gap: '0.75rem', overflow: 'hidden' }}>
        {/* Left: Problem Details */}
        <div style={{ backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
          <ProblemDescription problem={selectedProblem} />
        </div>

        {/* Right: Code Editor & Console Split */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', overflow: 'hidden' }}>
          {/* Top Half: Code Editor or Web Preview */}
          <div style={{ flex: 1.3, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
            {isWeb ? (
              activeWebTab === 'preview' ? (
                <WebPreview html={webHtml} css={webCss} js={webJs} />
              ) : activeWebTab === 'html' ? (
                <CodeEditor language="html" value={webHtml} onChange={(val) => setWebHtml(val)} />
              ) : activeWebTab === 'css' ? (
                <CodeEditor language="css" value={webCss} onChange={(val) => setWebCss(val)} />
              ) : (
                <CodeEditor language="javascript" value={webJs} onChange={(val) => setWebJs(val)} />
              )
            ) : (
              <CodeEditor language={language} value={code} onChange={(val) => setCode(val)} />
            )}
          </div>

          {/* Bottom Half: Console / Output Panel */}
          <div style={{ flex: 0.9, backgroundColor: 'var(--bg-card)', border: '1px solid var(--border-subtle)', borderRadius: 'var(--radius-sm)', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.45rem 1rem', backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.8rem' }}>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <span style={{ fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Terminal size={13} color="var(--accent-primary)" /> Execution Terminal
                </span>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Judge0 Sandboxed Interface</span>
            </div>

            <div style={{ flex: 1, overflowY: 'auto' }}>
              <ConsoleOutput outputData={outputData} isRunning={isRunning || isSubmitting} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

