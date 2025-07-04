import 'bootstrap/dist/css/bootstrap.min.css';

const tasks = [
  {
    title: 'Design Homepage',
    status: 'In Progress',
    priority: 'High',
    description: 'Create a clean and modern homepage layout using Tailwind CSS...',
    done: 2,
    total: 5,
    start: '16th Mar 2025',
    due: '31st Mar 2025',
    avatars: ["/avatar1.jpg", "/avatar2.jpg"]
  },
  {
    title: 'Write Blog Post',
    status: 'In Progress',
    priority: 'Medium',
    description: 'Write an informative blog post about React performance optimization...',
    done: 2,
    total: 5,
    start: '16th Mar 2025',
    due: '27th Mar 2025',
    avatars: ["/avatar3.jpg", "/avatar4.jpg"]
  },
  {
    title: 'API Integration for Dashboard',
    status: 'Pending',
    priority: 'High',
    description: 'Implement API integration for the user dashboard...',
    done: 0,
    total: 5,
    start: '16th Mar 2025',
    due: '5th Apr 2025',
    avatars: ["/avatar1.jpg", "/avatar5.jpg"]
  },
  // Add more tasks here...
];

const getBadge = (type, value) => {
  const colorMap = {
    status: {
      'In Progress': 'info',
      'Pending': 'secondary',
      'Completed': 'success'
    },
    priority: {
      'High': 'danger',
      'Medium': 'warning',
      'Low': 'success'
    }
  };
  return <span className={`badge bg-${colorMap[type][value]} me-2`}>{value}</span>;
};

const TaskCard = ({ task }) => (
  <div className="task-card p-3 rounded shadow-sm mb-4 bg-white">
    <div className="d-flex align-items-center mb-2">
      {getBadge('status', task.status)}
      {getBadge('priority', task.priority)}
    </div>
    <h5>{task.title}</h5>
    <p className="text-muted small mb-2">{task.description}</p>
    <div className="progress mb-2">
      <div
        className="progress-bar"
        role="progressbar"
        style={{ width: `${(task.done / task.total) * 100}%` }}
        aria-valuenow={task.done}
        aria-valuemin={0}
        aria-valuemax={task.total}
      ></div>
    </div>
    <p className="text-muted small mb-1">Task Done: {task.done} / {task.total}</p>
    <div className="d-flex justify-content-between">
      <small className="text-muted">Start: {task.start}</small>
      <small className="text-muted">Due: {task.due}</small>
    </div>
    <div className="d-flex mt-2 avatar-group">
      {task.avatars.map((src, idx) => (
        <img
          key={idx}
          src={src}
          alt="avatar"
          className="rounded-circle border border-white me-1"
          style={{ width: '32px', height: '32px' }}
        />
      ))}
    </div>
  </div>
);

const App = () => {
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-md-3 bg-white vh-100 p-4 border-end">
          <div className="text-center">
            <img src="/avatar1.jpg" className="rounded-circle mb-2" width={80} alt="Admin" />
            <h5>Mike</h5>
            <span className="badge bg-primary">Admin</span>
            <p className="text-muted small">mike@timetoprogram.com</p>
          </div>
          <hr />
          <ul className="nav flex-column">
            <li className="nav-item">
              <a className="nav-link" href="#">Dashboard</a>
            </li>
            <li className="nav-item">
              <a className="nav-link active" href="#">Manage Tasks</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Create Task</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Team Members</a>
            </li>
            <li className="nav-item">
              <a className="nav-link" href="#">Logout</a>
            </li>
          </ul>
        </div>
        <div className="col-md-9 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h4>My Tasks</h4>
            <button className="btn btn-outline-success">Download Report</button>
          </div>
          <div className="d-flex gap-3 mb-4">
            <button className="btn btn-primary">All <span className="badge bg-light text-dark ms-1">18</span></button>
            <button className="btn btn-outline-secondary">Pending <span className="badge bg-light text-dark ms-1">11</span></button>
            <button className="btn btn-outline-info">In Progress <span className="badge bg-light text-dark ms-1">5</span></button>
            <button className="btn btn-outline-success">Completed <span className="badge bg-light text-dark ms-1">2</span></button>
          </div>
          <div className="row">
            {tasks.map((task, index) => (
              <div className="col-md-6" key={index}>
                <TaskCard task={task} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
