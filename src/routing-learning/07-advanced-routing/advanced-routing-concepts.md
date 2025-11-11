# 🚀 Advanced Routing Patterns - Complex Routing Solutions

## 🎯 What Are Advanced Routing Patterns?

Advanced routing patterns are sophisticated techniques for handling complex navigation scenarios, dynamic route generation, performance optimization, and scalable routing architectures. These patterns go beyond basic routing to solve real-world application challenges.

## 🧩 Dynamic Route Generation

### **1. Route Configuration Systems**
Create routes from configuration objects for maintainable, scalable routing.

```jsx
// Route configuration
const routeConfig = [
  {
    path: '/',
    component: HomePage,
    public: true,
    exact: true
  },
  {
    path: '/dashboard',
    component: Dashboard,
    requireAuth: true,
    roles: ['user', 'admin']
  },
  {
    path: '/admin',
    component: AdminPanel,
    requireAuth: true,
    roles: ['admin'],
    permissions: ['admin.access']
  },
  {
    path: '/users/:userId',
    component: UserProfile,
    requireAuth: true,
    preload: ['user', 'preferences']
  }
];

// Route generator
function generateRoutes(config) {
  return config.map(route => {
    let element = <route.component />;
    
    // Apply guards based on configuration
    if (!route.public) {
      element = <RequireAuth>{element}</RequireAuth>;
    }
    
    if (route.roles) {
      element = <RequireRole roles={route.roles}>{element}</RequireRole>;
    }
    
    if (route.permissions) {
      element = <RequirePermission permissions={route.permissions}>{element}</RequirePermission>;
    }
    
    return (
      <Route 
        key={route.path} 
        path={route.path} 
        element={element}
        loader={route.preload ? createLoader(route.preload) : undefined}
      />
    );
  });
}

// Usage
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {generateRoutes(routeConfig)}
      </Routes>
    </BrowserRouter>
  );
}
```

### **2. Dynamic Route Registration**
Register routes at runtime based on user permissions or feature flags.

```jsx
function useDynamicRoutes() {
  const { user } = useAuth();
  const [routes, setRoutes] = useState([]);
  
  useEffect(() => {
    const availableRoutes = [];
    
    // Base routes for all users
    availableRoutes.push({
      path: '/dashboard',
      component: Dashboard
    });
    
    // Admin routes
    if (user?.role === 'admin') {
      availableRoutes.push({
        path: '/admin',
        component: AdminPanel
      });
    }
    
    // Feature-based routes
    if (user?.features?.includes('analytics')) {
      availableRoutes.push({
        path: '/analytics',
        component: Analytics
      });
    }
    
    // Plugin routes
    user?.plugins?.forEach(plugin => {
      availableRoutes.push({
        path: `/plugins/${plugin.id}`,
        component: plugin.component
      });
    });
    
    setRoutes(availableRoutes);
  }, [user]);
  
  return routes;
}

// Usage
function DynamicApp() {
  const routes = useDynamicRoutes();
  
  return (
    <BrowserRouter>
      <Routes>
        {routes.map(route => (
          <Route 
            key={route.path} 
            path={route.path} 
            element={<route.component />} 
          />
        ))}
      </Routes>
    </BrowserRouter>
  );
}
```

## 🔄 Catch-All and Wildcard Routes

### **1. Catch-All Routes**
Handle unmatched routes with flexible patterns.

```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Specific routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Catch-all for blog posts */}
        <Route path="/blog/*" element={<BlogRouter />} />
        
        {/* Catch-all for user profiles */}
        <Route path="/users/*" element={<UserRouter />} />
        
        {/* Global catch-all (404) */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

// Blog router handles all /blog/* routes
function BlogRouter() {
  const location = useLocation();
  const remainingPath = location.pathname.replace('/blog', '');
  
  return (
    <Routes>
      <Route path="/" element={<BlogHome />} />
      <Route path="/category/:category" element={<BlogCategory />} />
      <Route path="/post/:slug" element={<BlogPost />} />
      <Route path="/author/:author" element={<BlogAuthor />} />
      <Route path="*" element={<BlogNotFound />} />
    </Routes>
  );
}
```

### **2. Wildcard Parameter Matching**
Capture multiple path segments with wildcard parameters.

```jsx
function FileExplorer() {
  const { '*': filePath } = useParams();
  const pathSegments = filePath ? filePath.split('/') : [];
  
  return (
    <div className="file-explorer">
      <Breadcrumbs segments={pathSegments} />
      <FileList path={filePath} />
    </div>
  );
}

// Route definition
<Route path="/files/*" element={<FileExplorer />} />

// Matches:
// /files/documents/reports/2024/january.pdf
// /files/images/vacation/beach.jpg
// /files/projects/react-app/src/components
```

