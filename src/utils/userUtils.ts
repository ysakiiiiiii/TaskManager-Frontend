// utils.ts
export const statusLabels: Record<number, string> = {
  1: "To Do",
  2: "In Progress",
  3: "On Hold",
  4: "Done"
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case "To Do": return "#fcb329";
    case "In Progress": return "#dc3545";
    case "On Hold": return "#6610f2";
    case "Done": return "#20b478";
    default: return "#4caf50";
  }
};

export const getAvatarUrl = (name: string) => {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`;
};