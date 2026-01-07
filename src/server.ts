import 'reflect-metadata';
import dotenv from 'dotenv';

if (process.env.DOTENV_CONFIG_PATH) {
  dotenv.config({ path: process.env.DOTENV_CONFIG_PATH });
} else {
  dotenv.config();
}

import app from './App';
import { connectDB } from './config/db';

const isDevelopment = process.env.NODE_ENV === 'development';

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

// Local development server
if (isDevelopment) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
  });
}

// Wrap app to ensure DB connection on each request
const handler = async (req: any, res: any) => {
  await initializeDB();
  return app(req, res);
};

export default handler;