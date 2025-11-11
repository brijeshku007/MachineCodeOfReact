# 📊 Data Loading with Routes - Modern Data Fetching Patterns

## 🎯 What is Route-Based Data Loading?

Route-based data loading is the practice of fetching data based on the current route, managing loading states, handling errors, and optimizing data fetching for better user experience. It's about making your routes "data-aware" and creating smooth, performant applications.

## �  Evolution of Data Loading in React Router

### **React Router v5 and Earlier:**
```jsx
// Old way - data loading in components
function UserProfile() {
  const { userId } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    fetchUser(userId)
      .then(setUser)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [userId]);
  
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  
  return <div>{user.name}</div>;
}
```

### **React Router v6.4+ with Loaders:**
```jsx
// Modern way - data loading at route level
export async function userLoader({ params }) {
  const user = await fetchUser(params.userId);
  return user;
}

function UserProfile() {
  const user = useLoaderData();
  return <div>{user.name}</div>; // Data is already loaded!
}

// Route definition
<Route 
  path="/users/:userId" 
  element={<UserProfile />}
  loader={userLoader}
/>
```

## 🚀 React Router v6.4+ Data Loading Features

### **1. Loaders - Pre-route Data Fetching**
Loaders run before the route component renders, ensuring data is available immediately.

```jsx
// Basic loader
export async function productLoader({ params }) {
  const product = await fetch(`/api/products/${params.productId}`);
  if (!product.ok) {
    throw new Response("Product not found", { status: 404 });
  }
  return product.json();
}

// Component using loader data
function ProductDetail() {
  const product = useLoaderData();
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>{product.description}</p>
      <p>${product.price}</p>
    </div>
  );
}

// Route with loader
<Route 
  path="/products/:productId" 
  element={<ProductDetail />}
  loader={productLoader}
/>
```

### **2. Actions - Form Submission Handling**
Actions handle form submissions and data mutations.

```jsx
// Action for form submission
export async function createProductAction({ request }) {
  const formData = await request.formData();
  const productData = Object.fromEntries(formData);
  
  const response = await fetch('/api/products', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData)
  });
  
  if (!response.ok) {
    throw new Response("Failed to create product", { status: 400 });
  }
  
  return redirect('/products');
}

// Component with form
function CreateProduct() {
  return (
    <Form method="post">
      <input name="name" placeholder="Product name" required />
      <input name="price" type="number" placeholder="Price" required />
      <textarea name="description" placeholder="Description" />
      <button type="submit">Create Product</button>
    </Form>
  );
}

// Route with action
<Route 
  path="/products/new" 
  element={<CreateProduct />}
  action={createProductAction}
/>
```

### **3. Error Boundaries with Routes**
Handle errors at the route level with error boundaries.

```jsx
// Error boundary component
function ProductErrorBoundary() {
  const error = useRouteError();
  
  if (error.status === 404) {
    return (
      <div className="error-page">
        <h1>Product Not Found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products">Back to Products</Link>
      </div>
    );
  }
  
  return (
    <div className="error-page">
      <h1>Something went wrong</h1>
      <p>{error.message}</p>
    </div>
  );
}

// Route with error boundary
<Route 
  path="/products/:productId" 
  element={<ProductDetail />}
  loader={productLoader}
  errorElement={<ProductErrorBoundary />}
/>
```

## 🔄 Data Loading Patterns

### **1. Parallel Data Loading**
Load multiple pieces of data simultaneously.

```jsx
export async function dashboardLoader() {
  // Load data in parallel
  const [user, stats, notifications, recentActivity] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications(),
    fetchRecentActivity()
  ]);
  
  return {
    user,
    stats,
    notifications,
    recentActivity
  };
}

function Dashboard() {
  const { user, stats, notifications, recentActivity } = useLoaderData();
  
  return (
    <div className="dashboard">
      <UserProfile user={user} />
      <StatsWidget stats={stats} />
      <NotificationsList notifications={notifications} />
      <ActivityFeed activity={recentActivity} />
    </div>
  );
}
```

### **2. Dependent Data Loading**
Load data that depends on other data.

