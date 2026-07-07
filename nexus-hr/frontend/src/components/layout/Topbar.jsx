import React, { useState } from 'react';
import { Search, Bell, Moon, Sun, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ dark, onToggleDark }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-10 glass-card rounded-none border-b border-white/40 dark:border-gray-800 px-6 py-3 flex items-center justify-between">
      <div className="flex items-center gap-2 w-full max-w-md">
        <Search size={18} className="text-gray-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search employees, departments... (Ctrl+K)"
          className="bg-transparent outline-none text-sm w-full text-gray-700 dark:text-gray-200 placeholder:text-gray-400"
        />
      </div>

      <div className="flex items-center gap-4">
        <button onClick={onToggleDark} className="text-gray-500 hover:text-gray-800 dark:hover:text-white">
          {dark ? <Sun size={18} /> : <Moon size={18} />}
        </button>
        <button className="relative text-gray-500 hover:text-gray-800 dark:hover:text-white">
          <Bell size={18} />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-red-500" />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-primary-100 text-primary-700 flex items-center justify-center text-sm font-semibold">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-sm">
            <p className="font-medium text-gray-700 dark:text-gray-200 leading-tight">{user?.name}</p>
            <p className="text-xs text-gray-400 leading-tight capitalize">{user?.role?.replace('_', ' ')}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="text-gray-500 hover:text-red-500" title="Logout">
          <LogOut size={18} />
        </button>
      </div>
    </header>
  );
}
