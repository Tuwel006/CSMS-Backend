import 'reflect-metadata';
import dotenv from 'dotenv';
dotenv.config();

import app from './App';
import { connectDB } from './config/db';

connectDB(); // initialize DB ONCE

export default app;