```jsx
export async function userProfileLoader({ params }) {
  // First, get the user
  const user = await fetchUser(params.userId);
  
  // Then, get user-specific data
  const [posts, followers, following] = await Promise.all([
    fetchUserPosts(user.id),
    fetchUserFollowers(user.id),
    fetchUserFollowing(user.id)
  ]);
  
  return {
    user,
    posts,
    followers,
    following
  };
}
```

### **3. Conditional Data Loading**
Load data based on conditions.

```jsx
export async function productLoader({ params, request }) {
  const url = new URL(request.url);
  const includeReviews = url.searchParams.get('reviews') === 'true';
  const includeRelated = url.searchParams.get('related') === 'true';
  
  const product = await fetchProduct(params.productId);
  
  const additionalData = await Promise.all([
    includeReviews ? fetchProductReviews(product.id) : Promise.resolve(null),
    includeRelated ? fetchRelatedProducts(product.category) : Promise.resolve(null)
  ]);
  
  return {
    product,
    reviews: additionalData[0],
    relatedProducts: additionalData[1]
  };
}
```

## 🎨 Advanced Data Loading Techniques

### **1. Data Caching and Revalidation**
Implement caching to avoid unnecessary requests.

```jsx
// Simple cache implementation
const dataCache = new Map();

export async function cachedLoader({ params }) {
  const cacheKey = `product-${params.productId}`;
  const cached = dataCache.get(cacheKey);
  
  // Return cached data if it's fresh (less than 5 minutes old)
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    return cached.data;
  }
  
  // Fetch fresh data
  const product = await fetchProduct(params.productId);
  
  // Cache the result
  dataCache.set(cacheKey, {
    data: product,
    timestamp: Date.now()
  });
  
  return product;
}
```

### **2. Optimistic Updates**
Update UI immediately, then sync with server.

