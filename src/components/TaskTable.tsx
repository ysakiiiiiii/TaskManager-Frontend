import React, { useState } from "react";
import "../styles/TaskTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import type { Task, Status } from "../data/types";
import { allTasks } from "../data/allTasks";

const getStatusColor = (status: Status): string => {
  switch (status) {
    case "To Do": return "";
    case "In Progress": return "#dc3545";
    case "Done": return "#86d254";
    case "On Hold": return "#6610f2";
    default: return "#4caf50";
  }
};

export default function TaskTable() {
  const [filters, setFilters] = useState({ category: "", priority: "", status: "" });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "card">("list");
  const [page, setPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(10);

  const filteredTasks = allTasks.filter((task) => (
    (!filters.category || task.category === filters.category) &&
    (!filters.priority || task.priority === filters.priority) &&
    (!filters.status || task.status === filters.status) &&
    (task.title.toLowerCase().includes(search.toLowerCase()) ||
      task.assignedTo.name.toLowerCase().includes(search.toLowerCase()))
  ));

  const paginatedTasks = tasksPerPage === 0
    ? filteredTasks
    : filteredTasks.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  const totalPages = tasksPerPage === 0 ? 1 : Math.ceil(filteredTasks.length / tasksPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="task-table-wrapper px-3 py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="font-poppins mb-0 fs-5 fs-md-4 fs-lg-3">Tasks</h4>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => setView("list")}> <i className="bi bi-list"></i> </button>
          <button className="btn btn-outline-secondary me-2" onClick={() => setView("card")}> <i className="bi bi-grid-3x3-gap"></i> </button>
        </div>
      </div>

      <div className="mb-3">
        {/* Top Row: Filters */}
        <div className="row g-2 mb-2">
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

        {/* Bottom Row: Pagination + Search + Add */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <select className="form-select">
              <option>5 per page</option>
              <option>10 per page</option>
              <option>20 per page</option>
              <option>50 per page</option>
            </select>
          </div>

          <div className="d-flex align-items-center gap-2">
            <input
              type="text"
              className="form-control"
              placeholder="Search User"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button className="btn btn-primary form-control">+ Add New Task</button>
          </div>
        </div>
      </div>


      {view === "list" ? (
        <table className="table table-bordered align-middle table-fixed w-100">
          <thead className="table-light">
            <tr>
              <th style={{ width: "25%" }}>Task Title</th>
              <th className="d-none d-md-table-cell" style={{ width: "20%" }}>Assigned To</th>
              <th className="d-none d-md-table-cell" style={{ width: "15%" }}>Category</th>
              <th className="d-none d-md-table-cell" style={{ width: "10%" }}>Priority</th>
              <th className="d-none d-md-table-cell" style={{ width: "15%" }}>Status</th>
              <th className="d-none d-md-table-cell" style={{ width: "15%" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task, idx) => (
              <tr key={idx}>
                <td style={{ borderLeft: `5px solid ${getStatusColor(task.status)}`, borderRadius: "8px 0 0 8px" }}>
                  <div>{task.title}</div>
                  <small className="text-muted d-md-none">By {task.assignedTo.name}</small>
                </td>
                <td className="d-none d-md-table-cell">
                  <div className="d-flex align-items-center gap-2">
                    <img src={task.assignedTo.avatar} alt="avatar" className="rounded-circle" width="40" height="40" />
                    <div>
                      <div>{task.assignedTo.name}</div>
                      <div className="text-muted" style={{ fontSize: "0.8rem" }}>{task.assignedTo.email}</div>
                    </div>
                  </div>
                </td>
                <td className="d-none d-md-table-cell">{task.category}</td>
                <td className="d-none d-md-table-cell">{task.priority}</td>
                <td className="d-none d-md-table-cell">
                  <span className="status-pill" style={{ backgroundColor: getStatusColor(task.status) }}>{task.status}</span>
                </td>
                <td className="d-none d-md-table-cell">
                  <i className="bi bi-trash me-2 cursor-pointer"></i>
                  <i className="bi bi-eye me-2 cursor-pointer"></i>
                  <i className="bi bi-three-dots"></i>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <div className="row">
          {paginatedTasks.map((task, idx) => (
            <div key={idx} className="col-md-6 mb-3">
              <div className="card h-100">
                <div className="card-body">
                  <h5 className="card-title">{task.title}</h5>
                  <p className="card-subtitle text-muted mb-2">Created by {task.assignedTo.name}</p>
                  <p className="mb-1"><strong>Category:</strong> {task.category}</p>
                  <p className="mb-1"><strong>Priority:</strong> {task.priority}</p>
                  <p className="mb-1">
                    <strong>Status:</strong> <span className="status-pill" style={{ backgroundColor: getStatusColor(task.status) }}>{task.status}</span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav className="mt-3">
          <ul className="pagination justify-content-center">
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(1)}>&laquo;</button>
            </li>
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>&lsaquo;</button>
            </li>
            {[...Array(totalPages)].map((_, i) => (
              <li key={i} className={`page-item ${page === i + 1 ? "active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
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
}
