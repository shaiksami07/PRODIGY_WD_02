import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);

  const onSubmit = async (values) => {
    try {
      await login(values.email, values.password);
      navigate(location.state?.from?.pathname || '/dashboard', { replace: true });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-50 via-white to-accent-purple/10 dark:from-gray-950 dark:to-gray-900 px-4">
      <div className="glass-card w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="w-12 h-12 mx-auto rounded-xl bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center text-white font-bold text-xl">
            N
          </div>
          <h1 className="text-xl font-semibold mt-3 text-gray-800 dark:text-gray-100">Sign in to NexusHR</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">Enterprise Workforce Management Platform</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email</label>
            <input
              type="email"
              className="input-field mt-1"
              placeholder="you@company.com"
              {...register('email', { required: 'Email is required' })}
            />
            {errors.email && <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                className="input-field mt-1"
                placeholder="••••••••"
                {...register('password', { required: 'Password is required' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                className="absolute right-3 top-3.5 text-xs text-gray-400"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
              <input type="checkbox" {...register('rememberMe')} /> Remember me
            </label>
            <Link to="/forgot-password" className="text-primary-600 hover:underline">
              Forgot password?
            </Link>
          </div>

          <button type="submit" disabled={isSubmitting} className="btn-primary w-full">
            {isSubmitting ? 'Signing in...' : 'Sign in'}
          </button>
        </form>

        <p className="text-xs text-center text-gray-400 mt-6">
          Default admin (after seeding): admin@nexushr.com / ChangeMe123!
        </p>
      </div>
    </div>
  );
}
