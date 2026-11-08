import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { Trophy, Award, Flame, User } from 'lucide-react';

export default function StudentLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filterType, setFilterType] = useState('global');
  const [stream, setStream] = useState('all');

  useEffect(() => {
    async function load() {
      const data = await analyticsService.getLeaderboard({ type: filterType, stream });
      setLeaderboard(data);
    }
    load();
  }, [filterType, stream]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>Campus Academic Leaderboard</h1>
          <Badge variant="highlight">Live Standing</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Privacy-preserving student leaderboards celebrating consistency, code speed, and exam accuracy.
        </p>
      </div>

      {/* Your Rank Pin Card */}
      <Card
        glow
        style={{
          backgroundColor: 'rgba(216, 120, 85, 0.1)',
          border: '1px solid rgba(216, 120, 85, 0.3)',
          padding: '1.25rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              backgroundColor: 'var(--accent-primary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: '1.2rem'
            }}
          >
            #4
          </div>
          <div>
            <div style={{ fontWeight: 700, fontSize: '1.05rem', color: 'var(--text-primary)' }}>
              Your Standings: Rank #4 in Computer Science
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              785 Total Points • 88.6% Average Across 14 Examinations
            </div>
          </div>
        </div>

        <Badge variant="secondary">Code Grandmaster</Badge>
      </Card>

      {/* Filter Tabs */}
      <Card style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {['global', 'stream', 'subject'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                style={{
                  padding: '0.45rem 1rem',
                  borderRadius: 'var(--radius-sm)',
                  backgroundColor: filterType === t ? 'var(--accent-secondary)' : 'var(--bg-secondary)',
                  color: filterType === t ? '#191B18' : 'var(--text-secondary)',
                  fontWeight: 700,
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  border: 'none',
                  textTransform: 'capitalize'
                }}
              >
                {t}
              </button>
            ))}
          </div>

          <div style={{ width: '220px' }}>
            <Input
              as="select"
              value={stream}
              onChange={(e) => setStream(e.target.value)}
            >
              <option value="all">All Disciplines</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Comm.</option>
            </Input>
          </div>
        </div>
      </Card>

      {/* Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Rank</th>
                <th style={{ padding: '1rem' }}>Student Candidate</th>
                <th style={{ padding: '1rem' }}>Stream</th>
                <th style={{ padding: '1rem' }}>Exams Done</th>
                <th style={{ padding: '1rem' }}>Total Points</th>
                <th style={{ padding: '1rem' }}>Average %</th>
                <th style={{ padding: '1rem 1.25rem' }}>Honor Badge</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => (
                <tr
                  key={item.rank}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    backgroundColor: item.isCurrentUser ? 'rgba(216, 120, 85, 0.12)' : 'transparent'
                  }}
                >
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>
                    #{item.rank}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <img
                        src={item.avatar}
                        alt={item.name}
                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                      />
                      <span style={{ fontWeight: item.isCurrentUser ? 700 : 500, color: item.isCurrentUser ? 'var(--accent-primary)' : 'var(--text-primary)' }}>
                        {item.name}
                      </span>
                    </div>
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.stream}</td>
                  <td style={{ padding: '1rem' }}>{item.examsCount}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>{item.totalScore}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-highlight)' }}>{item.avgPercentage}%</td>
                  <td style={{ padding: '1rem 1.25rem' }}>
                    <Badge variant={item.rank <= 3 ? 'highlight' : 'secondary'}>{item.badge}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

