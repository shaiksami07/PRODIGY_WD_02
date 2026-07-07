import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './components/layout/DashboardLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Employees from './pages/Employees';
import EmployeeForm from './pages/EmployeeForm';
import Departments from './pages/Departments';
import Leaves from './pages/Leaves';
import AttendancePage from './pages/Attendance';
import Payroll from './pages/Payroll';
import Analytics from './pages/Analytics';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import Settings from './pages/Settings';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />

      <Route
        element={
          <ProtectedRoute>
            <DashboardLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<Employees />} />
        <Route path="/employees/new" element={<EmployeeForm />} />
        <Route path="/employees/:id" element={<EmployeeForm />} />
        <Route path="/departments" element={<Departments />} />
        <Route path="/leaves" element={<Leaves />} />
        <Route path="/attendance" element={<AttendancePage />} />
        <Route path="/payroll" element={<Payroll />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/notifications" element={<Notifications />} />
        <Route path="/audit-logs" element={<AuditLogs />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
