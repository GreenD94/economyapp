export const CAT_COLORS: Record<string, string> = {
  Alimentacion: '#ef5350', Higiene: '#ab47bc', Salud: '#42a5f5',
  Casa: '#26a69a', Gym: '#66bb6a', Claude: '#ff7043',
  Ocio: '#ffa726', Imprevistos: '#8d6e63', Caprichos: '#ec407a', Tecnologia: '#78909c',
};

export type PieSlice = { cat: string; amount: number; color: string; pct: number };

export function fmt(n: number) {
  return `$${n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}

export function nowString() {
  const now  = new Date();
  const date = now.toLocaleString('es', { day: 'numeric', month: 'short', year: 'numeric' });
  const time = now.toLocaleTimeString('en', { hour: 'numeric', minute: '2-digit', hour12: true });
  return `${date}  ${time}`;
}
