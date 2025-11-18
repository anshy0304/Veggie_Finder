import dotenv from 'dotenv';
import mongoose from 'mongoose';

// Load .env from current working directory (project root)
dotenv.config();

const uri = process.env.MONGO_URI;
if (!uri) {
  console.error('MONGO_URI not set in .env');
  process.exit(2);
}

(async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000, connectTimeoutMS: 5000 });
    console.log('MongoDB connection: OK');
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('MongoDB connection: FAILED');
    console.error(err.message || err);
    process.exit(1);
  }
})();
