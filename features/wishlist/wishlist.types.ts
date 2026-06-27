export type ColorFilter = 'all' | 'green' | 'yellow' | 'red' | 'grey';
export type FormState   = { item: string; price: string; priority: string; notes: string };

export const EMPTY_FORM: FormState = { item: '', price: '', priority: 'Media', notes: '' };

export const CARD_CLASS: Record<string, string> = {
  green: 'cardGreen', yellow: 'cardYellow', red: 'cardRed', grey: 'cardGrey',
};
export const TAB_CLASS: Record<string, string> = {
  all: 'tabAll', green: 'tabGreen', yellow: 'tabYellow', red: 'tabRed', grey: 'tabGrey',
};

export function verdictToColor(verdict: string): 'green' | 'yellow' | 'red' | 'grey' {
  if (verdict === 'COMPRAR SIN CULPA' || verdict === 'COMPRAR YA') return 'green';
  if (verdict === 'ESPERA 72 HORAS'   || verdict === 'ESPERA 7 DIAS') return 'yellow';
  if (verdict === 'DESCARTADO') return 'red';
  return 'grey';
}
