# 🛡️ Route Guards & Authentication - Protecting Your Routes

## 🎯 What Are Route Guards?

Route guards are mechanisms that control access to routes based on certain conditions like authentication status, user roles, or permissions. They act as gatekeepers, deciding whether a user can access a particular route or should be redirected elsewhere.

## 🔐 Why Route Guards Are Essential

### **Security Benefits:**
- **Protect sensitive pages** from unauthorized access
- **Prevent data breaches** by controlling route access
- **Implement role-based access control** (RBAC)
- **Handle authentication flows** seamlessly

### **User Experience Benefits:**
- **Smooth login/logout flows** with proper redirects
- **Preserve intended destinations** after login
- **Show appropriate content** based on user status
- **Handle loading states** during authentication checks

## 🧩 Types of Route Protection

### **1. Authentication Guards**
Protect routes that require user login.

```jsx
// Basic authentication guard
function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    // Redirect to login with return URL
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  return children;
}

// Usage
<Route path="/dashboard" element={
  <RequireAuth>
    <Dashboard />
  </RequireAuth>
} />
```

### **2. Role-Based Guards**
Protect routes based on user roles or permissions.

```jsx
function RequireRole({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) return <div>Loading...</div>;
  
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  
  return children;
}

// Usage
<Route path="/admin" element={
  <RequireRole allowedRoles={['admin', 'moderator']}>
    <AdminPanel />
  </RequireRole>
} />
```

### **3. Guest Guards**
Redirect authenticated users away from auth pages.

```jsx
function RequireGuest({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  
  if (user) {
    // Redirect authenticated users to dashboard
    return <Navigate to="/dashboard" replace />;
  }
  
  return children;
}

// Usage
<Route path="/login" element={
  <RequireGuest>
    <LoginPage />
  </RequireGuest>
} />
```

## 🔑 Authentication Context Setup

### **Authentication Context:**
```jsx
import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Check for existing session on app start
    checkAuthStatus();
  }, []);
  
  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (token) {
        const userData = await validateToken(token);
        setUser(userData);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('authToken');
    } finally {
      setLoading(false);
    }
  };
  
  const login = async (credentials) => {
    try {
      const response = await loginAPI(credentials);
      const { user, token } = response;
      
      localStorage.setItem('authToken', token);
      setUser(user);
      
      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  const logout = () => {
    localStorage.removeItem('authToken');
    setUser(null);
  };
  
  const updateUser = (userData) => {
    setUser(prev => ({ ...prev, ...userData }));
  };
  
  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isModerator: user?.role === 'moderator' || user?.role === 'admin'
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
```

## 🛡️ Advanced Route Guard Patterns

### **1. Conditional Route Guards:**
```jsx
function ConditionalGuard({ children, condition, fallback, redirectTo }) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!condition && redirectTo) {
      navigate(redirectTo, { replace: true });
    }
  }, [condition, redirectTo, navigate]);
  
  if (!condition) {
    return fallback || <div>Access Denied</div>;
  }
  
  return children;
}

// Usage
<Route path="/premium" element={
  <ConditionalGuard 
    condition={user?.isPremium}
    redirectTo="/upgrade"
    fallback={<UpgradePrompt />}
  >
    <PremiumContent />
  </ConditionalGuard>
} />
```

### **2. Multi-Level Permission Guards:**
```jsx
function PermissionGuard({ children, permissions, requireAll = false }) {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const userPermissions = user.permissions || [];
  
  const hasPermission = requireAll
    ? permissions.every(p => userPermissions.includes(p))
    : permissions.some(p => userPermissions.includes(p));
  
  if (!hasPermission) {
    return (
      <div className="permission-denied">
        <h2>Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <Link to="/dashboard">Go to Dashboard</Link>
      </div>
    );
  }
  
  return children;
}

// Usage
<Route path="/users/manage" element={
  <PermissionGuard permissions={['user.read', 'user.write']} requireAll>
    <UserManagement />
  </PermissionGuard>
} />
```

### **3. Time-Based Guards:**
```jsx
function TimeBasedGuard({ children, allowedHours, timezone = 'UTC' }) {
  const [isAllowed, setIsAllowed] = useState(false);
  
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const allowed = allowedHours.includes(currentHour);
      setIsAllowed(allowed);
    };
    
    checkTime();
    const interval = setInterval(checkTime, 60000); // Check every minute
    
    return () => clearInterval(interval);
  }, [allowedHours]);
  
  if (!isAllowed) {
    return (
      <div className="time-restricted">
        <h2>Access Restricted</h2>
        <p>This page is only available during business hours (9 AM - 5 PM).</p>
      </div>
    );
  }
  
  return children;
}
```

## 🔄 Authentication Flow Patterns

