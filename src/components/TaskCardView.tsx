import React from "react";
import type { Task } from '../interfaces/task';
import { getStatusColor } from "../utils/userUtils";

interface TaskCardViewProps {
  tasks: Task[];
}

const TaskCardView: React.FC<TaskCardViewProps> = ({ tasks }) => {
  return (
    <div className="row">
      {tasks.map((task, idx) => {
        const completedCount = task.checklistItems.filter(item => item.isCompleted).length;
        const totalCount = task.checklistItems.length;
        const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

        return (
          <div key={idx} className="col-md-6 col-lg-4 mb-4">
            <div
              className="card h-100 shadow-sm p-3 transition-all"
              style={{
                backgroundColor: "#fff",
                borderLeft: `6px solid ${getStatusColor(task.status?.name || '')}`,
                borderTopLeftRadius: "1rem",
                borderBottomLeftRadius: "1rem",
                borderRight: "1px solid #dee2e6",
                borderTop: "1px solid #dee2e6",
                borderBottom: "1px solid #dee2e6",
                minHeight: "200px",
                display: "flex",
                flexDirection: "column",
                transition: "transform 0.2s ease, box-shadow 0.2s ease",
                cursor: "pointer",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "translateY(-4px)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "translateY(0)")}
            >
              <div className="d-flex align-items-center mb-3 flex-wrap gap-2">
                <span className="badge text-light" style={{ backgroundColor: "#078b83", fontSize: "0.65rem", padding: "0.25rem 0.4rem" }}>
                  {task.category?.name || 'Uncategorized'}
                </span>
                <span className={`badge ${
                  task.priority?.name === "High" ? "bg-danger"
                  : task.priority?.name === "Medium" ? "bg-warning text-dark"
                  : "bg-success"
                }`} style={{ fontSize: "0.65rem", padding: "0.25rem 0.4rem" }}>
                  {task.priority?.name || 'Normal'}
                </span>
                <span className="badge text-white" style={{
                  backgroundColor: getStatusColor(task.status?.name || ''),
                  fontSize: "0.65rem", padding: "0.25rem 0.4rem"
                }}>
                  {task.status?.name || 'Unknown'}
                </span>
              </div>

              <div className="mb-3">
                <h5 className="fw-semibold mb-2" style={{ fontSize: "0.95rem" }}>{task.title}</h5>
                <div className="small text-muted" style={{ fontSize: "0.7rem" }}>
                  <div className="d-flex align-items-center">
                    <span className="me-1">Created by:</span>
                    <img
                      src={task.createdBy?.avatar || `https://ui-avatars.com/api/?name=${task.createdBy?.fullName}`}
                      alt={task.createdBy?.fullName}
                      className="rounded-circle me-1 border"
                      width="20"
                      height="20"
                      style={{ objectFit: "cover" }}
                    />
                    <span className="fw-medium">{task.createdBy?.fullName}</span>
                  </div>
                </div>
              </div>

              <div className="mb-3">
                <p className="text-muted small mb-0" style={{
                  fontSize: "0.75rem",
                  minHeight: "2.5em",
                  lineHeight: "1.3",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  display: "-webkit-box",
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: "vertical",
                }}>
                  {task.description || "No description provided..."}
                </p>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between small" style={{ fontSize: "0.7rem" }}>
                  <span>Progress:</span>
                  <span>{completedCount}/{totalCount}</span>
                </div>
                <div className="progress mt-1" style={{ height: "4px", backgroundColor: "#e9ecef" }}>
                  <div className="progress-bar" style={{
                    width: `${progressPercentage}%`,
                    backgroundColor: getStatusColor(task.status?.name || '')
                  }}></div>
                </div>
              </div>

              <div className="mb-3">
                <div className="d-flex justify-content-between text-muted small" style={{ fontSize: "0.7rem" }}>
                  <div><strong>Created:</strong> {new Date(task.dateCreated).toLocaleDateString()}</div>
                  <div><strong>Due:</strong> {new Date(task.dueDate).toLocaleDateString()}</div>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
                <div className="d-flex flex-wrap gap-2">
                  {task.assignedUsers.slice(0, 2).map((user, i) => (
                    <div key={i} className="d-flex align-items-center">
                      <img
                        src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}`}
                        alt={user.fullName}
                        className="rounded-circle me-1 border"
                        width="24"
                        height="24"
                        style={{ objectFit: "cover" }}
                      />
                      <span className="small">{user.fullName}</span>
                    </div>
                  ))}
                  {task.assignedUsers.length > 2 && (
                    <span className="small">+{task.assignedUsers.length - 2}</span>
                  )}
                </div>

                {task.attachments?.length > 0 && (
                  <div className="d-flex align-items-center gap-1" style={{ fontSize: "0.7rem" }}>
                    <i className="bi bi-paperclip"></i>
                    <span>{task.attachments.length}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default TaskCardView;
