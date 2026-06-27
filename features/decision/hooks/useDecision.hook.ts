'use client';
import { useState } from 'react';

export type DecisionInputs = {
  price: number;
  health: number;
  productivity: number;
  comfort: number;
  days: number;
};

export type DecisionResult = {
  score: number;
  verdict: string;
  verdictColor: 'green' | 'yellow' | 'red';
};

function computeResult(inputs: DecisionInputs): DecisionResult {
  const { price, health, productivity, comfort, days } = inputs;

  const priceBonus = price <= 20 ? 3 : price <= 100 ? 1 : 0;
  const daysBonus = days >= 7 ? 2 : days >= 3 ? 1 : 0;
  const rawScore = ((health + productivity + comfort) / 3) * 1.5 + priceBonus + daysBonus;
  const score = Math.min(10, Math.round(rawScore * 10) / 10);

  if (price <= 20) return { score, verdict: 'COMPRA YA',        verdictColor: 'green' };
  if (score >= 7.5)  return { score, verdict: 'COMPRA YA',        verdictColor: 'green' };
  if (score >= 5)    return { score, verdict: 'ESPERA 72 HORAS',  verdictColor: 'yellow' };
  if (days >= 7)     return { score, verdict: 'ESPERA 72 HORAS',  verdictColor: 'yellow' };
  return { score, verdict: 'NO COMPRES', verdictColor: 'red' };
}

const DEFAULTS: DecisionInputs = { price: 0, health: 3, productivity: 3, comfort: 3, days: 1 };

export function useDecision() {
  const [inputs, setInputs] = useState<DecisionInputs>(DEFAULTS);
  const result = computeResult(inputs);

  function update<K extends keyof DecisionInputs>(key: K, value: DecisionInputs[K]) {
    setInputs((prev) => ({ ...prev, [key]: value }));
  }

  function reset() { setInputs(DEFAULTS); }

  return { inputs, result, update, reset };
}
