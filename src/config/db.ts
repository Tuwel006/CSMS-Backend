import * as dotenv from 'dotenv';
import mongoose from 'mongoose';

dotenv.config();

const MONGO_URL = process.env.MONGO_URI;

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URL as string);
        console.log(('MongoDB Connection Successfully.'));
    } catch (error) {
        console.error("MongoDB connection Error: ",error);
    }
}