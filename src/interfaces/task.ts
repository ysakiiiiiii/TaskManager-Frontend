export interface IdNameDto {
  id: number;
  name: string;
}

export interface SearchFiltersDto {
  statuses: IdNameDto[];
  priorities: IdNameDto[];
  categories: IdNameDto[];
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar?: string;
}

export interface AssignedUser {
  userId: string;
  fullName: string;
  email: string;
  avatar?: string;
}


export interface ChecklistItem {
  id: number;
  description: string;
  isCompleted: boolean;
}

export interface Attachment {
  id: number;
  fileName: string;
  fileExtension: string;
  filePath: string;
  contentType?:string,
  dateUploaded: string;
  uploadedById: string;
  uploadedBy?: User;
}

export interface Comment {
  id: number;
  isEdited: boolean;
  userAvatar: string;
  userName: string;
  content: string;
  dateCreated: string;
  userId: string;
  createdBy?: User;
}

export interface Task {
  id: number;
  title: string;
  description: string;
  createdById: string | null;
  categoryId: number;
  priorityId: number;
  statusId: number;
  dateCreated: string;
  dateModified: string | null;
  dueDate: string;
  assignedUsers: AssignedUser[];
  checklistItems: ChecklistItem[];
  comments: Comment[];
  attachments: Attachment[];
  createdBy?: {
    id: string | null;
    fullName: string;
    avatar?: string;
  };
  category?: {
    id: number;
    name: string;
  };
  priority?: {
    id: number;
    name: string;
  };
  status?: {
    id: number;
    name: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
}

export interface PaginatedTaskResponse {
  items: Task[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface TaskFilterParams {
  search?: string;
  category?: string;
  priority?: string;
  status?: string;
  type? : string;
  sortBy?: string;
  isAscending?: boolean;
  page?: number;
  pageSize?: number;
}

export interface TaskCreateDto {
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
  statusId: number;
  dueDate?: string;
  assignedUserIds: string[];
}

export interface TaskUpdateDto {
  id: number;
  title: string;
  description: string;
  categoryId: number;
  priorityId: number;
  statusId: number;
  dueDate?: string; 
  assignedUserIds: string[];
  checklistItems: CheckListDto[]; 
}

export interface CheckListDto {
  id: number;
  description: string;
  isCompleted: boolean;
}

export interface AttachmentDto {
  id: number;
  fileName: string;
  fileExtension: string;
  filePath: string;
  dateUploaded: string; 
  uploadedById: string;
}



export const getAvatarUrl = (name: string): string => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
};

export const transformTask = (task: any): Task => {
  console.log('Task Data:', task);


  return {
    id: task.id,
    title: task.title,
    description: task.description,
    createdById: task.createdById,
    categoryId: task.categoryId,
    priorityId: task.priorityId,
    statusId: task.statusId,
    dateCreated: task.dateCreated,
    dateModified: task.dateModified,
    dueDate: task.dueDate,

    assignedUsers: (task.assignedUsers ?? []).map((au: any) => ({
      userId: au.userId,
      fullName: au.fullName,
      email: au.email,
      avatar: getAvatarUrl(au.fullName),
    })),

    checklistItems: task.checklistItems ?? [],
    comments: (task.comments ?? []).map((c: any) => ({
      ...c,
      userAvatar: c.userAvatar || getAvatarUrl(c.userName),
    })),
    attachments: (task.attachments ?? []).map((att: any) => ({
      ...att,
      uploadedBy: att.uploadedBy
        ? {
            ...att.uploadedBy,
            avatar:
              att.uploadedBy.avatar ||
              getAvatarUrl(
                `${att.uploadedBy.firstName} ${att.uploadedBy.lastName}`
              ),
          }
        : undefined,
    })),

    createdBy: {
      id: task.createdById,
      fullName: task.createdByName || "Unassigned",
      avatar: getAvatarUrl(task.createdByName),
    },

    category: {
      id: task.categoryId,
      name: task.categoryName ?? "Uncategorized",
    },

    priority: {
      id: task.priorityId,
      name: task.priorityName ?? "Low",
    },

    status: {
      id: task.statusId,
      name: task.statusName ?? "Unknown",
    },
  };
};

