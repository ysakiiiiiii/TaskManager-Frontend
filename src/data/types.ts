export type Status = 'To Do' | 'In Progress' | 'Done' | 'On Hold';
export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'UI/UX' | 'Backend' | 'Documentation' | 'DevOps' | 'Testing';

export interface UserModel {
  name: string;
  email: string;
  avatar: string;
}

// types.ts
export interface Task {
  title: string;
  assignedTo: UserModel;
  assignedToList?: UserModel[]; 
  createdBy: UserModel; 
  category: Category;
  priority: Priority;
  status: Status;
  description?: string;
  completedTasks?: number;
  totalTasks?: number;
  startDate?: string;
  dueDate?: string;
  attachments?: any[];
}