import React, { useState, useMemo } from "react";
import "../styles/TaskTable.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import useSearchFilters from "../hooks/useSearchFilter";
import TaskListView from "../components/TaskListView";
import TaskCardView from "../components/TaskCardView";
import { Button, Form } from "react-bootstrap";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../hooks/useTasks";

const DEFAULT_FILTERS = {
  category: "",
  priority: "",
  status: "",
  search: "",
};

const VIEW_CONFIG = {
  list: {
    pageSizes: [5, 10, 20, 50, 0],
    defaultPageSize: 5,
    icon: "bi-list",
  },
  card: {
    pageSizes: [6, 12, 18, 0],
    defaultPageSize: 6,
    icon: "bi-grid-3x3-gap",
  },
};

export default function TaskTable() {
  const { role, loading: authLoading } = useAuth();
  const { filters: enumFilters, loading: filtersLoading } = useSearchFilters();
  
  const [viewMode, setViewMode] = useState<keyof typeof VIEW_CONFIG>("list");
  
  const {
    tasks,
    loading: tasksLoading,
    error,
    pagination,
    filters,
    updateFilters,
    changePage,
    changePageSize,
  } = useTasks(DEFAULT_FILTERS);

  const filterOptions = useMemo(() => [
    { key: "category", label: "Category", values: enumFilters.categories },
    { key: "priority", label: "Priority", values: enumFilters.priorities },
    { key: "status", label: "Status", values: enumFilters.statuses },
  ], [enumFilters]);

  const handleViewChange = (newView: keyof typeof VIEW_CONFIG) => {
    setViewMode(newView);
    changePageSize(VIEW_CONFIG[newView].defaultPageSize);
  };

  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    changePageSize(Number(e.target.value));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFilters({ search: e.target.value });
  };

  const handleFilterChange = (key: keyof typeof DEFAULT_FILTERS, value: string) => {
    updateFilters({ [key]: value });
  };

  const renderPagination = () => {
    if (pagination.totalPages <= 1) return null;

    const maxPageButtons = 5;
    const pages: (number | string)[] = [];
    
    if (pagination.totalPages <= maxPageButtons) {
      for (let i = 1; i <= pagination.totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      
      const start = Math.max(2, pagination.page - 2);
      const end = Math.min(pagination.totalPages - 1, pagination.page + 2);
      
      if (start > 2) pages.push("…");
      for (let i = start; i <= end; i++) pages.push(i);
      if (end < pagination.totalPages - 1) pages.push("…");
      if (pagination.totalPages > 1) pages.push(pagination.totalPages);
    }

    return (
      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(1)}>&laquo;</button>
          </li>
          <li className={`page-item ${pagination.page === 1 ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(pagination.page - 1)}>
              &lsaquo;
            </button>
          </li>
          
          {pages.map((p, i) => (
            typeof p === "string" ? (
              <li key={i} className="page-item disabled">
                <span className="page-link">…</span>
              </li>
            ) : (
              <li key={i} className={`page-item ${pagination.page === p ? "active" : ""}`}>
                <button className="page-link" onClick={() => changePage(p)}>
                  {p}
                </button>
              </li>
            )
          ))}
          
          <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(pagination.page + 1)}>
              &rsaquo;
            </button>
          </li>
          <li className={`page-item ${pagination.page === pagination.totalPages ? "disabled" : ""}`}>
            <button className="page-link" onClick={() => changePage(pagination.totalPages)}>
              &raquo;
            </button>
          </li>
        </ul>
      </nav>
    );
  };

  const renderViewToggle = () => (
    <div>
      {Object.entries(VIEW_CONFIG).map(([view, config]) => (
        <Button
          key={view}
          variant={viewMode === view ? "primary" : "outline-secondary"}
          className="me-2"
          size="sm"
          style={{ 
            backgroundColor: viewMode === view ? "#6a6dfb" : undefined, 
            borderColor: "#6a6dfb" 
          }}
          onClick={() => handleViewChange(view as keyof typeof VIEW_CONFIG)}
        >
          <i className={`bi ${config.icon}`}></i> {view.charAt(0).toUpperCase() + view.slice(1)}
        </Button>
      ))}
    </div>
  );

  const renderFilters = () => (
    <div className="row g-2 mb-2">
      {filterOptions.map(({ key, label, values }) => (
        <div className="col-md" key={key}>
          <Form.Select
            size="sm"
            value={filters[key as keyof typeof filters] as string | number | readonly string[] | undefined}
            onChange={(e) => handleFilterChange(key as keyof typeof DEFAULT_FILTERS, e.target.value)}
            disabled={filtersLoading}
          >
            <option value="">Select {label}</option>
            {filtersLoading ? (
              <option disabled>Loading...</option>
            ) : (
              values.map((val) => (
                <option key={val} value={val}>{val}</option>
              ))
            )}
          </Form.Select>
        </div>
      ))}
    </div>
  );

  const renderActionButtons = () => (
    <div className="row g-2">
      <div className={`col-12 ${role === "admin" ? "col-md-4" : "col-md-6"}`}>
        <Form.Control
          type="text"
          placeholder="Search tasks"
          value={filters.search || ""}
          onChange={handleSearchChange}
        />
      </div>

      <div className={`col-12 ${role === "admin" ? "col-md-4" : "col-md-6"}`}>
        <Button variant="primary" className="w-100 text-white" style={{ backgroundColor: "#6a6dfb" }}>
          + Add New Task
        </Button>
      </div>

      {role === "admin" && !authLoading && (
        <div className="col-12 col-md-4 pe-5">
          <Button 
            variant="primary" 
            className="w-100 text-white text-nowrap px-3"
            style={{ minWidth: "200px", backgroundColor: "#6a6dfb" }}
          >
            + Add New Category
          </Button>
        </div>
      )}
    </div>
  );

  const renderContent = () => {
    if (tasksLoading) return <div className="text-center py-5">Loading tasks...</div>;
    if (error) return <div className="alert alert-danger">{error}</div>;
    
    return viewMode === "list" ? (
      <TaskListView tasks={tasks}/>
    ) : (
      <TaskCardView tasks={tasks} />
    );
  };

  return (
    <div className="card border-0 shadow-sm">
      <div className="card-body">
        <div className="task-table-wrapper px-3 py-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-poppins mb-0 fs-5 fs-md-4 fs-lg-3">Search Filters</h4>
            {renderViewToggle()}
          </div>

          <div className="mb-3">
            {renderFilters()}
            <hr className="border border-dark my-5" />

            <div className="d-flex flex-wrap justify-content-between align-items-center gap-2">
              <Form.Select
                className="pe-4"
                value={pagination.pageSize as string | number | readonly string[] | undefined}
                onChange={handlePageSizeChange}
              >
                {VIEW_CONFIG[viewMode].pageSizes.map((n) => (
                  <option key={n} value={n}>
                    {n === 0 ? "All" : `${n} per page`}
                  </option>
                ))}
              </Form.Select>
              
              {renderActionButtons()}
            </div>
          </div>

          {renderContent()}
          {renderPagination()}
        </div>
      </div>
    </div>
  );
}
