"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const db_1 = require("../config/db");
async function resetDatabase() {
    try {
        console.log('Connecting to database (pre-sync)...');
        // Create a separate data source without synchronization for dropping
        const dropDataSource = new typeorm_1.DataSource({
            ...db_1.AppDataSource.options,
            synchronize: false
        });
        await dropDataSource.initialize();
        console.log('Dropping and recreating public schema...');
        await dropDataSource.query('DROP SCHEMA public CASCADE;');
        await dropDataSource.query('CREATE SCHEMA public;');
        await dropDataSource.query('GRANT ALL ON SCHEMA public TO public;');
        await dropDataSource.query('COMMENT ON SCHEMA public IS \'standard public schema\';');
        await dropDataSource.destroy();
        console.log('Reconnecting for synchronization...');
        await db_1.AppDataSource.initialize();
        // Since synchronize: true is in AppDataSource options, it will sync now
        console.log('✅ Database reset successfully!');
        process.exit(0);
    }
    catch (error) {
        console.error('❌ Error resetting database:', error);
        process.exit(1);
    }
}
resetDatabase();
