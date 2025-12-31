import type { ObjectId } from 'mongodb';

export interface AlertThresholds {
  warning: number;
  danger: number;
  critical: number;
}

export interface SpendingLimit {
  id: string;
  monthlyLimit: number;
  alertThresholds: AlertThresholds;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface SpendingLimitDocument {
  _id: ObjectId;
  monthlyLimit: number;
  alertThresholds: AlertThresholds;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
