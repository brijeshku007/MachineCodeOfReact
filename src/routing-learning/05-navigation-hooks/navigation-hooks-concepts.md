# 🪝 Navigation Hooks - Programmatic Navigation

## 🎯 What Are Navigation Hooks?

Navigation hooks are React Router hooks that allow you to navigate programmatically, access location information, and manage navigation state without using Link components. They're essential for handling form submissions, conditional redirects, and complex navigation flows.

## 🧩 Core Navigation Hooks

### **1. useNavigate Hook**
Provides a function to navigate programmatically.

```jsx
import { useNavigate } from 'react-router-dom';

function LoginForm() {
  const navigate = useNavigate();
  
  const handleLogin = async (credentials) => {
    const success = await login(credentials);
    if (success) {
      navigate('/dashboard'); // Navigate to dashboard
    }
  };
  
  return (
    <form onSubmit={handleLogin}>
      {/* form fields */}
    </form>
  );
}
```

### **2. useLocation Hook**
Provides information about the current location.

```jsx
import { useLocation } from 'react-router-dom';

function CurrentPage() {
  const location = useLocation();
  
  return (
    <div>
      <p>Current path: {location.pathname}</p>
      <p>Search params: {location.search}</p>
      <p>Hash: {location.hash}</p>
    </div>
  );
}
```

### **3. useParams Hook**
Extracts parameters from the current route (covered in previous module).

### **4. useSearchParams Hook**
Manages query parameters (covered in previous module).

## 🚀 useNavigate Hook Deep Dive

### **Basic Navigation:**
```jsx
import { useNavigate } from 'react-router-dom';

function NavigationExample() {
  const navigate = useNavigate();
  
  const goToHome = () => {
    navigate('/'); // Navigate to home
  };
  
  const goToProfile = () => {
    navigate('/profile'); // Navigate to profile
  };
  
  const goBack = () => {
    navigate(-1); // Go back one page
  };
  
  const goForward = () => {
    navigate(1); // Go forward one page
  };
  
  return (
    <div>
      <button onClick={goToHome}>Go Home</button>
      <button onClick={goToProfile}>Go to Profile</button>
      <button onClick={goBack}>Go Back</button>
      <button onClick={goForward}>Go Forward</button>
    </div>
  );
}
```

### **Navigation with State:**
```jsx
function ProductList() {
  const navigate = useNavigate();
  
  const viewProduct = (product) => {
    navigate(`/products/${product.id}`, {
      state: { 
        product,
        returnTo: '/products',
        timestamp: Date.now()
      }
    });
  };
  
  return (
    <div>
      {products.map(product => (
        <button key={product.id} onClick={() => viewProduct(product)}>
          View {product.name}
        </button>
      ))}
    </div>
  );
}

// In the destination component
function ProductDetail() {
  const location = useLocation();
  const { product, returnTo } = location.state || {};
  
  return (
    <div>
      <h1>{product?.name || 'Product Not Found'}</h1>
      {returnTo && (
        <Link to={returnTo}>← Back to Products</Link>
      )}
    </div>
  );
}
```

