import React from 'react';
import { useQuery } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export default function AuditLogs() {
  const { data, isLoading } = useQuery({
    queryKey: ['audit-logs'],
    queryFn: () => apiClient.get('/audit-logs').then((r) => r.data.data.items),
  });

  return (
    <div className="glass-card p-5">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Audit Logs</h1>
      {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
            <th className="py-2 pr-4">When</th>
            <th className="py-2 pr-4">User</th>
            <th className="py-2 pr-4">Action</th>
            <th className="py-2 pr-4">Resource</th>
          </tr>
        </thead>
        <tbody>
          {(data || []).map((log) => (
            <tr key={log._id} className="border-b border-gray-100 dark:border-gray-800/60">
              <td className="py-2 pr-4">{new Date(log.createdAt).toLocaleString()}</td>
              <td className="py-2 pr-4">{log.user?.name || 'System'}</td>
              <td className="py-2 pr-4 font-mono text-xs">{log.action}</td>
              <td className="py-2 pr-4">{log.resource}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
