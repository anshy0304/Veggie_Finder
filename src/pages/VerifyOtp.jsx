import { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { fetchJSON } from '../config/api';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { handleSuccessfulAuth } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email from the navigation state passed from the Signup page
  const email = location.state?.email;

  // If there's no email, the user shouldn't be here.
  if (!email) {
    return (
      <div className="container my-5 text-center">
        <h2>Something went wrong.</h2>
        <p>No email address was provided for verification.</p>
        <Link to="/signup">Go back to Sign Up</Link>
      </div>
    );
  }

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      const data = await fetchJSON('/api/auth/verify-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      // On success, the backend sends user/token. The context handles the login.
      handleSuccessfulAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Verification failed. Please try again.');
    }
    setLoading(false);
  };

  const handleResendOtp = async () => {
    setError('');
    setMessage('Sending...');
    try {
        const data = await fetchJSON('/api/auth/resend-otp', {
            method: 'POST',
            body: JSON.stringify({ email })
        });
        setMessage(data.message);
    } catch (err) {
        setError(err.message || "Failed to resend OTP.");
        setMessage(''); // Clear the "Sending..." message on error
    }
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold">Verify Your Account</h2>
              <p className="text-center text-muted mb-4">
                An OTP has been sent to <strong>{email}</strong>. Please enter it below.
              </p>

              {error && <div className="alert alert-danger">{error}</div>}
              {message && <div className="alert alert-info">{message}</div>}

              <form onSubmit={handleVerifySubmit}>
                <div className="mb-4">
                  <label htmlFor="otp" className="form-label">Verification Code (OTP)</label>
                  <input
                    type="text"
                    className="form-control"
                    id="otp"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    placeholder="Enter the 6-digit code"
                    maxLength="6"
                  />
                </div>

                <button type="submit" className="btn btn-primary w-100 mb-3" disabled={loading}>
                  {loading ? 'Verifying...' : 'Verify & Sign In'}
                </button>
              </form>

              <div className="text-center mt-3">
                <p className="text-muted mb-0">
                  Didn't receive the code?{' '}
                  <button className="btn btn-link p-0" onClick={handleResendOtp}>
                    Resend OTP
                  </button>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtp;