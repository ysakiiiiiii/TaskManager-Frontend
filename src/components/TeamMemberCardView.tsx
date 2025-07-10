import React from "react";
import { Card, Badge } from "react-bootstrap";
import { getAvatarUrl, getStatusColor, statusLabels } from "../utils/userUtils";
import type { User } from "../interfaces/user";

interface TeamMemberCardViewProps {
  users: User[];
  toggleStatus: (id: string) => void;
  onEdit: (user: User) => void;
  onDelete: (id: string) => void;
}

const TeamMemberCardView: React.FC<TeamMemberCardViewProps> = ({
  users,
  toggleStatus,
  onEdit,
  onDelete
}) => {
  return (
    <div className="row g-4">
      {users.map((user) => (
        <div className="col-12 col-sm-6 col-lg-4" key={user.id}>
          <Card className="h-100 border-0 shadow-lg hover-shadow transition-all">
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center gap-3 mb-4">
                <div className="position-relative">
                  <img
                    src={getAvatarUrl(`${user.firstName} ${user.lastName}`)}
                    alt="avatar"
                    className="rounded-circle border border-3 border-white shadow-sm"
                    width={56}
                    height={56}
                  />
                  <span 
                    className={`position-absolute bottom-0 end-0 p-1 rounded-circle border border-2 border-white ${user.isActive ? "bg-success" : "bg-secondary"}`}
                    style={{ width: "14px", height: "14px" }}
                  />
                </div>
                <div>
                  <h5 className="fw-bold mb-0">{user.firstName} {user.lastName}</h5>
                  <small className="text-muted">@{user.email.split('@')[0]}</small>
                  <a 
                    href={`mailto:${user.email}`} 
                    className="d-block text-decoration-none text-primary small text-truncate"
                    style={{ maxWidth: "200px" }}
                  >
                    {user.email}
                  </a>
                </div>
              </div>

              <div className="mb-4">
                <div className="d-flex align-items-center gap-2 mb-2">
                  <span className="text-muted small">Status:</span>
                  <Badge 
                    pill 
                    bg={user.isActive ? "success-light" : "secondary-light"} 
                    text={user.isActive ? "success" : "secondary"}
                    className="px-2 py-1"
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted small">Tasks:</span>
                  {user.taskStatusCounts?.length ? (
                    <div className="d-flex gap-2 flex-wrap">
                      {user.taskStatusCounts.map(({ statusId, count }) => (
                        <span
                          key={statusId}
                          className="badge rounded-pill px-2 py-1"
                          style={{ 
                            backgroundColor: getStatusColor(statusLabels[statusId]),
                            color: "white",
                            fontSize: "0.75rem"
                          }}
                        >
                          {statusLabels[statusId]}: {count}
                        </span>
                      ))}
                    </div>
                  ) : (
                    <span className="text-muted small">No tasks assigned</span>
                  )}
                </div>
              </div>

              <div className="mt-auto d-flex justify-content-end gap-2">
                <button
                  className={`btn btn-icon ${user.isActive ? "btn-danger-soft" : "btn-success-soft"}`}
                  onClick={() => toggleStatus(user.id)}
                  aria-label={user.isActive ? "Deactivate" : "Activate"}
                  data-bs-toggle="tooltip"
                  title={user.isActive ? "Deactivate" : "Activate"}
                >
                  <i className={`bi ${user.isActive ? "bi-toggle-on" : "bi-toggle-off"}`} />
                </button>

                <button
                  className="btn btn-icon btn-primary-soft"
                  onClick={() => onEdit(user)}
                  aria-label="Edit"
                  data-bs-toggle="tooltip"
                  title="Edit"
                >
                  <i className="bi bi-pencil" />
                </button>

                <button
                  className="btn btn-icon btn-danger-soft"
                  onClick={() => onDelete(user.id)}
                  aria-label="Delete"
                  data-bs-toggle="tooltip"
                  title="Delete"
                >
                  <i className="bi bi-trash" />
                </button>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberCardView;