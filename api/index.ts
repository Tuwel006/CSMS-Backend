import app from '../src/App';
import { AppDataSource, connectDB } from '../src/config/db';

const ensureDB = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await connectDB();
    }
  } catch (err) {
    console.error('DB connect error in serverless handler:', err);
    throw err;
  }
};

export default async function handler(req: any, res: any) {
  try {
    await ensureDB();
  } catch (err) {
    res.status(500).send('Database connection failed');
    return;
  }

  // Delegate to the Express app
  return app(req, res);
}
