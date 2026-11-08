import React, { useState } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { Award, Download, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ResultsPage() {
  const { success } = useToast();
  const [search, setSearch] = useState('');

  const submissions = [
    { id: 'sub_1', student: 'Aditya Vardhan', rollNo: '22CS8042', exam: 'Data Structures Mid-Term', score: 46, max: 50, percentage: 92, time: '34m', status: 'Passed', date: 'Nov 06, 2026' },
    { id: 'sub_2', student: 'Siddharth Rao', rollNo: '22CS8019', exam: 'Data Structures Mid-Term', score: 48, max: 50, percentage: 96, time: '29m', status: 'Passed', date: 'Nov 06, 2026' },
    { id: 'sub_3', student: 'Ananya Sharma', rollNo: '22IT8011', exam: 'Data Structures Mid-Term', score: 44, max: 50, percentage: 88, time: '38m', status: 'Passed', date: 'Nov 06, 2026' },
    { id: 'sub_4', student: 'Vikramaditya Bose', rollNo: '22CS8077', exam: 'Operating Systems Assessment', score: 54, max: 60, percentage: 90, time: '48m', status: 'Passed', date: 'Nov 05, 2026' },
    { id: 'sub_5', student: 'Rohan Kulkarni', rollNo: '22CS8094', exam: 'Data Structures Mid-Term', score: 28, max: 50, percentage: 56, time: '44m', status: 'Review', date: 'Nov 05, 2026' }
  ];

  const filtered = submissions.filter(
    (s) =>
      s.student.toLowerCase().includes(search.toLowerCase()) ||
      s.exam.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo.toLowerCase().includes(search.toLowerCase())
  );

  const handleExport = () => {
    success('Grade report CSV exported successfully.');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 className="heading-2" style={{ margin: 0 }}>Examination Results & Scoring Audit</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>
            Inspect candidate scores, time taken, passing status, and export accredited grade rosters.
          </p>
        </div>

        <Button
          variant="secondary"
          size="md"
          onClick={handleExport}
          leftIcon={<Download size={16} />}
        >
          Export CSV Roster
        </Button>
      </div>

      <Card style={{ padding: '1.25rem' }}>
        <Input
          placeholder="Search by student name, roll number, or exam title..."
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
                <th style={{ padding: '1rem 1.25rem' }}>Candidate</th>
                <th style={{ padding: '1rem' }}>Roll No</th>
                <th style={{ padding: '1rem' }}>Examination</th>
                <th style={{ padding: '1rem' }}>Marks Awarded</th>
                <th style={{ padding: '1rem' }}>Percentage</th>
                <th style={{ padding: '1rem' }}>Time Spent</th>
                <th style={{ padding: '1rem' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem' }}>Date</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((sub) => (
                <tr key={sub.id} style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
                  <td style={{ padding: '1rem 1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {sub.student}
                  </td>
                  <td style={{ padding: '1rem', fontFamily: 'var(--font-code)', fontSize: '0.82rem' }}>
                    {sub.rollNo}
                  </td>
                  <td style={{ padding: '1rem' }}>{sub.exam}</td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-secondary)' }}>
                    {sub.score} / {sub.max}
                  </td>
                  <td style={{ padding: '1rem', fontWeight: 700, color: 'var(--accent-highlight)' }}>
                    {sub.percentage}%
                  </td>
                  <td style={{ padding: '1rem', color: 'var(--text-muted)' }}>{sub.time}</td>
                  <td style={{ padding: '1rem' }}>
                    <Badge variant={sub.status === 'Passed' ? 'secondary' : 'danger'}>
                      {sub.status}
                    </Badge>
                  </td>
                  <td style={{ padding: '1rem 1.25rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    {sub.date}
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

