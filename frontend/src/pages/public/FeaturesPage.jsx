import React from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import {
  BrainCircuit,
  Code2,
  LineChart,
  ShieldAlert,
  Zap,
  Globe,
  Shuffle,
  FileSpreadsheet,
  Lock,
  Layers
} from 'lucide-react';

export default function FeaturesPage() {
  const featureList = [
    {
      icon: <BrainCircuit size={24} color="var(--accent-primary)" />,
      title: 'Contextual AI Question Generation',
      desc: 'Create exams calibrated by engineering stream, subject, topic, and difficulty (Easy, Medium, Hard, Mixed) with verified answer keys.'
    },
    {
      icon: <Code2 size={24} color="var(--accent-secondary)" />,
      title: 'Monaco Editor & Polyglot Sandbox',
      desc: 'Industry-standard editor supporting C, C++, Java, Python, JavaScript, HTML, and CSS with real-time browser preview and automated test-case runner.'
    },
    {
      icon: <LineChart size={24} color="var(--accent-highlight)" />,
      title: 'Cognitive Topic Mastery Radar',
      desc: 'Visual radar charts and accuracy bars breakdown performance by topic (e.g. Arrays: 85%, Trees: 40%) with targeted AI revision action items.'
    },
    {
      icon: <Shuffle size={24} color="var(--accent-muted)" />,
      title: 'Dynamic Question & Option Shuffling',
      desc: 'Randomizes question order and option pairings dynamically per candidate while preserving accurate answer key mappings.'
    },
    {
      icon: <Globe size={24} color="var(--status-info)" />,
      title: 'Bilingual AI Assistant (English & Telugu)',
      desc: 'Ask complex technical doubts, algorithm optimizations, or exam preparation tips in either English or Telugu with formatted code blocks.'
    },
    {
      icon: <ShieldAlert size={24} color="var(--status-danger)" />,
      title: 'Distraction-Free Anti-Cheat Mode',
      desc: 'Dedicated exam room layout with countdown clocks, autosave pulses, fullscreen enforcement, and automatic submission upon timer expiry.'
    },
    {
      icon: <FileSpreadsheet size={24} color="var(--accent-secondary)" />,
      title: 'Question Bank & Batch Import',
      desc: 'Centralized repository with search, filtering by stream and difficulty, usage tracking, and batch JSON/CSV question ingestion.'
    },
    {
      icon: <Layers size={24} color="var(--accent-primary)" />,
      title: 'Student AI Practice Drills',
      desc: 'Enables students to independently generate personalized practice mock tests on any weak topic without affecting official grades.'
    }
  ];

  return (
    <div className="container" style={{ padding: '4rem 1.5rem', maxWidth: '1100px' }}>
      <div style={{ textAlign: 'center', marginBottom: '3.5rem' }}>
        <Badge variant="highlight" style={{ marginBottom: '0.85rem' }}>Full Capability Matrix</Badge>
        <h1 className="heading-1" style={{ marginBottom: '1rem' }}>
          Engineered for Deep Learning and Accurate Evaluation
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', maxWidth: '700px', margin: '0 auto', lineHeight: 1.6 }}>
          Explore the state-of-the-art features powering the Quentrix AI assessment ecosystem.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2rem' }}>
        {featureList.map((f, i) => (
          <Card key={i} hoverable style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
            <div
              style={{
                width: '46px',
                height: '46px',
                borderRadius: 'var(--radius-sm)',
                backgroundColor: 'var(--bg-secondary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '1.25rem',
                border: '1px solid var(--border-subtle)'
              }}
            >
              {f.icon}
            </div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '0.6rem', color: 'var(--text-primary)' }}>
              {f.title}
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, flex: 1 }}>
              {f.desc}
            </p>
          </Card>
        ))}
      </div>
    </div>
  );
}

