"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const db_1 = require("../config/db");
async function resetDatabase() {
    try {
        console.log('Connecting to database...');
        await db_1.AppDataSource.initialize();
        console.log('Dropping all tables...');
        await db_1.AppDataSource.dropDatabase();
        console.log('Synchronizing schema...');
        await db_1.AppDataSource.synchronize();
        console.log('✅ Database reset successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}
resetDatabase();
