import { AppDataSource } from '../config/db';
import { DatabaseSeeder } from './seed';

async function runSeeder() {
  try {
    // Initialize database connection
    await AppDataSource.initialize();
    console.log('📡 Database connection established');

    // Run seeder
    await DatabaseSeeder.run();

    // Close connection
    await AppDataSource.destroy();
    console.log('🔌 Database connection closed');
    
    process.exit(0);
  } catch (error) {
    console.error('💥 Seeding failed:', error);
    process.exit(1);
  }
}

runSeeder();