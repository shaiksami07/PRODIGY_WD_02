import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-6xl font-bold text-primary-600">404</h1>
      <p className="text-gray-500 dark:text-gray-400">This page doesn't exist.</p>
      <Link to="/dashboard" className="btn-primary">Back to Dashboard</Link>
    </div>
  );
}
