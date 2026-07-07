import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { Plus } from 'lucide-react';
import { departmentApi } from '../services/employeeApi';

export default function Departments() {
  const qc = useQueryClient();
  const [form, setForm] = useState({ name: '', code: '', description: '' });

  const { data: departments, isLoading } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list().then((r) => r.data.data.departments),
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      await departmentApi.create(form);
      toast.success('Department created');
      setForm({ name: '', code: '', description: '' });
      qc.invalidateQueries({ queryKey: ['departments'] });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create department');
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass-card p-5">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4">Departments</h1>
        {isLoading && <p className="text-gray-400 text-sm">Loading...</p>}
        <div className="space-y-2">
          {(departments || []).map((d) => (
            <div key={d._id} className="flex items-center justify-between p-3 rounded-xl border border-gray-100 dark:border-gray-800">
              <div>
                <p className="font-medium text-gray-800 dark:text-gray-100">{d.name}</p>
                <p className="text-xs text-gray-400">{d.code} {d.description ? `· ${d.description}` : ''}</p>
              </div>
              <span className={`text-xs px-2 py-0.5 rounded-full ${d.isActive ? 'bg-emerald-100 text-emerald-700' : 'bg-gray-100 text-gray-500'}`}>
                {d.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
          ))}
        </div>
      </div>

      <form onSubmit={handleCreate} className="glass-card p-5 h-fit space-y-3">
        <h2 className="font-semibold text-gray-700 dark:text-gray-200 flex items-center gap-2">
          <Plus size={16} /> New Department
        </h2>
        <input
          className="input-field"
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          className="input-field"
          placeholder="Code (e.g. ENG)"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
          required
        />
        <textarea
          className="input-field"
          placeholder="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
        <button type="submit" className="btn-primary w-full">Create</button>
      </form>
    </div>
  );
}
