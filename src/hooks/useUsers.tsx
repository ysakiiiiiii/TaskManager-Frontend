import { useEffect, useState } from "react";
import type { PaginatedUserResponse, User } from "../interfaces/user";
import { getUsers } from "../services/userService";

const useUsers = (isActive: string, page: number, pageSize: number) => {
  const [data, setData] = useState<PaginatedUserResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const activeFilter = isActive === "" ? null : isActive === "Active";
  setLoading(true);
  getUsers(activeFilter, page, pageSize)
    .then((res) => setData(res))
    .finally(() => setLoading(false));
}, [isActive, page, pageSize]);


  return { data, loading };
};

export default useUsers;