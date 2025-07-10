
import api from '../api/api';
import type { ApiResponse, PaginatedTaskResponse, Task, TaskFilterParams } from '../interfaces/task';
import { transformTask } from '../interfaces/task';

export const TaskService = {
  async getAllTasks(params: TaskFilterParams): Promise<PaginatedTaskResponse> {
    const response = await api.get<ApiResponse<PaginatedTaskResponse>>('/TaskItem', {
      params: {
        search: params.search,
        category: params.category,
        priority: params.priority,
        status: params.status,
        sortBy: params.sortBy,
        isAscending: params.isAscending,
        pageNumber: params.page,
        pageSize: params.pageSize,
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
