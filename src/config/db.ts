import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/v1/shared/entities/User';
dotenv.config();

const isStaging = process.env.NODE_ENV === 'staging';
const isProduction = process.env.NODE_ENV === 'production';

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [__dirname + '/../modules/v1/shared/entities/*.{ts,js}'],
    ssl: (isStaging || isProduction) ? {
        rejectUnauthorized: false
    } : false,
    extra: {
        max: 1, // Limit connections for serverless
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000
    }
});

let isConnected = false;

export const connectDB = async () => {
    if (isConnected && AppDataSource.isInitialized) {
        return;
    }
    
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            isConnected = true;
            console.log(`PostgreSQL Connection Successfully (${isStaging ? 'Staging' : isProduction ? 'Production' : 'Development'}).`);
            console.log('Database synced successfully.');
        }
    } catch (error) {
        console.error('PostgreSQL connection Error: ', error);
        isConnected = false;
        throw error;
    }
};