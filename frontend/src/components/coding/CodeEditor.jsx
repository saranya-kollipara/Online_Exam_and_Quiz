import React from 'react';
import Editor from '@monaco-editor/react';

export default function CodeEditor({
  language = 'javascript',
  value = '',
  onChange,
  readOnly = false,
  height = '100%'
}) {
  const languageMap = {
    c: 'c',
    cpp: 'cpp',
    java: 'java',
    python: 'python',
    javascript: 'javascript',
    html: 'html',
    css: 'css'
  };

  const monacoLang = languageMap[language.toLowerCase()] || 'javascript';

  return (
    <div style={{ height, width: '100%', position: 'relative', overflow: 'hidden' }}>
      <Editor
        height="100%"
        language={monacoLang}
        theme="vs-dark"
        value={value}
        onChange={onChange}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 2,
          padding: { top: 12, bottom: 12 },
          lineDecorationsWidth: 10,
          overviewRulerBorder: false,
          cursorBlinking: 'smooth',
          smoothScrolling: true
        }}
        loading={
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: '#1e1e1e',
              color: 'var(--text-secondary)',
              fontFamily: 'var(--font-code)',
              fontSize: '0.9rem'
            }}
          >
            Loading Monaco Compiler Engine...
          </div>
        }
      />
    </div>
  );
}

