import { useEffect, useState } from "react";
import { fetchSearchFilters } from "../services/filterServices";

export default function useSearchFilters() {
  const [filters, setFilters] = useState<{
    statuses: string[];
    priorities: string[];
    categories: string[];
  }>({
    statuses: [],
    priorities: [],
    categories: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchFilters()
      .then((data) => {
        setFilters({
          statuses: data.statuses.map((s) => s.name),
          priorities: data.priorities.map((p) => p.name),
          categories: data.categories.map((c) => c.name),
        });
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load filters");
      })
      .finally(() => setLoading(false));
  }, []);

  return { filters, loading, error };
}
