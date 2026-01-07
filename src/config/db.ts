import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/v1/shared/entities/User';

if (process.env.DOTENV_CONFIG_PATH) {
    dotenv.config({ path: process.env.DOTENV_CONFIG_PATH });
} else {
    dotenv.config();
}

const isStaging = process.env.NODE_ENV === 'staging';
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

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
    ssl: (isStaging || isProduction || isDevelopment) ? {
        rejectUnauthorized: false
    } : false,
    extra: {
        max: 10,
        connectionTimeoutMillis: 30000,
        idleTimeoutMillis: 30000,
        query_timeout: 30000,
        statement_timeout: 30000,
        keepAlive: true,
        keepAliveInitialDelayMillis: 10000
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