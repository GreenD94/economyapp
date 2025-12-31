'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import type { UserSettings, UserSettingsDocument } from '../types/settings.types';
import type { Result } from '@/features/core/types/common.types';

const SETTINGS_ID = new ObjectId('000000000000000000000001');

function mapDocumentToSettings(doc: UserSettingsDocument): UserSettings {
  return {
    id: doc._id.toString(),
    name: doc.name,
    age: doc.age,
    currency: doc.currency,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export async function getUserSettings(): Promise<Result<UserSettings>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<UserSettingsDocument>('usersettings');

    const document = await collection.findOne({ _id: SETTINGS_ID });

    if (!document) {
      return {
        success: true,
        data: {
          id: SETTINGS_ID.toString(),
          name: '',
          age: 0,
          currency: 'USD',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      };
    }

    return { success: true, data: mapDocumentToSettings(document) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateUserSettings(
  data: Partial<Omit<UserSettings, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Result<UserSettings>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<UserSettingsDocument>('usersettings');

    const now = new Date();
    const existing = await collection.findOne({ _id: SETTINGS_ID });

    if (existing) {
      const updateData: Partial<Omit<UserSettingsDocument, '_id'>> = {
        name: data.name,
        age: data.age,
        currency: data.currency,
        updatedAt: now,
      };

      const result = await collection.findOneAndUpdate(
        { _id: SETTINGS_ID },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!result) {
        return { success: false, error: 'Failed to update settings' };
      }

      return { success: true, data: mapDocumentToSettings(result) };
    } else {
      const document: UserSettingsDocument = {
        _id: SETTINGS_ID,
        name: data.name || '',
        age: data.age || 0,
        currency: data.currency || 'USD',
        createdAt: now,
        updatedAt: now,
      };

      const result = await collection.insertOne(document as UserSettingsDocument);
      const inserted = await collection.findOne({ _id: result.insertedId });

      if (!inserted) {
        return { success: false, error: 'Failed to create settings' };
      }

      return { success: true, data: mapDocumentToSettings(inserted) };
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
