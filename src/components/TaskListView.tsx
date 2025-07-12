import React from "react";
import { useNavigate } from "react-router-dom";
import type { Task } from "../interfaces/task";
import { getStatusColor } from "../utils/userUtils";
import { TaskService } from "../services/taskServices";
import { useAuth } from "../context/AuthContext";

interface TaskListViewProps {
  tasks: Task[];
  onDelete?: (deletedId: number) => void;
  showToast: (message: string, type: "success" | "error") => void;
}

const TaskListView: React.FC<TaskListViewProps> = ({ tasks, onDelete, showToast }) => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const getFirstAssignedUser = (task: Task) => task.assignedUsers[0] || null;

  const canEditOrDelete = (task: Task) => task.createdById === user?.id;

  const handleEdit = (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (!canEditOrDelete(task)) {
      showToast("You can only edit your own tasks", "error");
      return;
    }
    navigate(`/tasks/${task.id}/edit`);
  };

  const handleDelete = async (e: React.MouseEvent, task: Task) => {
    e.stopPropagation();
    if (!canEditOrDelete(task)) {
      showToast("You can only delete your own tasks", "error");
      return;
    }

    const confirmDelete = window.confirm("Are you sure you want to delete this task?");
    if (!confirmDelete) return;

    try {
      await TaskService.deleteTask(task.id);
      showToast("Task deleted successfully", "success");
      onDelete?.(task.id);
    } catch (err: any) {
      console.error("Delete error:", err);
      const status = err?.response?.status;
      const message =
        status === 403
          ? "You are not authorized to delete this task."
          : status === 404
          ? "Task not found."
          : "Error deleting task. Please try again.";
      showToast(message, "error");
    }
  };

  return (
    <table className="table table-bordered align-middle table-fixed w-100">
      <thead className="table-light">
        <tr>
          <th style={{ width: "30%" }}>Task Title</th>
          <th className="d-none d-sm-table-cell" style={{ width: "25%" }}>Assigned To</th>
          <th className="d-none d-md-table-cell" style={{ width: "15%" }}>Category</th>
          <th className="d-none d-lg-table-cell" style={{ width: "10%" }}>Priority</th>
          <th className="d-none d-xl-table-cell" style={{ width: "15%" }}>Status</th>
          <th style={{ width: "5%" }}>Actions</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task) => {
          const assignedUser = getFirstAssignedUser(task);
          const editable = canEditOrDelete(task);

          return (
            <tr
              key={task.id}
              onClick={() => navigate(`/tasks/${task.id}`)}
              style={{ cursor: "pointer" }}
            >
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
              <td className="d-none d-md-table-cell">{task.category?.name || "Uncategorized"}</td>
              <td className="d-none d-lg-table-cell">{task.priority?.name || "Normal"}</td>
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
                    onClick={(e) => handleEdit(e, task)}
                    title={editable ? "Edit Task" : "You can only edit your own tasks"}
                  >
                    <i className="bi bi-pencil"></i>
                  </button>
                  <button
                    className="btn btn-sm p-2 rounded-circle text-danger hover-danger"
                    onClick={(e) => handleDelete(e, task)}
                    title={editable ? "Delete Task" : "You can only delete your own tasks"}
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
