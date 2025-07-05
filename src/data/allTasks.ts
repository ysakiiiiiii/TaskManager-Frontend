import type { Task } from './types'; 

export const allTasks: Task[] = [
  {
    title: 'Update Dashboard UI',
    assignedTo: { name: 'Zsazsa McCleverty', email: 'zsazsa@example.com', avatar: 'https://i.pravatar.cc/40?img=1' },
    category: 'UI/UX',
    priority: 'High',
    status: 'In Progress',
  },
  {
    title: 'API Integration',
    assignedTo: { name: 'Yoko Pottie', email: 'yoko@example.com', avatar: 'https://i.pravatar.cc/40?img=2' },
    category: 'Backend',
    priority: 'Medium',
    status: 'To Do',
  },
  {
    title: 'Write Docs',
    assignedTo: { name: 'Wesley Burland', email: 'wesley@example.com', avatar: 'https://i.pravatar.cc/40?img=3' },
    category: 'Documentation',
    priority: 'Low',
    status: 'On Hold',
  },
  {
    title: 'Deploy to Production',
    assignedTo: { name: 'Ava Crayton', email: 'ava@example.com', avatar: 'https://i.pravatar.cc/40?img=4' },
    category: 'Backend',
    priority: 'High',
    status: 'Done',
  },
  
  ...Array.from({ length: 40 }, (_, i): Task => ({
    title: `Task Sample #${i + 5}`,
    assignedTo: {
      name: `User ${i + 1}`,
      email: `user${i + 1}@example.com`,
      avatar: `https://i.pravatar.cc/40?img=${(i % 70) + 1}`,
    },
    category: ['UI/UX', 'Backend', 'Documentation', 'DevOps', 'Testing'][i % 5] as Task['category'],
    priority: ['High', 'Medium', 'Low'][i % 3] as Task['priority'],
    status: ['To Do', 'In Progress', 'Done', 'On Hold'][i % 4] as Task['status'],
  })),
];