```jsx
export async function updateProductAction({ params, request }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);
  
  // Optimistically update the cache
  const cacheKey = `product-${params.productId}`;
  const cached = dataCache.get(cacheKey);
  if (cached) {
    dataCache.set(cacheKey, {
      ...cached,
      data: { ...cached.data, ...updates }
    });
  }
  
  try {
    // Send update to server
    const response = await fetch(`/api/products/${params.productId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updates)
    });
    
    if (!response.ok) {
      throw new Error('Update failed');
    }
    
    const updatedProduct = await response.json();
    
    // Update cache with server response
    dataCache.set(cacheKey, {
      data: updatedProduct,
      timestamp: Date.now()
    });
    
    return updatedProduct;
  } catch (error) {
    // Revert optimistic update on error
    if (cached) {
      dataCache.set(cacheKey, cached);
    }
    throw error;
  }
}
```

### **3. Background Data Refresh**
Keep data fresh in the background.

```jsx
function useBackgroundRefresh(refreshFn, interval = 30000) {
  const revalidator = useRevalidator();
  
  useEffect(() => {
    const timer = setInterval(() => {
      if (document.visibilityState === 'visible') {
        revalidator.revalidate();
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, [revalidator, interval]);
  
  // Refresh when window regains focus
  useEffect(() => {
    const handleFocus = () => revalidator.revalidate();
    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [revalidator]);
}
```

## 🔄 Loading States and UX

### **1. Global Loading States**
Show loading indicators during navigation.

```jsx
function App() {
  const navigation = useNavigation();
  const isLoading = navigation.state === 'loading';
  
  return (
    <div className="app">
      {isLoading && <GlobalLoadingBar />}
      
      <nav className="main-nav">
        <NavLink to="/">Home</NavLink>
        <NavLink to="/products">Products</NavLink>
        <NavLink to="/dashboard">Dashboard</NavLink>
      </nav>
      
      <main className={`main-content ${isLoading ? 'loading' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

function GlobalLoadingBar() {
  return (
    <div className="loading-bar">
      <div className="loading-progress"></div>
    </div>
  );
}
```

### **2. Skeleton Loading**
Show content placeholders while loading.

```jsx
function ProductListSkeleton() {
  return (
    <div className="products-grid">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="product-card skeleton">
          <div className="skeleton-image"></div>
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
        </div>
      ))}
    </div>
  );
}

// Use with Suspense
function ProductList() {
  const products = useLoaderData();
  
  return (
    <Suspense fallback={<ProductListSkeleton />}>
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Suspense>
  );
}
```

### **3. Progressive Loading**
Load critical data first, then enhance with additional data.

```jsx
export async function progressiveLoader({ params }) {
  // Load critical data immediately
  const product = await fetchProduct(params.productId);
  
  // Return critical data first
  const initialData = { product, reviews: null, related: null };
  
  // Load additional data in background
  Promise.all([
    fetchProductReviews(product.id),
    fetchRelatedProducts(product.category)
  ]).then(([reviews, related]) => {
    // Update the data (this would need a more sophisticated implementation)
    // In practice, you might use a state management solution here
  });
  
  return initialData;
}
```

## 🚨 Error Handling Strategies

### **1. Graceful Error Handling**
Handle different types of errors appropriately.

```jsx
export async function robustLoader({ params }) {
  try {
    const product = await fetchProduct(params.productId);
    
    // Try to load additional data, but don't fail if it's unavailable
    const [reviews, related] = await Promise.allSettled([
      fetchProductReviews(product.id),
      fetchRelatedProducts(product.category)
    ]);
    
    return {
      product,
      reviews: reviews.status === 'fulfilled' ? reviews.value : [],
      related: related.status === 'fulfilled' ? related.value : []
    };
  } catch (error) {
    if (error.status === 404) {
      throw new Response('Product not found', { status: 404 });
    }
    
    // For other errors, provide fallback data
    console.error('Failed to load product:', error);
    throw new Response('Failed to load product', { status: 500 });
  }
}

function ProductErrorBoundary() {
  const error = useRouteError();
  
  if (error.status === 404) {
    return <ProductNotFound />;
  }
  
  if (error.status === 500) {
    return <ProductLoadError onRetry={() => window.location.reload()} />;
  }
  
  return <GenericError error={error} />;
}
```

### **2. Retry Mechanisms**
Implement retry logic for failed requests.

```jsx
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  for (let i = 0; i <= maxRetries; i++) {
    try {
      const response = await fetch(url, options);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response;
    } catch (error) {
      lastError = error;
      
      if (i < maxRetries) {
        // Exponential backoff
        const delay = Math.pow(2, i) * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  throw lastError;
}

export async function resilientLoader({ params }) {
  const response = await fetchWithRetry(`/api/products/${params.productId}`);
  return response.json();
}
```

## 🎯 Data Loading with External Libraries

### **1. React Query Integration**
Combine React Router with React Query for advanced caching.

```jsx
import { useQuery } from '@tanstack/react-query';

export function createQueryLoader(queryKey, queryFn) {
  return async ({ params, request }) => {
    const queryClient = getQueryClient();
    
    // Pre-populate the cache
    await queryClient.prefetchQuery({
      queryKey: queryKey(params),
      queryFn: () => queryFn(params, request)
    });
    
    return null; // Data will be accessed via useQuery in component
  };
}

// Usage
export const productLoader = createQueryLoader(
  (params) => ['product', params.productId],
  (params) => fetchProduct(params.productId)
);

function ProductDetail() {
  const { productId } = useParams();
  const { data: product, isLoading, error } = useQuery({
    queryKey: ['product', productId],
    queryFn: () => fetchProduct(productId)
  });
  
  if (isLoading) return <ProductSkeleton />;
  if (error) return <ProductError error={error} />;
  
  return <ProductDisplay product={product} />;
}
```

### **2. SWR Integration**
Use SWR for data fetching with caching and revalidation.

```jsx
import useSWR from 'swr';

function ProductDetail() {
  const { productId } = useParams();
  const { data: product, error, isLoading } = useSWR(
    `/api/products/${productId}`,
    fetcher,
    {
      revalidateOnFocus: true,
      revalidateOnReconnect: true,
      dedupingInterval: 60000 // 1 minute
    }
  );
  
  if (isLoading) return <ProductSkeleton />;
  if (error) return <ProductError error={error} />;
  
  return <ProductDisplay product={product} />;
}
```

## 🎨 Advanced Patterns

### **1. Data Prefetching**
Prefetch data for likely next routes.

```jsx
function ProductCard({ product }) {
  const navigate = useNavigate();
  
  const handleMouseEnter = () => {
    // Prefetch product details
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = `/api/products/${product.id}`;
    document.head.appendChild(link);
  };
  
  const handleClick = () => {
    navigate(`/products/${product.id}`);
  };
  
  return (
    <div 
      className="product-card"
      onMouseEnter={handleMouseEnter}
      onClick={handleClick}
    >
      <img src={product.image} alt={product.name} />
      <h3>{product.name}</h3>
      <p>${product.price}</p>
    </div>
  );
}
```

### **2. Infinite Scrolling with Routes**
Implement infinite scrolling that works with routing.

```jsx
export async function infiniteProductsLoader({ request }) {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = parseInt(url.searchParams.get('limit') || '20');
  
  const products = await fetchProducts({ page, limit });
  
  return {
    products,
    page,
    hasMore: products.length === limit
  };
}

function InfiniteProductList() {
  const { products: initialProducts, page: initialPage, hasMore: initialHasMore } = useLoaderData();
  const [products, setProducts] = useState(initialProducts);
  const [page, setPage] = useState(initialPage);
  const [hasMore, setHasMore] = useState(initialHasMore);
  const [loading, setLoading] = useState(false);
  
  const loadMore = async () => {
    if (loading || !hasMore) return;
    
    setLoading(true);
    try {
      const nextPage = page + 1;
      const response = await fetch(`/api/products?page=${nextPage}&limit=20`);
      const newProducts = await response.json();
      
      setProducts(prev => [...prev, ...newProducts]);
      setPage(nextPage);
      setHasMore(newProducts.length === 20);
    } catch (error) {
      console.error('Failed to load more products:', error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <InfiniteScroll
      dataLength={products.length}
      next={loadMore}
      hasMore={hasMore}
      loader={<ProductSkeleton />}
    >
      <div className="products-grid">
        {products.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </InfiniteScroll>
  );
}
```

## 🎯 Best Practices

### **1. Data Loading Performance**
```jsx
// ✅ Good - Parallel loading
export async function dashboardLoader() {
  const [user, stats, notifications] = await Promise.all([
    fetchUser(),
    fetchStats(),
    fetchNotifications()
  ]);
  
  return { user, stats, notifications };
}

// ❌ Bad - Sequential loading
export async function slowDashboardLoader() {
  const user = await fetchUser();
  const stats = await fetchStats();
  const notifications = await fetchNotifications();
  
  return { user, stats, notifications };
}
```

### **2. Error Handling**
```jsx
// ✅ Good - Specific error handling
export async function productLoader({ params }) {
  try {
    const product = await fetchProduct(params.productId);
    return product;
  } catch (error) {
    if (error.status === 404) {
      throw new Response('Product not found', { status: 404 });
    }
    throw new Response('Failed to load product', { status: 500 });
  }
}

// ❌ Bad - Generic error handling
export async function badProductLoader({ params }) {
  const product = await fetchProduct(params.productId);
  return product; // Unhandled errors will crash the app
}
```

### **3. Loading States**
```jsx
// ✅ Good - Meaningful loading states
function App() {
  const navigation = useNavigation();
  
  return (
    <div className="app">
      {navigation.state === 'loading' && <LoadingBar />}
      {navigation.state === 'submitting' && <SavingIndicator />}
      <Outlet />
    </div>
  );
}
```

## 🎉 What You've Mastered

After completing data loading concepts, you can:

- ✅ Implement modern data loading with React Router v6.4+ loaders
- ✅ Handle form submissions with actions
- ✅ Create robust error handling strategies
- ✅ Implement advanced loading states and UX patterns
- ✅ Integrate with external data fetching libraries
- ✅ Build performant applications with caching and prefetching
- ✅ Handle complex data loading scenarios

## 🚀 What's Next?

Now that you understand data loading, you're ready for:

1. **Route Optimization** → `09-route-optimization` - Performance optimization
2. **Testing** → `10-routing-testing` - Testing routing applications
3. **Production** → `11-production-patterns` - Deployment and best practices

---

**🎉 You can now build data-driven applications with excellent UX!**

**Next:** `09-route-optimization/route-optimization-concepts.md`