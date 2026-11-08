import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useExam } from '../../hooks/useExam';
import MockTestGeneratorModal from '../../components/ai/MockTestGeneratorModal';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Badge from '../../components/common/Badge';
import { storage } from '../../utils/storage';
import { Sparkles, Play, RotateCcw, Clock, Award, HelpCircle, CheckCircle2 } from 'lucide-react';

export default function AIMockTestsPage() {
  const navigate = useNavigate();
  const { startExam } = useExam();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [recentMockDrills, setRecentMockDrills] = useState([
    {
      id: 'mock_ds_1',
      title: 'Trees & Heap Structures Practice Drill',
      subject: 'Data Structures',
      topic: 'AVL Rotations & Binary Heaps',
      durationMinutes: 20,
      totalQuestions: 10,
      difficulty: 'Medium',
      lastScore: '80%',
      completedAt: 'Yesterday'
    },
    {
      id: 'mock_algo_2',
      title: 'Dynamic Programming Subproblems Sprint',
      subject: 'Algorithms',
      topic: '0/1 Knapsack & Memoization',
      durationMinutes: 25,
      totalQuestions: 8,
      difficulty: 'Hard',
      lastScore: '62.5%',
      completedAt: '3 days ago'
    }
  ]);

  const handleGeneratedTest = (mockTest) => {
    // Add to list and start exam
    setRecentMockDrills([mockTest, ...recentMockDrills]);
    startExam(mockTest);
    navigate(`/exam/${mockTest.id}`);
  };

  const handleLaunchExisting = (drill) => {
    // Construct populated mock test
    const mockExam = {
      ...drill,
      populatedQuestions: [
        {
          id: 'mock_q_1',
          text: 'What is the maximum number of rotations required to restore AVL balance after a single node deletion?',
          type: 'MCQ',
          difficulty: 'Hard',
          marks: 2,
          options: [
            { id: 'A', text: '1 rotation' },
            { id: 'B', text: 'At most O(log n) rotations' },
            { id: 'C', text: 'Always 2 rotations' },
            { id: 'D', text: 'O(n) rotations' }
          ],
          correctAnswer: 'B',
          explanation: 'While an insertion in an AVL tree requires at most 1 single or double rotation, deletion can decrease the height of a subtree and trigger cascading rotations up to the root, bounded by O(log n).'
        },
        {
          id: 'mock_q_2',
          text: 'Inorder traversal of a max-heap always produces sorted elements.',
          type: 'True/False',
          difficulty: 'Easy',
          marks: 1,
          options: [
            { id: 'A', text: 'True' },
            { id: 'B', text: 'False' }
          ],
          correctAnswer: 'B',
          explanation: 'False. A heap only satisfies the heap-order property between parent and child; left and right siblings have no relative order. Hence Inorder traversal does not yield sorted order.'
        }
      ]
    };
    try {
      const mockList = storage.get('mock_tests_list') || [];
      if (!mockList.some((m) => m.id === mockExam.id)) {
        mockList.unshift(mockExam);
        storage.set('mock_tests_list', mockList);
      }
    } catch (e) {
      // ignore
    }
    startExam(mockExam);
    navigate(`/exam/${drill.id}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
            <h1 className="heading-2" style={{ margin: 0 }}>AI Practice Drills & Mock Tests</h1>
            <Badge variant="highlight">Adaptive Training</Badge>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Generate unlimited custom practice tests on your weak topics. Mock test results do not affect official GPA.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          onClick={() => setIsModalOpen(true)}
          leftIcon={<Sparkles size={16} />}
        >
          Generate New AI Drill
        </Button>
      </div>

      {/* Generator Banner Card */}
      <Card
        glow
        style={{
          background: 'linear-gradient(135deg, rgba(216, 120, 85, 0.12), rgba(37, 41, 35, 0.8))',
          padding: '2rem'
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div>
            <Badge variant="primary" style={{ marginBottom: '0.6rem' }}>Synthesize Custom Exam</Badge>
            <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>
              Target Weak Topics With Zero Grade Risk
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', maxWidth: '620px', lineHeight: 1.6, margin: 0 }}>
              Select any topic—such as Binary Search Trees, Banker's Deadlocks, or React Hooks—and choose your desired question count, time limit, and difficulty.
            </p>
          </div>
          <Button
            variant="accent"
            size="lg"
            onClick={() => setIsModalOpen(true)}
            rightIcon={<Play size={16} />}
          >
            Configure & Start Drill
          </Button>
        </div>
      </Card>

      {/* Recent Practice Drills */}
      <div>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 700, marginBottom: '1rem' }}>Recent Practice Sessions</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {recentMockDrills.map((drill) => (
            <Card key={drill.id} hoverable style={{ display: 'flex', flexDirection: 'column' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
                <Badge variant={drill.difficulty === 'Hard' ? 'danger' : 'highlight'}>{drill.difficulty}</Badge>
                {drill.lastScore && (
                  <span style={{ fontSize: '0.8rem', color: 'var(--accent-secondary)', fontWeight: 700 }}>
                    Last Score: {drill.lastScore}
                  </span>
                )}
              </div>

              <h4 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.35rem' }}>
                {drill.title}
              </h4>
              <div style={{ fontSize: '0.82rem', color: 'var(--accent-highlight)', marginBottom: '1rem' }}>
                {drill.subject} • {drill.topic}
              </div>

              <div
                style={{
                  display: 'flex',
                  gap: '1rem',
                  fontSize: '0.8rem',
                  color: 'var(--text-muted)',
                  backgroundColor: 'var(--bg-secondary)',
                  padding: '0.6rem 0.85rem',
                  borderRadius: 'var(--radius-xs)',
                  marginBottom: '1.25rem'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Clock size={13} /> {drill.durationMinutes} mins
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <HelpCircle size={13} /> {drill.totalQuestions} Questions
                </span>
              </div>

              <div style={{ marginTop: 'auto', display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => handleLaunchExisting(drill)}
                  leftIcon={<RotateCcw size={14} />}
                >
                  Retry Drill
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </div>

      <MockTestGeneratorModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onGenerated={handleGeneratedTest}
      />
    </div>
  );
}

