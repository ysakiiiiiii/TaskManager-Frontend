export interface TaskStatusCount {
  statusId: number;
  count: number;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  email: string;
  role: string | null;
  userCreated: string;
  userModified?: string;
  isActive?: boolean; 
  taskStatusCounts?: TaskStatusCount[];
}

export interface PaginatedUserResponse {
  items: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}

export interface PaginatedUserResponse {
  items: User[];
  totalCount: number;
  currentPage: number;
  pageSize: number;
}