### **1. Login with Redirect:**
```jsx
function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Get the intended destination
  const from = location.state?.from?.pathname || '/dashboard';
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    const result = await login(credentials);
    
    if (result.success) {
      // Redirect to intended destination
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }
    
    setLoading(false);
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <h1>Login</h1>
      
      {error && <div className="error">{error}</div>}
      
      <input
        type="email"
        placeholder="Email"
        value={credentials.email}
        onChange={(e) => setCredentials({...credentials, email: e.target.value})}
        required
      />
      
      <input
        type="password"
        placeholder="Password"
        value={credentials.password}
        onChange={(e) => setCredentials({...credentials, password: e.target.value})}
        required
      />
      
      <button type="submit" disabled={loading}>
        {loading ? 'Logging in...' : 'Login'}
      </button>
      
      <p>Trying to access: {from}</p>
    </form>
  );
}
```

### **2. Logout with Cleanup:**
```jsx
function useLogout() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    // Clear user data
    logout();
    
    // Clear any cached data
    localStorage.removeItem('userPreferences');
    sessionStorage.clear();
    
    // Redirect to login
    navigate('/login', { replace: true });
  };
  
  return handleLogout;
}

// Usage in component
function Header() {
  const { user } = useAuth();
  const handleLogout = useLogout();
  
  return (
    <header>
      <span>Welcome, {user.name}</span>
      <button onClick={handleLogout}>Logout</button>
    </header>
  );
}
```

### **3. Auto-Logout on Token Expiry:**
```jsx
function useTokenExpiry() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    const checkTokenExpiry = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (payload.exp < currentTime) {
            logout();
            navigate('/login', { 
              state: { message: 'Session expired. Please login again.' },
              replace: true 
            });
          }
        } catch (error) {
          console.error('Token validation error:', error);
          logout();
        }
      }
    };
    
    // Check immediately and then every minute
    checkTokenExpiry();
    const interval = setInterval(checkTokenExpiry, 60000);
    
    return () => clearInterval(interval);
  }, [logout, navigate]);
}
```

## 🎨 Route Guard Components

### **1. Protected Route Wrapper:**
```jsx
function ProtectedRoute({ 
  children, 
  requireAuth = true, 
  allowedRoles = [], 
  permissions = [],
  fallback = null 
}) {
  const { user, loading } = useAuth();
  const location = useLocation();
  
  if (loading) {
    return <div className="loading">Checking authentication...</div>;
  }
  
  // Check authentication
  if (requireAuth && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // Check roles
  if (allowedRoles.length > 0 && !allowedRoles.includes(user?.role)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }
  
  // Check permissions
  if (permissions.length > 0) {
    const userPermissions = user?.permissions || [];
    const hasPermission = permissions.some(p => userPermissions.includes(p));
    
    if (!hasPermission) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }
  
  return children;
}

// Usage
<Route path="/admin/*" element={
  <ProtectedRoute 
    allowedRoles={['admin']}
    fallback={<AccessDenied />}
  >
    <AdminRoutes />
  </ProtectedRoute>
} />
```

### **2. Route-Level Guards:**
```jsx
function createGuardedRoute(Component, guards = []) {
  return function GuardedComponent(props) {
    for (const Guard of guards) {
      const result = Guard(props);
      if (result !== true) {
        return result; // Return the guard's fallback component
      }
    }
    
    return <Component {...props} />;
  };
}

// Guard functions
const authGuard = ({ user }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  return true;
};

const adminGuard = ({ user }) => {
  if (user?.role !== 'admin') {
    return <Navigate to="/unauthorized" replace />;
  }
  return true;
};

// Usage
const GuardedAdminPanel = createGuardedRoute(AdminPanel, [authGuard, adminGuard]);

<Route path="/admin" element={<GuardedAdminPanel />} />
```

## 🔒 Advanced Authentication Patterns

### **1. Multi-Factor Authentication:**
```jsx
function MFAGuard({ children }) {
  const { user } = useAuth();
  const [mfaVerified, setMfaVerified] = useState(false);
  
  useEffect(() => {
    if (user?.mfaEnabled && !user?.mfaVerified) {
      // Redirect to MFA verification
      navigate('/mfa-verify');
    } else {
      setMfaVerified(true);
    }
  }, [user]);
  
  if (user?.mfaEnabled && !mfaVerified) {
    return <MFAVerification onVerified={() => setMfaVerified(true)} />;
  }
  
  return children;
}
```

