import React from 'react';
import { allTasks } from '../data/allTasks';
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, XAxis, YAxis, CartesianGrid, LineChart, Line } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import RecentTasks from '../components/RecentTasks';
import type { Task, Status, Priority, Category } from '../data/types';

const COLORS = {
  Pending: '#7E57C2',
  'On Hold': '#EE534F',
  'In Progress': '#26C6DA',
  Completed: '#66BB6A',
  Low: '#26A69A',
  Medium: '#FFA726',
  High: '#EF5350',
  'UI/UX': '#8E24AA',
  Backend: '#00ACC1',
  Documentation: '#43A047',
  DevOps: '#5C6BC0',
  Testing: '#EC407A'
};

// Mock data for task history
const taskHistoryData = [
  { date: 'Mar 1', created: 2, completed: 1 },
  { date: 'Mar 5', created: 3, completed: 2 },
  { date: 'Mar 10', created: 5, completed: 3 },
  { date: 'Mar 15', created: 4, completed: 2 },
  { date: 'Mar 20', created: 6, completed: 4 },
  { date: 'Mar 25', created: 3, completed: 5 },
];

const Dashboard = () => {
  // Calculate task statistics with proper typing
  const statusCounts: Record<string, number> = { 
    'To Do': 0, 
    'In Progress': 0, 
    'Done': 0,                                                  
    'On Hold': 0 
  };
  
  const priorityCounts: Record<Priority, number> = { 
    Low: 0, 
    Medium: 0, 
    High: 0 
  };
  
  const categoryCounts: Record<Category, number> = { 
    'UI/UX': 0, 
    Backend: 0, 
    Documentation: 0,
    DevOps: 0,
    Testing: 0
  };
  
  let overdueCount = 0;
  const today = new Date('2025-03-25');

  allTasks.forEach((task) => {
    // Status counts
    statusCounts[task.status]++;
    
    // Priority counts
    priorityCounts[task.priority]++;
    
    // Category counts
    categoryCounts[task.category]++;
    
    // Overdue tasks
    const dueDateParts = task.dueDate?.split('/');
    if (dueDateParts && dueDateParts.length === 3) {
      const dueDate = new Date(`20${dueDateParts[2]}-${dueDateParts[1]}-${dueDateParts[0]}`);
      if (dueDate < today && task.status !== 'Done') overdueCount++;
    }

  });

  // Convert status counts to chart data (grouping Pending statuses)
  const statusData = [
    { name: 'Pending', value: statusCounts['To Do'] },
    { name: 'On Hold', value: statusCounts['On Hold'] },
    { name: 'In Progress', value: statusCounts['In Progress'] },
    { name: 'Completed', value: statusCounts['Done'] }
  ];

  const priorityData = Object.entries(priorityCounts).map(([name, count]) => ({
    name,
    count
  }));

  const categoryData = Object.entries(categoryCounts).map(([name, count]) => ({
    name,
    count
  }));

  const totalTasks = allTasks.length;
  const completionRate = totalTasks > 0 ? Math.round((statusCounts['Done'] / totalTasks) * 100) : 0;

  // Format today's date
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  };
  const formattedDate = today.toLocaleDateString('en-US', options);

  // Get recent tasks (last 5)
  const recentTasks = [...allTasks]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  return (
    <div className="container-fluid">
      {/* Greeting Section */}
      <div className="row mb-5">
        <div className="col-md-12">
          <div className="card border-0 shadow-md rounded-4">
            <div className="card-body p-4">
              <div className="row align-items-center">
                <div className="col-md-4">
                  <h2 className="mb-1 fw-bold">Good Morning, Admin!</h2>
                  <p className="text-muted mb-4">{formattedDate}</p>
                </div>
                <div className="col-md-8">
                  <div className="row g-3">
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-primary">
                        <h4 className="mb-0 fw-bold">{totalTasks}</h4>
                        <small className="text-muted">Total Tasks</small>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-warning">
                        <h4 className="mb-0 fw-bold">{statusCounts['To Do'] + statusCounts['On Hold']}</h4>
                        <small className="text-muted">Pending</small>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-info">
                        <h4 className="mb-0 fw-bold">{statusCounts['In Progress']}</h4>
                        <small className="text-muted">In Progress</small>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-success">
                        <h4 className="mb-0 fw-bold">{statusCounts['Done']}</h4>
                        <small className="text-muted">Completed</small>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-danger">
                        <h4 className="mb-0 fw-bold">{overdueCount}</h4>
                        <small className="text-muted">Overdue</small>
                      </div>
                    </div>
                    <div className="col-6 col-sm-4 col-lg-2">
                      <div className="p-3 bg-white rounded shadow-sm border-start border-4 border-secondary">
                        <h4 className="mb-0 fw-bold">{completionRate}%</h4>
                        <small className="text-muted">Completion Rate</small>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Top Row */}
      <div className="row">
        {/* Task Distribution Pie Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-md rounded-4">
            <div className="card-body">
              <h5 className="card-title py-2">Task Distribution</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    <Legend wrapperStyle={{ display: 'flex', gap: '20px', justifyContent: 'center' }}/>
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Task Priority Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-md rounded-4">
            <div className="card-body">
              <h5 className="card-title py-2">Task Priority Levels</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={priorityData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]}>
                      {priorityData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section - Bottom Row */}
      <div className="row mb-4">
        {/* Task Category Bar Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-md rounded-4">
            <div className="card-body">
              <h5 className="card-title py-2">Task Categories</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={categoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => [`${value} tasks`, 'Count']} />
                    <Bar dataKey="count" name="Tasks" radius={[4, 4, 0, 0]}>
                      {categoryData.map((entry, index) => (
                        <Cell key={`bar-${index}`} fill={COLORS[entry.name as keyof typeof COLORS]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>

        {/* Task History Line Chart */}
        <div className="col-md-6 mb-4">
          <div className="card h-100 border-0 shadow-md rounded-4">
            <div className="card-body">
              <h5 className="card-title">Task History</h5>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={taskHistoryData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="date" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="created" 
                      stroke="#7E57C2" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Tasks Created"
                    />
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#66BB6A" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                      activeDot={{ r: 6 }}
                      name="Tasks Completed"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Tasks Section */}
      <div className="row">
        <div className="col-md-12">
          <div className="card border-0 shadow-sm">
            <div className="card-body">
              <RecentTasks tasks={allTasks} onTaskSelect={() => {}} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;