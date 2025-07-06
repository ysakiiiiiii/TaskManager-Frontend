import React, { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import '../styles/SidebarLayout.css';
import TaskTable from './TaskTable';
import AdminDashboard from '../pages/AdminDashboard';

const SidebarLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div
        className={`sidebar d-flex flex-column p-2 ${
          isMobile ? (isSidebarOpen ? 'open' : '') : 'collapsed'
        }`}
      >
        <a href="#" className="nav-link mb-2">
          <i className="bi bi-house-door"></i>
          <span className="nav-label">Dashboard</span>
        </a>
        <a href="#" className="nav-link mb-2">
          <i className="bi bi-person"></i>
          <span className="nav-label">Users</span>
        </a>
        <a href="#" className="nav-link mb-2">
          <i className="bi bi-gear"></i>
          <span className="nav-label">Settings</span>
        </a>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && (
        <div className="overlay" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Main content area */}
      <div className="content-area d-flex flex-column">
        <TopNavbar onToggleSidebar={toggleSidebar} />
        <div className="main-content flex-grow-1 overflow-auto px-3">
          <AdminDashboard />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
