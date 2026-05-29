import { format, differenceInDays, isAfter } from 'date-fns';

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy');
}
export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'dd MMM yyyy HH:mm');
}
export function daysBetween(start: string | Date, end: string | Date): number {
  return differenceInDays(new Date(end), new Date(start));
}
export function isOverdue(endDate: string | Date): boolean {
  return isAfter(new Date(), new Date(endDate));
}
export function getDaysOverdue(endDate: string | Date): number {
  if (!isOverdue(endDate)) return 0;
  return differenceInDays(new Date(), new Date(endDate));
}