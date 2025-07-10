import { useEffect, useState } from "react";
import type { SearchFiltersDto } from "../interfaces/task";
import { fetchSearchFilters } from "../services/filterServices";

export default function useSearchFilters() {
  const [filters, setFilters] = useState<SearchFiltersDto>({
    statuses: [],
    priorities: [],
    categories: [],
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchSearchFilters()
      .then(setFilters)
      .catch((err) => {
        console.error(err);
        setError("Failed to load filters");
      })
      .finally(() => setLoading(false));
  }, []);

  return { filters, loading, error };
}
