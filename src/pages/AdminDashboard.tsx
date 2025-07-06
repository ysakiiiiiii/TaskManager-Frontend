import React from 'react';
import { allTasks } from '../data/allTasks'; 
import { BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';

const COLORS = {
  Pending: '#7E57C2',
  'In Progress': '#26C6DA',
  Completed: '#66BB6A',
  Low: '#26A69A',
  Medium: '#FFA726',
  High: '#EF5350'
};

const Dashboard = () => {
  const statusCounts = { Pending: 0, 'In Progress': 0, Completed: 0 };
  const priorityCounts = { Low: 0, Medium: 0, High: 0 };

  allTasks.forEach((task) => {
    const { status, priority } = task;
    if (status === 'To Do' || status === 'On Hold') statusCounts.Pending++;
    else if (status === 'In Progress') statusCounts['In Progress']++;
    else if (status === 'Done') statusCounts.Completed++;

    priorityCounts[priority]++;
  });

  const statusData = [
    { name: 'Pending', value: statusCounts.Pending },
    { name: 'In Progress', value: statusCounts['In Progress'] },
    { name: 'Completed', value: statusCounts.Completed }
  ];

  const priorityData = [
    { name: 'Low', count: priorityCounts.Low },
    { name: 'Medium', count: priorityCounts.Medium },
    { name: 'High', count: priorityCounts.High }
  ];

  const totalTasks = allTasks.length;

  return (
    <div className="container py-4">
      <div className="card mb-4">
        <div className="card-body d-flex justify-content-between align-items-center">
          <div>
            <h2 className="card-title">Good Morning! Mike</h2>
            <p className="text-muted">Tuesday 25th Mar 2025</p>
          </div>
          <div className="d-flex gap-4">
            <div className="text-center">
              <h4>{totalTasks}</h4>
              <p className="text-muted">Total Tasks</p>
            </div>
            <div className="text-center text-primary">
              <h4>{statusCounts.Pending}</h4>
              <p className="text-muted">Pending Tasks</p>
            </div>
            <div className="text-center text-info">
              <h4>{statusCounts['In Progress']}</h4>
              <p className="text-muted">In Progress</p>
            </div>
            <div className="text-center text-success">
              <h4>{statusCounts.Completed}</h4>
              <p className="text-muted">Completed Tasks</p>
            </div>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Task Distribution</h5>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    fill="#8884d8"
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        <div className="col-md-6 mb-4">
          <div className="card h-100">
            <div className="card-body">
              <h5 className="card-title">Task Priority Levels</h5>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={priorityData}>
                  <Bar dataKey="count">
                    {priorityData.map((entry, index) => (
                      <Cell key={`bar-${index}`} fill={COLORS[entry.name]} />
                    ))}
                  </Bar>
                  <Tooltip />
                  <Legend />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
