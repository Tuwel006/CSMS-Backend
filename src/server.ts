import 'reflect-metadata';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import { insertBalls } from './modules/v1/shared/testData';
dotenv.config();

import app from './App';

const PORT = process.env.PORT || 3000;

const startServer = async () => {
    try {
        await connectDB();
    app.listen(PORT, ()=> {
        console.log(`Server running on PORT: ${PORT}`);
    })
    } catch (error) {
        console.error('Failed to Start Server', error);
        process.exit(1);
    }
}

startServer();