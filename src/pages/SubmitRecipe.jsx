import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const SubmitRecipe = () => {
  const [recipeName, setRecipeName] = useState('');
  const [recipeImg, setRecipeImg] = useState('');
  const [recipeCuisine, setRecipeCuisine] = useState('Vegetarian');
  const [recipeInstructions, setRecipeInstructions] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [ingredientInput, setIngredientInput] = useState('');
  const [userRecipes, setUserRecipes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const [deleteSuccess, setDeleteSuccess] = useState('');

  const loadUserRecipes = useCallback(async () => {
    if (!token) return;
    try {
      const response = await fetch('/api/recipes', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch recipes');
      const data = await response.json();
      setUserRecipes(data || []);
    } catch (error) {
      console.error('Error loading recipes:', error);
    }
  }, [token]);

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this recipe?')) return;
    setDeletingId(id);
    try {
      const response = await fetch(`/api/recipes/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete recipe');
      // remove from local state
      setUserRecipes((prev) => prev.filter((r) => r._id !== id));
  // show small success alert for deletion
  const deletedRecipe = userRecipes.find((r) => r._id === id);
  setDeleteSuccess(deletedRecipe?.name || 'Recipe');
  setTimeout(() => setDeleteSuccess(''), 3000);
    } catch (error) {
      console.error('Error deleting recipe:', error);
      alert(error.message);
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    if (user) {
      loadUserRecipes();
    }
  }, [user, loadUserRecipes]);

  const handleAddIngredient = () => {
    const ingredientText = ingredientInput.trim();
    if (ingredientText) {
      setIngredients([...ingredients, ingredientText]);
      setIngredientInput('');
    }
  };

  const handleRemoveIngredient = (index) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (ingredients.length === 0) {
      alert('Please add at least one ingredient.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: recipeName,
          image_url: recipeImg,
          instructions: recipeInstructions,
          ingredients: ingredients,
          cuisine: recipeCuisine,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Failed to submit recipe');
      }

      setRecipeName('');
      setRecipeImg('');
      setRecipeInstructions('');
      setIngredients([]);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 4000);

      loadUserRecipes();
      window.scrollTo(0, 0);
    } catch (error) {
      console.error('Error submitting recipe:', error);
      alert(error.message);
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddIngredient();
    }
  };

  return (
    <main className="container my-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          <div className="text-center mb-5">
            <h1 className="display-5 fw-bold">Share Your Creation</h1>
            <p className="lead text-muted">Contribute to our community by sharing your favorite vegetarian recipes.</p>
          </div>

          <div className="card shadow-sm">
            <div className="card-body p-4 p-md-5">
              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label htmlFor="recipe-name" className="form-label fs-5">Recipe Name</label>
                  <input
                    type="text"
                    className="form-control form-control-lg"
                    id="recipe-name"
                    placeholder="e.g., Classic Vegan Lasagna"
                    value={recipeName}
                    onChange={(e) => setRecipeName(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="recipe-img" className="form-label fs-5">Image URL</label>
                  <input
                    type="url"
                    className="form-control"
                    id="recipe-img"
                    placeholder="https://example.com/image.jpg"
                    value={recipeImg}
                    onChange={(e) => setRecipeImg(e.target.value)}
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="recipe-cuisine" className="form-label fs-5">Cuisine</label>
                  <select
                    id="recipe-cuisine"
                    className="form-select"
                    value={recipeCuisine}
                    onChange={(e) => setRecipeCuisine(e.target.value)}
                  >
                    <option>Vegetarian</option>
                    <option>Indian</option>
                    <option>Italian</option>
                    <option>Chinese</option>
                    <option>Mexican</option>
                    <option>Thai</option>
                  </select>
                </div>

                <div className="mb-4">
                  <label className="form-label fs-5">Ingredients</label>
                  {ingredients.length > 0 && (
                    <ul className="list-group mb-2">
                      {ingredients.map((ingredient, index) => (
                        <li key={index} className="list-group-item d-flex justify-content-between align-items-center">
                          {ingredient}
                          <button
                            type="button"
                            className="btn-close"
                            aria-label="Remove"
                            onClick={() => handleRemoveIngredient(index)}
                          ></button>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="input-group">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="e.g., 1 cup all-purpose flour"
                      value={ingredientInput}
                      onChange={(e) => setIngredientInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button
                      className="btn btn-outline-secondary"
                      type="button"
                      onClick={handleAddIngredient}
                    >
                      Add
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <label htmlFor="recipe-instructions" className="form-label fs-5">Instructions</label>
                  <textarea
                    className="form-control"
                    id="recipe-instructions"
                    rows="6"
                    placeholder="1. Preheat oven to 375°F (190°C).&#10;2. Mix all dry ingredients...&#10;3. Bake for 25-30 minutes."
                    value={recipeInstructions}
                    onChange={(e) => setRecipeInstructions(e.target.value)}
                    required
                  ></textarea>
                </div>

                <div className="d-grid">
                  <button type="submit" className="btn btn-primary btn-lg" disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Submitting...
                      </>
                    ) : (
                      'Submit Recipe'
                    )}
                  </button>
                </div>

                {showSuccess && (
                  <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <strong>Success!</strong> Your recipe has been submitted.
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setShowSuccess(false)}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
                {deleteSuccess && (
                  <div className="alert alert-success alert-dismissible fade show mt-4" role="alert">
                    <strong>Deleted!</strong> {deleteSuccess} has been removed.
                    <button
                      type="button"
                      className="btn-close"
                      onClick={() => setDeleteSuccess('')}
                      aria-label="Close"
                    ></button>
                  </div>
                )}
              </form>
            </div>
          </div>

          <section className="mt-5 pt-4 border-top">
            <h2 className="text-center mb-4">Your Submissions</h2>
            {userRecipes.length === 0 ? (
              <div className="text-center py-5">
                <i className="fas fa-file-alt fa-4x text-muted mb-4"></i>
                <h2 className="fw-bold">You haven't submitted any recipes yet.</h2>
                <p className="lead text-muted mt-3">Fill out the form above to get started!</p>
              </div>
            ) : (
              <div className="row row-cols-1 row-cols-md-2 g-4">
                {userRecipes.map((recipe) => (
                  <div key={recipe._id} className="col">
                    <div className="card h-100 recipe-card">
                      {recipe.image_url && (
                        <img src={recipe.image_url} className="card-img-top" alt={recipe.name} />
                      )}
                      <div className="card-body d-flex flex-column">
                        <h5 className="card-title">{recipe.name}</h5>
                        <p className="text-muted small mt-2">{recipe.ingredients?.slice(0,3).join(', ')}{recipe.ingredients && recipe.ingredients.length>3 ? '...' : ''}</p>
                        <div className="mt-auto d-flex gap-2">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => handleDelete(recipe._id)}
                            disabled={deletingId === recipe._id}
                          >
                            {deletingId === recipe._id ? (
                              <>
                                <span className="spinner-border spinner-border-sm me-1" aria-hidden="true"></span>
                                Deleting...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-trash me-1"></i> Delete
                              </>
                            )}
                          </button>
                          <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={() => {
                              // open modal with recipe details
                              // reuse existing modal shape from Home (map to expected fields)
                              const modalRecipe = {
                                idMeal: recipe._id,
                                strMeal: recipe.name,
                                strMealThumb: recipe.image_url,
                                strInstructions: recipe.instructions,
                                strCategory: 'Vegetarian',
                                // map ingredients to numbered fields used by RecipeModal
                                ...Object.fromEntries((recipe.ingredients || []).map((ing, i) => [`strIngredient${i+1}`, ing]))
                              };
                              // navigate to Home and pass recipe in location state so Home opens the modal
                              navigate('/', { state: { openRecipe: modalRecipe } });
                            }}
                          >
                            <i className="fas fa-eye me-1"></i> View
                          </button>
                        </div>
                      </div>
                      <div className="card-footer">
                        <small className="text-muted">Submitted by You</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
};

export default SubmitRecipe;