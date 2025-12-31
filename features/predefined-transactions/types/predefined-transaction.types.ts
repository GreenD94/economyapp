import type { ObjectId } from 'mongodb';

export interface PredefinedTransaction {
  id: string;
  name: string;
  type: 'expense' | 'earning';
  amount: number;
  category: string;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
}

export interface PredefinedTransactionDocument {
  _id: ObjectId;
  name: string;
  type: 'expense' | 'earning';
  amount: number;
  category: string;
  description: string;
  icon: string;
  color: string;
  createdAt: Date;
}
