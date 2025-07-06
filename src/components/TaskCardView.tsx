import React from "react";
import type { Task } from "../data/types";
import { getStatusColor } from "./TaskTable";

interface TaskCardViewProps {
  tasks: Task[];
}

const TaskCardView: React.FC<TaskCardViewProps> = ({ tasks }) => {
  return (
    <div className="row">
      {tasks.map((task, idx) => (
        <div key={idx} className="col-md-6 col-lg-4 mb-4">
          <div 
            className="card h-100 shadow-sm p-3 transition-all"
            style={{
              backgroundColor: "#fff",
              borderLeft: `6px solid ${getStatusColor(task.status)}`,
              borderTopLeftRadius: "1rem",
              borderBottomLeftRadius: "1rem",
              borderRight: '1px solid #dee2e6',
              borderTop: '1px solid #dee2e6',
              borderBottom: '1px solid #dee2e6',
              minHeight: '200px',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
              cursor: 'pointer',
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            {/* Card header with badges*/}
            <div className="d-flex align-items-center mb-3 flex-wrap gap-2" style={{ rowGap: '0.5rem' }}>
              <span className="badge text-light" style={{ 
                backgroundColor: "#078b83",
                fontSize: '0.65rem',
                padding: '0.25rem 0.4rem'
              }}>
                {task.category}
              </span>
              <span
                className={`badge ${
                  task.priority === "High"
                    ? "bg-danger"
                    : task.priority === "Medium"
                    ? "bg-warning text-dark"
                    : "bg-success"
                }`}
                style={{ fontSize: '0.65rem', padding: '0.25rem 0.4rem' }}
              >
                {task.priority}
              </span>
              <span
                className="badge text-white"
                style={{
                  backgroundColor: getStatusColor(task.status),
                  fontSize: '0.65rem',
                  padding: '0.25rem 0.4rem'
                }}
              >
                {task.status}
              </span>
            </div>

            {/* Task title and creator info*/}
            <div className="mb-3">
              <h5 className="fw-semibold mb-2" style={{ fontSize: '0.95rem' }}>{task.title}</h5>
              <div className="small text-muted" style={{ fontSize: '0.7rem' }}>
                <div className="d-flex align-items-center">
                  <span className="me-1">Created by:</span>
                  <img
                    src={task.createdBy.avatar}
                    alt={task.createdBy.name}
                    className="rounded-circle me-1 border"
                    width="20"
                    height="20"
                    style={{ objectFit: 'cover' }}
                  />
                  <span className="fw-medium">{task.createdBy.name}</span>
                </div>
              </div>
            </div>

            {/* Task description */}
            <div className="mb-3">
              <p className="text-muted small mb-0" style={{ 
                fontSize: '0.75rem',
                minHeight: '2.5em',
                lineHeight: '1.3',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical'
              }}>
                {task.description || "No description provided..."}
              </p>
            </div>

            {/* Progress bar */}
            <div className="mb-3">
              <div className="d-flex justify-content-between small" style={{ fontSize: '0.7rem' }}>
                <span>Progress:</span>
                <span>{task.completedTasks || 0}/{task.totalTasks || 5}</span>
              </div>
              <div className="progress mt-1" style={{ height: "4px", backgroundColor: "#e9ecef" }}>
                <div
                  className="progress-bar"
                  style={{
                    width: `${((task.completedTasks || 0) / (task.totalTasks || 5)) * 100}%`,
                    backgroundColor: getStatusColor(task.status),
                  }}
                ></div>
              </div>
            </div>

            {/* Dates*/}
            <div className="mb-3">
              <div className="d-flex justify-content-between text-muted small" style={{ fontSize: '0.7rem' }}>
                <div>
                  <div><strong>Start:</strong> {task.startDate || "16/03/25"}</div>
                </div>
                <div>
                  <div><strong>Due:</strong> {task.dueDate || "31/03/25"}</div>
                </div>
              </div>
            </div>

            {/* Footer with assigned users and attachments */}
            <div className="d-flex justify-content-between align-items-center mt-auto pt-2">
              <div className="d-flex flex-wrap gap-2">
                {(task.assignedToList || [task.assignedTo]).map((user, i) => (
                  <div key={i} className="d-flex align-items-center">
                    <img
                      src={user.avatar}
                      alt={user.name}
                      className="rounded-circle me-1 border"
                      width="24"
                      height="24"
                      style={{ objectFit: 'cover' }}
                    />
                    <span className="small">{user.name}</span>
                  </div>
                ))}
              </div>
              
              {task.attachments && (
                <div className="d-flex align-items-center gap-1" style={{ fontSize: '0.7rem' }}>
                  <i className="bi bi-paperclip"></i>
                  <span>{task.attachments.length}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskCardView;