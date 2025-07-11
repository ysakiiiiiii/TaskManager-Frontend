export function aggregateCountsByKey<T extends { count: number }>(
  users: { [key: string]: T[] | null },
  key: keyof T
): Record<string, number> {
  const totals: Record<string, number> = {};

  for (const userId in users) {
    const list = users[userId] ?? [];
    for (const item of list) {
      const id = item[key];
      if (id !== undefined && id !== null) {
        const keyStr = String(id);
        totals[keyStr] = (totals[keyStr] || 0) + item.count;
      }
    }
  }

  return totals;
}
