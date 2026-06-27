export type Tab           = 'budget' | 'networth';
export type NetworthFilter = 'all' | 'real' | 'projected' | 'meta';

export const NETWORTH_FILTER_LABELS: Record<NetworthFilter, string> = {
  all: 'Todos', real: 'Real', projected: 'Proyectado', meta: 'Meta',
};

export function fmtMonth(ym: string) {
  const [y, m] = ym.split('-');
  return new Date(parseInt(y), parseInt(m) - 1, 1).toLocaleString('es', { month: 'long', year: 'numeric' });
}

export function firstOfMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`;
}

export function nowISO() { return new Date().toISOString(); }

export function fmtAmt(n: number) {
  return n.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}