### **Replace vs Push Navigation:**
```jsx
function AuthExample() {
  const navigate = useNavigate();
  
  const login = () => {
    // Push to history (can go back)
    navigate('/dashboard');
  };
  
  const logout = () => {
    // Replace current entry (can't go back to protected page)
    navigate('/login', { replace: true });
  };
  
  const redirectAfterTimeout = () => {
    setTimeout(() => {
      navigate('/timeout', { replace: true });
    }, 5000);
  };
  
  return (
    <div>
      <button onClick={login}>Login</button>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### **Relative Navigation:**
```jsx
function NestedNavigation() {
  const navigate = useNavigate();
  
  const goToSibling = () => {
    navigate('../sibling'); // Go to sibling route
  };
  
  const goToChild = () => {
    navigate('child'); // Go to child route
  };
  
  const goUp = () => {
    navigate('..'); // Go up one level
  };
  
  return (
    <div>
      <button onClick={goToSibling}>Go to Sibling</button>
      <button onClick={goToChild}>Go to Child</button>
      <button onClick={goUp}>Go Up</button>
    </div>
  );
}
```

## 📍 useLocation Hook Deep Dive

### **Location Object Properties:**
```jsx
function LocationInfo() {
  const location = useLocation();
  
  console.log(location);
  // {
  //   pathname: "/products/123",
  //   search: "?category=electronics&sort=price",
  //   hash: "#reviews",
  //   state: { from: "/dashboard" },
  //   key: "ac3df4"
  // }
  
  return (
    <div>
      <h2>Current Location Info</h2>
      <p><strong>Pathname:</strong> {location.pathname}</p>
      <p><strong>Search:</strong> {location.search}</p>
      <p><strong>Hash:</strong> {location.hash}</p>
      <p><strong>State:</strong> {JSON.stringify(location.state)}</p>
      <p><strong>Key:</strong> {location.key}</p>
    </div>
  );
}
```

### **Tracking Route Changes:**
```jsx
function RouteTracker() {
  const location = useLocation();
  
  useEffect(() => {
    // Track page views
    analytics.track('Page View', {
      path: location.pathname,
      search: location.search
    });
  }, [location]);
  
  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo(0, 0);
  }, [location.pathname]);
  
  return null; // This component doesn't render anything
}
```

### **Conditional Rendering Based on Location:**
```jsx
function ConditionalNavigation() {
  const location = useLocation();
  
  const isHomePage = location.pathname === '/';
  const isProductPage = location.pathname.startsWith('/products');
  const hasSearchParams = location.search.length > 0;
  
  return (
    <nav>
      {!isHomePage && <Link to="/">Home</Link>}
      {isProductPage && <ProductBreadcrumbs />}
      {hasSearchParams && <ClearFiltersButton />}
    </nav>
  );
}
```

## 🔄 Navigation Patterns

### **1. Form Submission with Redirect:**
```jsx
function ContactForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (formData) => {
    setLoading(true);
    
    try {
      await submitContactForm(formData);
      
      // Navigate with success message
      navigate('/contact/success', {
        state: { 
          message: 'Thank you for your message!',
          submittedAt: new Date().toISOString()
        }
      });
    } catch (error) {
      // Navigate with error message
      navigate('/contact/error', {
        state: { 
          error: error.message,
          formData // Preserve form data
        }
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      {/* form fields */}
      <button type="submit" disabled={loading}>
        {loading ? 'Sending...' : 'Send Message'}
      </button>
    </form>
  );
}
```

### **2. Multi-Step Navigation:**
```jsx
function MultiStepWizard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({});
  
  const nextStep = (stepData) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);
    
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
      navigate(`/wizard/step-${currentStep + 1}`, {
        state: { formData: newFormData, step: currentStep + 1 }
      });
    } else {
      // Final step - submit and redirect
      submitWizard(newFormData);
      navigate('/wizard/complete', { replace: true });
    }
  };
  
  const previousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      navigate(`/wizard/step-${currentStep - 1}`, {
        state: { formData, step: currentStep - 1 }
      });
    }
  };
  
  return (
    <div className="wizard">
      <div className="wizard-progress">
        Step {currentStep} of 3
      </div>
      
      <WizardStep 
        step={currentStep}
        data={formData}
        onNext={nextStep}
        onPrevious={previousStep}
      />
    </div>
  );
}
```

### **3. Conditional Redirects:**
```jsx
function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login, preserving intended destination
      navigate('/login', {
        state: { from: location.pathname },
        replace: true
      });
    }
  }, [user, loading, navigate, location]);
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return null; // Will redirect
  }
  
  return children;
}
```

### **4. Search and Filter Navigation:**
```jsx
function ProductSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  
  const updateSearch = (newParams) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });
    
    // Navigate with new search params
    navigate({
      pathname: location.pathname,
      search: params.toString()
    });
  };
  
  const clearFilters = () => {
    navigate(location.pathname); // Clear all search params
  };
  
  return (
    <div>
      <input 
        type="text"
        placeholder="Search products..."
        onChange={(e) => updateSearch({ q: e.target.value })}
      />
      
      <select onChange={(e) => updateSearch({ category: e.target.value })}>
        <option value="">All Categories</option>
        <option value="electronics">Electronics</option>
        <option value="clothing">Clothing</option>
      </select>
      
      <button onClick={clearFilters}>Clear Filters</button>
    </div>
  );
}
```

## 🎯 Advanced Navigation Techniques

### **1. Navigation Guards:**
```jsx
function useNavigationGuard(shouldBlock, message) {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (!shouldBlock) return;
    
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = message;
      return message;
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [shouldBlock, message]);
  
  const guardedNavigate = (to, options) => {
    if (shouldBlock) {
      const confirmed = window.confirm(message);
      if (!confirmed) return;
    }
    navigate(to, options);
  };
  
  return guardedNavigate;
}

// Usage
function FormWithGuard() {
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const guardedNavigate = useNavigationGuard(
    hasUnsavedChanges,
    'You have unsaved changes. Are you sure you want to leave?'
  );
  
  const handleSave = () => {
    // Save logic
    setHasUnsavedChanges(false);
    guardedNavigate('/success');
  };
  
  return (
    <form>
      <input onChange={() => setHasUnsavedChanges(true)} />
      <button onClick={handleSave}>Save</button>
    </form>
  );
}
```

### **2. Navigation History Management:**
```jsx
function useNavigationHistory() {
  const [history, setHistory] = useState([]);
  const location = useLocation();
  
  useEffect(() => {
    setHistory(prev => [...prev, location.pathname]);
  }, [location.pathname]);
  
  const canGoBack = history.length > 1;
  const previousPath = history[history.length - 2];
  
  return {
    history,
    canGoBack,
    previousPath,
    clearHistory: () => setHistory([location.pathname])
  };
}

