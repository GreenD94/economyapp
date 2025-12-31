'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { PredefinedTransaction, PredefinedTransactionDocument } from '../types/predefined-transaction.types';
import type { Result } from '@/features/core/types/common.types';

function mapDocumentToPredefinedTransaction(doc: PredefinedTransactionDocument): PredefinedTransaction {
  return {
    id: doc._id.toString(),
    name: doc.name,
    type: doc.type,
    amount: doc.amount,
    category: doc.category,
    description: doc.description,
    icon: doc.icon,
    color: doc.color,
    createdAt: doc.createdAt,
  };
}

export async function getPredefinedTransactionList(): Promise<Result<PredefinedTransaction[]>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<PredefinedTransactionDocument>('predefinedtransactions');

    const documents = await collection
      .find({})
      .sort({ type: 1, name: 1 })
      .toArray();

    const transactions = documents.map(mapDocumentToPredefinedTransaction);

    return { success: true, data: transactions };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function executePredefinedTransaction(
  predefinedId: string,
  amount?: number
): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(predefinedId)) {
      return { success: false, error: 'Invalid predefined transaction ID' };
    }

    const db = await connectToDatabase();
    const predefinedCollection = db.collection<PredefinedTransactionDocument>('predefinedtransactions');
    const transactionCollection = db.collection('transactions');

    const predefined = await predefinedCollection.findOne({ _id: new ObjectId(predefinedId) });

    if (!predefined) {
      return { success: false, error: 'Predefined transaction not found' };
    }

    const transactionAmount = amount !== undefined && amount > 0 ? amount : predefined.amount;

    if (transactionAmount <= 0) {
      return { success: false, error: 'Amount must be greater than 0' };
    }

    const transaction: Omit<import('../../transactions/types/transaction.types').TransactionDocument, '_id'> = {
      type: predefined.type,
      amount: transactionAmount,
      category: predefined.category,
      description: predefined.description,
      date: new Date(),
      createdAt: new Date(),
    };

    await transactionCollection.insertOne(transaction as import('../../transactions/types/transaction.types').TransactionDocument);

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
