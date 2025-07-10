import api from "../api/api";
import type { PaginatedUserResponse } from "../interfaces/user";

export const getUsers = async (
  isActive: boolean | null,
  page: number,
  pageSize: number
): Promise<PaginatedUserResponse> => {
  const params: any = {
    page,
    pageSize: pageSize === 0 ? 10000 : pageSize, 
  };
  if (isActive !== null) params.isActive = isActive;

  const response = await api.get("/User/AllUsers", { params });
  return response.data.data; 
};

