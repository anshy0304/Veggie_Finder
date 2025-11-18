import { useState } from 'react';
import { fetchFromApi } from '../utils/api';
import RecipeModal from '../components/shared/RecipeModal';
import CookMode from '../components/shared/CookMode';

const Categories = () => {
  const [categoryRecipes, setCategoryRecipes] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cookModeActive, setCookModeActive] = useState(false);
  const [cookModeInstructions, setCookModeInstructions] = useState('');

  const VEG_CATEGORIES = [
    { name: 'Vegetarian', image: 'https://www.themealdb.com/images/media/meals/u9l7k81628771647.jpg' },
    { name: 'Vegan', image: 'https://www.themealdb.com/images/media/meals/rvxxuy1468312893.jpg' },
    { name: 'Pasta', image: 'https://www.themealdb.com/images/media/meals/ustsqw1468250014.jpg' },
    { name: 'Dessert', image: 'https://www.themealdb.com/images/media/meals/wxywrq1468235067.jpg' },
    { name: 'Side', image: 'https://www.themealdb.com/images/media/meals/uuyrrx1487327597.jpg' },
    { name: 'Starter', image: 'https://www.themealdb.com/images/media/meals/sytuqu1511299554.jpg' },
    { name: 'Breakfast', image: 'https://www.themealdb.com/images/media/meals/1550440197.jpg' },
    { name: 'Salad', image: 'https://www.themealdb.com/images/media/meals/krrxpq1511820265.jpg' }
  ];

  const handleCategoryClick = async (categoryName) => {
    setSelectedCategory(categoryName);
    setLoading(true);
    window.scrollTo(0, 0);

    const meals = await fetchFromApi(`filter.php?c=${categoryName}`);
    setCategoryRecipes(meals || []);
    setLoading(false);
  };

  const handleRecipeClick = async (mealId) => {
    const meals = await fetchFromApi(`lookup.php?i=${mealId}`);
    if (meals && meals[0]) {
      setSelectedRecipe(meals[0]);
      setShowModal(true);
    }
  };

  const handleBackToCategories = () => {
    setSelectedCategory(null);
    setCategoryRecipes([]);
  };

  const handleStartCookMode = (instructions) => {
    setCookModeInstructions(instructions);
    setCookModeActive(true);
  };

  return (
    <>
      <main className="container my-5">
        {!selectedCategory ? (
          <>
            <div className="text-center mb-5">
              <h1 className="display-5 fw-bold">Explore Our Categories</h1>
              <p className="lead text-muted">Select a category to discover new vegetarian recipes.</p>
            </div>

            <section className="mb-5">
              <h2 className="mb-4">All Categories</h2>
              <div className="row row-cols-2 row-cols-md-3 row-cols-lg-4 g-3 g-md-4">
                {VEG_CATEGORIES.map((cat) => (
                  <div key={cat.name} className="col">
                    <div
                      className="card category-card text-decoration-none text-white shadow-sm"
                      onClick={() => handleCategoryClick(cat.name)}
                      style={{ cursor: 'pointer' }}
                    >
                      <img src={cat.image} className="card-img" alt={cat.name} />
                      <div className="card-img-overlay d-flex align-items-center justify-content-center p-2">
                        <h5 className="card-title text-center">{cat.name}</h5>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </>
        ) : (
          <>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h2 className="mb-0">
                Recipes in <span className="text-primary">{selectedCategory}</span>
              </h2>
              <button onClick={handleBackToCategories} className="btn btn-outline-secondary">
                <i className="fas fa-arrow-left me-2"></i>View All Categories
              </button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                {categoryRecipes.length > 0 ? (
                  categoryRecipes.map((meal) => (
                    <div key={meal.idMeal} className="col">
                      <div className="card h-100 recipe-card" onClick={() => handleRecipeClick(meal.idMeal)}>
                        <img src={meal.strMealThumb} className="card-img-top" alt={meal.strMeal} />
                        <div className="card-body">
                          <h5 className="card-title">{meal.strMeal}</h5>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted w-100">No recipes found in this category.</p>
                )}
              </div>
            )}
          </>
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

export default Categories;
