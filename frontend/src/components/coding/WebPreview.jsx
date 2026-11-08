import React, { useMemo } from 'react';
import { RefreshCw, ExternalLink, Globe } from 'lucide-react';

export default function WebPreview({ html = '', css = '', js = '' }) {
  const combinedSource = useMemo(() => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            * { box-sizing: border-box; }
            body { margin: 0; padding: 1.5rem; background: #191B18; color: #F4F0E8; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
            ${css}
          </style>
        </head>
        <body>
          ${html}
          <script>
            try {
              ${js}
            } catch (err) {
              console.error(err);
            }
          </script>
        </body>
      </html>
    `;
  }, [html, css, js]);

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#191B18' }}>
      {/* Mini Browser Bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0.5rem 1rem',
          backgroundColor: 'var(--bg-secondary)',
          borderBottom: '1px solid var(--border-subtle)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ff5f56' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#ffbd2e' }} />
          <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#27c93f' }} />
          <span style={{ marginLeft: '0.5rem', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Globe size={13} /> Sandboxed Live Browser Canvas
          </span>
        </div>
        <div style={{ fontSize: '0.72rem', color: 'var(--accent-secondary)' }}>
          ● Live Hot Reload Active
        </div>
      </div>

      {/* Sandboxed iframe */}
      <iframe
        title="Web Problem Preview"
        srcDoc={combinedSource}
        sandbox="allow-scripts allow-modals"
        style={{
          width: '100%',
          flex: 1,
          border: 'none',
          backgroundColor: '#191B18'
        }}
      />
    </div>
  );
}

