"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.DOTENV_CONFIG_PATH) {
    dotenv_1.default.config({ path: process.env.DOTENV_CONFIG_PATH });
}
else {
    dotenv_1.default.config();
}
const App_1 = __importDefault(require("./App"));
const db_1 = require("./config/db");
const isDevelopment = process.env.NODE_ENV === 'development';
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
// Local development server
if (isDevelopment) {
    const PORT = process.env.PORT || 5000;
    App_1.default.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}
// Wrap app to ensure DB connection on each request
const handler = async (req, res) => {
    await initializeDB();
    return (0, App_1.default)(req, res);
};
exports.default = handler;
