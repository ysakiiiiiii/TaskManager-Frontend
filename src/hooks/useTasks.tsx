// src/hooks/useTasks.ts
import { useState, useEffect, useCallback } from 'react';
import { TaskService } from '../services/taskServices';
import type { TaskFilterParams, Task, PaginatedTaskResponse } from '../interfaces/task';

export const useTasks = (initialFilters: TaskFilterParams) => {
  const [state, setState] = useState({
    tasks: [] as Task[],
    loading: false,
    error: null as string | null,
    filters: initialFilters,
    pagination: {
      page: initialFilters.page || 1,
      pageSize: initialFilters.pageSize || 10,
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
        pageSize: state.pagination.pageSize,
      });

      setState(prev => ({
        ...prev,
        tasks: response.items,
        pagination: {
          page: response.page,
          pageSize: response.pageSize,
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
  }, [state.filters, state.pagination.page, state.pagination.pageSize]);

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

  const changePage = (newPage: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        ...prev.pagination,
        page: newPage,
      },
    }));
  };

  const changePageSize = (newPageSize: number) => {
    setState(prev => ({
      ...prev,
      pagination: {
        page: 1,
        pageSize: newPageSize,
        totalCount: prev.pagination.totalCount,
        totalPages: Math.ceil(prev.pagination.totalCount / newPageSize),
      },
    }));
  };

  return {
    tasks: state.tasks,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    pagination: state.pagination,
    updateFilters,
    changePage,
    changePageSize,
    refreshTasks: loadTasks,
  };
};
