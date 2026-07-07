import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import apiClient from '../services/apiClient';

export default function Payroll() {
  const qc = useQueryClient();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const { data, isLoading } = useQuery({
    queryKey: ['payroll', month, year],
    queryFn: () => apiClient.get('/payroll', { params: { month, year } }).then((r) => r.data.data.items),
  });

  const generate = async () => {
    try {
      await apiClient.post('/payroll/preview', { month: Number(month), year: Number(year) });
      toast.success('Payroll preview generated');
      qc.invalidateQueries({ queryKey: ['payroll', month, year] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to generate preview');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100">Payroll Preview</h1>
        <div className="flex items-center gap-2">
          <input type="number" value={month} onChange={(e) => setMonth(e.target.value)} className="input-field w-20" />
          <input type="number" value={year} onChange={(e) => setYear(e.target.value)} className="input-field w-28" />
          <button onClick={generate} className="btn-primary">Generate Preview</button>
        </div>
      </div>

      <div className="glass-card p-5">
        {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b border-gray-200 dark:border-gray-800">
              <th className="py-2 pr-4">Employee</th>
              <th className="py-2 pr-4">Basic</th>
              <th className="py-2 pr-4">Allowances</th>
              <th className="py-2 pr-4">Deductions</th>
              <th className="py-2 pr-4">Net Pay</th>
            </tr>
          </thead>
          <tbody>
            {(data || []).map((p) => (
              <tr key={p._id} className="border-b border-gray-100 dark:border-gray-800/60">
                <td className="py-2 pr-4">{p.employee?.fullName}</td>
                <td className="py-2 pr-4">{p.basic}</td>
                <td className="py-2 pr-4">{p.allowances}</td>
                <td className="py-2 pr-4">{p.deductions}</td>
                <td className="py-2 pr-4 font-semibold">{p.netPay}</td>
              </tr>
            ))}
            {!isLoading && (data || []).length === 0 && (
              <tr><td colSpan={5} className="py-6 text-center text-gray-400">No payroll data for this period yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
