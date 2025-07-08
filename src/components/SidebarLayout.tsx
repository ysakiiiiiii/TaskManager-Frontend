import React, { useState, useEffect } from 'react';
import TopNavbar from './TopNavbar';
import '../styles/SidebarLayout.css';
import TaskTable from './TaskTable';
import AdminDashboard from '../pages/AdminDashboard';
import TeamDashboard from './TeamDashboard';
import TeamMemberListView from './TeamMemberListView';

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
        <div className="sidebar-logo mb-4 d-flex align-items-center gap-2 px-2">
          <img src="/logo.png" alt="Logo" width="28" />
          {!isMobile && <span className="fw-bold fs-5">Tasky</span>}
        </div>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3">
          <div
            className="icon-sidebar d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-layers" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar">Dashboard</span>
        </a>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3">
          <div
            className="icon-sidebar d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-journal-bookmark-fill" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar">Tasks</span>
        </a>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3">
          <div
            className="icon-sidebar d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-person-rolodex" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar">Users</span>
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
          <TaskTable />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
