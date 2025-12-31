import { format, startOfMonth, endOfMonth, isWithinInterval } from 'date-fns';

export function formatDate(date: Date): string {
  return format(date, 'MMM dd, yyyy');
}

export function formatDateShort(date: Date): string {
  return format(date, 'MMM dd');
}

export function formatDateLong(date: Date): string {
  return format(date, 'MMMM dd, yyyy');
}

export function getMonthStart(date: Date = new Date()): Date {
  return startOfMonth(date);
}

export function getMonthEnd(date: Date = new Date()): Date {
  return endOfMonth(date);
}

export function isDateInCurrentMonth(date: Date): boolean {
  const now = new Date();
  const monthStart = getMonthStart(now);
  const monthEnd = getMonthEnd(now);
  return isWithinInterval(date, { start: monthStart, end: monthEnd });
}

export function getDaysInMonth(date: Date = new Date()): number {
  const monthEnd = getMonthEnd(date);
  return monthEnd.getDate();
}
