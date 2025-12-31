'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { RecurringTransaction, RecurringTransactionDocument } from '../types/recurring-transaction.types';
import type { Result } from '@/features/core/types/common.types';
import type { TransactionDocument } from '../../transactions/types/transaction.types';
import { addDays, addWeeks, addMonths, isBefore, isAfter } from 'date-fns';

function mapDocumentToRecurring(doc: RecurringTransactionDocument): RecurringTransaction {
  return {
    id: doc._id.toString(),
    type: doc.type,
    amount: doc.amount,
    category: doc.category,
    description: doc.description,
    frequency: doc.frequency,
    startDate: doc.startDate,
    endDate: doc.endDate,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

function getNextDate(currentDate: Date, frequency: 'daily' | 'weekly' | 'monthly'): Date {
  switch (frequency) {
    case 'daily':
      return addDays(currentDate, 1);
    case 'weekly':
      return addWeeks(currentDate, 1);
    case 'monthly':
      return addMonths(currentDate, 1);
  }
}

export async function createRecurringTransaction(
  data: Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Result<RecurringTransaction>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<RecurringTransactionDocument>('recurringtransactions');

    const now = new Date();
    const document: RecurringTransactionDocument = {
      _id: new ObjectId(),
      type: data.type,
      amount: data.amount,
      category: data.category,
      description: data.description,
      frequency: data.frequency,
      startDate: data.startDate,
      endDate: data.endDate,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create recurring transaction' };
    }

    return { success: true, data: mapDocumentToRecurring(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getRecurringTransactionList(): Promise<Result<RecurringTransaction[]>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<RecurringTransactionDocument>('recurringtransactions');

    const documents = await collection.find({}).sort({ createdAt: -1 }).toArray();

    const transactions = documents.map(mapDocumentToRecurring);

    return { success: true, data: transactions };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateRecurringTransaction(
  id: string,
  data: Partial<Omit<RecurringTransaction, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Result<RecurringTransaction>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid recurring transaction ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<RecurringTransactionDocument>('recurringtransactions');

    const updateData: Partial<Omit<RecurringTransactionDocument, '_id'>> = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: 'Recurring transaction not found' };
    }

    return { success: true, data: mapDocumentToRecurring(result) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteRecurringTransaction(id: string): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid recurring transaction ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<RecurringTransactionDocument>('recurringtransactions');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Recurring transaction not found' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function processRecurringTransactions(): Promise<Result<number>> {
  try {
    const db = await connectToDatabase();
    const recurringCollection = db.collection<RecurringTransactionDocument>('recurringtransactions');
    const transactionCollection = db.collection<TransactionDocument>('transactions');

    const now = new Date();
    const recurringTransactions = await recurringCollection
      .find({ isActive: true })
      .toArray();

    let processedCount = 0;

    for (const recurring of recurringTransactions) {
      if (recurring.endDate && isAfter(now, recurring.endDate)) {
        continue;
      }

      if (isAfter(now, recurring.startDate)) {
        const lastProcessed = await transactionCollection
          .findOne(
            {
              type: recurring.type,
              category: recurring.category,
              description: recurring.description,
              amount: recurring.amount,
            },
            { sort: { date: -1 } }
          );

        let nextDate = recurring.startDate;
        if (lastProcessed) {
          const lastDate = new Date(lastProcessed.date);
          nextDate = getNextDate(lastDate, recurring.frequency);
        }

        if (isBefore(nextDate, now) || nextDate.getTime() === now.getTime()) {
          const transaction: Omit<TransactionDocument, '_id'> = {
            type: recurring.type,
            amount: recurring.amount,
            category: recurring.category,
            description: recurring.description,
            date: nextDate,
            createdAt: new Date(),
          };

          await transactionCollection.insertOne(transaction as TransactionDocument);
          processedCount++;
        }
      }
    }

    return { success: true, data: processedCount };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
