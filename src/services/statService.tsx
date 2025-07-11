import api from "../api/api";
// services/userService.ts
export const getUserStats = () => {
  return api.get('/user/UserStats', { withCredentials: true });
};

