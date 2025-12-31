'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { SpendingLimit, SpendingLimitDocument } from '../types/limit.types';
import type { Result } from '@/features/core/types/common.types';

const LIMIT_ID = new ObjectId('000000000000000000000002');

function mapDocumentToLimit(doc: SpendingLimitDocument): SpendingLimit {
  return {
    id: doc._id.toString(),
    monthlyLimit: doc.monthlyLimit,
    alertThresholds: doc.alertThresholds,
    isActive: doc.isActive,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function createSpendingLimit(
  data: Omit<SpendingLimit, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Result<SpendingLimit>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SpendingLimitDocument>('spendinglimits');

    const existing = await collection.findOne({ _id: LIMIT_ID });
    if (existing) {
      return { success: false, error: 'Spending limit already exists. Use update instead.' };
    }

    const now = new Date();
    const document: SpendingLimitDocument = {
      _id: LIMIT_ID,
      monthlyLimit: data.monthlyLimit,
      alertThresholds: data.alertThresholds,
      isActive: data.isActive,
      createdAt: now,
      updatedAt: now,
    };

    const result = await collection.insertOne(document);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create spending limit' };
    }

    return { success: true, data: mapDocumentToLimit(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getSpendingLimit(): Promise<Result<SpendingLimit>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SpendingLimitDocument>('spendinglimits');

    const document = await collection.findOne({ _id: LIMIT_ID });

    if (!document) {
      return {
        success: true,
        data: {
          id: LIMIT_ID.toString(),
          monthlyLimit: 0,
          alertThresholds: {
            warning: 80,
            danger: 90,
            critical: 100,
          },
          isActive: false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }

    return { success: true, data: mapDocumentToLimit(document) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateSpendingLimit(
  data: Partial<Omit<SpendingLimit, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Result<SpendingLimit>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SpendingLimitDocument>('spendinglimits');

    const now = new Date();
    const existing = await collection.findOne({ _id: LIMIT_ID });

    if (existing) {
      const updateData: Partial<Omit<SpendingLimitDocument, '_id'>> = {
        monthlyLimit: data.monthlyLimit,
        alertThresholds: data.alertThresholds,
        isActive: data.isActive,
        updatedAt: now,
      };

      const result = await collection.findOneAndUpdate(
        { _id: LIMIT_ID },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return { success: false, error: 'Failed to update spending limit' };
      }

      return { success: true, data: mapDocumentToLimit(result) };
    } else {
      const document: SpendingLimitDocument = {
        _id: LIMIT_ID,
        monthlyLimit: data.monthlyLimit || 0,
        alertThresholds: data.alertThresholds || {
          warning: 80,
          danger: 90,
          critical: 100,
        },
        isActive: data.isActive !== undefined ? data.isActive : false,
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(document);
      const inserted = await collection.findOne({ _id: result.insertedId });

      if (!inserted) {
        return { success: false, error: 'Failed to create spending limit' };
      }

      return { success: true, data: mapDocumentToLimit(inserted) };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteSpendingLimit(): Promise<Result<void>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<SpendingLimitDocument>('spendinglimits');

    const result = await collection.deleteOne({ _id: LIMIT_ID });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Spending limit not found' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