## 🎨 Advanced Parameter Patterns

### **1. Optional Parameters**
Handle routes with optional path segments.

```jsx
// Custom route matching for optional parameters
function OptionalParamRoute({ path, element }) {
  const location = useLocation();
  
  // Match pattern like /products/:category?/:id?
  const matchOptionalParams = (pattern, pathname) => {
    const patternParts = pattern.split('/');
    const pathParts = pathname.split('/');
    
    const params = {};
    let matches = true;
    
    for (let i = 0; i < patternParts.length; i++) {
      const patternPart = patternParts[i];
      const pathPart = pathParts[i];
      
      if (patternPart.startsWith(':') && patternPart.endsWith('?')) {
        // Optional parameter
        const paramName = patternPart.slice(1, -1);
        if (pathPart) {
          params[paramName] = pathPart;
        }
      } else if (patternPart.startsWith(':')) {
        // Required parameter
        if (!pathPart) {
          matches = false;
          break;
        }
        params[patternPart.slice(1)] = pathPart;
      } else if (patternPart !== pathPart) {
        matches = false;
        break;
      }
    }
    
    return matches ? params : null;
  };
  
  const params = matchOptionalParams(path, location.pathname);
  
  if (!params) return null;
  
  return React.cloneElement(element, { params });
}

// Usage
<OptionalParamRoute 
  path="/products/:category?/:id?" 
  element={<ProductPage />} 
/>
```

### **2. Constraint-Based Parameters**
Validate parameters with custom constraints.

```jsx
function ConstrainedRoute({ path, constraints, element }) {
  const params = useParams();
  
  const validateParams = () => {
    for (const [param, constraint] of Object.entries(constraints)) {
      const value = params[param];
      
      if (!value) continue;
      
      if (constraint.pattern && !constraint.pattern.test(value)) {
        return false;
      }
      
      if (constraint.validate && !constraint.validate(value)) {
        return false;
      }
    }
    
    return true;
  };
  
  if (!validateParams()) {
    return <Navigate to="/404" replace />;
  }
  
  return element;
}

// Usage
<Route path="/users/:userId" element={
  <ConstrainedRoute
    constraints={{
      userId: {
        pattern: /^\d+$/,
        validate: (id) => parseInt(id) > 0
      }
    }}
    element={<UserProfile />}
  />
} />
```

## 🔀 Route Composition Patterns

### **1. Route Factories**
Create reusable route patterns.

```jsx
// CRUD route factory
function createCRUDRoutes(basePath, components) {
  const { List, Detail, Create, Edit } = components;
  
  return [
    <Route key={`${basePath}-list`} path={basePath} element={<List />} />,
    <Route key={`${basePath}-create`} path={`${basePath}/new`} element={<Create />} />,
    <Route key={`${basePath}-detail`} path={`${basePath}/:id`} element={<Detail />} />,
    <Route key={`${basePath}-edit`} path={`${basePath}/:id/edit`} element={<Edit />} />
  ];
}

// Usage
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {createCRUDRoutes('/users', {
          List: UserList,
          Detail: UserDetail,
          Create: UserCreate,
          Edit: UserEdit
        })}
        
        {createCRUDRoutes('/products', {
          List: ProductList,
          Detail: ProductDetail,
          Create: ProductCreate,
          Edit: ProductEdit
        })}
      </Routes>
    </BrowserRouter>
  );
}
```

### **2. Route Middleware**
Apply middleware-like functionality to routes.

```jsx
function createRouteMiddleware(middlewares) {
  return function RouteMiddleware({ children }) {
    return middlewares.reduceRight(
      (acc, Middleware) => <Middleware>{acc}</Middleware>,
      children
    );
  };
}

// Middleware components
function LoggingMiddleware({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    console.log('Route accessed:', location.pathname);
  }, [location.pathname]);
  
  return children;
}

function AnalyticsMiddleware({ children }) {
  const location = useLocation();
  
  useEffect(() => {
    analytics.track('page_view', { path: location.pathname });
  }, [location.pathname]);
  
  return children;
}

// Usage
const RouteWithMiddleware = createRouteMiddleware([
  LoggingMiddleware,
  AnalyticsMiddleware,
  RequireAuth
]);

<Route path="/dashboard" element={
  <RouteWithMiddleware>
    <Dashboard />
  </RouteWithMiddleware>
} />
```

## 🎭 Route-Based State Management

### **1. Route State Synchronization**
Sync application state with URL parameters.

