import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import { Trophy, Medal, Award, Flame, Filter } from 'lucide-react';

export default function AdminLeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filterType, setFilterType] = useState('global');
  const [selectedStream, setSelectedStream] = useState('all');

  useEffect(() => {
    async function fetchLeaderboard() {
      const data = await analyticsService.getLeaderboard({ type: filterType, stream: selectedStream });
      setLeaderboard(data);
    }
    fetchLeaderboard();
  }, [filterType, selectedStream]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
          <h1 className="heading-2" style={{ margin: 0 }}>Institution Academic Leaderboard</h1>
          <Badge variant="highlight">Top Performers</Badge>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
          Honor roll ranks across engineering disciplines, exam milestones, and cumulative grade averages.
        </p>
      </div>

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
                  backgroundColor: filterType === t ? 'var(--accent-primary)' : 'var(--bg-secondary)',
                  color: filterType === t ? '#fff' : 'var(--text-secondary)',
                  border: `1px solid ${filterType === t ? 'var(--accent-primary)' : 'var(--border-subtle)'}`,
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {t} Leaderboard
              </button>
            ))}
          </div>

          <div style={{ width: '220px' }}>
            <Input
              as="select"
              value={selectedStream}
              onChange={(e) => setSelectedStream(e.target.value)}
            >
              <option value="all">All Departments</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Information Technology">Information Technology</option>
              <option value="Electronics">Electronics & Comm.</option>
            </Input>
          </div>
        </div>
      </Card>

      {/* Leaderboard Table */}
      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Rank</th>
                <th style={{ padding: '1rem' }}>Candidate</th>
                <th style={{ padding: '1rem' }}>Stream</th>
                <th style={{ padding: '1rem' }}>Exams Completed</th>
                <th style={{ padding: '1rem' }}>Cumulative Score</th>
                <th style={{ padding: '1rem' }}>Avg Percentage</th>
                <th style={{ padding: '1rem 1.25rem' }}>Honor Tier</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((item) => {
                const isTop3 = item.rank <= 3;
                return (
                  <tr
                    key={item.rank}
                    style={{
                      borderBottom: '1px solid var(--border-subtle)',
                      backgroundColor: item.isCurrentUser ? 'rgba(216, 120, 85, 0.08)' : 'transparent'
                    }}
                  >
                    <td style={{ padding: '1rem 1.25rem', fontWeight: 800 }}>
                      <span
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '28px',
                          height: '28px',
                          borderRadius: '50%',
                          backgroundColor:
                            item.rank === 1
                              ? 'rgba(232, 197, 141, 0.2)'
                              : item.rank === 2
                              ? 'rgba(200, 200, 200, 0.2)'
                              : item.rank === 3
                              ? 'rgba(216, 120, 85, 0.2)'
                              : 'transparent',
                          color:
                            item.rank === 1
                              ? 'var(--accent-highlight)'
                              : item.rank === 2
                              ? '#d1d5db'
                              : item.rank === 3
                              ? 'var(--accent-primary)'
                              : 'var(--text-secondary)'
                        }}
                      >
                        {item.rank}
                      </span>
                    </td>
                    <td style={{ padding: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <img
                          src={item.avatar}
                          alt={item.name}
                          style={{ width: '34px', height: '34px', borderRadius: '50%', objectFit: 'cover' }}
                        />
                        <span style={{ fontWeight: 600, color: 'var(--text-primary)' }}>
                          {item.name}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.stream}</td>
                    <td style={{ padding: '1rem', color: 'var(--text-secondary)' }}>{item.examsCount}</td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                      {item.totalScore} pts
                    </td>
                    <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-highlight)' }}>
                      {item.avgPercentage}%
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <Badge variant={isTop3 ? 'highlight' : 'secondary'}>
                        {item.badge}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

