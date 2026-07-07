import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Users, UserCheck, Building2, CalendarClock, TrendingUp, Wallet } from 'lucide-react';
import {
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import StatCard from '../components/dashboard/StatCard';
import { dashboardApi } from '../services/employeeApi';

const COLORS = ['#6366f1', '#22d3ee', '#a78bfa', '#f472b6', '#34d399', '#fbbf24'];

export default function Dashboard() {
  const { data: summary } = useQuery({
    queryKey: ['dashboard-summary'],
    queryFn: () => dashboardApi.summary().then((r) => r.data.data),
  });

  const { data: deptDist } = useQuery({
    queryKey: ['dept-distribution'],
    queryFn: () => dashboardApi.departmentDistribution().then((r) => r.data.data.distribution),
  });

  const { data: hiringTrend } = useQuery({
    queryKey: ['hiring-trend'],
    queryFn: () => dashboardApi.hiringTrend().then((r) => r.data.data.trend),
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Dashboard</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">Welcome back — here's what's happening today.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Employees" value={summary?.totalEmployees ?? '—'} icon={Users} />
        <StatCard label="Active Employees" value={summary?.activeEmployees ?? '—'} icon={UserCheck} accent="from-emerald-500 to-teal-500" />
        <StatCard label="Departments" value={summary?.departments ?? '—'} icon={Building2} accent="from-cyan-500 to-blue-500" />
        <StatCard label="Pending Leave" value={summary?.pendingLeave ?? '—'} icon={CalendarClock} accent="from-amber-500 to-orange-500" />
        <StatCard label="Monthly Hiring" value={summary?.monthlyHiring ?? '—'} icon={TrendingUp} accent="from-fuchsia-500 to-pink-500" />
        <StatCard label="Attendance Rate" value={`${summary?.attendanceRate ?? 0}%`} icon={UserCheck} accent="from-indigo-500 to-purple-500" />
        <StatCard label="Monthly Resignations" value={summary?.monthlyResignations ?? '—'} icon={Users} accent="from-red-500 to-rose-500" />
        <StatCard label="Payroll (this cycle)" value="Preview" icon={Wallet} accent="from-lime-500 to-green-500" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="glass-card p-5">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Department Distribution</h2>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={deptDist || []} dataKey="count" nameKey="department" outerRadius={90} label>
                {(deptDist || []).map((entry, i) => (
                  <Cell key={entry.department} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h2 className="font-semibold text-gray-700 dark:text-gray-200 mb-4">Hiring Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={(hiringTrend || []).map((t) => ({ name: `${t._id.month}/${t._id.year}`, count: t.count }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line type="monotone" dataKey="count" stroke="#6366f1" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
