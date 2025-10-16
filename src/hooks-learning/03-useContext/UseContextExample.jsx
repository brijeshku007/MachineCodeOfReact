import React, { useContext } from 'react';
import { ThemeProvider, useTheme } from './ThemeContext';
import { UserProvider, useUser } from './UserContext';

/**
 * useContext Hook - Complete Learning Example
 * 
 * useContext allows you to consume context values without nesting Consumer components.
 * It's perfect for sharing global state like themes, authentication, language settings.
 * 
 * Benefits:
 * - Avoid prop drilling
 * - Share global state
 * - Clean component tree
 * - Type-safe with TypeScript
 */

// Component that uses Theme Context
const ThemeControls = () => {
  const {
    theme,
    fontSize,
    language,
    currentTheme,
    currentFontSize,
    toggleTheme,
    updateFontSize,
    updateLanguage,
    availableThemes,
    availableFontSizes,
    availableLanguages
  } = useTheme();

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color,
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      fontSize: currentFontSize,
      marginBottom: '20px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white'
    },
    select: {
      padding: '5px',
      margin: '5px',
      borderRadius: '4px',
      border: `1px solid ${currentTheme.borderColor}`,
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color
    }
  };

  return (
    <div style={styles.container}>
      <h3>Theme Controls</h3>
      <p>Current theme: <strong>{theme}</strong></p>
      <p>Font size: <strong>{fontSize}</strong></p>
      <p>Language: <strong>{language}</strong></p>
      
      <div>
        <button style={styles.button} onClick={toggleTheme}>
          Toggle Theme ({availableThemes.join(' → ')})
        </button>
      </div>
      
      <div>
        <label>Font Size: </label>
        <select 
          style={styles.select}
          value={fontSize} 
          onChange={(e) => updateFontSize(e.target.value)}
        >
          {availableFontSizes.map(size => (
            <option key={size} value={size}>
              {size.charAt(0).toUpperCase() + size.slice(1)}
            </option>
          ))}
        </select>
      </div>
      
      <div>
        <label>Language: </label>
        <select 
          style={styles.select}
          value={language} 
          onChange={(e) => updateLanguage(e.target.value)}
        >
          {availableLanguages.map(lang => (
            <option key={lang} value={lang}>
              {lang.toUpperCase()}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

// Component that displays theme-aware content
const ThemedContent = () => {
  const { currentTheme, currentFontSize } = useTheme();
  
  const styles = {
    container: {
      padding: '20px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color,
      border: `2px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      fontSize: currentFontSize,
      marginBottom: '20px'
    }
  };

  return (
    <div style={styles.container}>
      <h3>Themed Content</h3>
      <p>This content automatically adapts to the current theme!</p>
      <p>Background, text color, and borders all change based on context.</p>
      <ul>
        <li>Dynamic styling based on context</li>
        <li>No prop drilling required</li>
        <li>Consistent theming across components</li>
      </ul>
    </div>
  );
};

// Login Form Component
const LoginForm = () => {
  const { login, loading } = useUser();
  const { currentTheme } = useTheme();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    setMessage(result.message);
    
    if (result.success) {
      setEmail('');
      setPassword('');
    }
  };

  const styles = {
    form: {
      padding: '20px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color,
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      marginBottom: '20px'
    },
    input: {
      padding: '8px',
      margin: '5px 0',
      width: '200px',
      borderRadius: '4px',
      border: `1px solid ${currentTheme.borderColor}`,
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color
    },
    button: {
      padding: '10px 20px',
      margin: '10px 0',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#28a745',
      color: 'white'
    }
  };

  return (
    <form style={styles.form} onSubmit={handleSubmit}>
      <h3>Login Form</h3>
      <div>
        <input
          style={styles.input}
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div>
        <input
          style={styles.input}
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
      </div>
      <button style={styles.button} type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      {message && (
        <div style={{ marginTop: '10px', color: message.includes('successful') ? '#28a745' : '#dc3545' }}>
          {message}
        </div>
      )}
      <p style={{ fontSize: '12px', color: '#666' }}>
        Use any email and password to login
      </p>
    </form>
  );
};

// User Profile Component
const UserProfile = () => {
  const { 
    user, 
    isAuthenticated, 
    logout, 
    updateProfile, 
    preferences, 
    togglePreference,
    userName,
    userInitials
  } = useUser();
  const { currentTheme } = useTheme();

  const [isEditing, setIsEditing] = React.useState(false);
  const [editName, setEditName] = React.useState(user?.name || '');

  const handleUpdateProfile = () => {
    updateProfile({ name: editName });
    setIsEditing(false);
  };

  const styles = {
    container: {
      padding: '20px',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color,
      border: `1px solid ${currentTheme.borderColor}`,
      borderRadius: '8px',
      marginBottom: '20px'
    },
    avatar: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      backgroundColor: '#007bff',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '24px',
      fontWeight: 'bold',
      marginBottom: '10px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white'
    },
    input: {
      padding: '8px',
      margin: '5px',
      borderRadius: '4px',
      border: `1px solid ${currentTheme.borderColor}`,
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color
    },
    checkbox: {
      margin: '5px'
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div style={styles.container}>
      <h3>User Profile</h3>
      
      <div style={styles.avatar}>
        {userInitials}
      </div>
      
      <div>
        <strong>Name:</strong> 
        {isEditing ? (
          <span>
            <input
              style={styles.input}
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
            <button style={styles.button} onClick={handleUpdateProfile}>
              Save
            </button>
            <button style={styles.button} onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </span>
        ) : (
          <span>
            {userName}
            <button style={styles.button} onClick={() => setIsEditing(true)}>
              Edit
            </button>
          </span>
        )}
      </div>
      
      <div><strong>Email:</strong> {user.email}</div>
      <div><strong>Member since:</strong> {new Date(user.joinDate).toLocaleDateString()}</div>
      
      <h4>Preferences</h4>
      <div>
        <label>
          <input
            style={styles.checkbox}
            type="checkbox"
            checked={preferences.notifications}
            onChange={() => togglePreference('notifications')}
          />
          Enable notifications
        </label>
      </div>
      <div>
        <label>
          <input
            style={styles.checkbox}
            type="checkbox"
            checked={preferences.darkMode}
            onChange={() => togglePreference('darkMode')}
          />
          Dark mode
        </label>
      </div>
      
      <button 
        style={{...styles.button, backgroundColor: '#dc3545'}} 
        onClick={logout}
      >
        Logout
      </button>
    </div>
  );
};

// Main component that demonstrates useContext
const UseContextExample = () => {
  const { currentTheme } = useTheme();
  const { isAuthenticated, loading } = useUser();

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '900px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: currentTheme.backgroundColor,
      color: currentTheme.color,
      minHeight: '100vh'
    },
    title: {
      borderBottom: `2px solid #007bff`,
      paddingBottom: '10px',
      marginBottom: '30px'
    },
    section: {
      marginBottom: '30px'
    },
    loadingContainer: {
      textAlign: 'center',
      padding: '50px'
    }
  };

  if (loading) {
    return (
      <div style={styles.loadingContainer}>
        <h2>Loading user data...</h2>
        <p>Please wait while we initialize the application.</p>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useContext Hook - Complete Example</h1>
      
      <div style={styles.section}>
        <h2>🎨 Theme Management</h2>
        <ThemeControls />
        <ThemedContent />
      </div>
      
      <div style={styles.section}>
        <h2>👤 User Authentication</h2>
        {!isAuthenticated ? (
          <LoginForm />
        ) : (
          <UserProfile />
        )}
      </div>
      
      <div style={styles.section}>
        <h2>🎓 Key useContext Concepts</h2>
        <div style={{
          padding: '20px',
          backgroundColor: currentTheme.backgroundColor,
          border: `1px solid ${currentTheme.borderColor}`,
          borderRadius: '8px'
        }}>
          <h3>What you've learned:</h3>
          <ul>
            <li><strong>Context Creation:</strong> Using createContext() to create shared state</li>
            <li><strong>Provider Pattern:</strong> Wrapping components with context providers</li>
            <li><strong>Context Consumption:</strong> Using useContext() to access context values</li>
            <li><strong>Custom Hooks:</strong> Creating useTheme() and useUser() for cleaner API</li>
            <li><strong>Multiple Contexts:</strong> Using multiple contexts together</li>
            <li><strong>Context Updates:</strong> How context changes trigger re-renders</li>
            <li><strong>Error Boundaries:</strong> Proper error handling for missing providers</li>
          </ul>
          
          <h3>Best Practices Demonstrated:</h3>
          <ul>
            <li>✅ Custom hooks for context consumption</li>
            <li>✅ Error handling for missing providers</li>
            <li>✅ Separating concerns (theme vs user context)</li>
            <li>✅ Persistent storage integration</li>
            <li>✅ Loading states management</li>
            <li>✅ Type-safe context usage patterns</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

// Wrapper component with providers
const UseContextExampleWithProviders = () => {
  return (
    <ThemeProvider>
      <UserProvider>
        <UseContextExample />
      </UserProvider>
    </ThemeProvider>
  );
};

export default UseContextExampleWithProviders;