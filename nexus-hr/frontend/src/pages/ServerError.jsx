import React from 'react';

export default function ServerError() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-gray-50 dark:bg-gray-950">
      <h1 className="text-6xl font-bold text-red-500">500</h1>
      <p className="text-gray-500 dark:text-gray-400">Something went wrong on our end.</p>
    </div>
  );
}
