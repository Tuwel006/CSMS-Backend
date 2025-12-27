"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const App_1 = __importDefault(require("./App"));
const db_1 = require("./config/db");
// Ensure DB is connected before handling requests
let dbInitialized = false;
const initializeDB = async () => {
    if (!dbInitialized) {
        try {
            await (0, db_1.connectDB)();
            dbInitialized = true;
        }
        catch (error) {
            console.error('Database initialization failed:', error);
        }
    }
};
// Initialize DB on cold start
initializeDB();
// Wrap app to ensure DB connection on each request
const handler = async (req, res) => {
    await initializeDB();
    return (0, App_1.default)(req, res);
};
exports.default = handler;
