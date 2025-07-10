import React from "react";
import type { Task } from "../interfaces/task";
import { getStatusColor } from "../utils/userUtils";

interface TaskListViewProps {
  tasks: Task[];
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks }) => {
  const getFirstAssignedUser = (task: Task) => {
    return task.assignedUsers.length > 0 ? task.assignedUsers[0] : null;
  };

  return (
    <table className="table table-bordered align-middle table-fixed w-100">
      <thead className="table-light">
        <tr>
          <th style={{ width: "30%" }}>Task Title</th>
          <th className="d-none d-sm-table-cell" style={{ width: "25%" }}>
            Assigned To
          </th>
          <th className="d-none d-md-table-cell" style={{ width: "15%" }}>
            Category
          </th>
          <th className="d-none d-lg-table-cell" style={{ width: "10%" }}>
            Priority
          </th>
          <th className="d-none d-xl-table-cell" style={{ width: "15%" }}>
            Status
          </th>
          <th style={{ width: "5%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, idx) => {
          const assignedUser = getFirstAssignedUser(task);

          return (
            <tr key={idx}>
              <td
                style={{
                  borderLeft: `5px solid ${getStatusColor(task.status?.name || "")}`,
                  borderRadius: "8px 0 0 8px",
                }}
              >
                <div>{task.title}</div>
                <small className="text-muted">By {task.createdBy?.fullName}</small>
              </td>

              <td className="d-none d-sm-table-cell">
                {assignedUser && (
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={
                        assignedUser.avatar ||
                        `https://ui-avatars.com/api/?name=${encodeURIComponent(assignedUser.fullName)}`
                      }
                      alt="avatar"
                      className="rounded-circle"
                      width="40"
                      height="40"
                    />
                    <div>
                      <div>{assignedUser.fullName}</div>
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>
                        {assignedUser.email}
                      </div>
                    </div>
                  </div>
                )}
              </td>

              <td className="d-none d-md-table-cell">
                {task.category?.name || "Uncategorized"}
              </td>
              <td className="d-none d-lg-table-cell">
                {task.priority?.name || "Normal"}
              </td>
              <td className="d-none d-xl-table-cell">
                <span
                  className="status-pill"
                  style={{
                    backgroundColor: getStatusColor(task.status?.name || ""),
                  }}
                >
                  {task.status?.name || "Unknown"}
                </span>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <button
                    className="btn btn-sm p-2 rounded-circle text-primary hover-edit"
                    aria-label="Edit"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>

                  <button
                    className="btn btn-sm p-2 rounded-circle text-muted hover-danger"
                    aria-label="Delete"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <i className="bi bi-trash" />
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

export default TaskListView;
