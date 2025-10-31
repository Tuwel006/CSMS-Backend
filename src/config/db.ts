import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/v1/shared/entities/User';

dotenv.config();

export const AppDataSource = new DataSource({
    type: 'mysql',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    // password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true, // Auto-sync in development
    logging: false,
    entities: [__dirname+"/../modules/v1/shared/entities/*.{ts,js}"],
    migrations: [],
    subscribers: [],
});

export const connectDB = async () => {
    try {
        await AppDataSource.initialize();
        console.log('MySQL Connection Successfully.');
        console.log('Database synced successfully.');
    } catch (error) {
        console.error('MySQL connection Error: ', error);
        throw error;
    }
};