import React, { useState, useEffect } from "react";
import { Outlet, Navigate, Link, useNavigate, useLocation } from "react-router-dom";
import TopNavbar from "./TopNavbar";
import "../styles/SidebarLayout.css";
import { useAuth } from "../context/AuthContext";

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: 'bi-layers', roles: ['admin', 'user'] },
  { to: '/tasks', label: 'Tasks', icon: 'bi-journal-bookmark-fill', roles: ['admin', 'user'] },
  { to: '/account', label: 'Account', icon: 'bi-person-gear', roles: ['admin', 'user'] },
  { to: '/users', label: 'Users', icon: 'bi-person-rolodex', roles: ['admin'] }
];

const SidebarLayout: React.FC = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { role, isAuthenticated, logout, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth <= 1200;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(false);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const contentArea = document.querySelector('.main-content');
    if (contentArea) {
      contentArea.scrollTo({ top: 0, behavior: 'auto' });
    }
  }, [location.pathname]);

  const toggleSidebar = () => setSidebarOpen(!isSidebarOpen);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (loading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="layout-container">
      {/* Sidebar */}
      <div className={`sidebar align-items-center d-flex flex-column p-2 ${isMobile ? (isSidebarOpen ? "open" : "") : "collapsed"}`}>
        <div className="sidebar-logo mb-4 d-flex px-2 pt-5">
          <img src="/logov1.png" alt="Logo" width="40" />
          <span className="fw-bold fs-4">TASKY.io</span>
        </div>

        <hr className="w-100 border-top border-dark mb-4" />

        {navLinks.map(({ to, label, icon, roles }) => {
          if (!role || (roles && !roles.includes(role))) return null;
          return (
            <Link
              key={to}
              to={to}
              className="nav-link d-flex align-items-center gap-3 mb-3 ps-1"
              onClick={() => isMobile && setSidebarOpen(false)}
            >
              <div className="icon-sidebar bsc-icon d-flex align-items-center justify-content-center bg-white rounded" style={{ width: "44px", height: "44px" }}>
                <i className={`bi ${icon}`} style={{ fontSize: "1.2rem" }}></i>
              </div>
              <span className="text-sidebar bsc-span">{label}</span>
            </Link>
          );
        })}

        <button
          onClick={handleLogout}
          className="nav-link logout-link d-flex align-items-center gap-3 mb-3 ps-1 border-0 bg-transparent w-100"
        >
          <div className="icon-sidebar logout-icon d-flex align-items-center justify-content-center bg-white rounded" style={{ width: "44px", height: "44px" }}>
            <i className="bi bi-box-arrow-right" style={{ fontSize: "1.2rem" }}></i>
          </div>
          <span className="text-sidebar logout-span">Logout</span>
        </button>
      </div>

      {/* Overlay for mobile */}
      {isMobile && isSidebarOpen && <div className="overlay" onClick={() => setSidebarOpen(false)} />}

      {/* Main content area display */}
      <div className="content-area d-flex flex-column">
        <TopNavbar onToggleSidebar={toggleSidebar} />
        <div className="main-content flex-grow-1 overflow-auto px-3">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default SidebarLayout;
