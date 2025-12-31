import type { ObjectId } from 'mongodb';

export interface SavingsGoal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SavingsGoalDocument {
  _id: ObjectId;
  name: string;
  targetAmount: number;
  currentAmount: number;
  targetDate: Date;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
  updatedAt: Date;
}
