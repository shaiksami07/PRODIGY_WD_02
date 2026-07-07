import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Plus, Search, Trash2, Eye } from 'lucide-react';
import { employeeApi } from '../services/employeeApi';

export default function Employees() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading } = useQuery({
    queryKey: ['employees', search, page],
    queryFn: () => employeeApi.list({ search, page, limit: 10 }).then((r) => r.data.data),
    keepPreviousData: true,
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-gray-100">Employees</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">{data?.total ?? 0} total employees</p>
        </div>
        <Link to="/employees/new" className="btn-primary flex items-center gap-2">
          <Plus size={16} /> Add Employee
        </Link>
      </div>

      <div className="glass-card p-4">
        <div className="flex items-center gap-2 mb-4">
          <Search size={16} className="text-gray-400" />
          <input
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name or email..."
            className="input-field max-w-sm"
          />
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-800">
                <th className="py-2 pr-4">Employee ID</th>
                <th className="py-2 pr-4">Name</th>
                <th className="py-2 pr-4">Department</th>
                <th className="py-2 pr-4">Designation</th>
                <th className="py-2 pr-4">Status</th>
                <th className="py-2 pr-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">Loading employees...</td></tr>
              )}
              {!isLoading && (data?.items || []).length === 0 && (
                <tr><td colSpan={6} className="py-6 text-center text-gray-400">No employees found.</td></tr>
              )}
              {(data?.items || []).map((emp) => (
                <tr key={emp._id} className="border-b border-gray-100 dark:border-gray-800/60 hover:bg-primary-50/40 dark:hover:bg-gray-800/40">
                  <td className="py-2 pr-4 font-mono text-xs">{emp.employeeId}</td>
                  <td className="py-2 pr-4">{emp.fullName}</td>
                  <td className="py-2 pr-4">{emp.department?.name || '—'}</td>
                  <td className="py-2 pr-4">{emp.designation?.title || '—'}</td>
                  <td className="py-2 pr-4">
                    <span className={`px-2 py-0.5 rounded-full text-xs capitalize ${
                      emp.status === 'active' ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-600'
                    }`}>
                      {emp.status}
                    </span>
                  </td>
                  <td className="py-2 pr-4 flex items-center gap-3">
                    <Link to={`/employees/${emp._id}`} className="text-primary-600 hover:text-primary-800">
                      <Eye size={16} />
                    </Link>
                    <button className="text-red-500 hover:text-red-700">
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-between mt-4 text-sm text-gray-500">
          <span>Page {data?.page ?? 1} of {data?.totalPages ?? 1}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40">
              Prev
            </button>
            <button disabled={page >= (data?.totalPages ?? 1)} onClick={() => setPage((p) => p + 1)} className="px-3 py-1 rounded-lg border disabled:opacity-40">
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
