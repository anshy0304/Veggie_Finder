import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchFromApi } from '../utils/api';
import RecipeModal from '../components/shared/RecipeModal';
import CookMode from '../components/shared/CookMode';
import { Link } from 'react-router-dom';

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [cookModeActive, setCookModeActive] = useState(false);
  const [cookModeInstructions, setCookModeInstructions] = useState('');
  const { user, token } = useAuth();

  const loadFavorites = useCallback(async () => {
    if (!token) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const response = await fetch('/api/favorites', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch favorites');
      const data = await response.json();
      setFavorites(data);
    } catch (error) {
      console.error('Error loading favorites:', error);
    }
    setLoading(false);
  }, [token]);


  useEffect(() => {
    if (user) {
      loadFavorites();
    }
  }, [user, loadFavorites]);

  const handleRecipeClick = async (mealId) => {
    const meals = await fetchFromApi(`lookup.php?i=${mealId}`);
    if (meals && meals[0]) {
      setSelectedRecipe(meals[0]);
      setShowModal(true);
    }
  };

  const handleRemove = async (favId) => {
    try {
        const response = await fetch(`/api/favorites/${favId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        if (!response.ok) throw new Error('Failed to remove favorite');

      setFavorites(favorites.filter(fav => fav._id !== favId));
    } catch (error) {
      console.error('Error removing favorite:', error);
      alert('Failed to remove favorite');
    }
  };

  const handleStartCookMode = (instructions) => {
    setCookModeInstructions(instructions);
    setCookModeActive(true);
  };

  if (loading) {
    return (
      <div className="container text-center py-5">
        <div className="spinner-border text-primary" style={{ width: '3rem', height: '3rem' }} role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <main className="container my-5">
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold">My Favorite Recipes</h1>
          <p className="lead text-muted">All your saved vegetarian recipes, ready to be cooked!</p>
        </div>

        {favorites.length === 0 ? (
          <div className="text-center py-5">
            <i className="fas fa-heart-crack fa-4x text-muted mb-4"></i>
            <h2 className="fw-bold">No Favorites Yet!</h2>
            <p className="lead text-muted mt-3">
              You haven't saved any recipes. <br />
              Click the heart icon on any recipe to add it here.
            </p>
            <Link to="/" className="btn btn-primary btn-lg mt-4">
              <i className="fas fa-search me-2"></i>Find Recipes
            </Link>
          </div>
        ) : (
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
            {favorites.map((fav) => (
              <div key={fav._id} className="col">
                <div className="card h-100 recipe-card" onClick={() => handleRecipeClick(fav.meal_id)}>
                  <img src={fav.meal_image} className="card-img-top" alt={fav.meal_name} />
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title">{fav.meal_name}</h5>
                  </div>
                  <div className="card-footer bg-transparent border-0 pb-3">
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(fav._id);
                      }}
                    >
                      <i className="fas fa-trash-alt me-1"></i> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
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

export default Favorites;