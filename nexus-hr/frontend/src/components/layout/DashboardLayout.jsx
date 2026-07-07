import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

export default function DashboardLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [dark, setDark] = useState(false);

  const toggleDark = () => {
    setDark((d) => !d);
    document.documentElement.classList.toggle('dark');
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-primary-50/40 dark:from-gray-950 dark:to-gray-900">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar dark={dark} onToggleDark={toggleDark} />
        <main className="flex-1 p-6 overflow-x-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
