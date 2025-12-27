import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './App';
import { connectDB } from './config/db';

// Ensure DB is connected before handling requests
let dbInitialized = false;

const initializeDB = async () => {
  if (!dbInitialized) {
    try {
      await connectDB();
      dbInitialized = true;
    } catch (error) {
      console.error('Database initialization failed:', error);
    }
  }
};

// Initialize DB on cold start
initializeDB();

// Wrap app to ensure DB connection on each request
const handler = async (req: any, res: any) => {
  await initializeDB();
  return app(req, res);
};

export default handler;