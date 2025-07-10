import api from '../api/api';
import type { ApiResponse, PaginatedTaskResponse, Task, TaskFilterParams } from '../interfaces/task';
import { transformTask } from '../interfaces/task';

export const TaskService = {
  async getAllTasks(params: TaskFilterParams): Promise<PaginatedTaskResponse> {
    const response = await api.get<ApiResponse<PaginatedTaskResponse>>('/TaskItem', {
      params: {
        Search: params.search,
        Category: params.category,
        Priority: params.priority,
        Status: params.status,
        SortBy: params.sortBy,
        isAscending: params.isAscending,
        Page: params.page,
        PageSize: params.pageSize,
        Type: params.type,
      },
    });
    return {
      ...response.data.data,
      items: response.data.data.items.map(transformTask),
    };
  },

  async getTaskById(id: number): Promise<Task> {
    const response = await api.get<ApiResponse<Task>>(`/TaskItem/${id}`);
    return transformTask(response.data.data);
  },

  async createTask(taskData: any): Promise<Task> {
    const response = await api.post<ApiResponse<Task>>('/TaskItem', taskData);
    return transformTask(response.data.data);
  },

  async updateTask(id: number, taskData: any): Promise<Task> {
    const response = await api.put<ApiResponse<Task>>(`/TaskItem/${id}`, taskData);
    return transformTask(response.data.data);
  },

  async deleteTask(id: number): Promise<void> {
    await api.delete(`/TaskItem/${id}`);
  },
};