// interfaces/user.ts
export interface CountItem {
  statusId?: number;
  priorityId?: number;
  categoryId?: number;
  count: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  fullName?: string;
  role?: string;
  isActive : boolean;
  userCreated: string;
  userModified?: string | null;
  taskStatusCounts?: CountById[];   
  taskPriorityCounts?: CountById[]; 
  taskCategoryCounts?: CountById[]; 
}
export interface CountById {
  id: number;
  count: number;
}

export interface PaginatedUserResponse {
  items: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
  search: string;
}
export interface ApiResponse {
  success: boolean;
  message: string;
  errors?: string[];
  data?: any;
}
