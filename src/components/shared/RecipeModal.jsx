import { useEffect, useState } from 'react';

const RecipeModal = ({ show, onHide, recipe, onStartCookMode }) => {
  const [ingredients, setIngredients] = useState([]);

  useEffect(() => {
    if (recipe) {
      const ing = [];
      for (let i = 1; i <= 20; i++) {
        const ingredient = recipe[`strIngredient${i}`];
        const measure = recipe[`strMeasure${i}`];
        if (ingredient && ingredient.trim()) {
          ing.push(`${measure} ${ingredient}`);
        }
      }
      setIngredients(ing);
    }
  }, [recipe]);

  useEffect(() => {
    // Avoid relying on Bootstrap's window.bootstrap (may be undefined).
    // Instead control modal visibility via React using the `show` prop.
    // Keep a small effect to lock/unlock body scroll when modal is open.
    if (show) {
      // prevent background scroll when modal is open
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [show, onHide]);

  if (!recipe) return null;

  // Render modal markup but control visibility via `show` prop.
  // We avoid using Bootstrap JS and instead toggle classes/styles from React.
  return (
    <>
      <div
        className={`modal fade ${show ? 'show d-block' : ''}`}
        id="recipeModal"
        tabIndex="-1"
        role="dialog"
        aria-hidden={!show}
        style={show ? { backgroundColor: 'rgba(0,0,0,0.4)' } : {}}
      >
        <div className="modal-dialog modal-lg modal-dialog-scrollable">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{recipe.strMeal}</h5>
              <button type="button" className="btn-close" aria-label="Close" onClick={onHide}></button>
            </div>
          <div className="modal-body">
            <img src={recipe.strMealThumb} className="img-fluid rounded mb-4" alt={recipe.strMeal} />

            <div className="d-flex gap-2 mb-4">
              <button
                className="btn btn-primary"
                onClick={() => onStartCookMode(recipe.strInstructions)}
                data-bs-dismiss="modal"
              >
                <i className="fas fa-utensils me-2"></i>Cook Mode
              </button>
            </div>

            <div className="row g-4">
              <div className="col-md-5">
                <h4>Ingredients</h4>
                <ul className="list-unstyled lh-lg">
                  {ingredients.map((ing, idx) => (
                    <li key={idx}>{ing}</li>
                  ))}
                </ul>
              </div>
              <div className="col-md-7">
                <h4>Instructions</h4>
                <p style={{ whiteSpace: 'pre-wrap' }}>{recipe.strInstructions}</p>
              </div>
            </div>

            {recipe.strYoutube && (
              <>
                <hr className="my-4" />
                <div className="text-center">
                  <h4>Video Tutorial</h4>
                  <a href={recipe.strYoutube} target="_blank" rel="noopener noreferrer" className="btn btn-danger mt-2">
                    <i className="fab fa-youtube me-2"></i>Watch on YouTube
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      </div>
      {/* Backdrop element when modal is shown */}
      {show && <div className="modal-backdrop fade show" />}
    </>
  );
};

export default RecipeModal;