```jsx
function useRouteState(key, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = searchParams.get(key) || defaultValue;
  
  const setValue = (newValue) => {
    setSearchParams(prev => {
      if (newValue === defaultValue) {
        prev.delete(key);
      } else {
        prev.set(key, newValue);
      }
      return prev;
    });
  };
  
  return [value, setValue];
}

// Usage
function ProductList() {
  const [category, setCategory] = useRouteState('category', 'all');
  const [sortBy, setSortBy] = useRouteState('sort', 'name');
  const [page, setPage] = useRouteState('page', '1');
  
  return (
    <div>
      <CategoryFilter value={category} onChange={setCategory} />
      <SortSelector value={sortBy} onChange={setSortBy} />
      <ProductGrid category={category} sortBy={sortBy} page={page} />
      <Pagination currentPage={page} onPageChange={setPage} />
    </div>
  );
}
```

### **2. Complex State in URLs**
Store complex state objects in URL parameters.

```jsx
function useComplexRouteState(key, defaultValue) {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const value = useMemo(() => {
    const param = searchParams.get(key);
    if (!param) return defaultValue;
    
    try {
      return JSON.parse(decodeURIComponent(param));
    } catch {
      return defaultValue;
    }
  }, [searchParams, key, defaultValue]);
  
  const setValue = (newValue) => {
    setSearchParams(prev => {
      if (JSON.stringify(newValue) === JSON.stringify(defaultValue)) {
        prev.delete(key);
      } else {
        prev.set(key, encodeURIComponent(JSON.stringify(newValue)));
      }
      return prev;
    });
  };
  
  return [value, setValue];
}

// Usage
function AdvancedSearch() {
  const [filters, setFilters] = useComplexRouteState('filters', {
    priceRange: [0, 1000],
    categories: [],
    inStock: true,
    rating: 0
  });
  
  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };
  
  return (
    <div>
      <PriceRangeSlider 
        value={filters.priceRange}
        onChange={(range) => updateFilter('priceRange', range)}
      />
      <CategoryCheckboxes
        selected={filters.categories}
        onChange={(categories) => updateFilter('categories', categories)}
      />
      {/* Other filter controls */}
    </div>
  );
}
```

## 🔄 Route Transitions and Animations

### **1. Page Transition System**
Create smooth transitions between routes.

```jsx
import { AnimatePresence, motion } from 'framer-motion';

function AnimatedRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
        transition={{ duration: 0.3 }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
}
```

### **2. Loading States with Transitions**
Handle loading states during route transitions.

```jsx
function useRouteTransition() {
  const [isTransitioning, setIsTransitioning] = useState(false);
  const location = useLocation();
  const prevLocation = useRef(location);
  
  useEffect(() => {
    if (location !== prevLocation.current) {
      setIsTransitioning(true);
      
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        prevLocation.current = location;
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [location]);
  
  return isTransitioning;
}

function TransitionWrapper({ children }) {
  const isTransitioning = useRouteTransition();
  
  return (
    <div className={`route-container ${isTransitioning ? 'transitioning' : ''}`}>
      {isTransitioning && <div className="route-loading">Loading...</div>}
      <div className={`route-content ${isTransitioning ? 'hidden' : 'visible'}`}>
        {children}
      </div>
    </div>
  );
}
```

## 🎯 Route-Based Code Splitting

### **1. Advanced Lazy Loading**
Implement sophisticated code splitting strategies.

```jsx
// Route-based code splitting with error boundaries
function createLazyRoute(importFn, fallback = <div>Loading...</div>) {
  const LazyComponent = React.lazy(importFn);
  
  return function LazyRoute(props) {
    return (
      <Suspense fallback={fallback}>
        <ErrorBoundary>
          <LazyComponent {...props} />
        </ErrorBoundary>
      </Suspense>
    );
  };
}

// Preloading strategy
function createPreloadableRoute(importFn) {
  let componentPromise = null;
  
  const preload = () => {
    if (!componentPromise) {
      componentPromise = importFn();
    }
    return componentPromise;
  };
  
  const LazyComponent = React.lazy(() => {
    if (componentPromise) {
      return componentPromise;
    }
    return importFn();
  });
  
  LazyComponent.preload = preload;
  
  return LazyComponent;
}

// Usage
const Dashboard = createPreloadableRoute(() => import('./Dashboard'));
const Profile = createPreloadableRoute(() => import('./Profile'));

// Preload on hover
function NavigationLink({ to, children, preload }) {
  return (
    <Link 
      to={to}
      onMouseEnter={() => preload && preload()}
    >
      {children}
    </Link>
  );
}

<NavigationLink to="/dashboard" preload={Dashboard.preload}>
  Dashboard
</NavigationLink>
```

### **2. Bundle Splitting Strategies**
Optimize bundle loading based on route patterns.

