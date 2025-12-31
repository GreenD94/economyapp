import { connectToDatabase } from '../../../features/core/utils/database.client';
import type { TransactionDocument } from '../../../features/transactions/types/transaction.types';

interface PredefinedTransactionData {
  name: string;
  type: 'expense' | 'earning';
  amount: number;
  category: string;
  description: string;
  icon: string;
  color: string;
}

const PREDEFINED_TRANSACTIONS: PredefinedTransactionData[] = [
  {
    name: 'Monthly Salary',
    type: 'earning',
    amount: 0,
    category: 'Other',
    description: 'Monthly salary income',
    icon: 'dollar-sign',
    color: '#10b981',
  },
  {
    name: 'Rent',
    type: 'expense',
    amount: 0,
    category: 'Bills',
    description: 'Monthly rent payment',
    icon: 'home',
    color: '#f59e0b',
  },
  {
    name: 'Electricity',
    type: 'expense',
    amount: 0,
    category: 'Bills',
    description: 'Electricity bill',
    icon: 'zap',
    color: '#f59e0b',
  },
  {
    name: 'Water',
    type: 'expense',
    amount: 0,
    category: 'Bills',
    description: 'Water bill',
    icon: 'droplet',
    color: '#f59e0b',
  },
  {
    name: 'Internet',
    type: 'expense',
    amount: 0,
    category: 'Bills',
    description: 'Internet service bill',
    icon: 'wifi',
    color: '#f59e0b',
  },
  {
    name: 'Phone',
    type: 'expense',
    amount: 0,
    category: 'Bills',
    description: 'Phone service bill',
    icon: 'phone',
    color: '#f59e0b',
  },
  {
    name: 'Groceries',
    type: 'expense',
    amount: 0,
    category: 'Food',
    description: 'Grocery shopping',
    icon: 'shopping-cart',
    color: '#ef4444',
  },
  {
    name: 'Gas',
    type: 'expense',
    amount: 0,
    category: 'Transport',
    description: 'Gas for vehicle',
    icon: 'fuel',
    color: '#3b82f6',
  },
];

export async function seedPredefinedTransactions(): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection('predefinedtransactions');

  for (const transaction of PREDEFINED_TRANSACTIONS) {
    const exists = await collection.findOne({ name: transaction.name });
    if (!exists) {
      await collection.insertOne({
        name: transaction.name,
        type: transaction.type,
        amount: transaction.amount,
        category: transaction.category,
        description: transaction.description,
        icon: transaction.icon,
        color: transaction.color,
        createdAt: new Date(),
      });
      console.log(`  ✓ Seeded predefined transaction: ${transaction.name}`);
    } else {
      console.log(`  ⊙ Predefined transaction already exists: ${transaction.name}`);
    }
  }
}
