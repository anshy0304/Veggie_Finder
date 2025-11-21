

import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from '../server/config/db.js';
import authRoutes from '../server/routes/auth.js';
import favoriteRoutes from '../server/routes/Favorites.js';
import recipeRoutes from '../server/routes/recipes.js';

// Load environment variables
dotenv.config();

// Initialize the Express app
const app = express();

// --- CORRECT MIDDLEWARE AND ROUTING SETUP ---

// 1. Set up CORS
app.use(cors({ origin: process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173' }));

// 2. Set up the body-parser
app.use(express.json());

// 3. THIS IS THE FIX: A middleware "gatekeeper" to ensure the DB is connected.
// This function will run for EVERY incoming API request.
app.use(async (req, res, next) => {
  try {
    // It will wait for the database to be ready.
    // Our cached connection in db.js makes this very fast after the first time.
    await connectDB();
    // If the connection is successful, it passes the request to the next step (the routes).
    next();
  } catch (error) {
    // If the DB connection fails, it stops everything and sends a server error.
    console.error('Database connection middleware failed:', error);
    res.status(500).json({ message: 'Internal Server Error: Could not connect to database.' });
  }
});

// 4. Set up the API routes. These will only be reached if the DB connection succeeds.
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/recipes', recipeRoutes);

// 5. Finally, export the app for Vercel to use.
export default app;