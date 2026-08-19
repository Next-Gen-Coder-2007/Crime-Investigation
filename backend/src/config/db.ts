import mongoose from "mongoose";

export const connectDB = async (): Promise<boolean> => {
  const mongoUri = process.env.MONGODB_URI || "mongodb://localhost:27017/intelboard";

  try {
    const conn = await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error: any) {
    console.warn(`[Database Warning] MongoDB connection failed: ${error.message}`);
    console.warn(`[Database Warning] System will operate in fallback mode until MongoDB is accessible.`);
    return false;
  }
};
