import type { SpendingLimit } from '../../limits/types/limit.types';

export const emptySpendingLimit: SpendingLimit = {
  id: '',
  monthlyLimit: 0,
  alertThresholds: {
    warning: 80,
    danger: 90,
    critical: 100,
  },
  isActive: false,
  createdAt: new Date(),
  updatedAt: new Date(),
};
