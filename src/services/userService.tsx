import api from "../api/api";
import type {ApiResponse } from "../interfaces/user";

export async function getUsers(
  isActive: boolean | null,
  page: number,
  pageSize: number,
  search: string
) {
  const response = await api.get("/User/AllUsers", {
    params: {
      isActive,
      page,
      pageSize,
      search: search || undefined,
    },
  });

  return response.data.data;
}



export const toggleUserStatus = async (userId: string): Promise<ApiResponse> => {
  const response = await api.patch(`/User/ToggleStatus/${userId}`);
  return response.data;
};