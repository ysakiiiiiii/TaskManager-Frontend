import { useState, useEffect, useCallback } from 'react';
import { TaskService } from '../services/taskServices';
import type { TaskFilterParams, Task } from '../interfaces/task';

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filters: TaskFilterParams;
  pagination: {
    page: number;
    totalCount: number;
    totalPages: number;
  };
}

export const useTasks = (initialFilters: TaskFilterParams) => {
  const [state, setState] = useState<TaskState>({
    tasks: [],
    loading: false,
    error: null,
    filters: {
      ...initialFilters,
      pageSize: initialFilters.pageSize || 5,
    },
    pagination: {
      page: 1,
      totalCount: 0,
      totalPages: 1,
    },
  });

  const loadTasks = useCallback(async () => {
    setState(prev => ({ ...prev, loading: true, error: null }));

    try {
      const response = await TaskService.getAllTasks({
        ...state.filters,
        page: state.pagination.page,
      });

      setState(prev => ({
        ...prev,
        tasks: response.items,
        pagination: {
          ...prev.pagination,
          totalCount: response.totalCount,
          totalPages: response.totalPages,
        },
      }));
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load tasks';
      setState(prev => ({ ...prev, error: errorMessage }));
      console.error('Task loading error:', err);
    } finally {
      setState(prev => ({ ...prev, loading: false }));
    }
  }, [state.filters, state.pagination.page]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks]);

  const updateFilters = (newFilters: Partial<TaskFilterParams>) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, ...newFilters },
      pagination: {
        ...prev.pagination,
        page: 1,
      },
    }));
  };

  const changePage = (page: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page,
      },
    }));
  };

  const changePageSize = (pageSize: number) => {
    setState(prev => ({
      ...prev,
      filters: { ...prev.filters, pageSize },
      pagination: { ...prev.pagination, page: 1 },
    }));
  };

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: {
      ...state.pagination,
      pageSize: state.filters.pageSize!,
    },
    updateFilters,
    changePage,
    changePageSize,
    refreshTasks: loadTasks,
  };
};
