import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { MongoClient, ServerApiVersion } from 'mongodb';
import usersRouter from './routes/users.js';

dotenv.config();

const app = express();

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false
}));

// Add OPTIONS handling for preflight requests
app.options('*', cors());

app.use(express.json());

// MongoDB Connection
const uri = process.env.MONGODB_URI;
console.log('Attempting to connect to MongoDB...');

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  // Add monitoring without the unsupported option
  monitorCommands: true
});

async function connectDB() {
  try {
    console.log('Connecting to MongoDB...');
    await client.connect();
    console.log('Connected to client, attempting ping...');
    await client.db("admin").command({ ping: 1 });
    console.log("Successfully connected to MongoDB!");
    return client.db();
  } catch (error) {
    console.error("MongoDB connection error details:", {
      name: error.name,
      message: error.message,
      code: error.code,
      stack: error.stack
    });
    process.exit(1);
  }
}

// Initialize database connection
connectDB().catch(error => {
  console.error('Failed to connect to MongoDB:', error);
  process.exit(1);
});

// Routes
app.use('/api/users', usersRouter);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Handle process termination
process.on('SIGINT', async () => {
  await client.close();
  process.exit(0);
}); 