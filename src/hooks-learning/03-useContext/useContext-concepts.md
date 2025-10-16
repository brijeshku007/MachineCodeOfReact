# useContext Hook - Deep Dive Concepts

## 🌐 What is useContext?

useContext is React's solution to **prop drilling** - the problem of passing props through multiple component levels just to reach a deeply nested component.

### The Problem: Prop Drilling
```javascript
// ❌ Prop drilling - passing props through multiple levels
function App() {
  const [user, setUser] = useState({ name: 'John' });
  return <Header user={user} setUser={setUser} />;
}

function Header({ user, setUser }) {
  return <Navigation user={user} setUser={setUser} />;
}

function Navigation({ user, setUser }) {
  return <UserMenu user={user} setUser={setUser} />;
}

function UserMenu({ user, setUser }) {
  return <div>Welcome, {user.name}!</div>;
}
```

### The Solution: Context API
```javascript
// ✅ Context API - direct access to shared state
const UserContext = createContext();

function App() {
  const [user, setUser] = useState({ name: 'John' });
  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Header />
    </UserContext.Provider>
  );
}

function UserMenu() {
  const { user } = useContext(UserContext);
  return <div>Welcome, {user.name}!</div>;
}
```

---

## 🏗️ Context API Architecture

### 1. **Create Context**
```javascript
import { createContext } from 'react';

// Create context with default value
const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});
```

### 2. **Create Provider Component**
```javascript
export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');
  
  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };
  
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};
```

### 3. **Consume Context with useContext**
```javascript
function ThemedButton() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  
  return (
    <button 
      style={{ 
        backgroundColor: theme === 'light' ? '#fff' : '#333',
        color: theme === 'light' ? '#333' : '#fff'
      }}
      onClick={toggleTheme}
    >
      Toggle Theme
    </button>
  );
}
```

### 4. **Wrap App with Provider**
```javascript
function App() {
  return (
    <ThemeProvider>
      <Header />
      <Main />
      <Footer />
    </ThemeProvider>
  );
}
```

---

## 🎯 When to Use Context

### ✅ **Good Use Cases:**
- **Theme/UI preferences** - Dark mode, language, font size
- **Authentication** - User login state, permissions
- **Global app state** - Shopping cart, notifications
- **Configuration** - API endpoints, feature flags
- **Deeply nested components** - Avoiding prop drilling

### ❌ **Avoid Context For:**
- **Frequently changing data** - Can cause performance issues
- **Local component state** - Use useState instead
- **Simple prop passing** - 1-2 levels deep is fine
- **Complex state logic** - Consider useReducer or state management libraries

---

## 🔧 Custom Hooks Pattern

### Why Custom Hooks?
- **Better API** - Cleaner component code
- **Error handling** - Catch missing provider errors
- **Type safety** - Better TypeScript support
- **Reusability** - Consistent usage across components

### Custom Hook Implementation
```javascript
// Create custom hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  
  return context;
};

// Usage in components
function MyComponent() {
  const { theme, toggleTheme } = useTheme(); // Clean and safe
  
  return (
    <div style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <button onClick={toggleTheme}>Toggle</button>
    </div>
  );
}
```

---

## 🚀 Advanced Context Patterns

### 1. **Multiple Contexts**
```javascript
// Separate concerns with multiple contexts
function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <LanguageProvider>
          <Router />
        </LanguageProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

// Use multiple contexts in one component
function Header() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage } = useLanguage();
  
  return (
    <header style={{ background: theme === 'light' ? '#fff' : '#333' }}>
      <span>{language === 'en' ? 'Welcome' : 'Bienvenido'} {user.name}</span>
      <button onClick={toggleTheme}>Toggle Theme</button>
      <button onClick={logout}>Logout</button>
    </header>
  );
}
```

