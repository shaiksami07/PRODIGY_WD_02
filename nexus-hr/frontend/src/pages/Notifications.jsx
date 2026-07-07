import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../services/apiClient';

export default function Notifications() {
  const qc = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: () => apiClient.get('/notifications').then((r) => r.data.data.items),
  });

  const markRead = async (id) => {
    await apiClient.patch(`/notifications/${id}/read`);
    qc.invalidateQueries({ queryKey: ['notifications'] });
  };

  return (
    <div className="glass-card p-5 max-w-2xl">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Notifications</h1>
      {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
      <div className="space-y-2">
        {(data || []).map((n) => (
          <button
            key={n._id}
            onClick={() => markRead(n._id)}
            className={`w-full text-left p-3 rounded-xl border border-gray-100 dark:border-gray-800 ${
              n.isRead ? 'opacity-60' : 'bg-primary-50/50 dark:bg-primary-900/10'
            }`}
          >
            <p className="text-sm font-medium text-gray-800 dark:text-gray-100">{n.title}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">{n.message}</p>
          </button>
        ))}
        {!isLoading && (data || []).length === 0 && (
          <p className="text-gray-400 text-sm">You're all caught up.</p>
        )}
      </div>
    </div>
  );
}
