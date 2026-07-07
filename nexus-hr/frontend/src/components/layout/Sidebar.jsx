import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Building2, CalendarDays, Clock,
  BarChart3, Bell, Settings, ShieldCheck, Wallet,
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/leaves', label: 'Leave', icon: CalendarDays },
  { to: '/attendance', label: 'Attendance', icon: Clock },
  { to: '/payroll', label: 'Payroll', icon: Wallet },
  { to: '/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/notifications', label: 'Notifications', icon: Bell },
  { to: '/audit-logs', label: 'Audit Logs', icon: ShieldCheck },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export default function Sidebar({ collapsed, onToggle }) {
  return (
    <aside
      className={`h-screen sticky top-0 flex flex-col glass-card rounded-none border-r border-white/40 dark:border-gray-800 transition-all ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      <div className="flex items-center gap-2 px-4 py-5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-600 to-accent-purple flex items-center justify-center text-white font-bold">
          N
        </div>
        {!collapsed && (
          <div>
            <p className="font-semibold text-gray-800 dark:text-gray-100 leading-tight">NexusHR</p>
            <p className="text-xs text-gray-400 leading-tight">Workforce Platform</p>
          </div>
        )}
      </div>

      <nav className="flex-1 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                isActive
                  ? 'bg-gradient-to-r from-primary-600 to-accent-purple text-white shadow-md'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-primary-50 dark:hover:bg-gray-800'
              }`
            }
          >
            <Icon size={18} />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}
      </nav>

      <button
        onClick={onToggle}
        className="m-3 text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
      >
        {collapsed ? '»' : '« Collapse'}
      </button>
    </aside>
  );
}
