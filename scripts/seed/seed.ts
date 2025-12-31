import { connectToDatabase, closeDatabaseConnection } from '../../features/core/utils/database.client';
import { seedCategories } from './seeders/categories.seeder';
import { seedPredefinedTransactions } from './seeders/predefined-transactions.seeder';

async function seed() {
  try {
    console.log('🌱 Starting database seeding...');
    
    await connectToDatabase();
    console.log('✅ Connected to database');

    await seedCategories();
    console.log('✅ Categories seeded');

    await seedPredefinedTransactions();
    console.log('✅ Predefined transactions seeded');

    await closeDatabaseConnection();
    console.log('✅ Database connection closed');
    
    console.log('🎉 Seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    await closeDatabaseConnection();
    process.exit(1);
  }
}

seed();
