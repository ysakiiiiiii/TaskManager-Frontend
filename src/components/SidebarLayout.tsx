import React, { useState, useEffect } from "react";
import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import "../styles/SidebarLayout.css";
import TaskTable from "../pages/TaskTable";
import AdminDashboard from "../pages/AdminDashboard";
import TeamDashboard from "../pages/TeamDashboard";
import AccountSettings from "../pages/AccountSettings";
import ProtectedRoute from "../routes/ProtectedRoute";
import UserDashboard from "../pages/UserDashboard";

// Mock auth context - in a real app you'd have proper auth context/provider
const useAuth = () => {
  // This is just for demonstration - replace with your actual auth logic
  const [user, setUser] = useState({
    role: 'user',
    isAuthenticated: true
  });

  return {
    role: user.role,
    isAuthenticated: user.isAuthenticated,
    logout: () => setUser({ role: '', isAuthenticated: false })
  };
};

const SidebarLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { role, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div
        className={`sidebar align-items-center d-flex flex-column p-2 ${
          isMobile ? (isSidebarOpen ? "open" : "") : "collapsed"
        }`}
      >
        <div className="sidebar-logo mb-4 d-flex px-2 pt-5">
          <img src="/logov1.png" alt="Logo" width="40" />
          <span className="fw-bold fs-4">TASKY.io</span>
        </div>

        <hr className="w-100 border-top border-dark mb-4" />

        <Link
          to="/dashboard"
          className="nav-link d-flex align-items-center gap-3 mb-3 ps-1"
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: "44px", height: "44px" }}
          >
            <i className="bi bi-layers" style={{ fontSize: "1.2rem" }}></i>
          </div>
          <span className="text-sidebar bsc-span">Dashboard</span>
        </Link>
        
        <Link
          to="/tasks"
          className="nav-link d-flex align-items-center gap-3 mb-3 ps-1"
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: "44px", height: "44px" }}
          >
            <i
              className="bi bi-journal-bookmark-fill"
              style={{ fontSize: "1.2rem" }}
            ></i>
          </div>
          <span className="text-sidebar bsc-span">Tasks</span>
        </Link>
        
        {role === 'admin' && (
          <Link
            to="/users"
            className="nav-link d-flex align-items-center gap-3 mb-3 ps-1"
            onClick={() => isMobile && setSidebarOpen(false)}
          >
            <div
              className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
              style={{ width: "44px", height: "44px" }}
            >
              <i
                className="bi bi-person-rolodex"
                style={{ fontSize: "1.2rem" }}
              ></i>
            </div>
            <span className="text-sidebar bsc-span">Users</span>
          </Link>
        )}
        
        <Link
          to="/account"
          className="nav-link d-flex align-items-center gap-3 mb-3 ps-1"
          onClick={() => isMobile && setSidebarOpen(false)}
        >
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: "44px", height: "44px" }}
          >
            <i className="bi bi-person-gear" style={{ fontSize: "1.2rem" }}></i>
          </div>
          <span className="text-sidebar bsc-span">Account</span>
        </Link>
        
        <button
          onClick={handleLogout}
          className="nav-link logout-link d-flex align-items-center gap-3 mb-3 ps-1 border-0 bg-transparent w-100"
        >
          <div
            className="icon-sidebar logout-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: "44px", height: "44px" }}
          >
            <i
              className="bi bi-box-arrow-right"
              style={{ fontSize: "1.2rem" }}  
            ></i>
          </div>
          <span className="text-sidebar logout-span">Logout</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content area */}
      <div className="content-area d-flex flex-column">
        <TopNavbar onToggleSidebar={toggleSidebar} />
        <div className="main-content flex-grow-1 overflow-auto px-3 pe-1">
          <Routes>
            {/* Public routes for all authenticated users */}
            <Route path="/dashboard" element={<UserDashboard />} />
            <Route path="/tasks" element={<TaskTable />} />
            <Route path="/account" element={<AccountSettings />} />
            
            {/* Admin-only routes */}
            <Route element={<ProtectedRoute allowedRoles={['admin']} userRole={role} />}>
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/users" element={<TeamDashboard />} />
              <Route path="/tasks" element={<TaskTable />} />

            </Route>
            
            {/* Redirect to dashboard by default */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;