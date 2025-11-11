// 🛡️ Route Guards & Authentication - Complete Working Example
// This demonstrates comprehensive authentication and route protection patterns

import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, Navigate, useNavigate, useLocation } from 'react-router-dom';

// =============================================================================
// AUTHENTICATION CONTEXT & PROVIDER
// =============================================================================

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Mock users database
const MOCK_USERS = {
  'admin@example.com': {
    id: 1,
    email: 'admin@example.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
    permissions: ['user.read', 'user.write', 'admin.access', 'reports.view'],
    authLevel: 3, // Full authentication
    mfaEnabled: true,
    emailVerified: true
  },
  'manager@example.com': {
    id: 2,
    email: 'manager@example.com',
    password: 'manager123',
    name: 'Manager User',
    role: 'manager',
    permissions: ['user.read', 'reports.view'],
    authLevel: 2, // Email verified
    mfaEnabled: false,
    emailVerified: true
  },
  'user@example.com': {
    id: 3,
    email: 'user@example.com',
    password: 'user123',
    name: 'Regular User',
    role: 'user',
    permissions: ['profile.read', 'profile.write'],
    authLevel: 1, // Basic login
    mfaEnabled: false,
    emailVerified: false
  }
};

function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sessionExpiry, setSessionExpiry] = useState(null);

  useEffect(() => {
    // Check for existing session on app start
    checkAuthStatus();
  }, []);

  // Session management
  useEffect(() => {
    if (user && !sessionExpiry) {
      // Set session to expire in 30 minutes
      const expiry = Date.now() + (30 * 60 * 1000);
      setSessionExpiry(expiry);
    }
  }, [user, sessionExpiry]);

  // Check session expiry
  useEffect(() => {
    if (!sessionExpiry) return;

    const checkExpiry = () => {
      if (Date.now() > sessionExpiry) {
        logout();
        alert('Session expired. Please login again.');
      }
    };

    const interval = setInterval(checkExpiry, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [sessionExpiry]);

  const checkAuthStatus = async () => {
    try {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const user = JSON.parse(userData);
        setUser(user);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      localStorage.removeItem('currentUser');
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      const user = MOCK_USERS[credentials.email];

      if (!user || user.password !== credentials.password) {
        throw new Error('Invalid email or password');
      }

      // Store user data (in real app, store only token)
      localStorage.setItem('currentUser', JSON.stringify(user));
      setUser(user);
      setSessionExpiry(Date.now() + (30 * 60 * 1000));

      return { success: true, user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
    setSessionExpiry(null);
  };

  const updateUser = (userData) => {
    const updatedUser = { ...user, ...userData };
    setUser(updatedUser);
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  };

  const extendSession = () => {
    setSessionExpiry(Date.now() + (30 * 60 * 1000));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    extendSession,
    sessionExpiry,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isManager: user?.role === 'manager' || user?.role === 'admin',
    hasPermission: (permission) => user?.permissions?.includes(permission) || false,
    authLevel: user?.authLevel || 0
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// =============================================================================
// ROUTE GUARD COMPONENTS
// =============================================================================

// Basic Authentication Guard
function RequireAuth({ children, fallback = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="spinner"></div>
        <p>Checking authentication...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return fallback || children;
}

// Role-Based Guard
function RequireRole({ children, allowedRoles, fallback = null }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    return fallback || <Navigate to="/unauthorized" replace />;
  }

  return children;
}

// Permission-Based Guard
function RequirePermission({ children, permissions, requireAll = false, fallback = null }) {
  const { user, hasPermission } = useAuth();
  const location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const hasRequiredPermissions = requireAll
    ? permissions.every(p => hasPermission(p))
    : permissions.some(p => hasPermission(p));

  if (!hasRequiredPermissions) {
    return fallback || (
      <div className="permission-denied">
        <h2>🚫 Access Denied</h2>
        <p>You don't have permission to view this page.</p>
        <p>Required permissions: {permissions.join(', ')}</p>
        <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
      </div>
    );
  }

  return children;
}

// Authentication Level Guard
function RequireAuthLevel({ children, requiredLevel, fallback = null }) {
  const { user, authLevel } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (user && authLevel < requiredLevel) {
      const nextStep = getNextAuthStep(authLevel, requiredLevel);
      navigate(`/auth/${nextStep}`, {
        state: { returnTo: location.pathname, requiredLevel }
      });
    }
  }, [user, authLevel, requiredLevel, navigate, location.pathname]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (authLevel < requiredLevel) {
    return fallback || <div>Redirecting to complete authentication...</div>;
  }

  return children;
}

function getNextAuthStep(current, required) {
  if (current < 1) return 'login';
  if (current < 2 && required >= 2) return 'verify-email';
  if (current < 3 && required >= 3) return 'setup-mfa';
  return 'complete';
}

// Guest Guard (redirect authenticated users)
function RequireGuest({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

// Combined Protection Guard
function ProtectedRoute({
  children,
  requireAuth = true,
  allowedRoles = [],
  permissions = [],
  requireAll = false,
  authLevel = 1,
  fallback = null
}) {
  const { user, loading, hasPermission } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>;
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
    const hasRequiredPermissions = requireAll
      ? permissions.every(p => hasPermission(p))
      : permissions.some(p => hasPermission(p));

    if (!hasRequiredPermissions) {
      return fallback || <Navigate to="/unauthorized" replace />;
    }
  }

  // Check auth level
  if (user && user.authLevel < authLevel) {
    const nextStep = getNextAuthStep(user.authLevel, authLevel);
    return <Navigate to={`/auth/${nextStep}`} replace />;
  }

  return children;
}

// =============================================================================
// AUTHENTICATION PAGES
// =============================================================================

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();

  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(credentials);

    if (result.success) {
      navigate(from, { replace: true });
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  const demoLogin = (userType) => {
    const demoCredentials = {
      admin: { email: 'admin@example.com', password: 'admin123' },
      manager: { email: 'manager@example.com', password: 'manager123' },
      user: { email: 'user@example.com', password: 'user123' }
    };

    setCredentials(demoCredentials[userType]);
  };

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>🔐 Login</h1>

        {location.state?.message && (
          <div className="info-message">
            {location.state.message}
          </div>
        )}

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={credentials.email}
              onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              disabled={loading}
            />
          </div>

          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="demo-accounts">
          <h3>Demo Accounts:</h3>
          <div className="demo-buttons">
            <button onClick={() => demoLogin('admin')} className="btn-demo">
              Admin User
            </button>
            <button onClick={() => demoLogin('manager')} className="btn-demo">
              Manager User
            </button>
            <button onClick={() => demoLogin('user')} className="btn-demo">
              Regular User
            </button>
          </div>
        </div>

        {from !== '/dashboard' && (
          <div className="redirect-info">
            <p>After login, you'll be redirected to: <strong>{from}</strong></p>
          </div>
        )}
      </div>
    </div>
  );
}

function EmailVerificationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [verifying, setVerifying] = useState(false);

  const returnTo = location.state?.returnTo || '/dashboard';

  const handleVerify = async () => {
    setVerifying(true);

    // Simulate email verification
    await new Promise(resolve => setTimeout(resolve, 2000));

    updateUser({ emailVerified: true, authLevel: 2 });

    navigate(returnTo, { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.emailVerified) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>📧 Verify Your Email</h1>
        <p>Please verify your email address to continue.</p>
        <p>Email: <strong>{user.email}</strong></p>

        <button
          onClick={handleVerify}
          disabled={verifying}
          className="btn-primary"
        >
          {verifying ? 'Verifying...' : 'Verify Email'}
        </button>

        <p className="help-text">
          In a real app, this would send a verification email.
        </p>
      </div>
    </div>
  );
}

function MFASetupPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, updateUser } = useAuth();
  const [setting, setSetting] = useState(false);

  const returnTo = location.state?.returnTo || '/dashboard';

  const handleSetupMFA = async () => {
    setSetting(true);

    // Simulate MFA setup
    await new Promise(resolve => setTimeout(resolve, 2000));

    updateUser({ mfaEnabled: true, authLevel: 3 });

    navigate(returnTo, { replace: true });
  };

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.mfaEnabled) {
    return <Navigate to={returnTo} replace />;
  }

  return (
    <div className="auth-page">
      <div className="auth-container">
        <h1>🔐 Setup Multi-Factor Authentication</h1>
        <p>Add an extra layer of security to your account.</p>

        <div className="mfa-info">
          <h3>Benefits of MFA:</h3>
          <ul>
            <li>Enhanced account security</li>
            <li>Protection against unauthorized access</li>
            <li>Required for admin functions</li>
          </ul>
        </div>

        <button
          onClick={handleSetupMFA}
          disabled={setting}
          className="btn-primary"
        >
          {setting ? 'Setting up...' : 'Setup MFA'}
        </button>

        <button
          onClick={() => navigate('/dashboard')}
          className="btn-secondary"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// APPLICATION PAGES
// =============================================================================

function Dashboard() {
  const { user, extendSession, sessionExpiry } = useAuth();
  const timeLeft = sessionExpiry ? Math.max(0, Math.floor((sessionExpiry - Date.now()) / 60000)) : 0;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>
      <div className="user-info">
        <h2>Welcome, {user.name}!</h2>
        <div className="user-details">
          <p><strong>Role:</strong> {user.role}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Auth Level:</strong> {user.authLevel}/3</p>
          <p><strong>Session expires in:</strong> {timeLeft} minutes</p>
        </div>

        <button onClick={extendSession} className="btn-secondary">
          Extend Session
        </button>
      </div>

      <div className="dashboard-sections">
        <div className="section-card">
          <h3>👤 Profile</h3>
          <p>Manage your personal information</p>
          <Link to="/profile" className="btn-primary">View Profile</Link>
        </div>

        {user.role !== 'user' && (
          <div className="section-card">
            <h3>👥 Users</h3>
            <p>Manage system users</p>
            <Link to="/users" className="btn-primary">Manage Users</Link>
          </div>
        )}

        {user.role === 'admin' && (
          <div className="section-card">
            <h3>⚙️ Admin</h3>
            <p>System administration</p>
            <Link to="/admin" className="btn-primary">Admin Panel</Link>
          </div>
        )}

        <div className="section-card">
          <h3>📊 Reports</h3>
          <p>View system reports</p>
          <Link to="/reports" className="btn-primary">View Reports</Link>
        </div>
      </div>

      <div className="auth-status">
        <h3>Authentication Status:</h3>
        <div className="status-grid">
          <div className={`status-item ${user.authLevel >= 1 ? 'complete' : 'incomplete'}`}>
            <span>✓</span> Basic Login
          </div>
          <div className={`status-item ${user.emailVerified ? 'complete' : 'incomplete'}`}>
            <span>{user.emailVerified ? '✓' : '○'}</span> Email Verified
          </div>
          <div className={`status-item ${user.mfaEnabled ? 'complete' : 'incomplete'}`}>
            <span>{user.mfaEnabled ? '✓' : '○'}</span> MFA Enabled
          </div>
        </div>
      </div>
    </div>
  );
}

function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="profile-page">
      <h1>👤 Profile</h1>
      <div className="profile-content">
        <div className="profile-info">
          <h2>Personal Information</h2>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>Role:</strong> {user.role}</p>
        </div>

        <div className="profile-permissions">
          <h2>Your Permissions</h2>
          <ul>
            {user.permissions.map(permission => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

function UsersPage() {
  const users = Object.values(MOCK_USERS);

  return (
    <div className="users-page">
      <h1>👥 User Management</h1>
      <div className="users-list">
        {users.map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>Email: {user.email}</p>
            <p>Role: {user.role}</p>
            <p>Auth Level: {user.authLevel}/3</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function AdminPage() {
  return (
    <div className="admin-page">
      <h1>⚙️ Admin Panel</h1>
      <div className="admin-content">
        <h2>System Administration</h2>
        <p>This page is only accessible to administrators.</p>

        <div className="admin-sections">
          <div className="admin-card">
            <h3>System Settings</h3>
            <p>Configure system-wide settings</p>
          </div>

          <div className="admin-card">
            <h3>User Roles</h3>
            <p>Manage user roles and permissions</p>
          </div>

          <div className="admin-card">
            <h3>Security</h3>
            <p>Security settings and logs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ReportsPage() {
  return (
    <div className="reports-page">
      <h1>📊 Reports</h1>
      <div className="reports-content">
        <p>This page requires 'reports.view' permission.</p>

        <div className="reports-list">
          <div className="report-card">
            <h3>User Activity Report</h3>
            <p>View user login and activity statistics</p>
          </div>

          <div className="report-card">
            <h3>System Performance</h3>
            <p>Monitor system performance metrics</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function UnauthorizedPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="error-page">
      <h1>🚫 Access Denied</h1>
      <p>You don't have permission to access this page.</p>

      {user && (
        <div className="user-context">
          <p>Current role: <strong>{user.role}</strong></p>
          <p>Your permissions:</p>
          <ul>
            {user.permissions.map(permission => (
              <li key={permission}>{permission}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="error-actions">
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Go to Dashboard
        </button>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// NAVIGATION COMPONENT
// =============================================================================

function Navigation() {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <nav className="main-nav">
      <div className="nav-brand">
        <Link to="/dashboard">🛡️ Route Guards Demo</Link>
      </div>

      <div className="nav-links">
        <Link to="/dashboard">Dashboard</Link>
        <Link to="/profile">Profile</Link>

        {isManager && <Link to="/users">Users</Link>}
        {isAdmin && <Link to="/admin">Admin</Link>}

        <Link to="/reports">Reports</Link>
      </div>

      <div className="nav-user">
        <span className="user-greeting">
          {user.name} ({user.role})
        </span>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </div>
    </nav>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function RouteGuardsApp() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="app">
          <Navigation />

          <main className="main-content">
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />

              {/* Auth routes (guest only) */}
              <Route path="/login" element={
                <RequireGuest>
                  <LoginPage />
                </RequireGuest>
              } />

              {/* Progressive auth routes */}
              <Route path="/auth/verify-email" element={<EmailVerificationPage />} />
              <Route path="/auth/setup-mfa" element={<MFASetupPage />} />

              {/* Protected routes */}
              <Route path="/dashboard" element={
                <RequireAuth>
                  <Dashboard />
                </RequireAuth>
              } />

              <Route path="/profile" element={
                <RequireAuth>
                  <ProfilePage />
                </RequireAuth>
              } />

              {/* Role-based routes */}
              <Route path="/users" element={
                <RequireRole allowedRoles={['manager', 'admin']}>
                  <UsersPage />
                </RequireRole>
              } />

              <Route path="/admin" element={
                <RequireRole allowedRoles={['admin']}>
                  <AdminPage />
                </RequireRole>
              } />

              {/* Permission-based routes */}
              <Route path="/reports" element={
                <RequirePermission permissions={['reports.view']}>
                  <ReportsPage />
                </RequirePermission>
              } />

              {/* Auth level routes */}
              <Route path="/secure" element={
                <RequireAuthLevel requiredLevel={3}>
                  <div>This requires MFA (Auth Level 3)</div>
                </RequireAuthLevel>
              } />

              {/* Error routes */}
              <Route path="/unauthorized" element={<UnauthorizedPage />} />
              <Route path="*" element={<div>404 - Page Not Found</div>} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

function HomePage() {
  const { user } = useAuth();

  return (
    <div className="home-page">
      <h1>🛡️ Route Guards & Authentication Demo</h1>

      {!user ? (
        <div className="welcome-guest">
          <p>Welcome! Please log in to access protected areas.</p>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      ) : (
        <div className="welcome-user">
          <p>Welcome back, {user.name}!</p>
          <Link to="/dashboard" className="btn-primary">Go to Dashboard</Link>
        </div>
      )}

      <div className="features-grid">
        <div className="feature-card">
          <h3>🔐 Authentication Guards</h3>
          <p>Protect routes that require user login</p>
        </div>

        <div className="feature-card">
          <h3>👑 Role-Based Access</h3>
          <p>Control access based on user roles</p>
        </div>

        <div className="feature-card">
          <h3>🎫 Permission System</h3>
          <p>Fine-grained permission control</p>
        </div>

        <div className="feature-card">
          <h3>📈 Progressive Auth</h3>
          <p>Multi-level authentication system</p>
        </div>
      </div>

      <div className="demo-info">
        <h2>Demo Accounts</h2>
        <div className="accounts-info">
          <div className="account-info">
            <h4>Admin User</h4>
            <p>Email: admin@example.com</p>
            <p>Password: admin123</p>
            <p>Access: All areas</p>
          </div>

          <div className="account-info">
            <h4>Manager User</h4>
            <p>Email: manager@example.com</p>
            <p>Password: manager123</p>
            <p>Access: Users, Reports</p>
          </div>

          <div className="account-info">
            <h4>Regular User</h4>
            <p>Email: user@example.com</p>
            <p>Password: user123</p>
            <p>Access: Profile only</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RouteGuardsApp;

// CSS Styles
const styles = `
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

.main-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  gap: 2rem;
}

.nav-links a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.nav-links a:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.user-greeting {
  color: white;
  font-size: 0.9rem;
}

.logout-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.logout-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

/* Auth Pages */
.auth-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.auth-container {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  max-width: 400px;
  width: 100%;
  text-align: center;
}

.auth-form {
  margin: 2rem 0;
}

.form-group {
  margin-bottom: 1rem;
  text-align: left;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus {
  border-color: #667eea;
  outline: none;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #fcc;
}

.info-message {
  background: #e3f2fd;
  color: #1976d2;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #bbdefb;
}

.demo-accounts {
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #eee;
}

.demo-buttons {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.btn-demo {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.btn-demo:hover {
  background: #e9ecef;
}

.redirect-info {
  margin-top: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  font-size: 0.9rem;
}

/* Dashboard */
.dashboard {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.user-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.user-details {
  margin: 1rem 0;
}

.user-details p {
  margin: 0.5rem 0;
}

.dashboard-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.section-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.section-card:hover {
  transform: translateY(-2px);
}

.auth-status {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.status-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.status-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border-radius: 4px;
  font-weight: bold;
}

.status-item.complete {
  background: #d4edda;
  color: #155724;
}

.status-item.incomplete {
  background: #f8d7da;
  color: #721c24;
}

/* Other Pages */
.profile-page,
.users-page,
.admin-page,
.reports-page {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.profile-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.profile-info,
.profile-permissions {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.users-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.user-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

.admin-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.admin-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.reports-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.report-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

/* Error Pages */
.error-page {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.user-context {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.permission-denied {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

/* Home Page */
.home-page {
  text-align: center;
  padding: 2rem;
}

.welcome-guest,
.welcome-user {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 3rem 0;
}

.feature-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.demo-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-top: 3rem;
  text-align: left;
}

.accounts-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.account-info {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}

/* Loading States */
.loading-screen {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  min-height: 60vh;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f3f3;
  border-top: 4px solid #667eea;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loading {
  text-align: center;
  padding: 2rem;
  color: #666;
}

/* Buttons */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s;
  font-size: 1rem;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-secondary {
  background: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #e9ecef;
  border-color: #adb5bd;
}

/* MFA Setup */
.mfa-info {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
}

.help-text {
  font-size: 0.9rem;
  color: #666;
  margin-top: 1rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-nav {
    flex-direction: column;
    gap: 1rem;
  }

  .nav-links {
    flex-wrap: wrap;
    justify-content: center;
  }

  .main-content {
    padding: 1rem;
  }

  .dashboard-sections,
  .features-grid,
  .accounts-info {
    grid-template-columns: 1fr;
  }

  .error-actions {
    flex-direction: column;
  }

  .demo-buttons {
    gap: 0.5rem;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}