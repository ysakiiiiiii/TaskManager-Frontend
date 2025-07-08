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
        className={`sidebar align-items-center d-flex flex-column p-2 ${
          isMobile ? (isSidebarOpen ? 'open' : '') : 'collapsed'
        }`}
      >
        <div className="sidebar-logo mb-4 d-flex px-2 pt-5">
          <img src="/logov1.png" alt="Logo" width="40" />
           <span className="fw-bold fs-4">TASKY</span>
        </div>

        <hr className="w-100 border-top border-dark mb-4" />

        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3 ps-1">
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-layers" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar bsc-span">Dashboard</span>
        </a>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3 ps-1">
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-journal-bookmark-fill" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar bsc-span">Tasks</span>
        </a>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3 ps-1">
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-person-rolodex" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar bsc-span">Users</span>
        </a>
        <a href="#" className="nav-link d-flex align-items-center gap-3 mb-3 ps-1">
          <div
            className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-person-gear" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar bsc-span">Account</span>
        </a>
        <a href="#" className="nav-link logout-link d-flex align-items-center gap-3 mb-3 ps-1">
          <div
            className="icon-sidebar logout-icon d-flex align-items-center justify-content-center bg-white rounded"
            style={{ width: '44px', height: '44px' }}
          >
            <i className="bi bi-box-arrow-right" style={{ fontSize: '1.2rem'}}></i>
          </div>
          <span className="text-sidebar logout-span">Logout</span>
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
