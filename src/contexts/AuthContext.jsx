import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { fetchJSON } from '../config/api.js';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // This function runs on initial app load to check for an existing session
  const fetchUser = useCallback(async () => {
    if (token) {
      try {
        // Decode token payload to get basic user info without an API call
        const decoded = JSON.parse(atob(token.split('.')[1] || '"{}"'));
        if (decoded.id && decoded.email) {
            setUser({ id: decoded.id, email: decoded.email });
        } else {
            throw new Error('Invalid token structure');
        }
      } catch (e) {
        console.error('Invalid token, signing out.', e);
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
      }
    }
    setLoading(false);
  }, [token]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  // A single, reusable function to handle the state changes after a successful login/verification
  const handleSuccessfulAuth = (data) => {
    if (data.token && data.user) {
      localStorage.setItem('token', data.token);
      setToken(data.token);
      setUser(data.user);
    }
  };

  // The new signUp function. It calls the API but does NOT log the user in.
  // It returns the response for the component to handle navigation.
  const signUp = async (email, password) => {
    try {
      const data = await fetchJSON('/api/auth/signup', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      return { data };
    } catch (error) {
      return { error };
    }
  };

  // The password-based signIn function.
  const signIn = async (email, password) => {
    try {
      const data = await fetchJSON('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });
      // On success, update the state and local storage
      handleSuccessfulAuth(data);
      return { data };
    } catch (error) {
      // Pass the error back to the component, which might contain the 'notVerified' flag
      return { error };
    }
  };

  // The signOut function remains the same.
  const signOut = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // The value provided to all components that use this context
  const value = {
    user,
    token,
    loading,
    handleSuccessfulAuth, // Exported for use in VerifyOtp.jsx and Login.jsx
    signUp,
    signIn,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};