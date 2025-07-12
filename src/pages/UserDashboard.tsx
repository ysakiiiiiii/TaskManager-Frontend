import React, { useMemo } from 'react';
import {
  BarChart, Bar, PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer,
  XAxis, YAxis, CartesianGrid
} from 'recharts';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useAuth } from '../context/AuthContext';
import useStatCounts from '../hooks/useStatCounts';
import useCategoryNames from '../hooks/useCategoryNames';
import { aggregateCountsByKey } from '../utils/statUtils';

const COLORS = {
  'To Do': '#7E57C2',
  'On Hold': '#EE534F',
  'In Progress': '#26C6DA',
  'Done': '#66BB6A',
  Low: '#26A69A',
  Medium: '#FFA726',
  High: '#EF5350',
  'Backend': '#00ACC1',
  'Backend Integration': '#5E35B1',
  'Frontend Development': '#42A5F5',
  'Project Management': '#AB47BC',
  'Quality Assurance': '#EC407A',
};

const Dashboard = () => {
  const { user } = useAuth();
  const { users, loading } = useStatCounts();
  const categoryMap = useCategoryNames();

  const isAdmin = user?.role === 'Admin';

  const targetUsers = useMemo(() => {
    if (loading) return [];
    return isAdmin ? users : users.filter(u => u.id === user?.id);
  }, [users, user, isAdmin, loading]);

  const priorityMap = {
    1: 'Low',
    2: 'Medium',
    3: 'High',
  };

const statusCounts = aggregateCountsByKey(
  Object.fromEntries(targetUsers.map(u => [u.id, u.taskStatusCounts ?? []])),
  'id'
);

const priorityCounts = aggregateCountsByKey(
  Object.fromEntries(targetUsers.map(u => [u.id, u.taskPriorityCounts ?? []])),
  'id'
);

const categoryCounts = aggregateCountsByKey(
  Object.fromEntries(targetUsers.map(u => [u.id, u.taskCategoryCounts ?? []])),
  'id'
);



  const totalTasks = Object.values(statusCounts).reduce((sum, c) => sum + c, 0);
  const doneTasks = statusCounts[3] || 0;
  const completionRate = totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0;

  const statusData = [
    { name: 'To Do', value: statusCounts[1] || 0 },
    { name: 'On Hold', value: statusCounts[4] || 0 },
    { name: 'In Progress', value: statusCounts[2] || 0 },
    { name: 'Done', value: statusCounts[3] || 0 },
  ];

  const priorityData = Object.entries(priorityCounts).map(([id, count]) => ({
    name: priorityMap[+id as keyof typeof priorityMap] || `Priority ${id}`,
    count
  }));

  const categoryData = Object.entries(categoryCounts).map(([id, count]) => ({
    name: categoryMap[+id] || `Category ${id}`,
    count
  }));

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });



  return (
    <div className="container-fluid py-4">
      {/* Header Section */}
      <div className="row mb-4">
        <div className="col-12">
          <div className="card border-0 shadow-sm rounded-3">
            <div className="card-body p-4">
              <div className="d-flex flex-column flex-md-row align-items-md-center justify-content-between">
                <div className="mb-3 mb-md-0">
                  <h1 className="h3 fw-bold mb-1">Good Morning, {isAdmin ? 'Admin' : user?.firstName}!</h1>
                  <p className="text-muted mb-0">{formattedDate}</p>
                </div>
                <div className="d-flex align-items-center">
                  <div className={`badge bg-${completionRate >= 75 ? 'success' : completionRate >= 50 ? 'warning' : 'danger'} py-2 px-3 rounded-pill`}>
                    <span className="fw-bold">{completionRate}%</span> Completion Rate
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Cards Section - Adjusted column classes */}
      <div className="row mb-4">
        <StatCard 
          title="Total Tasks" 
          count={totalTasks} 
          icon="bi-list-task" 
          color="primary" 
          description="All assigned tasks" 
        />
        <StatCard 
          title="Pending" 
          count={(statusCounts[1] || 0) + (statusCounts[4] || 0)} 
          icon="bi-hourglass-top" 
          color="warning" 
          description="To Do + On Hold"
        />
        <StatCard 
          title="In Progress" 
          count={statusCounts[2] || 0} 
          icon="bi-arrow-repeat" 
          color="info" 
          description="Currently being worked on"
        />
        <StatCard 
          title="Completed" 
          count={statusCounts[3] || 0} 
          icon="bi-check-circle" 
          color="success" 
          description="Finished tasks"
        />
       
      </div>

      {/* Charts Section */}
      <div className="row g-4">
        <div className="col-lg-4 col-md-6">
          <ChartCard 
            title="Task Status" 
            type="pie" 
            data={statusData} 
            colorKey="name" 
            height={350}
            description="Breakdown of tasks by status"
          />
        </div>
        <div className="col-lg-4 col-md-6">
          <ChartCard 
            title="Priority Levels" 
            type="bar" 
            data={priorityData} 
            dataKey="count" 
            colorKey="name" 
            height={350}
            description="Distribution of task priorities"
          />
        </div>
        <div className="col-lg-4 col-md-12">
          <ChartCard 
            title="Task Categories" 
            type="bar" 
            data={categoryData} 
            dataKey="count" 
            colorKey="name" 
            height={350}
            description="Tasks by category"
            showLabel={false} 
          />
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ title, count, icon, color, description }: { 
  title: string; 
  count: number | string; 
  icon?: string;
  color: string;
  description?: string;
}) => (
  <div className="col-6 col-sm-4 col-lg-3 col-xl-2-4 mb-3"> {/* Adjusted column classes */}
    <div className={`card border-start-lg border-${color} h-100`}>
      <div className="card-body">
        <div className="d-flex align-items-center">
          <div className={`bg-${color}-subtle rounded p-3 me-3`}>
            <i className={`bi ${icon || 'bi-card-checklist'} text-${color} fs-4`}></i>
          </div>
          <div>
            <h2 className="mb-1 fw-bold">{count}</h2>
            <h6 className="mb-0 text-muted">{title}</h6>
            {description && <small className="text-muted">{description}</small>}
          </div>
        </div>
      </div>
    </div>
  </div>
);