### **2. Session Management:**
```jsx
function useSessionManagement() {
  const { user, logout } = useAuth();
  
  useEffect(() => {
    if (!user) return;
    
    let lastActivity = Date.now();
    const TIMEOUT = 30 * 60 * 1000; // 30 minutes
    
    const updateActivity = () => {
      lastActivity = Date.now();
    };
    
    const checkInactivity = () => {
      if (Date.now() - lastActivity > TIMEOUT) {
        logout();
        alert('Session expired due to inactivity');
      }
    };
    
    // Track user activity
    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    events.forEach(event => {
      document.addEventListener(event, updateActivity, true);
    });
    
    // Check inactivity every minute
    const interval = setInterval(checkInactivity, 60000);
    
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, updateActivity, true);
      });
      clearInterval(interval);
    };
  }, [user, logout]);
}
```

### **3. Progressive Authentication:**
```jsx
function ProgressiveAuthGuard({ children, requiredLevel = 1 }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const authLevel = user?.authLevel || 0;
  
  if (authLevel < requiredLevel) {
    const nextStep = getNextAuthStep(authLevel, requiredLevel);
    navigate(`/auth/${nextStep}`, { 
      state: { returnTo: location.pathname, requiredLevel }
    });
    return null;
  }
  
  return children;
}

function getNextAuthStep(current, required) {
  if (current < 1) return 'login';
  if (current < 2 && required >= 2) return 'verify-email';
  if (current < 3 && required >= 3) return 'setup-mfa';
  return 'complete';
}
```

## 🎯 Best Practices

### **1. Centralized Route Configuration:**
```jsx
// routes.config.js
export const routeConfig = [
  {
    path: '/',
    element: HomePage,
    public: true
  },
  {
    path: '/dashboard',
    element: Dashboard,
    requireAuth: true
  },
  {
    path: '/admin',
    element: AdminPanel,
    requireAuth: true,
    allowedRoles: ['admin'],
    permissions: ['admin.access']
  },
  {
    path: '/profile',
    element: Profile,
    requireAuth: true,
    authLevel: 2 // Requires email verification
  }
];

// Route generator
function generateRoutes(config) {
  return config.map(route => {
    let element = <route.element />;
    
    if (!route.public) {
      element = (
        <ProtectedRoute
          requireAuth={route.requireAuth}
          allowedRoles={route.allowedRoles}
          permissions={route.permissions}
          authLevel={route.authLevel}
        >
          {element}
        </ProtectedRoute>
      );
    }
    
    return <Route key={route.path} path={route.path} element={element} />;
  });
}
```

### **2. Error Boundaries for Auth:**
```jsx
class AuthErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    if (error.message.includes('auth') || error.status === 401) {
      // Handle auth errors
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="auth-error">
          <h2>Authentication Error</h2>
          <p>Please try logging in again.</p>
          <button onClick={() => window.location.href = '/login'}>
            Go to Login
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

### **3. Loading States:**
```jsx
function AuthLoadingWrapper({ children }) {
  const { loading } = useAuth();
  
  if (loading) {
    return (
      <div className="auth-loading">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }
  
  return children;
}
```

## ⚠️ Common Security Considerations

### **1. Token Storage:**
```jsx
// ❌ Don't store sensitive tokens in localStorage for XSS protection
localStorage.setItem('authToken', token);

// ✅ Use httpOnly cookies when possible
// Or implement secure token refresh patterns
const useSecureAuth = () => {
  const [accessToken, setAccessToken] = useState(null);
  
  const refreshToken = async () => {
    try {
      const response = await fetch('/api/refresh', {
        method: 'POST',
        credentials: 'include' // Include httpOnly refresh cookie
      });
      
      const { accessToken } = await response.json();
      setAccessToken(accessToken);
      
      return accessToken;
    } catch (error) {
      // Redirect to login
      window.location.href = '/login';
    }
  };
  
  return { accessToken, refreshToken };
};
```

### **2. Route Protection Validation:**
```jsx
// ✅ Always validate on the server side too
function SecureRoute({ children }) {
  const { user } = useAuth();
  const [serverValidated, setServerValidated] = useState(false);
  
  useEffect(() => {
    // Validate with server
    validateUserAccess()
      .then(setServerValidated)
      .catch(() => {
        // Server says no access
        navigate('/unauthorized');
      });
  }, []);
  
  if (!serverValidated) {
    return <div>Validating access...</div>;
  }
  
  return children;
}
```

## 🎉 What You've Mastered

After completing route guards, you can:

- ✅ Implement authentication-based route protection
- ✅ Create role-based access control systems
- ✅ Handle login/logout flows with proper redirects
- ✅ Build progressive authentication systems
- ✅ Manage user sessions and token expiry
- ✅ Create secure, production-ready applications

## 🚀 What's Next?

Now that you understand route guards, you're ready for:

1. **Advanced Routing** → `07-advanced-routing` - Complex patterns and optimization
2. **Data Loading** → `08-data-loading` - Route-based data fetching
3. **Performance** → `09-route-optimization` - Optimization techniques

---

**🎉 Your applications are now secure and user-friendly!**

**Next:** `07-advanced-routing/advanced-routing-concepts.md`