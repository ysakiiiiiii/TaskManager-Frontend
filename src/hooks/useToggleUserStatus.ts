import { useCallback } from "react";
import { toggleUserStatus } from "../services/userService";
import useToast from "./useToast";

const useToggleUserStatus = () => {
  const { showToast } = useToast();

  const handleToggleStatus = useCallback(
    async (userId: string, isCurrentlyActive: boolean, onSuccess?: () => void) => {
      const confirmed = !isCurrentlyActive || window.confirm("Are you sure you want to deactivate this account?");
      if (!confirmed) return;

      try {
        const response = await toggleUserStatus(userId);
        if (response.success) {
          showToast(response.message || "User status updated.", "success");
          onSuccess?.(); // Refresh local list or trigger fetch
        } else {
          showToast(response.message || "Failed to toggle user status.", "error");
        }
      } catch (error) {
        showToast("An error occurred while updating user status.", "error");
        console.error("ToggleUserStatus Error:", error);
      }
    },
    [showToast]
  );

  return { handleToggleStatus };
};

export default useToggleUserStatus;
