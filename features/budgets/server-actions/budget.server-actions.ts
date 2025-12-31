'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { CategoryBudget, CategoryBudgetDocument } from '../types/budget.types';
import type { Result } from '@/features/core/types/common.types';
import { getMonthStart, getMonthEnd } from '@/features/core/utils';
import type { TransactionDocument } from '../../transactions/types/transaction.types';

function mapDocumentToBudget(doc: CategoryBudgetDocument): CategoryBudget {
  return {
    id: doc._id.toString(),
    categoryId: doc.categoryId,
    monthlyBudget: doc.monthlyBudget,
    currentSpending: doc.currentSpending,
    period: doc.period,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

async function calculateCurrentSpending(categoryId: string): Promise<number> {
  const db = await connectToDatabase();
  const transactionCollection = db.collection<TransactionDocument>('transactions');
  
  const monthStart = getMonthStart();
  const monthEnd = getMonthEnd();

  const expenses = await transactionCollection
    .find({
      type: 'expense',
      category: categoryId,
      date: {
        $gte: monthStart,
        $lte: monthEnd,
      },
    })
    .toArray();

  return expenses.reduce((sum, t) => sum + t.amount, 0);
}

export async function createCategoryBudget(
  data: Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>
): Promise<Result<CategoryBudget>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const existing = await collection.findOne({ categoryId: data.categoryId, period: data.period });
    if (existing) {
      return { success: false, error: 'Budget for this category and period already exists' };
    }

    const currentSpending = await calculateCurrentSpending(data.categoryId);
    const now = new Date();

    const document: CategoryBudgetDocument = {
      _id: new ObjectId(),
      categoryId: data.categoryId,
      monthlyBudget: data.monthlyBudget,
      currentSpending,
      period: data.period,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create category budget' };
    }

    return { success: true, data: mapDocumentToBudget(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCategoryBudget(id: string): Promise<Result<CategoryBudget>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid budget ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
      return { success: false, error: 'Category budget not found' };
    }

    const currentSpending = await calculateCurrentSpending(document.categoryId);
    const updated = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { currentSpending, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return { success: false, error: 'Failed to update budget' };
    }

    return { success: true, data: mapDocumentToBudget(updated) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCategoryBudgetList(): Promise<Result<CategoryBudget[]>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const documents = await collection.find({ period: 'month' }).sort({ createdAt: -1 }).toArray();

    const budgets = await Promise.all(
      documents.map(async (doc) => {
        const currentSpending = await calculateCurrentSpending(doc.categoryId);
        const updated = await collection.findOneAndUpdate(
          { _id: doc._id },
          { $set: { currentSpending, updatedAt: new Date() } },
          { returnDocument: 'after' }
        );
        return updated ? mapDocumentToBudget(updated) : mapDocumentToBudget(doc);
      })
    );

    return { success: true, data: budgets };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCategoryBudgetByCategory(categoryId: string): Promise<Result<CategoryBudget>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const document = await collection.findOne({ categoryId, period: 'month' });

    if (!document) {
      return {
        success: true,
        data: {
          id: '',
          categoryId,
          monthlyBudget: 0,
          currentSpending: 0,
          period: 'month',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }

    const currentSpending = await calculateCurrentSpending(categoryId);
    const updated = await collection.findOneAndUpdate(
      { _id: document._id },
      { $set: { currentSpending, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );

    if (!updated) {
      return { success: true, data: mapDocumentToBudget(document) };
    }

    return { success: true, data: mapDocumentToBudget(updated) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateCategoryBudget(
  id: string,
  data: Partial<Omit<CategoryBudget, 'id' | 'currentSpending' | 'createdAt' | 'updatedAt'>>
): Promise<Result<CategoryBudget>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid budget ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return { success: false, error: 'Category budget not found' };
    }

    const currentSpending = await calculateCurrentSpending(existing.categoryId);
    const updateData: Partial<Omit<CategoryBudgetDocument, '_id'>> = {
      monthlyBudget: data.monthlyBudget,
      period: data.period,
      currentSpending,
      updatedAt: new Date(),
    };

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: 'Failed to update category budget' };
    }

    return { success: true, data: mapDocumentToBudget(result) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteCategoryBudget(id: string): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid budget ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryBudgetDocument>('categorybudgets');

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Category budget not found' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
