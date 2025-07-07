import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import TeamMemberCardView from "./TeamMemberCardView";
import TeamMemberListView from "./TeamMemberListView";
import { teamMembers, type User } from "../data/taskInterfaces";

const TeamDashboard: React.FC = () => {
  const [users, setUsers] = useState<User[]>(teamMembers);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [viewMode, setViewMode] = useState<"list" | "card">("list");
  const [page, setPage] = useState(1);
  const [tasksPerPage, setTasksPerPage] = useState(viewMode === "list" ? 5 : 6);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showDetails, setShowDetails] = useState(false);

  const toggleStatus = (id: string) => {
    setUsers(users.map(user =>
      user.id === id ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = `${user.firstName} ${user.lastName}`.toLowerCase().includes(search.toLowerCase()) ||
                         user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || user.role === roleFilter;
    const matchesStatus = !statusFilter ||
                         (statusFilter === "Active" && user.isActive) ||
                         (statusFilter === "Inactive" && !user.isActive);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const paginatedUsers = tasksPerPage === 0
    ? filteredUsers
    : filteredUsers.slice((page - 1) * tasksPerPage, page * tasksPerPage);

  const totalPages = tasksPerPage === 0 ? 1 : Math.ceil(filteredUsers.length / tasksPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    if (key === "role") setRoleFilter(value);
    if (key === "status") setStatusFilter(value);
    setPage(1);
  };

  const handleViewChange = (newView: "list" | "card") => {
    setViewMode(newView);
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
    if (start > 2) pages.push("...");
    for (let i = start; i <= end; i++) pages.push(i);
    if (end < totalPages - 1) pages.push("...");
    if (totalPages > 1) pages.push(totalPages);
    return pages;
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="task-table-wrapper px-3 py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-poppins mb-0 fs-5 fs-md-4 fs-lg-3">Team Members</h4>
            <div>
              <button 
                className={`btn me-2 ${viewMode === "list" ? "text-white" : "btn-outline-secondary"}`}
                style={{ backgroundColor: viewMode === "list" ? "#6a6dfb" : "" }}
                onClick={() => handleViewChange("list")}
              >
                <i className="bi bi-list"></i> List
              </button>
              <button 
                className={`btn ${viewMode === "card" ? "text-white" : "btn-outline-secondary"}`}
                style={{ backgroundColor: viewMode === "card" ? "#6a6dfb" : "" }}
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
                <select 
                  className="form-select" 
                  value={roleFilter}
                  onChange={(e) => handleFilterChange("role", e.target.value)}
                >
                  <option value="">Select Role</option>
                  <option value="Developer">Developer</option>
                  <option value="Designer">Designer</option>
                  <option value="Manager">Manager</option>
                  <option value="QA">QA</option>
                </select>
              </div>
              <div className="col-md">
                <select 
                  className="form-select"
                  value={statusFilter}
                  onChange={(e) => handleFilterChange("status", e.target.value)}
                >
                  <option value="">Select Status</option>
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div className="col-md"></div> {/* Empty column for alignment */}
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
                  {viewMode === "list" ? (
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
                  placeholder="Search Members"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn form-control text-white" style={{backgroundColor: "#6a6dfb"}}>
                  + Add New Member
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'list' ? (
            <TeamMemberListView 
              users={paginatedUsers} 
              onUserSelect={(user) => {
                setSelectedUser(user);
                setShowDetails(true);
              }}
            />
          ) : (
            <TeamMemberCardView 
              users={paginatedUsers}
              onUserSelect={(user) => {
                setSelectedUser(user);
                setShowDetails(true);
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
};

export default TeamDashboard;