const ChartCard = ({
  title,
  type,
  data,
  colorKey,
  dataKey = 'value',
  height = 300,
  description,
  showLabel = true
}: {
  title: string;
  type: 'pie' | 'bar';
  data: any[];
  colorKey: string;
  dataKey?: string;
  height?: number;
  description?: string;
  showLabel?: boolean;
}) => (
  <div className="card h-100 shadow-sm">
    <div className="card-body">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="card-title mb-0">{title}</h5>
        {description && (
          <span className="badge bg-light text-dark">
            <i className="bi bi-info-circle me-1"></i>
          </span>
        )}
      </div>
      {description && <p className="text-muted small mb-3">{description}</p>}
      <div style={{ height: `${height}px` }}>
        <ResponsiveContainer width="100%" height="100%">
          {type === 'pie' ? (
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={2}
                dataKey={dataKey}
                label={showLabel ? ({ name, percent }) => `${name}: ${((percent ?? 0) * 100).toFixed(0)}%` : false}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry[colorKey] as keyof typeof COLORS] || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value) => [`${value} tasks`, 'Count']}
                labelFormatter={(label) => `Status: ${label}`}
              />
              {title !== 'Task Categories' && (
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              )}
            </PieChart>
          ) : (
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
              <XAxis 
                dataKey="name" 
                tick={title !== 'Task Categories' ? { fontSize: 12 } : false}
                axisLine={false}
                tickLine={false}
              />

              <YAxis 
                tick={{ fontSize: 12 }}
                axisLine={false}
                tickLine={false}
              />
              <Tooltip 
                cursor={{ fill: '#f5f5f5' }}
                formatter={(value) => [`${value} tasks`, 'Count']}
                labelFormatter={(label) => `${label}`}
              />
              <Bar 
                dataKey={dataKey} 
                name="Tasks" 
                radius={[4, 4, 0, 0]}
                barSize={24}
              >
                {data.map((entry, index) => (
                  <Cell key={index} fill={COLORS[entry[colorKey] as keyof typeof COLORS] || '#8884d8'} />
                ))}
              </Bar>
              {title !== 'Task Categories' && (
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  align="center"
                  wrapperStyle={{ paddingTop: '20px' }}
                />
              )}
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  </div>
);


export default Dashboard;