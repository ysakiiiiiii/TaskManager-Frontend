import React from "react";
import { Table, Badge, Dropdown } from "react-bootstrap";
import type { User } from "../data/taskInterfaces";
import { getAvatarUrl, getStatusColor, statusLabels } from "../utils/userUtils";

interface TeamMemberListViewProps {
  users: User[];
  onUserSelect: (user: User | null) => void;
  toggleStatus: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
  selectedUserId?: string;
}

const TeamMemberListView: React.FC<TeamMemberListViewProps> = ({ 
  users, 
  onUserSelect,
  toggleStatus,
  onEdit,
  onDelete,
  selectedUserId
}) => {
  const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);
  const tableRef = React.useRef<HTMLTableElement>(null);

  const handleDropdownToggle = (userId: string, isOpen: boolean) => {
    setOpenDropdownId(isOpen ? userId : null);
  };

  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (tableRef.current && !tableRef.current.contains(event.target as Node)) {
        onUserSelect(null);
        setOpenDropdownId(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onUserSelect]);

  return (
    <table 
      className="table table-bordered align-middle table-fixed w-100" 
      ref={tableRef}
    >
      <thead className="table-light">
        <tr>
          <th style={{ width: "25%" }}>Member</th>
          <th className="d-none d-sm-table-cell" style={{ width: "25%" }}>Email</th>
          <th className="d-none d-md-table-cell"style={{ width: "10%" }}>Status</th>
          <th className="d-none d-lg-table-cell"style={{ width: "30%" }}>Task Progress</th>
          <th className="text-center" style={{ width: "10%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr 
            key={user.id} 
            className={selectedUserId === user.id ? "table-primary" : ""}
            onClick={(e) => {
              const tag = (e.target as HTMLElement).tagName.toLowerCase();
              if (["button", "a", "svg", "path", "i"].includes(tag) || (e.target as HTMLElement).closest('.dropdown')) {
                return; 
              }
              onUserSelect(user);
            }}
            style={{ cursor: 'pointer' }}
          >
            <td>
              <div className="d-flex align-items-center gap-3">
                <img 
                  src={getAvatarUrl(`${user.firstName} ${user.lastName}`)}
                  alt="avatar"
                  className="rounded-circle"
                  width={40}
                  height={40}
                />
                <div>
                  <div className="fw-semibold">{user.firstName} {user.lastName}</div>
                  <div className="text-muted small">@{user.username}</div>
                </div>
              </div>
            </td>
            <td className="d-none d-sm-table-cell">
              <a href={`mailto:${user.email}`} className="text-decoration-none">
                {user.email}
              </a>
            </td>
            <td className="d-none d-md-table-cell">
              <Badge bg={user.isActive ? "success" : "secondary"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </td>
            <td className="d-none d-lg-table-cell">
              <div className="d-flex gap-2 flex-wrap">
                {[1, 2, 3, 4].map(statusId => {
                  const count = user.tasks.filter(task => task.statusId === statusId).length;
                  if (count === 0) return null;
                  const color = getStatusColor(statusLabels[statusId]);
                  return (
                    <span 
                      key={statusId}
                      className="badge rounded-pill"
                      style={{ backgroundColor: color }}
                    >
                      {statusLabels[statusId]}: {count}
                    </span>
                  );
                })}
              </div>
            </td>
            <td className="text-end">
              <div className="d-flex justify-content-center gap-2">
                {/* Status Toggle */}
               <button
                className={`btn p-3 rounded-circle ${user.isActive ? 'text-danger' : 'text-success'}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(user.id);
                  }}
                  aria-label={user.isActive ? 'Deactivate' : 'Activate'}
                >
                  <i className={`bi ${user.isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`} style={{ fontSize: '1.5rem' }} />
                </button>

                {/* Edit */}
                <button
                  className="btn btn-sm p-2 rounded-circle text-primary"
                  aria-label="Edit"
                >
                  <i className="bi bi-pencil" />
                </button>

                {/* Delete */}
                <button
                  className="btn btn-sm p-2 rounded-circle text-muted hover-danger"
                  aria-label="Delete"
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamMemberListView;
