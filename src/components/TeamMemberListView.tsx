import React from "react";
import { Table, Badge, Dropdown } from "react-bootstrap";
import type { User } from "../data/taskInterfaces";
import { getAvatarUrl, getStatusColor, statusLabels } from "../utils/userUtils";

interface TeamMemberListViewProps {
  users: User[];
  onUserSelect: (user: User) => void;
  toggleStatus: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const TeamMemberListView: React.FC<TeamMemberListViewProps> = ({ 
  users, 
  onUserSelect,
  toggleStatus,
  onEdit,
  onDelete
}) => {
  return (
    <table className="table table-bordered align-middle table-fixed w-100">
      <thead className="table-light">
        <tr>
          <th style={{ width: "25%" }}>Member</th>
          <th style={{ width: "25%" }}>Email</th>
          <th style={{ width: "15%" }}>Status</th>
          <th style={{ width: "25%" }}>Task Progress</th>
          <th style={{ width: "10%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
            <td onClick={() => onUserSelect(user)} style={{ cursor: 'pointer' }}>
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
            <td>
              <a href={`mailto:${user.email}`} className="text-decoration-none">
                {user.email}
              </a>
            </td>
            <td>
              <Badge bg={user.isActive ? "success" : "secondary"}>
                {user.isActive ? "Active" : "Inactive"}
              </Badge>
            </td>
            <td>
              <div className="d-flex gap-2">
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
            <td>
              <div className="d-flex align-items-center justify-content-end gap-2">
                <button 
                  className={`btn btn-sm ${user.isActive ? 'btn-outline-danger' : 'btn-outline-success'}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(user.id);
                  }}
                  style={{ minWidth: '90px' }}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <Dropdown>
                  <Dropdown.Toggle 
                    variant="light" 
                    id="dropdown-basic" 
                    className="p-1 d-flex align-items-center justify-content-center"
                    style={{ width: '32px', height: '32px' }}
                  >
                    <i className="bi bi-three-dots-vertical"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu style={{ zIndex: 9999 }}>
                    <Dropdown.Item onClick={() => onEdit(user)}>
                      <i className="bi bi-pencil me-2"></i> Edit
                    </Dropdown.Item>
                    <Dropdown.Item onClick={() => onDelete(user.id)} className="text-danger">
                      <i className="bi bi-trash me-2"></i> Delete
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </div>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default TeamMemberListView;