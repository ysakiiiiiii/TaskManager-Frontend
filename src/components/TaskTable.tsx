import React, { useState } from "react";
import "../styles/TaskTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

import type { Task, Status } from "../data/types";
import { allTasks } from "../data/allTasks";
import TaskListView from "./TaskListView";
import TaskCardView from "./TaskCardView";
import TaskBoardDetails from "./TaskBoardDetails";

export const getStatusColor = (status: Status): string => {
  switch (status) {
    case "To Do": return "#fcb329";
    case "In Progress": return "#dc3545";
    case "Done": return "#20b478";
    case "On Hold": return "#6610f2";
    default: return "#4caf50";
  }
};

export default function TaskTable() {
  const [filters, setFilters] = useState({ category: "", priority: "", status: "" });
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"list" | "card">("list");
  const [page, setPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(view === "list" ? 5 : 6); 
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showDetails, setShowDetails] = useState(false);
  const currentUser = { id: "u1", name: "You", avatar: "", email: "you@example.com" }; 

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

  const handleViewChange = (newView: "list" | "card") => {
    setView(newView);
    
    setTasksPerPage(newView === "list" ? 5 : 6);
    setPage(1);
  };

  const maxPageButtons = 5;

  const getPageList = () => {
    if (totalPages <= maxPageButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const half = Math.floor(maxPageButtons / 2);
    let start = Math.max(2, page - half + 1);
    let end = Math.min(totalPages - 1, start + maxPageButtons - 3);

    if (end - start < maxPageButtons - 3) {
      start = Math.max(2, end - (maxPageButtons - 3));
    }

    const pages = [1];
    if (start > 2) pages.push("…");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("…");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };


  return (
    <div className="card border-0 shadow-sm">
    <div className="card-body">
    <div className="task-table-wrapper px-3 py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="font-poppins mb-0 fs-5 fs-md-4 fs-lg-3">Search Filters</h4>
        <div>
          <button 
            className={`btn me-2 ${view === "list" ? "text-white" : "btn-outline-secondary"}`}
            style={{ backgroundColor: view === "list" ? "#6a6dfb" : "" }}
            onClick={() => handleViewChange("list")}
          >
            <i className="bi bi-list"></i> List
          </button>
          <button 
            className={`btn ${view === "card" ? "text-white" : "btn-outline-secondary"}`}
            style={{ backgroundColor: view === "card" ? "#6a6dfb" : "" }}
            onClick={() => handleViewChange("card")}
          >
            <i className="bi bi-grid-3x3-gap"></i> Cards
          </button>
        </div>
      </div>

      <div className="mb-3">
        {/* Top Row: Filters */}
        <div className="row g-2 mb-2">
          <div className="col-md">
            <select className="form-select form-select-sm" onChange={(e) => handleFilterChange("category", e.target.value)}>
              <option value="">Select Category</option>
              <option value="UI/UX">UI/UX</option>
              <option value="Backend">Backend</option>
              <option value="Documentation">Documentation</option>
            </select>
          </div>
          <div className="col-md">
            <select className="form-select form-select-sm" onChange={(e) => handleFilterChange("priority", e.target.value)}>
              <option value="">Select Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>
          <div className="col-md">
            <select className="form-select form-select-sm" onChange={(e) => handleFilterChange("status", e.target.value)}>
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

        {/* Bottom Row: Pagination + Search + Add */}
        <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
          <div>
            <select
              className="form-select"
              value={tasksPerPage}
              onChange={(e) => {
                const value = parseInt(e.target.value, 10);
                setTasksPerPage(value);
                setPage(1);
              }}
            >
              {view === "list" ? (
                <>
                  <option value={5}>5 per page</option>
                  <option value={10}>10 per page</option>
                  <option value={20}>20 per page</option>
                  <option value={50}>50 per page</option>
                  <option value={0}>All</option>
                </>
              ) : (
                <>
                  <option value={6}>6 per page</option>
                  <option value={12}>12 per page</option>
                  <option value={18}>18 per page</option>
                  <option value={0}>All</option>
                </>
              )}
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
            <button className="btn form-control text-white" style={{backgroundColor: "#6a6dfb"}}>+ Add New Task</button>
          </div>
        </div>
      </div>

        {view === "list" ? (
      <TaskListView tasks={paginatedTasks} onTaskSelect={(t) => { setSelectedTask(t); setShowDetails(true); }} />
    ) : (
      <TaskCardView tasks={paginatedTasks} onTaskSelect={(t) => { setSelectedTask(t); setShowDetails(true); }} />
    )}

    {selectedTask && (
      <TaskBoardDetails
        task={selectedTask}
        show={showDetails}
        onClose={() => setShowDetails(false)}
        currentUser={currentUser}
        onUpdateTask={(updatedTask) => {
          const updatedTasks = allTasks.map(task => 
            task.id === updatedTask.id ? updatedTask : task
          );
          setSelectedTask(updatedTask);
        }}
/>
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

            {getPageList().map((p, i) =>
              typeof p === "string" ? (
                <li key={i} className="page-item disabled">
                  <span className="page-link">…</span>
                </li>
              ) : (
                <li key={i} className={`page-item ${page === p ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setPage(p)}>{p}</button>
                </li>
              )
            )}

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
    </div>
    </div>
  );
}