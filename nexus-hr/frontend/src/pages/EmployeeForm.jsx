import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { employeeApi, departmentApi, designationApi } from '../services/employeeApi';

export default function EmployeeForm() {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  const { data: departments } = useQuery({
    queryKey: ['departments'],
    queryFn: () => departmentApi.list().then((r) => r.data.data.departments),
  });

  const { data: designations } = useQuery({
    queryKey: ['designations'],
    queryFn: () => designationApi.list().then((r) => r.data.data.designations),
  });

  useEffect(() => {
    if (isEdit) {
      employeeApi.get(id).then((r) => reset(r.data.data.employee));
    }
  }, [id, isEdit, reset]);

  const onSubmit = async (values) => {
    try {
      if (isEdit) {
        await employeeApi.update(id, values);
        toast.success('Employee updated');
      } else {
        await employeeApi.create(values);
        toast.success('Employee created');
      }
      navigate('/employees');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto glass-card p-6">
      <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-6">
        {isEdit ? 'Edit Employee' : 'Add Employee'}
      </h1>

      <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Full Name</label>
          <input className="input-field mt-1" {...register('fullName', { required: 'Required' })} />
          {errors.fullName && <p className="text-xs text-red-500">{errors.fullName.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Email</label>
          <input type="email" className="input-field mt-1" {...register('email', { required: 'Required' })} />
          {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
        </div>

        <div>
          <label className="text-sm font-medium">Phone</label>
          <input className="input-field mt-1" {...register('phone', { required: 'Required' })} />
        </div>

        <div>
          <label className="text-sm font-medium">Joining Date</label>
          <input type="date" className="input-field mt-1" {...register('joiningDate', { required: 'Required' })} />
        </div>

        <div>
          <label className="text-sm font-medium">Department</label>
          <select className="input-field mt-1" {...register('department', { required: 'Required' })}>
            <option value="">Select department</option>
            {(departments || []).map((d) => (
              <option key={d._id} value={d._id}>{d.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Designation</label>
          <select className="input-field mt-1" {...register('designation', { required: 'Required' })}>
            <option value="">Select designation</option>
            {(designations || []).map((d) => (
              <option key={d._id} value={d._id}>{d.title}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Salary</label>
          <input type="number" step="0.01" className="input-field mt-1" {...register('salary', { required: 'Required' })} />
        </div>

        <div>
          <label className="text-sm font-medium">Employment Type</label>
          <select className="input-field mt-1" {...register('employmentType')}>
            <option value="full_time">Full time</option>
            <option value="part_time">Part time</option>
            <option value="contract">Contract</option>
            <option value="intern">Intern</option>
          </select>
        </div>

        <div className="sm:col-span-2 flex justify-end gap-3 mt-2">
          <button type="button" onClick={() => navigate('/employees')} className="px-4 py-2 rounded-xl border">
            Cancel
          </button>
          <button type="submit" disabled={isSubmitting} className="btn-primary">
            {isSubmitting ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Employee'}
          </button>
        </div>
      </form>
    </div>
  );
}
