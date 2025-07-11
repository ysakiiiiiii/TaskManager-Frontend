// hooks/useStatCounts.ts
import { useEffect, useState } from 'react';
import { getUserStats } from '../services/statService';
import type { User } from '../interfaces/user';

const useStatCounts = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getUserStats();
        setUsers(res.data.data || []);
      } catch (err) {
        console.error('Failed to fetch user stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return { users, loading };
};

export default useStatCounts;
