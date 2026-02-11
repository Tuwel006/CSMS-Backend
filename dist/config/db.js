"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv = __importStar(require("dotenv"));
const User_1 = require("../modules/v1/shared/entities/User");
const Tenant_1 = require("../modules/v1/shared/entities/Tenant");
const Match_1 = require("../modules/v1/shared/entities/Match");
const Team_1 = require("../modules/v1/shared/entities/Team");
const MatchInnings_1 = require("../modules/v1/shared/entities/MatchInnings");
const InningsBatting_1 = require("../modules/v1/shared/entities/InningsBatting");
const InningsBowling_1 = require("../modules/v1/shared/entities/InningsBowling");
const BallByBall_1 = require("../modules/v1/shared/entities/BallByBall");
const Player_1 = require("../modules/v1/shared/entities/Player");
const PlayerStats_1 = require("../modules/v1/shared/entities/PlayerStats");
const MatchPlayer_1 = require("../modules/v1/shared/entities/MatchPlayer");
const Role_1 = require("../modules/v1/shared/entities/Role");
const Permission_1 = require("../modules/v1/shared/entities/Permission");
const RolePermission_1 = require("../modules/v1/shared/entities/RolePermission");
const Plan_1 = require("../modules/v1/shared/entities/Plan");
const PlanPermission_1 = require("../modules/v1/shared/entities/PlanPermission");
const UserPlan_1 = require("../modules/v1/shared/entities/UserPlan");
const UserRole_1 = require("../modules/v1/shared/entities/UserRole");
const BallHistory_1 = require("../modules/v1/shared/entities/BallHistory");
if (process.env.DOTENV_CONFIG_PATH) {
    dotenv.config({ path: process.env.DOTENV_CONFIG_PATH });
}
else {
    dotenv.config();
}
const isStaging = process.env.NODE_ENV === 'staging';
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT || 5432),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    synchronize: true,
    logging: false,
    entities: [
        User_1.User, Tenant_1.Tenant, Match_1.Match, Team_1.Team, MatchInnings_1.MatchInnings,
        InningsBatting_1.InningsBatting, InningsBowling_1.InningsBowling, BallByBall_1.BallByBall,
        Player_1.Player, PlayerStats_1.PlayerStats, MatchPlayer_1.MatchPlayer, Role_1.Role,
        Permission_1.Permission, RolePermission_1.RolePermission, Plan_1.Plan, PlanPermission_1.PlanPermission,
        UserPlan_1.UserPlan, UserRole_1.UserRole, BallHistory_1.BallHistory
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
const connectDB = async () => {
    if (isConnected && exports.AppDataSource.isInitialized) {
        return;
    }
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            isConnected = true;
            console.log(`PostgreSQL Connection Successfully (${isStaging ? 'Staging' : isProduction ? 'Production' : 'Development'}).`);
            console.log('Database synced successfully.');
        }
    }
    catch (error) {
        console.error('PostgreSQL connection Error: ', error);
        isConnected = false;
        throw error;
    }
};
exports.connectDB = connectDB;
