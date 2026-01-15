import 'reflect-metadata';
import { AppDataSource } from '../config/db';

async function resetDatabase() {
    try {
        console.log('Connecting to database...');
        await AppDataSource.initialize();

        console.log('Dropping all tables...');
        await AppDataSource.dropDatabase();

        console.log('Synchronizing schema...');
        await AppDataSource.synchronize();

        console.log('✅ Database reset successfully!');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}

resetDatabase();
