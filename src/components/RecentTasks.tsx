import React, { useState, useMemo } from "react";
import type { Task } from "../data/types";
import { getStatusColor } from "./TaskTable";

interface RecentTasksProps {
  tasks: Task[];
  onTaskSelect: (task: Task) => void;
}

const RecentTasks: React.FC<RecentTasksProps> = ({ tasks, onTaskSelect }) => {
  const [filters, setFilters] = useState({ category: "", priority: "", status: "" });
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(5);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const filteredTasks = useMemo(() => {
    return tasks.filter(
      (task) =>
        (!filters.category || task.category === filters.category) &&
        (!filters.priority || task.priority === filters.priority) &&
        (!filters.status || task.status === filters.status) &&
        (task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.assignedTo.name.toLowerCase().includes(search.toLowerCase()))
    );
  }, [filters, search, tasks]);

  const totalPages = tasksPerPage === 0 ? 1 : Math.ceil(filteredTasks.length / tasksPerPage);
  const paginatedTasks = tasksPerPage === 0
    ? filteredTasks
    : filteredTasks.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  return (
    <div className="recent-tasks-wrapper px-3 py-4">
      <h5 className="mb-3">Recent Tasks</h5>

      {/* Filters */}
      <div className="row g-2 mb-3">
        <div className="col-md">
          <select className="form-select" onChange={(e) => handleFilterChange("category", e.target.value)}>
            <option value="">Select Category</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Backend">Backend</option>
            <option value="Documentation">Documentation</option>
          </select>
        </div>
        <div className="col-md">
          <select className="form-select" onChange={(e) => handleFilterChange("priority", e.target.value)}>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="col-md">
          <select className="form-select" onChange={(e) => handleFilterChange("status", e.target.value)}>
            <option value="">Select Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
      </div>

        <div>
          <hr className="border border-dark my-5" />
        </div>

      {/* Search + Page Size */}
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
        <div style={{ minWidth: 200 }}>
          <select
            className="form-select"
            value={tasksPerPage}
            onChange={(e) => {
              const value = parseInt(e.target.value, 10);
              setTasksPerPage(value);
              setPage(1);
            }}
          >
            <option value={5}>5 per page</option>
            <option value={10}>10 per page</option>
            <option value={0}>All</option>
          </select>
        </div>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 250 }}
          placeholder="Search task or user"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />
      </div>

      {/* Table */}
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
          {paginatedTasks.map((task, idx) => (
            <tr onClick={() => onTaskSelect(task)} key={idx} style={{ cursor: 'pointer' }}>
              <td style={{ borderLeft: `5px solid ${getStatusColor(task.status)}`, borderRadius: "8px 0 0 8px" }}>
                <div>{task.title}</div>
                <small className="text-muted d-sm-none">By {task.createdBy.name}</small>
              </td>
              <td className="d-none d-sm-table-cell">
                <div className="d-flex align-items-center gap-2">
                  <img
                    src={task.assignedTo.avatar}
                    alt="avatar"
                    className="rounded-circle"
                    width="40"
                    height="40"
                  />
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

      {/* Pagination */}
      {totalPages > 1 && (
        <nav>
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(1)}>&laquo;</button>
            </li>
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>&lsaquo;</button>
            </li>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <li key={p} className={`page-item ${page === p ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(p)}>{p}</button>
              </li>
            ))}

            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>&rsaquo;</button>
            </li>
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(totalPages)}>&raquo;</button>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
};

export default RecentTasks;
