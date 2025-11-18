// This is the serverless-optimized version of server/config/db.js

import mongoose from 'mongoose';

// A global variable to hold the cached connection.
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

async function connectDB() {
  // If we have a cached connection, reuse it.
  if (cached.conn) {
    console.log('Using cached database connection.');
    return cached.conn;
  }

  // If we don't have a connection promise, create one.
  if (!cached.promise) {
    const MONGO_URI = process.env.MONGO_URI;
    if (!MONGO_URI) {
      throw new Error('Please define the MONGO_URI environment variable.');
    }

    console.log('Creating new database connection...');
    cached.promise = mongoose.connect(MONGO_URI, {
      bufferCommands: false, // Recommended for serverless
    }).then((mongooseInstance) => {
      console.log(`MongoDB Connected: ${mongooseInstance.connection.host}`);
      return mongooseInstance;
    });
  }

  // Await the connection promise and cache the result.
  cached.conn = await cached.promise;
  return cached.conn;
}

export default connectDB;