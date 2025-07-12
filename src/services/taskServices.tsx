import api from "../api/api";
import type {
  ApiResponse,
  PaginatedTaskResponse,
  Task,
  TaskCreateDto,
  TaskFilterParams,
  TaskUpdateDto,
} from "../interfaces/task";
import { transformTask } from "../interfaces/task";

export const TaskService = {
  // Fetch all tasks
  async getAllTasks(params: TaskFilterParams): Promise<PaginatedTaskResponse> {
    const response = await api.get<ApiResponse<PaginatedTaskResponse>>("/TaskItem", {
      params: {
        Search: params.search,
        Category: params.category,
        Priority: params.priority,
        Status: params.status,
        SortBy: params.sortBy,
        isAscending: params.isAscending,
        Page: params.page,
        PageSize: params.pageSize === 0 ? 10000 : params.pageSize,
        Type: params.type,
      },
    });

    return {
      ...response.data.data,
      items: response.data.data.items.map(transformTask),
    };
  },

  async getTaskById(taskId: number): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/TaskItem/${taskId}`);
    return transformTask(response.data.data);
  },

  async createFullTask(
    task: TaskCreateDto,
    checklistItems: { description: string }[]
  ): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>("/TaskItem", task);
    const createdTask = transformTask(response.data.data);

    const validItems = checklistItems.filter(i => i.description.trim() !== "");
    if (validItems.length > 0) {
      await api.post(`/Checklist/${createdTask.id}`, {
        items: validItems.map(i => ({ description: i.description.trim() })),
      });
    }

    return createdTask;
  },

  async updateTask(
    taskId: number,
    taskData: TaskUpdateDto,
    checklistItems: { description: string }[]
  ): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/TaskItem/${taskId}`, taskData);
    const updatedTask = transformTask(response.data.data);

    const validItems = checklistItems.filter(i => i.description.trim() !== "");
    if (validItems.length > 0) {
      await api.put(`/Checklist/${updatedTask.id}`, {
        items: validItems.map(i => ({ description: i.description.trim() })),
      });
    }

    return updatedTask;
  },

  async deleteTask(taskId: number): Promise<void> {
    await api.delete(`/TaskItem/${taskId}`);
  },

  async uploadAttachment(taskId: number, file: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", file.name);

    await api.post(`/Attachment/${taskId}/upload`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  async deleteAttachment(attachmentId: number): Promise<void> {
    await api.delete(`/Attachment/${attachmentId}`);
  },
};
