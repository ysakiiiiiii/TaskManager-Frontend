import { useEffect, useState } from 'react';
import { fetchSearchFilters } from '../services/filterServices';
import type { IdNameDto } from '../interfaces/task';

export default function useCategoryFilter() {
  const [filters, setFilters] = useState<{
    statuses: IdNameDto[];
    priorities: IdNameDto[];
    categories: IdNameDto[];
  }>({
    statuses: [],
    priorities: [],
    categories: [],
  });

  useEffect(() => {
    const loadFilters = async () => {
      try {
        const data = await fetchSearchFilters();
        setFilters(data); 
      } catch (error) {
        console.error('Error loading filters:', error);
      }
    };

    loadFilters();
  }, []);

  return { filters };
}
