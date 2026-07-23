import 'reflect-metadata';
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { User } from '../modules/v1/shared/entities/User';
import { Tenant } from '../modules/v1/shared/entities/Tenant';
import { Match } from '../modules/v1/shared/entities/Match';
import { Team } from '../modules/v1/shared/entities/Team';
import { MatchInnings } from '../modules/v1/shared/entities/MatchInnings';
import { InningsBatting } from '../modules/v1/shared/entities/InningsBatting';
import { InningsBowling } from '../modules/v1/shared/entities/InningsBowling';
import { BallByBall } from '../modules/v1/shared/entities/BallByBall';
import { Player } from '../modules/v1/shared/entities/Player';
import { PlayerStats } from '../modules/v1/shared/entities/PlayerStats';
import { MatchPlayer } from '../modules/v1/shared/entities/MatchPlayer';
import { Plan } from '../modules/v1/shared/entities/Plan';

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
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        User, Tenant, Match, Team, MatchInnings,
        InningsBatting, InningsBowling, BallByBall,
        Player, PlayerStats, MatchPlayer, Plan
    ],
    ssl: (isStaging || isProduction || isDevelopment) ? {
        rejectUnauthorized: false
    } : false,
    connectTimeoutMS: 10000,
    extra: {
        max: 5,
        connectionTimeoutMillis: 10000,
        idleTimeoutMillis: 30000,
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
