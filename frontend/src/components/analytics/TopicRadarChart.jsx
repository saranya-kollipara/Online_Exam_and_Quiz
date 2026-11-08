import React from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip
} from 'recharts';

export default function TopicRadarChart({ data = [] }) {
  const chartData = data.length > 0 ? data : [
    { topic: 'Arrays', accuracy: 85 },
    { topic: 'Linked Lists', accuracy: 60 },
    { topic: 'Trees', accuracy: 40 },
    { topic: 'Graphs', accuracy: 75 },
    { topic: 'Recursion', accuracy: 70 },
    { topic: 'Hashing', accuracy: 90 }
  ];

  return (
    <div style={{ width: '100%', height: 280 }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid stroke="rgba(244, 240, 232, 0.1)" />
          <PolarAngleAxis
            dataKey="topic"
            stroke="var(--text-secondary)"
            fontSize={11}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 100]}
            stroke="rgba(244, 240, 232, 0.2)"
            fontSize={10}
            tick={false}
          />
          <Radar
            name="Accuracy %"
            dataKey="accuracy"
            stroke="var(--accent-primary)"
            fill="var(--accent-primary)"
            fillOpacity={0.4}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--bg-card)',
              borderColor: 'var(--border-medium)',
              borderRadius: '8px',
              fontSize: '12px'
            }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

