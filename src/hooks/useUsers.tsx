import { useEffect, useState, useCallback } from "react";
import { getUsers } from "../services/userService";
import type { PaginatedUserResponse } from "../interfaces/user";

const useUsers = (isActive: string, page: number, pageSize: number, search: string) => {
  const [data, setData] = useState<PaginatedUserResponse | null>(null);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const statusFilter =
        isActive === "Active" ? true : isActive === "Inactive" ? false : null;

      const response = await getUsers(statusFilter, page, pageSize, search);
      setData(response);
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  }, [isActive, page, pageSize, search]); 

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, refetch: fetchData };
};


export default useUsers;
