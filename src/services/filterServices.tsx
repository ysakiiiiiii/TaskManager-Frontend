import api from "../api/api";
import type { SearchFiltersDto } from "../interfaces/task";

export const fetchSearchFilters = async (): Promise<SearchFiltersDto> => {
  const response = await api.get("/category/filters");
  return response.data.data;
};
