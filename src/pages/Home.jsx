import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchFromApi } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';
import RecipeModal from '../components/shared/RecipeModal';
import CookMode from '../components/shared/CookMode';
import { apiBase } from '../config/api'; 

const Home = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cookModeActive, setCookModeActive] = useState(false);
  const [cookModeInstructions, setCookModeInstructions] = useState('');
  const { user, token } = useAuth();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadInitialRecipes();
  }, []);

  // If navigated here with location.state.openRecipe, open the modal
  useEffect(() => {
    if (location && location.state && location.state.openRecipe) {
      setSelectedRecipe(location.state.openRecipe);
      setShowModal(true);
      // clear state so refresh doesn't re-open modal
      navigate(location.pathname, { replace: true });
    }
  }, [location, navigate]);

 // in src/pages/Home.jsx

const loadInitialRecipes = async () => {
  setLoading(true);
  try {
    // This fetch call points to your backend proxy.
    const response = await fetch('/api/recipes/public?category=Vegetarian');
    const combinedMeals = await response.json();
    setRecipes(combinedMeals || []);
  } catch (error) {
    console.error("Failed to load combined recipes:", error);
    setRecipes([]);
  }
  setLoading(false);
};
  // in src/pages/Home.jsx
const handleSearch = async (e) => {
  e.preventDefault();
  if (!searchQuery.trim()) {
    loadInitialRecipes();
    return;
  }

  setLoading(true);
  try {
    const response = await fetch(`/api/recipes/public?search=${encodeURIComponent(searchQuery)}`);
    if (!response.ok) throw new Error('Search request failed');
    const combinedMeals = await response.json();
    setRecipes(combinedMeals || []);
  } catch (error) {
    console.error("Failed to load search results:", error);
    setRecipes([]);
  }
  setLoading(false);
};

  const handleRandom = async () => {
    setLoading(true);
    const meals = await fetchFromApi('filter.php?c=Vegetarian');
    if (meals && meals.length > 0) {
      const randomMeal = meals[Math.floor(Math.random() * meals.length)];
      setRecipes([randomMeal]);
    }
    setLoading(false);
  };

  const handleRecipeClick = async (mealId) => {
    // If this meal comes from user-submitted recipes (we set idMeal = _id),
    // try to find it in the currently loaded `recipes` and open directly.
    const local = recipes.find(m => m.idMeal === mealId);
    if (local && local.strInstructions) {
      setSelectedRecipe(local);
      setShowModal(true);
      return;
    }

    const meals = await fetchFromApi(`lookup.php?i=${mealId}`);
    if (meals && meals[0]) {
      setSelectedRecipe(meals[0]);
      setShowModal(true);
    }
  };

  const handleAddToFavorites = async (meal) => {
    if (!user) {
      alert('Please login to add favorites');
      return;
    }

    try {
      const response = await fetch('/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          meal_id: meal.idMeal,
          meal_name: meal.strMeal,
          meal_image: meal.strMealThumb,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add to favorites');
      }

      alert(`${meal.strMeal} added to favorites!`);
    } catch (error) {
      console.error('Error adding to favorites:', error);
      alert(error.message);
    }
  };

  const handleStartCookMode = (instructions) => {
    setCookModeInstructions(instructions);
    setCookModeActive(true);
  };

  return (
    <>
      <header className="hero-section text-center py-5">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-8 col-lg-7">
              <h1 className="display-5 fw-bold mb-3">Find Your Next Favorite Meal</h1>
              <p className="lead text-muted mb-4">Explore thousands of plant-based recipes.</p>
              <form onSubmit={handleSearch} role="search">
                <div className="input-group input-group-lg shadow-sm">
                  <span className="input-group-text">
                    <i className="fas fa-search"></i>
                  </span>
                  <input
                    type="search"
                    className="form-control"
                    placeholder="Search for ingredients or recipes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <button className="btn btn-primary fw-bold" type="submit">
                    Search
                  </button>
                </div>
              </form>
              <div className="mt-4">
                <button onClick={handleRandom} className="btn btn-outline-secondary">
                  <i className="fas fa-dice me-2"></i>Surprise Me!
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="container my-5">
        <h2 className="text-center mb-4">Latest Recipes</h2>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {recipes.length > 0 ? (
              recipes.map((meal) => (
                <div key={meal.idMeal} className="col">
                  <div className="card h-100 recipe-card" onClick={() => handleRecipeClick(meal.idMeal)}>
                    <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />
                    <div className="card-body d-flex flex-column">
                      <h5 className="card-title">{meal.strMeal}</h5>
                    </div>
                    {user && (
                      <div className="card-footer bg-transparent border-0 pb-3">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToFavorites(meal);
                          }}
                        >
                          <i className="fas fa-heart me-1"></i> Add to Favorites
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-muted fs-4 mt-5">No vegetarian recipes found.</p>
            )}
          </div>
        )}
      </main>

      <RecipeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        recipe={selectedRecipe}
        onStartCookMode={handleStartCookMode}
      />

      <CookMode
        isActive={cookModeActive}
        onClose={() => setCookModeActive(false)}
        instructions={cookModeInstructions}
      />
    </>
  );
};

export default Home;