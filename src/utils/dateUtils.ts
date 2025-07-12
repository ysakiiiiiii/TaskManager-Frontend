export function isFutureDate(dateStr: string): boolean {
  const inputDate = new Date(dateStr);
  const now = new Date();
  return inputDate > now;
}
