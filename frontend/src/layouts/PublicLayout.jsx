import React from 'react';
import { Outlet, Link } from 'react-router-dom';
import Navbar from '../components/common/Navbar';
import { BrainCircuit, Github, Twitter, Linkedin, Mail, Heart } from 'lucide-react';

export default function PublicLayout() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)' }}>
      <Navbar variant="public" />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>

      <footer
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          padding: '4rem 0 2rem 0',
          marginTop: 'auto'
        }}
      >
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: 'var(--radius-xs)',
                  background: 'var(--accent-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#fff'
                }}
              >
                <BrainCircuit size={18} />
              </div>
              <span style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Quentrix <span style={{ color: 'var(--accent-primary)' }}>AI</span>
              </span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Learn Smarter. Practice Better. Perform Higher. The next-generation AI assessment and programming evaluation architecture.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-muted)' }}>
              <a href="#" aria-label="GitHub"><Github size={18} /></a>
              <a href="#" aria-label="LinkedIn"><Linkedin size={18} /></a>
              <a href="#" aria-label="Twitter"><Twitter size={18} /></a>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Platform</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Link to="/features">AI Question Generation</Link>
              <Link to="/features">Programming Sandbox</Link>
              <Link to="/features">Cognitive Analytics</Link>
              <Link to="/features">Live Proctored Exams</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Portals</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Link to="/admin/dashboard" style={{ color: 'var(--accent-primary)' }}>Academic Admin Console</Link>
              <Link to="/student/dashboard" style={{ color: 'var(--accent-secondary)' }}>Student Learning Portal</Link>
              <Link to="/auth/login">Faculty Sign In</Link>
              <Link to="/auth/register">Institutional Registration</Link>
            </div>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.2rem' }}>Support & Legal</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: 'var(--text-secondary)' }}>
              <Link to="/about">About Quentrix</Link>
              <Link to="/contact">Academic Partnerships</Link>
              <Link to="/contact">Privacy Policy</Link>
              <Link to="/contact">Terms of Service</Link>
            </div>
          </div>
        </div>

        <div className="container" style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>© 2026 Quentrix AI Academic Engine. All rights reserved.</span>
          <span>Engineered with precision for high-stakes engineering examinations.</span>
        </div>
      </footer>
    </div>
  );
}

