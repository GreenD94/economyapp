export interface PaymentSlot { date: Date; label: string; }

interface HasFrequency { frequency: string; due_day: number; }

export function getExpectedSlots(src: HasFrequency, month: string): PaymentSlot[] {
  const [year, mon] = month.split('-').map(Number);
  const lastDay = new Date(year, mon, 0).getDate();

  if (src.frequency === 'monthly') {
    const d = Math.min(src.due_day, lastDay);
    return [{ date: new Date(year, mon - 1, d), label: 'Pago mensual' }];
  }
  if (src.frequency === 'biweekly') {
    const slots: PaymentSlot[] = [{ date: new Date(year, mon - 1, 1), label: 'Pago 1' }];
    if (15 <= lastDay) slots.push({ date: new Date(year, mon - 1, 15), label: 'Pago 2' });
    return slots;
  }
  // weekly — day 1, 8, 15, 22, 29
  const slots: PaymentSlot[] = [];
  for (let d = 1, i = 1; d <= lastDay; d += 7, i++) {
    slots.push({ date: new Date(year, mon - 1, d), label: `Semana ${i}` });
  }
  return slots;
}

export function formatCountdown(date: Date): string {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(date);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / 86400000);
  if (diff < 0) return `Hace ${Math.abs(diff)} día${Math.abs(diff) !== 1 ? 's' : ''}`;
  if (diff === 0) return 'Hoy';
  if (diff === 1) return 'Mañana';
  if (diff < 7) return `En ${diff} días`;
  const w = Math.floor(diff / 7);
  const d = diff % 7;
  if (d === 0) return `En ${w} semana${w > 1 ? 's' : ''}`;
  return `En ${w} sem. y ${d} día${d > 1 ? 's' : ''}`;
}
