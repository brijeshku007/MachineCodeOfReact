import React, { createContext, useContext, useState, useEffect } from 'react';

/**
 * User Context - Authentication and User Management
 * 
 * This demonstrates more complex context usage:
 * 1. Authentication state
 * 2. User profile management
 * 3. Persistent storage
 * 4. Loading states
 */

// Create User Context
export const UserContext = createContext();

// User Provider Component
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [preferences, setPreferences] = useState({
    notifications: true,
    darkMode: false,
    language: 'en'
  });

  // Load user data on mount
  useEffect(() => {
    const loadUserData = () => {
      try {
        const savedUser = localStorage.getItem('user');
        const savedPreferences = localStorage.getItem('userPreferences');
        
        if (savedUser) {
          const userData = JSON.parse(savedUser);
          setUser(userData);
          setIsAuthenticated(true);
        }
        
        if (savedPreferences) {
          setPreferences(JSON.parse(savedPreferences));
        }
      } catch (error) {
        console.error('Error loading user data:', error);
      } finally {
        setLoading(false);
      }
    };

    // Simulate loading delay
    setTimeout(loadUserData, 1000);
  }, []);

  // Save preferences to localStorage
  useEffect(() => {
    if (!loading) {
      localStorage.setItem('userPreferences', JSON.stringify(preferences));
    }
  }, [preferences, loading]);

  // Login function
  const login = async (email, password) => {
    setLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock authentication
      if (email && password) {
        const userData = {
          id: Date.now(),
          email,
          name: email.split('@')[0],
          avatar: `https://ui-avatars.com/api/?name=${email}&background=007bff&color=fff`,
          joinDate: new Date().toISOString(),
          role: 'user'
        };
        
        setUser(userData);
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(userData));
        
        return { success: true, message: 'Login successful!' };
      } else {
        throw new Error('Invalid credentials');
      }
    } catch (error) {
      return { success: false, message: error.message };
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('userPreferences');
  };

  // Update user profile
  const updateProfile = (updates) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
  };

  // Update preferences
  const updatePreferences = (newPreferences) => {
    setPreferences(prev => ({ ...prev, ...newPreferences }));
  };

  // Toggle preference
  const togglePreference = (key) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const contextValue = {
    // State
    user,
    isAuthenticated,
    loading,
    preferences,
    
    // Actions
    login,
    logout,
    updateProfile,
    updatePreferences,
    togglePreference,
    
    // Computed values
    isAdmin: user?.role === 'admin',
    userName: user?.name || 'Guest',
    userInitials: user?.name ? user.name.split(' ').map(n => n[0]).join('') : 'G'
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using User Context
export const useUser = () => {
  const context = useContext(UserContext);
  
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  
  return context;
};