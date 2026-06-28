'use client';
import { useEffect, useState } from 'react';
import { apiGet } from '../../core/utils/api.client';

export interface IncomeInsight {
  confirmed_sources: number;
  total_sources: number;
  confirmed_amount: string;
  expected_amount: string;
}

export function useIncomeInsight(month: string) {
  const [data, setData]       = useState<IncomeInsight | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    apiGet<IncomeInsight>(`/api/v1/analytics/incomes/insight?month=${month}`)
      .then(d  => { if (!cancelled) { setData(d);         setLoading(false); } })
      .catch(e => { if (!cancelled) { setError(e.message); setLoading(false); } });
    return () => { cancelled = true; };
  }, [month]);

  return { data, loading, error };
}
