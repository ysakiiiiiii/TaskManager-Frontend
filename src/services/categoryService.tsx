import api from "../api/api";
import type { AddCategoryRequestDto, UpdateCategoryRequestDto } from "../interfaces/category";

export async function getCategories() {
  const res = await api.get("/Category");
  return res.data;
}

export async function createCategory(data: AddCategoryRequestDto) {
  const res = await api.post("/Category", data);
  return res.data;
}

export async function updateCategory(id: number, data: UpdateCategoryRequestDto) {
  const res = await api.put(`/Category/${id}`, data);
  return res.data;
}

export async function deleteCategory(id: number) {
  const res = await api.delete(`/Category/${id}`);
  return res.data;
}

export const reassignAndDeleteCategory = async (oldCategoryId: number, newCategoryId: number) => {
  return await api.post(`/Category/${oldCategoryId}/reassign-and-delete`, { newCategoryId });

}
