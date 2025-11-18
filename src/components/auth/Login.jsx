import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { fetchJSON } from '../../config/api';

const Login = () => {
  const [mode, setMode] = useState('password'); // 'password' or 'otp'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { signIn, handleSuccessfulAuth } = useAuth();
  const navigate = useNavigate();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    const { error } = await signIn(email, password);
    if (error) {
      if (error.notVerified) {
        setError(<span>Account not verified. <Link to="/verify-otp" state={{ email }}>Click here to verify.</Link></span>);
      } else {
        setError(error.message || 'Login failed');
      }
    } else {
      navigate('/');
    }
    setLoading(false);
  };

  const handleSendLoginOtp = async () => {
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await fetchJSON('/api/auth/send-login-otp', {
        method: 'POST',
        body: JSON.stringify({ email }),
      });
      setMessage(data.message);
      setOtpSent(true);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const handleOtpLoginSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);
    try {
      const data = await fetchJSON('/api/auth/login-with-otp', {
        method: 'POST',
        body: JSON.stringify({ email, otp }),
      });
      handleSuccessfulAuth(data);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="container my-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header bg-transparent border-0">
                <ul className="nav nav-tabs card-header-tabs">
                    <li className="nav-item w-50 text-center">
                        <button className={`nav-link w-100 ${mode === 'password' ? 'active' : ''}`} onClick={() => setMode('password')}>Password</button>
                    </li>
                    <li className="nav-item w-50 text-center">
                        <button className={`nav-link w-100 ${mode === 'otp' ? 'active' : ''}`} onClick={() => setMode('otp')}>OTP</button>
                    </li>
                </ul>
            </div>
            <div className="card-body p-5">
              <h2 className="text-center mb-4 fw-bold">Welcome Back</h2>
              {error && <div className="alert alert-danger" role="alert">{error}</div>}
              {message && <div className="alert alert-info">{message}</div>}

              {/* ----- PASSWORD LOGIN FORM ----- */}
              {mode === 'password' && (
                <form onSubmit={handlePasswordSubmit}>
                  <div className="mb-3"><label htmlFor="email" className="form-label">Email Address</label><input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                  <div className="mb-4"><label htmlFor="password" className="form-label">Password</label><input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                  <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
                </form>
              )}

              {/* ----- OTP LOGIN FORM ----- */}
              {mode === 'otp' && (
                <div>
                  <div className="mb-3"><label htmlFor="email-otp" className="form-label">Email Address</label><input type="email" id="email-otp" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} required disabled={otpSent}/></div>
                  {!otpSent ? (
                    <button className="btn btn-secondary w-100" onClick={handleSendLoginOtp} disabled={loading || !email}>{loading ? 'Sending...' : 'Send OTP'}</button>
                  ) : (
                    <form onSubmit={handleOtpLoginSubmit}>
                      <div className="mb-4"><label htmlFor="otp" className="form-label">OTP</label><input type="text" id="otp" className="form-control" value={otp} onChange={(e) => setOtp(e.target.value)} required placeholder="Enter 6-digit OTP"/></div>
                      <button type="submit" className="btn btn-primary w-100" disabled={loading}>{loading ? 'Signing In...' : 'Sign In with OTP'}</button>
                    </form>
                  )}
                </div>
              )}
              
              <div className="text-center mt-3"><p className="text-muted mb-0">Don't have an account? <Link to="/signup" className="text-primary fw-bold">Sign Up</Link></p></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;