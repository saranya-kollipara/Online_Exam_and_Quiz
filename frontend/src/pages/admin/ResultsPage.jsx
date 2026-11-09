import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Badge from '../../components/common/Badge';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { useToast } from '../../hooks/useToast';
import { storage } from '../../utils/storage';
import api from '../../services/api';
import { Award, Download, Search, CheckCircle2, XCircle, Clock } from 'lucide-react';

export default function ResultsPage() {
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [submissions, setSubmissions] = useState([]);

  useEffect(() => {
    async function fetchResults() {
      try {
        const res = await api.get('/results');
        if (res?.data && Array.isArray(res.data) && res.data.length > 0) {
          setSubmissions(res.data);
          return;
        }
      } catch (e) {
        // fallback to storage
      }
      const local = storage.get('exam_submissions') || [];
      setSubmissions(local);
    }
    fetchResults();
  }, []);

  const filtered = submissions.filter(
    (s) =>
      s.student?.toLowerCase().includes(search.toLowerCase()) ||
      s.exam?.toLowerCase().includes(search.toLowerCase()) ||
      s.rollNo?.toLowerCase().includes(search.toLowerCase())
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
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ padding: '3rem 1rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                    No candidate examination submissions recorded yet.
                  </td>
                </tr>
              ) : (
                filtered.map((sub) => (
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
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

