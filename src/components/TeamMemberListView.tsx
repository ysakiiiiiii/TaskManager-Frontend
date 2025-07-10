import React from "react";
import { Table, Badge } from "react-bootstrap";
import { getAvatarUrl, getStatusColor, statusLabels } from "../utils/userUtils";
import type { User } from "../interfaces/user";

interface TeamMemberListViewProps {
  users: User[];
  toggleStatus: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const TeamMemberListView: React.FC<TeamMemberListViewProps> = ({
  users,
  toggleStatus,
  onEdit,
  onDelete,
}) => {
  return (
    <table className="table table-bordered align-middle table-fixed w-100">
      <thead className="table-light">
        <tr>
          <th style={{ width: "25%" }}>Member</th>
          <th className="d-none d-sm-table-cell" style={{ width: "25%" }}>Email</th>
          <th className="d-none d-md-table-cell" style={{ width: "10%" }}>Status</th>
          <th className="d-none d-lg-table-cell" style={{ width: "30%" }}>Task Progress</th>
          <th className="text-center" style={{ width: "10%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map(user => (
          <tr key={user.id}>
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
                  <div className="text-muted small">@{user.email}</div>
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
              {user.taskStatusCounts?.length
                ? user.taskStatusCounts.map(({ statusId, count }) => (
                    <span
                      key={statusId}
                      className="badge rounded-pill"
                      style={{ backgroundColor: getStatusColor(statusLabels[statusId]) }}
                    >
                      {statusLabels[statusId]}: {count}
                    </span>
                  ))
                : <span className="text-muted small">No tasks</span>}

            </td>
            <td className="text-end">
              <div className="d-flex justify-content-center gap-2">
                <button
                  className={`btn p-3 rounded-circle ${user.isActive ? 'text-danger' : 'text-success'}`}
                  style={{
                    width: '40px',
                    height: '40px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                  onClick={() => toggleStatus(user.id)}
                  aria-label={user.isActive ? 'Deactivate' : 'Activate'}
                >
                  <i className={`bi ${user.isActive ? 'bi-toggle-on' : 'bi-toggle-off'}`} style={{ fontSize: '1.5rem' }} />
                </button>

                <button
                  className="btn btn-sm p-2 rounded-circle text-primary"
                  aria-label="Edit"
                  onClick={() => onEdit(user)}
                >
                  <i className="bi bi-pencil" />
                </button>

                <button
                  className="btn btn-sm p-2 rounded-circle text-muted hover-danger"
                  aria-label="Delete"
                  onClick={() => onDelete(user.id)}
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
