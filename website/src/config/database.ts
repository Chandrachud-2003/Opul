import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in environment variables');
    }
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

// Add this to handle initial connection errors
mongoose.connection.on('error', (err: mongoose.Error) => {
  console.error('MongoDB connection error:', err);
});

// Add this to handle successful reconnection
mongoose.connection.on('reconnected', () => {
  console.log('MongoDB reconnected!');
});

export default connectDB; 