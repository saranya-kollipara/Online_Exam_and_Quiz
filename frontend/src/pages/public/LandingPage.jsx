import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Button from '../../components/common/Button';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  BrainCircuit,
  Sparkles,
  Code2,
  LineChart,
  ShieldCheck,
  Zap,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  Award,
  Terminal
} from 'lucide-react';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div style={{ overflow: 'hidden' }}>
      {/* Hero Section */}
      <section
        style={{
          padding: '5rem 0 4rem 0',
          position: 'relative',
          background: 'radial-gradient(circle at 50% 20%, rgba(216, 120, 85, 0.12) 0%, rgba(25, 27, 24, 0) 70%)'
        }}
      >
        <div className="container" style={{ textAlign: 'center', maxWidth: '960px' }}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
              <Badge variant="primary" dot>
                Quentrix AI v2.4 Architecture
              </Badge>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Next-Gen Engineering Assessments
              </span>
            </div>

            <h1 className="heading-hero" style={{ marginBottom: '1.5rem', color: 'var(--text-primary)' }}>
              Learn Smarter. <br />
              <span className="text-gradient">Practice Better.</span> <br />
              <span className="text-gradient-accent">Perform Higher.</span>
            </h1>

            <p
              style={{
                fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                maxWidth: '740px',
                margin: '0 auto 2.5rem auto'
              }}
            >
              The premier AI-driven online examination and programming assessment platform engineered for modern technical universities and high-stakes coding evaluations.
            </p>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '3rem' }}>
              <Button
                variant="primary"
                size="lg"
                onClick={() => navigate('/auth/register')}
                rightIcon={<ArrowRight size={18} />}
              >
                Launch Assessment Free
              </Button>
              <Button
                variant="secondary"
                size="lg"
                onClick={() => navigate('/student/coding-practice')}
                leftIcon={<Code2 size={18} color="var(--accent-secondary)" />}
              >
                Try Coding Sandbox
              </Button>
            </div>

            {/* Quick Metrics Bar */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                gap: '1.5rem',
                backgroundColor: 'var(--bg-secondary)',
                border: '1px solid var(--border-medium)',
                borderRadius: 'var(--radius-lg)',
                padding: '1.75rem',
                boxShadow: 'var(--shadow-md)'
              }}
            >
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-primary)' }}>100K+</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>AI Questions Synthesized</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-secondary)' }}>7 Languages</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>C, C++, Java, Py, JS, Web</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-highlight)' }}>99.9%</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>Proctoring Uptime</div>
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--accent-muted)' }}>Bilingual</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>English & Telugu Tutoring</div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-secondary)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
            <Badge variant="secondary" style={{ marginBottom: '0.75rem' }}>
              Engineered Capabilities
            </Badge>
            <h2 className="heading-1">Designed for Rigorous Academic Excellence</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '600px', margin: '0.5rem auto 0 auto' }}>
              From multi-stream question generation to compiler evaluation, Quentrix bridges classroom theory and enterprise practice.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
            <Card hoverable glow style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(216, 120, 85, 0.15)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <BrainCircuit size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                AI Examination Creation
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Instructors configure streams, units, difficulty, and negative marking. Our AI generates verified questions with mandatory faculty review before publishing.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                <span>Strict Admin Approval Guardrails</span>
                <CheckCircle2 size={15} />
              </div>
            </Card>

            <Card hoverable glow style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(184, 213, 139, 0.15)', color: 'var(--accent-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <Terminal size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Integrated Monaco Compiler
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Real-world VS Code editing experience with syntax highlights, automated test cases, and a sandboxed browser preview for HTML/CSS/JS frontend drills.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: 600 }}>
                <span>Sub-50ms Sandboxed Execution</span>
                <CheckCircle2 size={15} />
              </div>
            </Card>

            <Card hoverable glow style={{ padding: '2rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: 'var(--radius-sm)', background: 'rgba(232, 197, 141, 0.15)', color: 'var(--accent-highlight)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.25rem' }}>
                <LineChart size={24} />
              </div>
              <h3 style={{ fontSize: '1.2rem', fontWeight: 700, marginBottom: '0.6rem' }}>
                Cognitive Performance Analytics
              </h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1rem' }}>
                Detailed topic-level accuracy breakdowns, radar mastery charts, and automated study recommendations highlighting weak concepts like Trees or Deadlocks.
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.82rem', color: 'var(--accent-highlight)', fontWeight: 600 }}>
                <span>Multi-Dimensional Topic Profiling</span>
                <CheckCircle2 size={15} />
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* AI Assistant Callout */}
      <section style={{ padding: '5rem 0', backgroundColor: 'var(--bg-primary)' }}>
        <div className="container" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '3rem', alignItems: 'center' }}>
          <div>
            <Badge variant="highlight" style={{ marginBottom: '1rem' }}>
              Bilingual Academic Tutor
            </Badge>
            <h2 className="heading-1" style={{ marginBottom: '1.25rem' }}>
              Instant Engineering Answers in English & Telugu
            </h2>
            <p style={{ color: 'var(--text-secondary)', lineHeight: 1.7, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              Students can ask technical questions, request code derivations, clarify mathematical constraints, or get exam tips in their preferred language.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="var(--accent-secondary)" />
                <span>Interactive code explanations with time complexity</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="var(--accent-secondary)" />
                <span>Native Telugu script and transliterated answers</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--text-primary)', fontSize: '0.9rem' }}>
                <CheckCircle2 size={18} color="var(--accent-secondary)" />
                <span>One-click copy code snippets to editor</span>
              </div>
            </div>
            <Button
              variant="accent"
              size="md"
              onClick={() => navigate('/student/ai-assistant')}
              rightIcon={<ArrowRight size={16} />}
            >
              Chat With Quentrix AI
            </Button>
          </div>

          <Card style={{ padding: '1.5rem', backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--border-medium)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '0.75rem' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: 'var(--accent-secondary)' }} />
              <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Live Assistant Conversation</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', fontSize: '0.85rem' }}>
              <div style={{ alignSelf: 'flex-end', backgroundColor: 'var(--accent-primary)', color: '#fff', padding: '0.65rem 1rem', borderRadius: '10px', maxWidth: '85%' }}>
                బైనరీ ట్రీ మరియు BST మధ్య తేడా ఏమిటి?
              </div>
              <div style={{ alignSelf: 'flex-start', backgroundColor: 'var(--bg-card)', color: 'var(--text-primary)', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid var(--border-subtle)', maxWidth: '90%' }}>
                <strong>BST (Binary Search Tree)</strong> లో ఎడమ వైపు ఉండే నోడ్స్ విలువ రూట్ కంటే తక్కువగా ఉంటుంది, కుడి వైపు ఉండే నోడ్స్ విలువ ఎక్కువగా ఉంటుంది. సాధారణ బైనరీ ట్రీలో ఈ నియమం ఉండదు!
              </div>
            </div>
          </Card>
        </div>
      </section>

      {/* Final Call to Action */}
      <section
        style={{
          padding: '5rem 0',
          backgroundColor: 'var(--bg-secondary)',
          borderTop: '1px solid var(--border-subtle)',
          textAlign: 'center'
        }}
      >
        <div className="container" style={{ maxWidth: '720px' }}>
          <h2 className="heading-1" style={{ marginBottom: '1rem' }}>
            Elevate Your Institution's Assessment Standard
          </h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem', fontSize: '1.05rem', lineHeight: 1.6 }}>
            Join forward-thinking colleges, professors, and students who have replaced antiquated test systems with Quentrix AI.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Button
              variant="primary"
              size="lg"
              onClick={() => navigate('/admin/dashboard')}
            >
              Explore Admin Console
            </Button>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => navigate('/student/dashboard')}
            >
              Explore Student Portal
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}

