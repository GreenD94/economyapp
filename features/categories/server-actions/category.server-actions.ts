'use server';

import { ObjectId } from 'mongodb';
import { connectToDatabase } from '@/features/core/utils/database.client';
import { PREDEFINED_CATEGORIES } from '@/features/core/constants/category.constants';
import type { Category, CategoryDocument } from '../types/category.types';
import type { Result } from '@/features/core/types/common.types';

function mapDocumentToCategory(doc: CategoryDocument): Category {
  return {
    id: doc._id.toString(),
    name: doc.name,
    icon: doc.icon,
    color: doc.color,
    isPredefined: doc.isPredefined,
    createdAt: doc.createdAt,
  };
}

async function initializePredefinedCategories(): Promise<void> {
  const db = await connectToDatabase();
  const collection = db.collection<CategoryDocument>('categories');

  for (const category of PREDEFINED_CATEGORIES) {
    const exists = await collection.findOne({ name: category.name, isPredefined: true });
    if (!exists) {
      const document: Omit<CategoryDocument, '_id'> = {
        name: category.name,
        icon: category.icon,
        color: category.color,
        isPredefined: category.isPredefined,
        createdAt: new Date(),
      };
      await collection.insertOne(document as CategoryDocument);
    }
  }
}

export async function createCategory(
  data: Omit<Category, 'id' | 'createdAt'>
): Promise<Result<Category>> {
  try {
    const db = await connectToDatabase();
    const collection = db.collection<CategoryDocument>('categories');

    const existing = await collection.findOne({ name: data.name });
    if (existing) {
      return { success: false, error: 'Category with this name already exists' };
    }

    const document: Omit<CategoryDocument, '_id'> = {
      name: data.name,
      icon: data.icon,
      color: data.color,
      isPredefined: false,
      createdAt: new Date(),
    };

    const result = await collection.insertOne(document as CategoryDocument);
    const inserted = await collection.findOne({ _id: result.insertedId });

    if (!inserted) {
      return { success: false, error: 'Failed to create category' };
    }

    return { success: true, data: mapDocumentToCategory(inserted) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCategory(id: string): Promise<Result<Category>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid category ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryDocument>('categories');

    const document = await collection.findOne({ _id: new ObjectId(id) });

    if (!document) {
      return { success: false, error: 'Category not found' };
    }

    return { success: true, data: mapDocumentToCategory(document) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function getCategoryList(): Promise<Result<Category[]>> {
  try {
    await initializePredefinedCategories();

    const db = await connectToDatabase();
    const collection = db.collection<CategoryDocument>('categories');

    const documents = await collection
      .find({})
      .sort({ isPredefined: -1, name: 1 })
      .toArray();

    const categories = documents.map(mapDocumentToCategory);

    return { success: true, data: categories };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function updateCategory(
  id: string,
  data: Partial<Omit<Category, 'id' | 'createdAt' | 'isPredefined'>>
): Promise<Result<Category>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid category ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryDocument>('categories');

    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return { success: false, error: 'Category not found' };
    }

    if (existing.isPredefined) {
      return { success: false, error: 'Cannot modify predefined category' };
    }

    const updateData: Partial<Omit<CategoryDocument, '_id' | 'isPredefined'>> = {};
    if (data.name !== undefined) updateData.name = data.name;
    if (data.icon !== undefined) updateData.icon = data.icon;
    if (data.color !== undefined) updateData.color = data.color;

    const result = await collection.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!result) {
      return { success: false, error: 'Failed to update category' };
    }

    return { success: true, data: mapDocumentToCategory(result) };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

export async function deleteCategory(id: string): Promise<Result<void>> {
  try {
    if (!ObjectId.isValid(id)) {
      return { success: false, error: 'Invalid category ID' };
    }

    const db = await connectToDatabase();
    const collection = db.collection<CategoryDocument>('categories');

    const existing = await collection.findOne({ _id: new ObjectId(id) });
    if (!existing) {
      return { success: false, error: 'Category not found' };
    }

    if (existing.isPredefined) {
      return { success: false, error: 'Cannot delete predefined category' };
    }

    const result = await collection.deleteOne({ _id: new ObjectId(id) });

    if (result.deletedCount === 0) {
      return { success: false, error: 'Failed to delete category' };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}
