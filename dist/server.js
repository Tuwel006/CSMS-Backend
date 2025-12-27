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
// Initialize DB connection for serverless
(0, db_1.connectDB)().catch(err => {
    console.error('Database connection failed:', err);
});
exports.default = App_1.default;
