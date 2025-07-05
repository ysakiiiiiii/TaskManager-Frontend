import React, { useState } from 'react';
import '../styles/TaskTable.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import type { Task, Status } from '../data/types';
import { allTasks } from '../data/allTasks';   

const getStatusBadgeClass = (status: Status): string => {
  switch (status) {
    case 'To Do':
      return 'bg-warning text-dark';
    case 'In Progress':
      return 'bg-danger text-white';
    case 'Done':
      return 'bg-primary text-white';
    case 'On Hold':
      return 'bg-indigo text-white';
    default:
      return 'bg-success text-white';
  }
};

export default function TaskTable() {
  const [filters, setFilters] = useState<{
    category: string;
    priority: string;
    status: string;
  }>({ category: '', priority: '', status: '' });

  const [search, setSearch] = useState('');
  const [view, setView] = useState<'list' | 'card'>('list');
  const [page, setPage] = useState(1);
  const tasksPerPage = 10;

  const filteredTasks = allTasks.filter((task) => {
    return (
      (filters.category === '' || task.category === filters.category) &&
      (filters.priority === '' || task.priority === filters.priority) &&
      (filters.status === '' || task.status === filters.status) &&
      (task.title.toLowerCase().includes(search.toLowerCase()) ||
        task.assignedTo.name.toLowerCase().includes(search.toLowerCase()))
    );
  });

  const paginatedTasks = filteredTasks.slice(
    (page - 1) * tasksPerPage,
    page * tasksPerPage
  );

  const totalPages = Math.ceil(filteredTasks.length / tasksPerPage);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="mb-0">Tasks</h4>
        <div>
          <button className="btn btn-outline-secondary me-2" onClick={() => setView('list')}>
            <i className="bi bi-list"></i>
          </button>
          <button className="btn btn-outline-secondary me-2" onClick={() => setView('card')}>
            <i className="bi bi-grid-3x3-gap"></i>
          </button>
          <button className="btn btn-primary">+ Add New Task</button>
        </div>
      </div>

      <div className="row g-2 mb-3">
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => handleFilterChange('category', e.target.value)}>
            <option value="">Select Category</option>
            <option value="UI/UX">UI/UX</option>
            <option value="Backend">Backend</option>
            <option value="Documentation">Documentation</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => handleFilterChange('priority', e.target.value)}>
            <option value="">Select Priority</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
        <div className="col-md-3">
          <select className="form-select" onChange={(e) => handleFilterChange('status', e.target.value)}>
            <option value="">Select Status</option>
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="On Hold">On Hold</option>
          </select>
        </div>
        <div className="col-md-3">
          <input
            type="text"
            className="form-control"
            placeholder="Search Task/User"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {view === 'list' ? (
        <table className="table table-bordered align-middle">
          <thead className="table-light">
            <tr>
              <th>Task Title</th>
              <th>Assigned To</th>
              <th>Category</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginatedTasks.map((task, idx) => (
              <tr key={idx}>
                <td>
                  <div>{task.title}</div>
                  <small className="text-muted">Created by {task.assignedTo.name}</small>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img src={task.assignedTo.avatar} alt="avatar" className="rounded-circle" width="40" height="40" />
                    <div>
                      <div>{task.assignedTo.name}</div>
                      <div className="text-muted" style={{ fontSize: '0.8rem' }}>{task.assignedTo.email}</div>
                    </div>
                  </div>
                </td>
                <td>{task.category}</td>
                <td>{task.priority}</td>
                <td>
                  <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span>
                </td>
                <td>
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
                  <p className="mb-1"><strong>Status:</strong> <span className={`badge ${getStatusBadgeClass(task.status)}`}>{task.status}</span></p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <nav className="mt-3">
        <ul className="pagination justify-content-center">
          {[...Array(totalPages)].map((_, i) => (
            <li key={i} className={`page-item ${page === i + 1 ? 'active' : ''}`}>
              <button className="page-link" onClick={() => setPage(i + 1)}>{i + 1}</button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
