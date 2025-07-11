import useCategoryFilter from './useCategoryFilter';

export default function useCategoryNames(): Record<number, string> {
  const { filters } = useCategoryFilter();

  const categoryMap: Record<number, string> = {};
  filters.categories.forEach(category => {
    categoryMap[category.id] = category.name;
  });

  return categoryMap;
}