```jsx
// Feature-based splitting
const AdminRoutes = React.lazy(() => import('./admin/AdminRoutes'));
const UserRoutes = React.lazy(() => import('./user/UserRoutes'));
const PublicRoutes = React.lazy(() => import('./public/PublicRoutes'));

function App() {
  const { user } = useAuth();
  
  return (
    <BrowserRouter>
      <Suspense fallback={<AppLoading />}>
        <Routes>
          <Route path="/public/*" element={<PublicRoutes />} />
          
          {user && (
            <Route path="/app/*" element={<UserRoutes />} />
          )}
          
          {user?.role === 'admin' && (
            <Route path="/admin/*" element={<AdminRoutes />} />
          )}
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
```

## 🔍 Route Analytics and Monitoring

### **1. Route Performance Monitoring**
Track route performance and user behavior.

```jsx
function useRouteAnalytics() {
  const location = useLocation();
  const [startTime, setStartTime] = useState(Date.now());
  
  useEffect(() => {
    setStartTime(Date.now());
  }, [location.pathname]);
  
  useEffect(() => {
    const handleBeforeUnload = () => {
      const timeSpent = Date.now() - startTime;
      
      analytics.track('route_time_spent', {
        path: location.pathname,
        timeSpent,
        timestamp: Date.now()
      });
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, [location.pathname, startTime]);
  
  // Track route changes
  useEffect(() => {
    analytics.track('route_change', {
      path: location.pathname,
      search: location.search,
      timestamp: Date.now()
    });
  }, [location]);
}
```

### **2. Route Error Tracking**
Monitor and track routing errors.

```jsx
class RouteErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    // Track routing errors
    analytics.track('route_error', {
      error: error.message,
      stack: error.stack,
      path: window.location.pathname,
      componentStack: errorInfo.componentStack,
      timestamp: Date.now()
    });
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <div className="route-error">
          <h2>Something went wrong</h2>
          <p>We've been notified of this error.</p>
          <button onClick={() => window.location.reload()}>
            Reload Page
          </button>
        </div>
      );
    }
    
    return this.props.children;
  }
}
```

## 🎨 Advanced Route Patterns

### **1. Multi-Tenant Routing**
Handle multiple tenants with subdomain or path-based routing.

```jsx
function useTenant() {
  const location = useLocation();
  const [tenant, setTenant] = useState(null);
  
  useEffect(() => {
    // Extract tenant from subdomain
    const subdomain = window.location.hostname.split('.')[0];
    
    // Or extract from path
    const pathTenant = location.pathname.split('/')[1];
    
    setTenant(subdomain !== 'www' ? subdomain : pathTenant);
  }, [location]);
  
  return tenant;
}

function TenantRouter() {
  const tenant = useTenant();
  
  if (!tenant) {
    return <TenantSelector />;
  }
  
  return (
    <TenantProvider tenant={tenant}>
      <Routes>
        <Route path="/:tenant/dashboard" element={<Dashboard />} />
        <Route path="/:tenant/settings" element={<Settings />} />
      </Routes>
    </TenantProvider>
  );
}
```

### **2. Internationalization Routing**
Handle multiple languages with route-based i18n.

```jsx
function useI18nRouting() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [locale, setLocale] = useState('en');
  
  useEffect(() => {
    const pathLocale = location.pathname.split('/')[1];
    const supportedLocales = ['en', 'es', 'fr', 'de'];
    
    if (supportedLocales.includes(pathLocale)) {
      setLocale(pathLocale);
    }
  }, [location]);
  
  const changeLocale = (newLocale) => {
    const pathWithoutLocale = location.pathname.replace(/^\/[a-z]{2}/, '');
    navigate(`/${newLocale}${pathWithoutLocale}`);
  };
  
  return { locale, changeLocale };
}

function I18nRouter() {
  return (
    <Routes>
      <Route path="/:locale/*" element={<LocalizedApp />} />
      <Route path="*" element={<Navigate to="/en" replace />} />
    </Routes>
  );
}
```

## 🎉 What You've Mastered

After completing advanced routing patterns, you can:

- ✅ Build dynamic, configuration-driven routing systems
- ✅ Implement complex parameter validation and constraints
- ✅ Create reusable route patterns and factories
- ✅ Handle advanced state management with URLs
- ✅ Implement sophisticated code splitting strategies
- ✅ Monitor and analyze routing performance
- ✅ Build multi-tenant and internationalized applications

## 🚀 What's Next?

Now that you understand advanced routing, you're ready for:

1. **Data Loading** → `08-data-loading` - Route-based data fetching
2. **Performance** → `09-route-optimization` - Advanced optimization
3. **Testing** → `10-routing-testing` - Testing routing applications

---

**🎉 You can now build enterprise-grade routing systems!**

**Next:** `08-data-loading/data-loading-concepts.md`