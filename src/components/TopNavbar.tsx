import React from 'react';
import '../styles/TopNavbar.css';

type Props = {
  onToggleSidebar: () => void;
};

const TopNavbar: React.FC<Props> = ({ onToggleSidebar }) => {
  return (
    <div className="top-navbar d-flex justify-content-between align-items-center px-3 py-2 shadow-sm bg-white">
      <div className="d-flex align-items-center gap-3">
        <i
          className="bi bi-list fs-4 cursor-pointer d-xl-none"
          onClick={onToggleSidebar}
        ></i>
      </div>

      <div className="d-flex align-items-center gap-3">
        <i className="bi bi-globe"></i>
        <i className="bi bi-brightness-high"></i>
        <i className="bi bi-grid-3x3-gap"></i>
        <i className="bi bi-bell"></i>
        <img
          src="https://i.pravatar.cc/32"
          alt="avatar"
          className="rounded-circle"
          width="32"
          height="32"
        />
      </div>
    </div>
  );
};

export default TopNavbar;
