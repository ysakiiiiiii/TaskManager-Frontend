import type { Task } from './types';

export const allTasks: Task[] = [
  {
    id: 't1',
    title: 'Fix Login Redirect Bug',
    description: 'Users are being redirected incorrectly after login, investigate and fix',
    assignedTo: { 
      id: 'u1', 
      name: 'Eliza Herring', 
      email: 'eliza@example.com', 
      avatar: 'https://i.pravatar.cc/40?img=5' 
    },
    createdBy: { 
      id: 'u2', 
      name: 'QA Team', 
      email: 'qa@example.com', 
      avatar: 'https://i.pravatar.cc/40?img=14' 
    },
    category: 'UI/UX',
    priority: 'High',
    status: 'In Progress',
    checklist: [
      { id: 'c1', text: 'Reproduce the issue', completed: true },
      { id: 'c2', text: 'Debug redirect logic', completed: true },
      { id: 'c3', text: 'Implement fix', completed: false },
      { id: 'c4', text: 'Write unit tests', completed: false }
    ],
    comments: [],
    attachments: [
      { 
        id: 'a1', 
        name: 'screenshot.png', 
        url: '#', 
        type: 'image/png', 
        size: '2.4MB' 
      }
    ],
    completedTasks: 2,
    totalTasks: 4,
    startDate: '18/03/25',
    dueDate: '22/03/25',
    createdAt: '2025-03-15T09:30:00Z',
    updatedAt: '2025-03-17T14:45:00Z'
  },
  {
    id: 't2',
    title: 'Optimize Database Indexes',
    description: 'Review and optimize indexes for faster query performance',
    assignedTo: { 
      id: 'u3', 
      name: 'Derek Small', 
      email: 'derek@example.com', 
      avatar: 'https://i.pravatar.cc/40?img=6' 
    },
    createdBy: { 
      id: 'u4', 
      name: 'Tech Lead', 
      email: 'tech@example.com', 
      avatar: 'https://i.pravatar.cc/40?img=15' 
    },
    category: 'DevOps',
    priority: 'Medium',
    status: 'On Hold',
    checklist: [
      { id: 'c1', text: 'Identify slow queries', completed: false },
      { id: 'c2', text: 'Analyze current indexes', completed: false },
      { id: 'c3', text: 'Create new indexes', completed: false }
    ],
    comments: [],
    attachments: [],
    completedTasks: 0,
    totalTasks: 3,
    startDate: '21/03/25',
    dueDate: '27/03/25',
    createdAt: '2025-03-18T10:15:00Z',
    updatedAt: '2025-03-18T10:15:00Z'
  },
  // Add more tasks with checklists as needed...
  ...Array.from({ length: 5 }, (_, i): Task => ({
    id: `t${i + 3}`,
    title: `Sample Task ${i + 1}`,
    description: `This is a sample task description ${i + 1}`,
    assignedTo: {
      id: `u${i + 5}`,
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://i.pravatar.cc/40?img=${i + 10}`
    },
    createdBy: {
      id: 'u1',
      name: 'System',
      email: 'system@example.com',
      avatar: 'https://i.pravatar.cc/40?img=1'
    },
    category: ['UI/UX', 'Backend', 'Documentation'][i % 3] as any,
    priority: ['High', 'Medium', 'Low'][i % 3] as any,
    status: ['To Do', 'In Progress', 'Done'][i % 3] as any,
    checklist: [
      { id: `c1`, text: `Initial research`, completed: i > 1 },
      { id: `c2`, text: `Implementation`, completed: i > 2 },
      { id: `c3`, text: `Testing`, completed: i > 3 }
    ],
    comments: [],
    attachments: [],
    completedTasks: i > 1 ? 1 : 0,
    totalTasks: 3,
    startDate: `${(i % 28) + 1}/03/25`,
    dueDate: `${(i % 28) + 5}/03/25`,
    createdAt: new Date(Date.now() - i * 86400000).toISOString(),
    updatedAt: new Date(Date.now() - i * 43200000).toISOString()
  }))
];