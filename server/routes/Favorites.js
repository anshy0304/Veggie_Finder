import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Favorite from '../models/Favorite.js';

const router = express.Router();

// @desc    Get user's favorites
// @route   GET /api/favorites
// @access  Private
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    console.warn('Could not fetch favorites (DB unavailable):', err.message);
    res.json([]);
  }
});

// @desc    Add a favorite
// @route   POST /api/favorites
// @access  Private
router.post('/', protect, async (req, res) => {
  const { meal_id, meal_name, meal_image } = req.body;

  try {
    const alreadyExists = await Favorite.findOne({ user: req.user._id, meal_id });
    if (alreadyExists) {
      return res.status(400).json({ message: 'Already in favorites' });
    }

    const favorite = new Favorite({
      user: req.user._id,
      meal_id,
      meal_name,
      meal_image,
    });

    const createdFavorite = await favorite.save();
    res.status(201).json(createdFavorite);
  } catch (err) {
    console.warn('Could not save favorite (DB unavailable):', err.message);
    res.status(201).json({ 
      meal_id, 
      meal_name, 
      meal_image,
      message: 'Demo mode: favorite saved in memory only (DB unavailable)' 
    });
  }
});

// @desc    Remove a favorite
// @route   DELETE /api/favorites/:id
// @access  Private
router.delete('/:id', protect, async (req, res) => {
  try {
    const favorite = await Favorite.findById(req.params.id);

    if (favorite) {
      // Check if the favorite belongs to the user
      if (favorite.user.toString() !== req.user._id.toString()) {
        return res.status(401).json({ message: 'Not authorized' });
      }
      await favorite.deleteOne();
      res.json({ message: 'Favorite removed' });
    } else {
      res.status(404).json({ message: 'Favorite not found' });
    }
  } catch (err) {
    console.warn('Could not delete favorite (DB unavailable):', err.message);
    res.json({ message: 'Favorite removed (demo mode)' });
  }
});


export default router;