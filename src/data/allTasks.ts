import type { Task } from './types';

export const allTasks: Task[] = Array.from({ length: 30 }, (_, i): Task => ({
  id: `t${i + 1}`,
  title: `Sample Task ${i + 1}`,
  description: `This is a sample task description for task ${i + 1}.`,
  assignedTo: {
    id: `u${i + 1}`,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`
  },
  createdBy: {
    id: `u${(i % 5) + 21}`,
    name: `Creator ${(i % 5) + 1}`,
    email: `creator${(i % 5) + 1}@example.com`,
    avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 21}`
  },
  category: ['UI/UX', 'Backend', 'DevOps', 'Documentation', 'Testing'][i % 5] as any,
  priority: ['High', 'Medium', 'Low'][i % 3] as any,
  status: ['To Do', 'In Progress', 'On Hold', 'Done'][i % 4] as any,
  checklist: [
    { id: `c1`, text: `Initial research`, completed: i % 4 > 0 },
    { id: `c2`, text: `Implementation`, completed: i % 4 > 1 },
    { id: `c3`, text: `Testing`, completed: i % 4 > 2 }
  ],
  comments: [],
  attachments: [],
  completedTasks: (i % 4),
  totalTasks: 3,
  startDate: `${String(((i % 28) + 1)).padStart(2, '0')}/03/25`,
  dueDate: `${String(((i % 28) + 5)).padStart(2, '0')}/03/25`,
  createdAt: new Date(Date.now() - i * 86400000).toISOString(),
  updatedAt: new Date(Date.now() - i * 43200000).toISOString()
}));
