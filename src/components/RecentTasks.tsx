import React from "react";
import type { Task } from "../data/types";
import { getStatusColor } from "./TaskTable";

interface RecentTasksProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, onTaskSelect }) => {
  return (
    <table className="table table-bordered align-middle table-fixed w-100">
      <thead className="table-light">
        <tr>
          <th style={{ width: "30%" }}>Task Title</th>
          <th className="d-none d-sm-table-cell" style={{ width: "25%" }}>Assigned To</th>
          <th className="d-none d-md-table-cell" style={{ width: "15%" }}>Category</th>
          <th className="d-none d-lg-table-cell" style={{ width: "10%" }}>Priority</th>
          <th className="d-none d-xl-table-cell" style={{ width: "15%" }}>Status</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map((task, idx) => (
          <tr onClick={() => onTaskSelect(task)} key={idx} style={{ cursor: 'pointer' }}>
            <td style={{ borderLeft: `5px solid ${getStatusColor(task.status)}`, borderRadius: "8px 0 0 8px" }}>
              <div>{task.title}</div>
              <small className="text-muted d-sm-none">By {task.createdBy.name}</small>
            </td>

            <td className="d-none d-sm-table-cell">
              <div className="d-flex align-items-center gap-2">
                <img src={task.assignedTo.avatar} alt="avatar" className="rounded-circle" width="40" height="40" />
                <div>
                  <div>{task.assignedTo.name}</div>
                  <div className="text-muted" style={{ fontSize: "0.8rem" }}>{task.assignedTo.email}</div>
                </div>
              </div>
            </td>

            <td className="d-none d-md-table-cell">{task.category}</td>
            <td className="d-none d-lg-table-cell">
              <span className={`badge bg-${task.priority === 'High' ? 'danger' : task.priority === 'Medium' ? 'warning' : 'success'}`}>
                {task.priority}
              </span>
            </td>
            <td className="d-none d-xl-table-cell">
              <span className="badge" style={{ backgroundColor: getStatusColor(task.status) }}>
                {task.status}
              </span>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RecentTasks;