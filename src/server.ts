import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './App';
import { connectDB } from './config/db';

// Initialize DB connection for serverless
connectDB().catch(err => {
  console.error('Database connection failed:', err);
});

export default app;