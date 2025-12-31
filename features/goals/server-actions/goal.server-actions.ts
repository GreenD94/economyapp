'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { SavingsGoal, SavingsGoalDocument } from '../types/goal.types';
import type { Result } from '@/features/core/types/common.types';

function mapDocumentToGoal(doc: SavingsGoalDocument): SavingsGoal {
  return {
    id: doc._id.toString(),
    name: doc.name,
    targetAmount: doc.targetAmount,
    currentAmount: doc.currentAmount,
    targetDate: doc.targetDate,
    description: doc.description,
    icon: doc.icon,
    color: doc.color,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createSavingsGoal(
  data: Omit<SavingsGoal, 'id' | 'currentAmount' | 'createdAt' | 'updatedAt'>
): Promise<Result<SavingsGoal>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SavingsGoalDocument>('savingsgoals');

    const now = new Date();
    const document: SavingsGoalDocument = {
      _id: new ObjectId(),
      name: data.name,
      targetAmount: data.targetAmount,
      currentAmount: 0,
      targetDate: data.targetDate,
      description: data.description,
      icon: data.icon,
      color: data.color,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create savings goal' };
    }

    return { success: true, data: mapDocumentToGoal(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getSavingsGoalList(): Promise<Result<SavingsGoal[]>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SavingsGoalDocument>('savingsgoals');

    const documents = await collection.find({}).sort({ createdAt: -1 }).toArray();

    const goals = documents.map(mapDocumentToGoal);

    return { success: true, data: goals };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateSavingsGoal(
  id: string,
  data: Partial<Omit<SavingsGoal, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Result<SavingsGoal>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid goal ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<SavingsGoalDocument>('savingsgoals');

    const updateData: Partial<Omit<SavingsGoalDocument, '_id'>> = {
      ...data,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: 'Savings goal not found' };
    }

    return { success: true, data: mapDocumentToGoal(result) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteSavingsGoal(id: string): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid goal ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<SavingsGoalDocument>('savingsgoals');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Savings goal not found' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
