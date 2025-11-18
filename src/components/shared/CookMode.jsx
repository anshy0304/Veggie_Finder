import { useState, useEffect } from 'react';

const CookMode = ({ isActive, onClose, instructions }) => {
  const [steps, setSteps] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [wakeLock, setWakeLock] = useState(null);

  useEffect(() => {
    if (isActive && instructions) {
      const parsedSteps = instructions
        .split('\n')
        .filter(step => step.trim() && !step.trim().match(/^STEP \d+$/));
      setSteps(parsedSteps);
      setCurrentStep(0);

      if ('wakeLock' in navigator) {
        navigator.wakeLock.request('screen')
          .then(lock => setWakeLock(lock))
          .catch(err => console.error(`${err.name}, ${err.message}`));
      }
    }

    return () => {
      if (wakeLock) {
        wakeLock.release().then(() => setWakeLock(null));
      }
    };
  }, [isActive, instructions]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  if (!isActive) return null;

  return (
    <div id="cook-mode-view" className={isActive ? 'active' : ''}>
      <button
        id="cook-mode-close-btn"
        className="btn-close"
        aria-label="Close Cook Mode"
        onClick={onClose}
      ></button>
      <div className="cook-mode-content">
        <div id="cook-mode-step-counter">
          Step {currentStep + 1} / {steps.length}
        </div>
        <p id="cook-mode-step-text" className="step-text">
          {steps[currentStep]}
        </p>
      </div>
      <div className="cook-mode-nav">
        <button
          id="cook-mode-prev-btn"
          className="btn btn-lg cook-mode-nav-btn"
          onClick={handlePrev}
          disabled={currentStep === 0}
        >
          <i className="fas fa-arrow-left me-2"></i> Previous
        </button>
        <button
          id="cook-mode-next-btn"
          className="btn btn-lg cook-mode-nav-btn"
          onClick={handleNext}
          disabled={currentStep === steps.length - 1}
        >
          Next <i className="fas fa-arrow-right ms-2"></i>
        </button>
      </div>
    </div>
  );
};

export default CookMode;
