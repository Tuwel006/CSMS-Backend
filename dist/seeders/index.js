"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const db_1 = require("../config/db");
const seed_1 = require("./seed");
async function runSeeder() {
    try {
        // Initialize database connection
        await db_1.AppDataSource.initialize();
        console.log('📡 Database connection established');
        // Run seeder
        await seed_1.DatabaseSeeder.run();
        // Close connection
        await db_1.AppDataSource.destroy();
        console.log('🔌 Database connection closed');
        process.exit(0);
    }
    catch (error) {
        console.error('💥 Seeding failed:', error);
        process.exit(1);
    }
}
runSeeder();
