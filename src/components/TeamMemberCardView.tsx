import React from "react";
import { Card, Image, Badge, Button } from "react-bootstrap";
import type { User } from "../data/taskInterfaces";
import { getStatusColor, statusLabels } from "../utils/userUtils";

const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
};

interface TeamMemberCardViewProps {
  users: User[];
  onUserSelect: (user: User) => void;
  toggleStatus: (id: string) => void;
}

const TeamMemberCardView: React.FC<TeamMemberCardViewProps> = ({ 
  users, 
  onUserSelect,
  toggleStatus
}) => {
  return (
    <div className="row">
      {users.map((user) => (
        <div key={user.id} className="col-md-6 col-lg-4 mb-4">
          <Card
            className="h-100 shadow-sm border-0 p-3"
            style={{
              backgroundColor: "#f9f9f9",
              borderRadius: "1rem",
              transition: "transform 0.2s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
            onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
          >
            <Card.Body className="d-flex flex-column">
              <div className="d-flex align-items-center justify-content-between mb-3">
                <div 
                  className="d-flex align-items-center" 
                  style={{ cursor: 'pointer' }}
                  onClick={() => onUserSelect(user)}
                >
                  <Image
                    src={getAvatarUrl(`${user.firstName} ${user.lastName}`)}
                    alt="avatar"
                    roundedCircle
                    width={48}
                    height={48}
                    className="me-3 border"
                  />
                  <div>
                    <h6 className="mb-0">
                      {user.firstName} {user.lastName}
                    </h6>
                    <div className="text-muted small">{user.role}</div>
                  </div>
                </div>
                <Button 
                  size="sm"
                  variant={user.isActive ? "outline-danger" : "outline-success"}
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleStatus(user.id);
                  }}
                >
                  {user.isActive ? 'Deactivate' : 'Activate'}
                </Button>
              </div>

              <div className="mb-2" onClick={() => onUserSelect(user)} style={{ cursor: 'pointer' }}>
                <a href={`mailto:${user.email}`} className="text-muted small text-decoration-none">
                  <i className="bi bi-envelope me-2"></i>
                  {user.email}
                </a>
              </div>

              <div className="mb-3" onClick={() => onUserSelect(user)} style={{ cursor: 'pointer' }}>
                <Badge bg={user.isActive ? "primary" : "secondary"}>
                  {user.isActive ? "Active" : "Inactive"}
                </Badge>
              </div>

              <div className="mt-auto" onClick={() => onUserSelect(user)} style={{ cursor: 'pointer' }}>
                <h6 className="text-muted text-uppercase small mb-2">Task Status</h6>
                <div className="d-flex flex-wrap gap-2">
                  {[1, 2, 3, 4].map((statusId) => {
                    const status = statusLabels[statusId];
                    const count = user.tasks.filter((task) => task.statusId === statusId).length;
                    const color = getStatusColor(status);
                    const bgColor = status === "Done" ? "#e6f5ef" : "#ffffff";
                    const isDone = status === "Done";

                    return (
                      <div
                        key={statusId}
                        className="flex-grow-1 p-2 rounded border"
                        style={{
                          borderLeft: `4px solid ${color}`,
                          backgroundColor: bgColor,
                          minWidth: "80px",
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center">
                          <span className="small text-muted">{status}</span>
                          <Badge
                            pill
                            bg={isDone ? "success" : "light"}
                            text={isDone ? "light" : "dark"}
                            className="px-2 border"
                          >
                            {count}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      ))}
    </div>
  );
};

export default TeamMemberCardView;