### 2. **Context with useReducer**
```javascript
// Complex state management with useReducer
const initialState = {
  user: null,
  loading: false,
  error: null
};

function authReducer(state, action) {
  switch (action.type) {
    case 'LOGIN_START':
      return { ...state, loading: true, error: null };
    case 'LOGIN_SUCCESS':
      return { ...state, loading: false, user: action.payload };
    case 'LOGIN_ERROR':
      return { ...state, loading: false, error: action.payload };
    case 'LOGOUT':
      return { ...state, user: null };
    default:
      return state;
  }
}

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);
  
  const login = async (credentials) => {
    dispatch({ type: 'LOGIN_START' });
    try {
      const user = await api.login(credentials);
      dispatch({ type: 'LOGIN_SUCCESS', payload: user });
    } catch (error) {
      dispatch({ type: 'LOGIN_ERROR', payload: error.message });
    }
  };
  
  const logout = () => {
    dispatch({ type: 'LOGOUT' });
  };
  
  const value = {
    ...state,
    login,
    logout
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
```

### 3. **Context with Persistence**
```javascript
export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState(() => {
    // Load from localStorage on initialization
    const saved = localStorage.getItem('settings');
    return saved ? JSON.parse(saved) : defaultSettings;
  });
  
  // Save to localStorage whenever settings change
  useEffect(() => {
    localStorage.setItem('settings', JSON.stringify(settings));
  }, [settings]);
  
  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <SettingsContext.Provider value={{ settings, updateSetting }}>
      {children}
    </SettingsContext.Provider>
  );
};
```

---

## ⚡ Performance Considerations

### 1. **Context Value Optimization**
```javascript
// ❌ Bad - creates new object on every render
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// ✅ Good - memoize the context value
function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  
  const value = useMemo(() => ({
    theme,
    setTheme
  }), [theme]);
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
```

### 2. **Split Contexts for Performance**
```javascript
// ❌ Single context causes unnecessary re-renders
const AppContext = createContext();

// ✅ Split into separate contexts
const UserContext = createContext();
const ThemeContext = createContext();
const SettingsContext = createContext();

// Components only re-render when their specific context changes
```

### 3. **Selective Context Consumption**
```javascript
// ❌ Consumes entire context
const { user, theme, settings, notifications } = useAppContext();

// ✅ Only consume what you need
const { user } = useUser();
const { theme } = useTheme();
```

---

## 🐛 Common Pitfalls and Solutions

### 1. **Missing Provider Error**
```javascript
// ❌ Using context without provider
function MyComponent() {
  const context = useContext(MyContext); // Returns undefined
  return <div>{context.value}</div>; // Error!
}

// ✅ Proper error handling
export const useMyContext = () => {
  const context = useContext(MyContext);
  
  if (!context) {
    throw new Error('useMyContext must be used within MyProvider');
  }
  
  return context;
};
```

### 2. **Context Value Instability**
```javascript
// ❌ New object created on every render
function Provider({ children }) {
  const [state, setState] = useState(initial);
  
  return (
    <Context.Provider value={{ state, setState }}>
      {children}
    </Context.Provider>
  );
}

// ✅ Stable context value
function Provider({ children }) {
  const [state, setState] = useState(initial);
  
  const value = useMemo(() => ({ state, setState }), [state]);
  
  return (
    <Context.Provider value={value}>
      {children}
    </Context.Provider>
  );
}
```

### 3. **Overusing Context**
```javascript
// ❌ Context for everything
const AppContext = createContext();

// ✅ Use context judiciously
// - Local state for component-specific data
// - Props for parent-child communication
// - Context for truly global state
```

---

## 🎓 Best Practices Summary

### ✅ **DO:**
- Use custom hooks for context consumption
- Memoize context values to prevent unnecessary re-renders
- Split large contexts into smaller, focused ones
- Provide meaningful error messages for missing providers
- Use context for truly global state

### ❌ **DON'T:**
- Use context for frequently changing data
- Create new objects in context value on every render
- Use context when simple prop passing would suffice
- Forget to handle missing provider cases
- Put everything in one giant context

This comprehensive guide covers all the essential concepts of useContext and the Context API!