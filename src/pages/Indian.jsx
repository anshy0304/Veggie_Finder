import { useState, useEffect } from 'react';
import RecipeModal from '../components/shared/RecipeModal';
import { fetchFromApi } from '../utils/api';

const Indian = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        // Call ThemealDB directly for Indian recipes (by area)
        const meals = await fetchFromApi('filter.php?a=Indian');
        setRecipes(meals || []);
      } catch (err) {
        console.error('Error loading Indian recipes:', err);
        setRecipes([]);
      }
      setLoading(false);
    };
    load();
  }, []);

  const handleRecipeClick = async (mealId) => {
    // If it's a user-submitted recipe (id is Mongo id), find locally
    const local = recipes.find((m) => m.idMeal === mealId);
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

  return (
    <main className="container my-5">
      <h2 className="text-center mb-4">Indian Recipes</h2>
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
                  {meal.strMealThumb && <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />}
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{meal.strMeal}</h5>
                    <small className="text-muted mt-auto">{meal.strCategory || 'Indian'}</small>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-muted fs-4 mt-5">No Indian recipes found.</p>
          )}
        </div>
      )}

      <RecipeModal
        show={showModal}
        onHide={() => setShowModal(false)}
        recipe={selectedRecipe}
        onStartCookMode={() => {}}
      />
    </main>
  );
};

export default Indian;
