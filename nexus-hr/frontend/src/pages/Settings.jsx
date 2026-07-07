import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../services/authApi';
import toast from 'react-hot-toast';
import { Lock, Eye, EyeOff, User, Mail, Shield, KeyRound } from 'lucide-react';

export default function Settings() {
  const { user } = useAuth();

  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [show, setShow] = useState({ current: false, new: false, confirm: false });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const toggle = (field) => setShow((s) => ({ ...s, [field]: !s[field] }));

  const validate = () => {
    const e = {};
    if (!form.currentPassword) e.currentPassword = 'Current password is required';
    if (!form.newPassword || form.newPassword.length < 8)
      e.newPassword = 'Must be at least 8 characters';
    else if (!/[A-Z]/.test(form.newPassword))
      e.newPassword = 'Must contain an uppercase letter';
    else if (!/[0-9]/.test(form.newPassword))
      e.newPassword = 'Must contain a number';
    if (form.newPassword !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await authApi.changePassword({
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password changed successfully!');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setErrors({});
    } catch (err) {
      const msg = err?.response?.data?.message || 'Failed to change password';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (field) =>
    `w-full bg-white/5 border ${
      errors[field] ? 'border-red-400' : 'border-white/10'
    } rounded-xl px-4 py-3 pr-12 text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 ${
      errors[field] ? 'focus:ring-red-400' : 'focus:ring-indigo-400'
    } transition-all`;

  return (
    <div className="max-w-2xl mx-auto space-y-6">

      {/* Profile Info Card */}
      <div className="glass-card p-6">
        <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
          <User size={20} className="text-indigo-400" /> Profile
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <User size={15} />, label: 'Name', value: user?.name },
            { icon: <Mail size={15} />, label: 'Email', value: user?.email },
            {
              icon: <Shield size={15} />,
              label: 'Role',
              value: user?.role?.replace(/_/g, ' '),
            },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-white/5 rounded-xl p-4 border border-white/10">
              <p className="text-xs text-gray-400 flex items-center gap-1 mb-1">
                {icon} {label}
              </p>
              <p className="text-sm font-medium text-gray-800 dark:text-gray-100 capitalize truncate">
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Change Password Card */}
      <div className="glass-card p-6">
        <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-5 flex items-center gap-2">
          <KeyRound size={20} className="text-indigo-400" /> Change Password
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          {/* Current Password */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Current Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="currentPassword"
                type={show.current ? 'text' : 'password'}
                placeholder="Enter current password"
                value={form.currentPassword}
                onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
                className={`${inputClass('currentPassword')} pl-10`}
              />
              <button type="button" onClick={() => toggle('current')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                {show.current ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.currentPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.currentPassword}</p>
            )}
          </div>

          {/* New Password */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="newPassword"
                type={show.new ? 'text' : 'password'}
                placeholder="At least 8 chars, 1 uppercase, 1 number"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
                className={`${inputClass('newPassword')} pl-10`}
              />
              <button type="button" onClick={() => toggle('new')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                {show.new ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.newPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.newPassword}</p>
            )}
          </div>

          {/* Confirm New Password */}
          <div>
            <label className="block text-xs text-gray-400 mb-1">Confirm New Password</label>
            <div className="relative">
              <Lock size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                id="confirmPassword"
                type={show.confirm ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                className={`${inputClass('confirmPassword')} pl-10`}
              />
              <button type="button" onClick={() => toggle('confirm')}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200 transition-colors">
                {show.confirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-xs text-red-400">{errors.confirmPassword}</p>
            )}
          </div>

          <button
            id="changePasswordSubmit"
            type="submit"
            disabled={loading}
            className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold py-3 rounded-xl transition-all duration-200 flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <KeyRound size={16} />
            )}
            {loading ? 'Changing…' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
