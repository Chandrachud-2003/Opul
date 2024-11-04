import { MongoClient } from 'mongodb';

const uri = import.meta.env.VITE_MONGODB_URI;
const client = new MongoClient(uri);

export const connectToDatabase = async () => {
  try {
    await client.connect();
    return client.db('opul'); // your database name
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}; 