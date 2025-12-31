export interface HealthScore {
  score: number;
  factors: {
    spendingRatio: number;
    savingsRate: number;
    budgetAdherence: number;
    trend: number;
  };
}

export const emptyHealthScore: HealthScore = {
  score: 0,
  factors: {
    spendingRatio: 0,
    savingsRate: 0,
    budgetAdherence: 0,
    trend: 0,
  },
};
