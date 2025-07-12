import { Routes, Route, Navigate } from 'react-router-dom';
import SidebarLayout from '../components/SidebarLayout';
import LoginPage from '../pages/LoginForm';
import RegisterForm from '../pages/RegisterForm';
import Forbidden from '../pages/Forbidden';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';
import UserDashboard from '../pages/UserDashboard';
import TaskTable from '../pages/TaskTable';
import AccountSettings from '../pages/AccountSettings';
import AdminDashboard from '../pages/AdminDashboard';
import TeamDashboard from '../pages/TeamDashboard';
import { useAuth } from '../context/AuthContext';
import AddTaskPage from '../pages/AddTaskPage';
import ManageCategoriesPage from '../pages/ManageCategoriesPage';
import TaskDetailsPage from '../pages/TaskDetailsPage';
import TaskEditPage from '../pages/TaskEditPage';
// import TaskEditPage from '../pages/TaskEditPage';

const AppRoutes = () => {
  const { role } = useAuth();

  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterForm />} />

      {/* Protected routes */}
      <Route element={<SidebarLayout />}>
        {/* Common authenticated routes */}
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/tasks" element={<TaskTable />} />
        <Route path="/account" element={<AccountSettings />} />
        <Route path="/tasks/new" element={<AddTaskPage />} />
        <Route path="/tasks/:id" element={<TaskDetailsPage />} />
        <Route path="/tasks/:taskId/edit" element={<TaskEditPage />} />

        {/* Admin-only routes */}
        <Route element={<ProtectedRoute allowedRoles={['admin']} userRole={role} />}>
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/users" element={<TeamDashboard />} />
          <Route path="/tasks/manageCategory" element={<ManageCategoriesPage />} />
        </Route>
      </Route>

      {/* Error routes */}
      <Route path="/forbidden" element={<Forbidden />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
