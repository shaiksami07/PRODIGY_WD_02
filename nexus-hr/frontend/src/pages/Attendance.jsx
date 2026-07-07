import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';
import { useAuth } from '../context/AuthContext';

export default function Attendance() {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['attendance'],
    queryFn: () => apiClient.get('/attendance', { params: { limit: 31 } }).then((r) => r.data.data),
  });

  const checkIn = async () => {
    try {
      await apiClient.post('/attendance/check-in', { employee: user.employee });
      toast.success('Checked in');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-in failed');
    }
  };

  const checkOut = async () => {
    try {
      await apiClient.post('/attendance/check-out', { employee: user.employee });
      toast.success('Checked out');
      qc.invalidateQueries({ queryKey: ['attendance'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Check-out failed');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Attendance</h1>
        <div className="flex gap-2">
          <button onClick={checkIn} className="btn-primary">Check In</button>
          <button onClick={checkOut} className="px-4 py-2 rounded-xl border">Check Out</button>
        </div>
      </div>

      <div className="glass-card p-5">
        {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-4">Employee</th>
              <th className="py-2 pr-4">Date</th>
              <th className="py-2 pr-4">Check In</th>
              <th className="py-2 pr-4">Check Out</th>
              <th className="py-2 pr-4">Status</th>
            </tr>
          </thead>
          <tbody>
            {(data?.items || []).map((rec) => (
              <tr key={rec._id} className="border-b border-gray-100 dark:border-gray-800/60">
                <td className="py-2 pr-4">{rec.employee?.fullName}</td>
                <td className="py-2 pr-4">{new Date(rec.date).toLocaleDateString()}</td>
                <td className="py-2 pr-4">{rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : '—'}</td>
                <td className="py-2 pr-4">{rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : '—'}</td>
                <td className="py-2 pr-4 capitalize">{rec.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
