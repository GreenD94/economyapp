'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../core/utils/api.client';

export interface CategoryDelta {
  category: string;
  current: string;
  previous: string;
  delta_pct: number | null;
}

export interface ExpenseComparison {
  deltas: CategoryDelta[];
}

export function useExpenseComparison(month: string) {
  const [data, setData]       = useState<ExpenseComparison | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<ExpenseComparison>(`/api/v1/analytics/expenses/comparison?month=${month}`)
      .then(d  => { if (!cancelled) { setData(d);         setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [month]);

  return { data, loading, error };
}
