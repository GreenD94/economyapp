import { connectToDatabase } from '../../../features/core/utils/database.client';
import { PREDEFINED_CATEGORIES } from '../../../features/core/constants/category.constants';
import type { CategoryDocument } from '../../../features/categories/types/category.types';

export async function seedCategories(): Promise<void> {
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
      console.log(`  ✓ Seeded category: ${category.name}`);
    } else {
      console.log(`  ⊙ Category already exists: ${category.name}`);
    }
  }
}
