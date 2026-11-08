import React, { useState, useEffect } from 'react';
import { analyticsService } from '../../services/analyticsService';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { Users, Search, Mail, UserCheck, Shield } from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function load() {
      const data = await analyticsService.getStudentsList();
      setStudents(data);
    }
    load();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()) ||
      s.stream.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-2" style={{ margin: 0 }}>Student Cohort Directory</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Manage candidate enrollment, verify academic standing, and monitor test engagement.
          </p>
        </div>

        <Badge variant="primary">{students.length} Enrolled Candidates</Badge>
      </div>

      <Card style={{ padding: '1.25rem' }}>
        <Input
          placeholder="Search by student name, email, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </Card>

      <Card style={{ padding: '0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
            <thead>
              <tr style={{ backgroundColor: 'var(--bg-secondary)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '1rem 1.25rem' }}>Student Name</th>
                <th style={{ padding: '1rem' }}>Email Address</th>
                <th style={{ padding: '1rem' }}>Engineering Stream</th>
                <th style={{ padding: '1rem' }}>Year</th>
                <th style={{ padding: '1rem' }}>Exams Taken</th>
                <th style={{ padding: '1rem' }}>Avg Score</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Last Activity</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((s) => (
                <tr key={s.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {s.name}
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{s.email}</td>
                  <td style={{ padding: '1rem' }}>{s.stream}</td>
                  <td style={{ padding: '1rem' }}>{s.year}</td>
                  <td style={{ padding: '1rem', fontWeight: 600 }}>{s.examsTaken}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {s.avgScore}
                  </td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant={s.status === 'Active' ? 'secondary' : 'danger'}>
                      {s.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {s.lastActive}
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

