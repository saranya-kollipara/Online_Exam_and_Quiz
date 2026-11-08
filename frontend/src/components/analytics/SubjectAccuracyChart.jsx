import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell
} from 'recharts';

export default function SubjectAccuracyChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { subject: 'Data Structures', accuracy: 78 },
    { subject: 'Algorithms', accuracy: 65 },
    { subject: 'Operating Systems', accuracy: 88 },
    { subject: 'DBMS', accuracy: 92 },
    { subject: 'Computer Networks', accuracy: 74 },
    { subject: 'Web Technologies', accuracy: 84 }
  ];

  const colors = ['#D87855', '#B8D58B', '#E8C58D', '#82769D', '#79B8FF', '#D87855'];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(244, 240, 232, 0.06)" />
          <XAxis
            dataKey="subject"
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            interval={0}
            angle={-15}
            textAnchor="end"
          />
          <YAxis
            stroke="var(--text-muted)"
            fontSize={11}
            tickLine={false}
            domain={[0, 100]}
            tickFormatter={(val) => `${val}%`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-medium)',
              borderRadius: '8px',
              color: 'var(--text-primary)',
              fontSize: '12px'
            }}
            formatter={(value) => [`${value}% Accuracy`, 'Mastery']}
          />
          <Bar dataKey="accuracy" radius={[6, 6, 0, 0]}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

