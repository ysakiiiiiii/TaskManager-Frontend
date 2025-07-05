export type Status = 'To Do' | 'In Progress' | 'Done' | 'On Hold';
export type Priority = 'High' | 'Medium' | 'Low';
export type Category = 'UI/UX' | 'Backend' | 'Documentation' | 'DevOps' | 'Testing';

export interface AssignedTo {
  name: string;
  email: string;
  avatar: string;
}

export interface Task {
  title: string;
  assignedTo: AssignedTo;
  category: Category;
  priority: Priority;
  status: Status;
}
