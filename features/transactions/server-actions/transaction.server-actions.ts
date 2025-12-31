'use server';

import { ObjectId, type Filter } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { Transaction, TransactionFilters, TransactionDocument } from '../types/transaction.types';
import type { Result } from '@/features/core/types/common.types';

function mapDocumentToTransaction(doc: TransactionDocument): Transaction {
  return {
    id: doc._id.toString(),
    type: doc.type,
    amount: doc.amount,
    category: doc.category,
    description: doc.description,
    date: doc.date,
    createdAt: doc.createdAt,
  };
}

export async function createTransaction(
  data: Omit<Transaction, 'id' | 'createdAt'>
): Promise<Result<Transaction>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<TransactionDocument>('transactions');

    const document: Omit<TransactionDocument, '_id'> = {
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      date: data.date,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(document as TransactionDocument);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create transaction' };
    }

    return { success: true, data: mapDocumentToTransaction(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getTransaction(id: string): Promise<Result<Transaction>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid transaction ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<TransactionDocument>('transactions');

    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
      return { success: false, error: 'Transaction not found' };
    }

    return { success: true, data: mapDocumentToTransaction(document) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getTransactionList(
  filters?: TransactionFilters
): Promise<Result<Transaction[]>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<TransactionDocument>('transactions');

    const query: Filter<TransactionDocument> = {};

    if (filters?.type) {
      query.type = filters.type;
    }

    if (filters?.category) {
      query.category = filters.category;
    }

    if (filters?.startDate || filters?.endDate) {
      query.date = {};
      if (filters.startDate) {
        query.date.$gte = filters.startDate;
      }
      if (filters.endDate) {
        query.date.$lte = filters.endDate;
      }
    }

    const documents = await collection
      .find(query)
      .sort({ date: -1, createdAt: -1 })
      .toArray();

    const transactions = documents.map(mapDocumentToTransaction);

    return { success: true, data: transactions };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateTransaction(
  id: string,
  data: Partial<Omit<Transaction, 'id' | 'createdAt'>>
): Promise<Result<Transaction>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid transaction ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<TransactionDocument>('transactions');

    const updateData: Partial<Omit<TransactionDocument, '_id'>> = {};
    if (data.type !== undefined) updateData.type = data.type;
    if (data.amount !== undefined) updateData.amount = data.amount;
    if (data.category !== undefined) updateData.category = data.category;
    if (data.description !== undefined) updateData.description = data.description;
    if (data.date !== undefined) updateData.date = data.date;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: 'Transaction not found' };
    }

    return { success: true, data: mapDocumentToTransaction(result) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteTransaction(id: string): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid transaction ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<TransactionDocument>('transactions');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Transaction not found' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
