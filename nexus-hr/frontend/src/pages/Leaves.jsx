import React from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { leaveApi } from '../services/employeeApi';
import { useAuth } from '../context/AuthContext';

export default function Leaves() {
  const qc = useQueryClient();
  const { hasRole } = useAuth();

  const { data, isLoading } = useQuery({
    queryKey: ['leaves'],
    queryFn: () => leaveApi.list({ limit: 20 }).then((r) => r.data.data),
  });

  const review = async (id, status) => {
    try {
      await leaveApi.review(id, { status });
      toast.success(`Leave ${status}`);
      qc.invalidateQueries({ queryKey: ['leaves'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update leave');
    }
  };

  return (
    <div className="glass-card p-5">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Leave Requests</h1>
      {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
      <div className="space-y-2">
        {(data?.items || []).map((leave) => (
          <div key={leave._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
            <div>
              <p className="font-medium text-gray-800 dark:text-gray-100">{leave.employee?.fullName}</p>
              <p className="text-xs text-gray-400 capitalize">
                {leave.type} · {leave.days} day(s) · {new Date(leave.startDate).toLocaleDateString()} - {new Date(leave.endDate).toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${
                leave.status === 'approved' ? 'bg-emerald-100 text-emerald-700' :
                leave.status === 'rejected' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'
              }`}>
                {leave.status}
              </span>
              {leave.status === 'pending' && hasRole('admin', 'hr', 'manager') && (
                <>
                  <button onClick={() => review(leave._id, 'approved')} className="text-xs px-2 py-1 rounded-lg bg-emerald-500 text-white">
                    Approve
                  </button>
                  <button onClick={() => review(leave._id, 'rejected')} className="text-xs px-2 py-1 rounded-lg bg-red-500 text-white">
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
        {!isLoading && (data?.items || []).length === 0 && (
          <p className="text-gray-400 text-sm">No leave requests yet.</p>
        )}
      </div>
    </div>
  );
}
