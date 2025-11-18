import express from 'express';
import protect from '../middleware/authMiddleware.js';
import Recipe from '../models/Recipe.js';

const router = express.Router();

// Private routes for logged-in users
router.get('/', protect, async (req, res) => {
  const recipes = await Recipe.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(recipes);
});

router.post('/', protect, async (req, res) => {
  const { name, image_url, instructions, ingredients, cuisine } = req.body;
  if (!name || !instructions || !ingredients || ingredients.length === 0) {
    return res.status(400).json({ message: 'Please fill all required fields' });
  }
  const recipe = new Recipe({ user: req.user._id, name, image_url, instructions, ingredients, cuisine: cuisine || 'Vegetarian' });
  const createdRecipe = await recipe.save();
  res.status(201).json(createdRecipe);
});

router.delete('/:id', protect, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
    if (recipe.user.toString() !== req.user._id.toString()) return res.status(401).json({ message: 'Not authorized' });
    await recipe.deleteOne();
    res.json({ message: 'Recipe removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error while deleting recipe' });
  }
});

// This is the single, smart public endpoint for both browsing and searching
router.get('/public', async (req, res) => {
  try {
    // DEBUG LINE: Leave this in for now.
    console.log('API HIT: /api/recipes/public with query:', req.query);

    const { category, search } = req.query;
    let meals = [];
    let mappedUser = [];
    
    // --- SEARCH LOGIC ---
    if (search) {
      const apiSearchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${encodeURIComponent(search)}`;
      const apiResp = await fetch(apiSearchUrl);
      if (apiResp.ok) {
        const apiJson = await apiResp.json();
        if (apiJson.meals) meals = apiJson.meals.filter(meal => meal.strCategory === 'Vegetarian');
      }
      try {
        const userRecipes = await Recipe.find({ name: new RegExp(search, 'i') }).sort({ createdAt: -1 });
        mappedUser = (userRecipes || []).map(r => ({ idMeal: r._id.toString(), strMeal: r.name, strMealThumb: r.image_url || '', strCategory: r.cuisine, strInstructions: r.instructions }));
      } catch (dbErr) { console.warn('DB search failed:', dbErr.message); }

    // --- BROWSE/CATEGORY LOGIC ---
    } else {
      const categoryToFetch = category || 'Vegetarian';
      const apiUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${encodeURIComponent(categoryToFetch)}`;
      const apiResp = await fetch(apiUrl);
      if (apiResp.ok) {
        const apiJson = await apiResp.json();
        meals = apiJson.meals || [];
      }
      try {
        const userRecipes = await Recipe.find({}).sort({ createdAt: -1 });
        mappedUser = (userRecipes || []).map(r => ({ idMeal: r._id.toString(), strMeal: r.name, strMealThumb: r.image_url || '', strCategory: r.cuisine, strInstructions: r.instructions }));
      } catch (dbErr) { console.warn('DB category fetch failed:', dbErr.message); }
    }

    // --- MERGE RESULTS ---
    const map = new Map();
    (meals || []).forEach(m => map.set(m.idMeal, m));
    (mappedUser || []).forEach(m => map.set(m.idMeal, m));
    res.json(Array.from(map.values()));
  } catch (error) {
    res.status(500).json({ message: 'Server error fetching public recipes' });
  }
});

// THIS MUST BE AT THE VERY END OF THE FILE
export default router;