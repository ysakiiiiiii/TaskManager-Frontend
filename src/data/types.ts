export type Status = 'To Do' | 'In Progress' | 'Done' | 'On Hold';
export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'UI/UX' | 'Backend' | 'Documentation' | 'DevOps' | 'Testing';

export interface UserModel {
  id: string;
  name: string;
  email: string;
  avatar: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Comment {
  id: string;
  user: UserModel;
  text: string;
  timestamp: string;
  attachment?: string;
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: UserModel;
  assignedToList?: UserModel[];
  createdBy: UserModel;
  category: Category;
  priority: Priority;
  status: Status;
  checklist: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  completedTasks?: number;
  totalTasks?: number;
  startDate?: string;
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
}