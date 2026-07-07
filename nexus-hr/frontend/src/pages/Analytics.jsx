import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { dashboardApi } from '../services/employeeApi';

const COLORS = ['#6366f1', '#22d3ee', '#a78bfa', '#f472b6'];

export default function Analytics() {
  const { data: genderDist } = useQuery({
    queryKey: ['gender-distribution'],
    queryFn: () => dashboardApi.genderDistribution().then((r) => r.data.data.distribution),
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Analytics</h1>
      <div className="glass-card p-5">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Gender Distribution</h2>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie data={genderDist || []} dataKey="count" nameKey="gender" outerRadius={100} label>
              {(genderDist || []).map((entry, i) => (
                <Cell key={entry.gender || i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Legend />
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