// Usage
function NavigationWithHistory() {
  const navigate = useNavigate();
  const { canGoBack, previousPath, clearHistory } = useNavigationHistory();
  
  return (
    <div>
      {canGoBack && (
        <button onClick={() => navigate(previousPath)}>
          ← Back to {previousPath}
        </button>
      )}
      <button onClick={clearHistory}>Clear History</button>
    </div>
  );
}
```

### **3. Programmatic Route Preloading:**
```jsx
function useRoutePreloader() {
  const navigate = useNavigate();
  
  const preloadRoute = (path) => {
    // Preload route component
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = path;
    document.head.appendChild(link);
  };
  
  const navigateWithPreload = (path, options) => {
    preloadRoute(path);
    setTimeout(() => navigate(path, options), 100);
  };
  
  return { preloadRoute, navigateWithPreload };
}
```

## 🚨 Common Patterns & Best Practices

### **1. Navigation After Async Operations:**
```jsx
function AsyncNavigationExample() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleAsyncAction = async () => {
    setLoading(true);
    
    try {
      const result = await someAsyncOperation();
      
      // Navigate based on result
      if (result.success) {
        navigate('/success', { 
          state: { data: result.data },
          replace: true 
        });
      } else {
        navigate('/error', { 
          state: { error: result.error } 
        });
      }
    } catch (error) {
      navigate('/error', { 
        state: { error: error.message } 
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <button onClick={handleAsyncAction} disabled={loading}>
      {loading ? 'Processing...' : 'Submit'}
    </button>
  );
}
```

### **2. Preserving Scroll Position:**
```jsx
function useScrollRestoration() {
  const location = useLocation();
  
  useEffect(() => {
    // Save scroll position before navigation
    const saveScrollPosition = () => {
      sessionStorage.setItem(
        `scroll-${location.key}`,
        window.scrollY.toString()
      );
    };
    
    window.addEventListener('beforeunload', saveScrollPosition);
    
    // Restore scroll position after navigation
    const savedPosition = sessionStorage.getItem(`scroll-${location.key}`);
    if (savedPosition) {
      window.scrollTo(0, parseInt(savedPosition));
    }
    
    return () => {
      window.removeEventListener('beforeunload', saveScrollPosition);
    };
  }, [location]);
}
```

### **3. Navigation with Loading States:**
```jsx
function NavigationWithLoading() {
  const navigate = useNavigate();
  const [navigating, setNavigating] = useState(false);
  
  const navigateWithLoading = async (path, options) => {
    setNavigating(true);
    
    // Simulate loading time or wait for data
    await new Promise(resolve => setTimeout(resolve, 500));
    
    navigate(path, options);
    setNavigating(false);
  };
  
  return (
    <div>
      {navigating && <div className="navigation-loading">Navigating...</div>}
      <button onClick={() => navigateWithLoading('/dashboard')}>
        Go to Dashboard
      </button>
    </div>
  );
}
```

## ⚠️ Common Mistakes & Solutions

### **❌ Mistake 1: Navigating in Render**
```jsx
// Wrong - causes infinite re-renders
function BadComponent() {
  const navigate = useNavigate();
  
  if (someCondition) {
    navigate('/somewhere'); // ❌ Don't do this
  }
  
  return <div>Content</div>;
}

// Correct - navigate in useEffect
function GoodComponent() {
  const navigate = useNavigate();
  
  useEffect(() => {
    if (someCondition) {
      navigate('/somewhere');
    }
  }, [someCondition, navigate]);
  
  return <div>Content</div>;
}
```

### **❌ Mistake 2: Not Handling Navigation State**
```jsx
// Wrong - no loading state
function BadForm() {
  const navigate = useNavigate();
  
  const handleSubmit = async (data) => {
    await submitData(data);
    navigate('/success'); // User doesn't know what's happening
  };
  
  return <form onSubmit={handleSubmit}>...</form>;
}

// Correct - with loading state
function GoodForm() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  
  const handleSubmit = async (data) => {
    setLoading(true);
    try {
      await submitData(data);
      navigate('/success');
    } catch (error) {
      // Handle error
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <button disabled={loading}>
        {loading ? 'Submitting...' : 'Submit'}
      </button>
    </form>
  );
}
```

## 🎉 What You've Mastered

After completing navigation hooks, you can:

- ✅ Navigate programmatically with useNavigate
- ✅ Access location information with useLocation
- ✅ Handle form submissions with redirects
- ✅ Implement multi-step wizards
- ✅ Create conditional navigation flows
- ✅ Manage navigation state and loading
- ✅ Build advanced navigation patterns

## 🚀 What's Next?

Now that you understand navigation hooks, you're ready for:

1. **Route Guards** → `06-route-guards` - Authentication and protection
2. **Advanced Routing** → `07-advanced-routing` - Complex patterns
3. **Data Loading** → `08-data-loading` - Route-based data fetching

---

**🎉 You can now handle any navigation scenario programmatically!**

**Next:** `06-route-guards/route-guards-concepts.md`