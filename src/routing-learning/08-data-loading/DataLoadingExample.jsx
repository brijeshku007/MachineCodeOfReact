// 📊 Data Loading with Routes - Complete Working Example
// This demonstrates modern data loading patterns with React Router v6.4+

import React, { useState, useEffect, Suspense } from 'react';
import {
  createBrowserRouter,
  RouterProvider,
  Outlet,
  useLoaderData,
  useActionData,
  useNavigation,
  useRevalidator,
  useRouteError,
  Form,
  Link,
  NavLink,
  redirect
} from 'react-router-dom';

// =============================================================================
// MOCK API AND DATA
// =============================================================================

// Mock database
let PRODUCTS = [
  { id: 1, name: 'MacBook Pro', price: 1999, category: 'Electronics', description: 'Powerful laptop for professionals', stock: 15, rating: 4.8, reviews: [] },
  { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', description: 'Latest smartphone with advanced features', stock: 32, rating: 4.7, reviews: [] },
  { id: 3, name: 'Nike Air Max', price: 129, category: 'Shoes', description: 'Comfortable running shoes', stock: 45, rating: 4.5, reviews: [] },
  { id: 4, name: 'React Handbook', price: 29, category: 'Books', description: 'Complete guide to React development', stock: 78, rating: 4.9, reviews: [] }
];

let USERS = [
  { id: 1, name: 'John Doe', email: 'john@example.com', orders: [], preferences: { theme: 'dark' } },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', orders: [], preferences: { theme: 'light' } }
];

let ORDERS = [
  { id: 1001, userId: 1, productIds: [1, 3], total: 2128, status: 'completed', date: '2024-01-15' },
  { id: 1002, userId: 2, productIds: [2], total: 999, status: 'pending', date: '2024-01-16' }
];

// Mock API functions with realistic delays
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const api = {
  // Products
  async getProducts(filters = {}) {
    await delay(800); // Simulate network delay

    let filtered = [...PRODUCTS];

    if (filters.category) {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.search) {
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return filtered;
  },

  async getProduct(id) {
    await delay(600);
    const product = PRODUCTS.find(p => p.id === parseInt(id));
    if (!product) {
      throw new Error('Product not found');
    }
    return product;
  },

  async createProduct(productData) {
    await delay(1000);
    const newProduct = {
      id: Math.max(...PRODUCTS.map(p => p.id)) + 1,
      ...productData,
      price: parseFloat(productData.price),
      stock: parseInt(productData.stock),
      rating: 0,
      reviews: []
    };
    PRODUCTS.push(newProduct);
    return newProduct;
  },

  async updateProduct(id, updates) {
    await delay(800);
    const index = PRODUCTS.findIndex(p => p.id === parseInt(id));
    if (index === -1) {
      throw new Error('Product not found');
    }
    PRODUCTS[index] = { ...PRODUCTS[index], ...updates };
    return PRODUCTS[index];
  },

  // Users
  async getUser(id) {
    await delay(400);
    const user = USERS.find(u => u.id === parseInt(id));
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  },

  // Orders
  async getUserOrders(userId) {
    await delay(500);
    return ORDERS.filter(o => o.userId === parseInt(userId));
  },

  // Dashboard data
  async getDashboardData() {
    await delay(1200);

    // Simulate parallel data loading
    const [products, users, orders] = await Promise.all([
      Promise.resolve(PRODUCTS),
      Promise.resolve(USERS),
      Promise.resolve(ORDERS)
    ]);

    return {
      stats: {
        totalProducts: products.length,
        totalUsers: users.length,
        totalOrders: orders.length,
        revenue: orders.reduce((sum, order) => sum + order.total, 0)
      },
      recentOrders: orders.slice(-5),
      topProducts: products.sort((a, b) => b.rating - a.rating).slice(0, 3)
    };
  },

  // Reviews
  async getProductReviews(productId) {
    await delay(300);
    return [
      { id: 1, userId: 1, rating: 5, comment: 'Excellent product!', date: '2024-01-10' },
      { id: 2, userId: 2, rating: 4, comment: 'Good value for money', date: '2024-01-12' }
    ];
  }
};

// =============================================================================
// LOADERS - Data fetching functions
// =============================================================================

// Products list loader with filtering
export async function productsLoader({ request }) {
  const url = new URL(request.url);
  const category = url.searchParams.get('category');
  const search = url.searchParams.get('search');

  try {
    const products = await api.getProducts({ category, search });
    return { products, filters: { category, search } };
  } catch (error) {
    throw new Response('Failed to load products', { status: 500 });
  }
}

// Single product loader with additional data
export async function productLoader({ params }) {
  try {
    // Load product and reviews in parallel
    const [product, reviews] = await Promise.all([
      api.getProduct(params.productId),
      api.getProductReviews(params.productId)
    ]);

    return { product, reviews };
  } catch (error) {
    if (error.message === 'Product not found') {
      throw new Response('Product not found', { status: 404 });
    }
    throw new Response('Failed to load product', { status: 500 });
  }
}

// Dashboard loader with parallel data fetching
export async function dashboardLoader() {
  try {
    const dashboardData = await api.getDashboardData();
    return dashboardData;
  } catch (error) {
    throw new Response('Failed to load dashboard', { status: 500 });
  }
}

// User profile loader with dependent data
export async function userProfileLoader({ params }) {
  try {
    const user = await api.getUser(params.userId);
    const orders = await api.getUserOrders(user.id);

    return { user, orders };
  } catch (error) {
    if (error.message === 'User not found') {
      throw new Response('User not found', { status: 404 });
    }
    throw new Response('Failed to load user profile', { status: 500 });
  }
}

// =============================================================================
// ACTIONS - Form submission handlers
// =============================================================================

// Create product action
export async function createProductAction({ request }) {
  const formData = await request.formData();
  const productData = Object.fromEntries(formData);

  // Validation
  if (!productData.name || !productData.price) {
    return {
      error: 'Name and price are required',
      values: productData
    };
  }

  try {
    await api.createProduct(productData);
    return redirect('/products?created=true');
  } catch (error) {
    return {
      error: 'Failed to create product',
      values: productData
    };
  }
}

// Update product action
export async function updateProductAction({ params, request }) {
  const formData = await request.formData();
  const updates = Object.fromEntries(formData);

  try {
    await api.updateProduct(params.productId, updates);
    return redirect(`/products/${params.productId}?updated=true`);
  } catch (error) {
    return {
      error: 'Failed to update product',
      values: updates
    };
  }
}

// =============================================================================
// COMPONENTS
// =============================================================================

// Root layout with navigation and loading states
function RootLayout() {
  const navigation = useNavigation();
  const revalidator = useRevalidator();

  const isLoading = navigation.state === 'loading';
  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="app">
      {/* Global loading bar */}
      {isLoading && (
        <div className="loading-bar">
          <div className="loading-progress"></div>
        </div>
      )}

      {/* Global submitting indicator */}
      {isSubmitting && (
        <div className="submitting-indicator">
          Saving changes...
        </div>
      )}

      <nav className="main-nav">
        <div className="nav-brand">
          <Link to="/">📊 Data Loading Demo</Link>
        </div>

        <div className="nav-links">
          <NavLink to="/products">Products</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
          <NavLink to="/users/1">Profile</NavLink>
          <NavLink to="/products/new">Add Product</NavLink>
        </div>

        <div className="nav-actions">
          <button
            onClick={() => revalidator.revalidate()}
            disabled={revalidator.state === 'loading'}
            className="refresh-btn"
          >
            {revalidator.state === 'loading' ? '🔄' : '↻'} Refresh
          </button>
        </div>
      </nav>

      <main className={`main-content ${isLoading ? 'loading' : ''}`}>
        <Outlet />
      </main>
    </div>
  );
}

// Products list with filtering
function ProductsList() {
  const { products, filters } = useLoaderData();
  const navigation = useNavigation();

  const isFiltering = navigation.location?.search !== window.location.search;

  return (
    <div className="products-page">
      <div className="page-header">
        <h1>📦 Products ({products.length})</h1>
        <Link to="/products/new" className="btn-primary">Add Product</Link>
      </div>

      {/* Filters */}
      <div className="filters">
        <Form method="get" className="filter-form">
          <input
            name="search"
            placeholder="Search products..."
            defaultValue={filters.search || ''}
            className="search-input"
          />

          <select name="category" defaultValue={filters.category || ''}>
            <option value="">All Categories</option>
            <option value="Electronics">Electronics</option>
            <option value="Shoes">Shoes</option>
            <option value="Books">Books</option>
          </select>

          <button type="submit" className="btn-secondary">
            {isFiltering ? 'Filtering...' : 'Filter'}
          </button>
        </Form>
      </div>

      {/* Products grid */}
      <div className={`products-grid ${isFiltering ? 'filtering' : ''}`}>
        {isFiltering && <ProductsGridSkeleton />}

        {!isFiltering && products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="category">{product.category}</p>
            <p className="stock">Stock: {product.stock}</p>
            <div className="rating">⭐ {product.rating}</div>

            <div className="product-actions">
              <Link to={`/products/${product.id}`} className="btn-primary">
                View Details
              </Link>
              <Link to={`/products/${product.id}/edit`} className="btn-secondary">
                Edit
              </Link>
            </div>
          </div>
        ))}
      </div>

      {!isFiltering && products.length === 0 && (
        <div className="empty-state">
          <h3>No products found</h3>
          <p>Try adjusting your filters or add a new product.</p>
        </div>
      )}
    </div>
  );
}

// Product detail with reviews
function ProductDetail() {
  const { product, reviews } = useLoaderData();
  const [showReviews, setShowReviews] = useState(false);

  return (
    <div className="product-detail">
      <div className="product-header">
        <Link to="/products" className="back-link">← Back to Products</Link>
        <h1>{product.name}</h1>
      </div>

      <div className="product-content">
        <div className="product-info">
          <div className="product-image">📦</div>
          <div className="product-details">
            <h2>{product.name}</h2>
            <p className="price">${product.price}</p>
            <p className="category">Category: {product.category}</p>
            <p className="description">{product.description}</p>
            <p className="stock">In Stock: {product.stock}</p>
            <div className="rating">⭐ {product.rating} ({reviews.length} reviews)</div>
          </div>
        </div>

        <div className="product-actions">
          <button className="btn-primary">Add to Cart</button>
          <Link to={`/products/${product.id}/edit`} className="btn-secondary">
            Edit Product
          </Link>
        </div>
      </div>

      {/* Reviews section */}
      <div className="reviews-section">
        <button
          onClick={() => setShowReviews(!showReviews)}
          className="reviews-toggle"
        >
          {showReviews ? 'Hide' : 'Show'} Reviews ({reviews.length})
        </button>

        {showReviews && (
          <div className="reviews-list">
            {reviews.map(review => (
              <div key={review.id} className="review-item">
                <div className="review-header">
                  <span className="rating">⭐ {review.rating}</span>
                  <span className="date">{review.date}</span>
                </div>
                <p className="comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Dashboard with parallel loaded data
function Dashboard() {
  const { stats, recentOrders, topProducts } = useLoaderData();

  return (
    <div className="dashboard">
      <h1>📊 Dashboard</h1>

      {/* Stats grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <div className="stat-number">{stats.totalProducts}</div>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <div className="stat-number">{stats.totalUsers}</div>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <div className="stat-number">{stats.totalOrders}</div>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <div className="stat-number">${stats.revenue.toLocaleString()}</div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="dashboard-section">
        <h2>Recent Orders</h2>
        <div className="orders-list">
          {recentOrders.map(order => (
            <div key={order.id} className="order-item">
              <span className="order-id">#{order.id}</span>
              <span className="order-total">${order.total}</span>
              <span className={`order-status status-${order.status}`}>
                {order.status}
              </span>
              <span className="order-date">{order.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Top products */}
      <div className="dashboard-section">
        <h2>Top Rated Products</h2>
        <div className="top-products">
          {topProducts.map(product => (
            <div key={product.id} className="top-product">
              <Link to={`/products/${product.id}`}>
                <h4>{product.name}</h4>
                <div className="rating">⭐ {product.rating}</div>
                <div className="price">${product.price}</div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// User profile with dependent data
function UserProfile() {
  const { user, orders } = useLoaderData();

  return (
    <div className="user-profile">
      <h1>👤 User Profile</h1>

      <div className="profile-content">
        <div className="user-info">
          <h2>{user.name}</h2>
          <p>Email: {user.email}</p>
          <p>Theme: {user.preferences.theme}</p>
        </div>

        <div className="user-orders">
          <h3>Order History ({orders.length})</h3>
          {orders.length === 0 ? (
            <p>No orders yet.</p>
          ) : (
            <div className="orders-list">
              {orders.map(order => (
                <div key={order.id} className="order-item">
                  <span className="order-id">#{order.id}</span>
                  <span className="order-total">${order.total}</span>
                  <span className={`order-status status-${order.status}`}>
                    {order.status}
                  </span>
                  <span className="order-date">{order.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Create product form
function CreateProduct() {
  const actionData = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="create-product">
      <div className="page-header">
        <Link to="/products" className="back-link">← Back to Products</Link>
        <h1>Add New Product</h1>
      </div>

      {actionData?.error && (
        <div className="error-message">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            name="name"
            required
            defaultValue={actionData?.values?.name || ''}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={actionData?.values?.price || ''}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            required
            defaultValue={actionData?.values?.category || ''}
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Shoes">Shoes</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            defaultValue={actionData?.values?.description || ''}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            name="stock"
            type="number"
            required
            defaultValue={actionData?.values?.stock || ''}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Creating...' : 'Create Product'}
          </button>
          <Link to="/products" className="btn-secondary">Cancel</Link>
        </div>
      </Form>
    </div>
  );
}

// Edit product form (similar to create but with loader data)
function EditProduct() {
  const { product } = useLoaderData();
  const actionData = useActionData();
  const navigation = useNavigation();

  const isSubmitting = navigation.state === 'submitting';

  return (
    <div className="edit-product">
      <div className="page-header">
        <Link to={`/products/${product.id}`} className="back-link">← Back to Product</Link>
        <h1>Edit Product</h1>
      </div>

      {actionData?.error && (
        <div className="error-message">
          {actionData.error}
        </div>
      )}

      <Form method="post" className="product-form">
        <div className="form-group">
          <label>Product Name:</label>
          <input
            name="name"
            required
            defaultValue={actionData?.values?.name || product.name}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Price:</label>
          <input
            name="price"
            type="number"
            step="0.01"
            required
            defaultValue={actionData?.values?.price || product.price}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Category:</label>
          <select
            name="category"
            required
            defaultValue={actionData?.values?.category || product.category}
            disabled={isSubmitting}
          >
            <option value="">Select Category</option>
            <option value="Electronics">Electronics</option>
            <option value="Shoes">Shoes</option>
            <option value="Books">Books</option>
          </select>
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea
            name="description"
            defaultValue={actionData?.values?.description || product.description}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-group">
          <label>Stock:</label>
          <input
            name="stock"
            type="number"
            required
            defaultValue={actionData?.values?.stock || product.stock}
            disabled={isSubmitting}
          />
        </div>

        <div className="form-actions">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn-primary"
          >
            {isSubmitting ? 'Updating...' : 'Update Product'}
          </button>
          <Link to={`/products/${product.id}`} className="btn-secondary">Cancel</Link>
        </div>
      </Form>
    </div>
  );
}

// =============================================================================
// ERROR BOUNDARIES
// =============================================================================

function ProductErrorBoundary() {
  const error = useRouteError();

  if (error.status === 404) {
    return (
      <div className="error-page">
        <h1>🚫 Product Not Found</h1>
        <p>The product you're looking for doesn't exist.</p>
        <Link to="/products" className="btn-primary">Browse Products</Link>
      </div>
    );
  }

  return (
    <div className="error-page">
      <h1>⚠️ Something went wrong</h1>
      <p>Failed to load product data.</p>
      <div className="error-actions">
        <button onClick={() => window.location.reload()} className="btn-primary">
          Try Again
        </button>
        <Link to="/products" className="btn-secondary">Browse Products</Link>
      </div>
    </div>
  );
}

function GeneralErrorBoundary() {
  const error = useRouteError();

  return (
    <div className="error-page">
      <h1>⚠️ Oops! Something went wrong</h1>
      <p>We encountered an error while loading this page.</p>
      <details className="error-details">
        <summary>Error Details</summary>
        <pre>{error.message}</pre>
      </details>
      <div className="error-actions">
        <button onClick={() => window.location.reload()} className="btn-primary">
          Reload Page
        </button>
        <Link to="/" className="btn-secondary">Go Home</Link>
      </div>
    </div>
  );
}

// =============================================================================
// LOADING SKELETONS
// =============================================================================

function ProductsGridSkeleton() {
  return (
    <div className="products-grid skeleton-grid">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="product-card skeleton">
          <div className="skeleton-title"></div>
          <div className="skeleton-price"></div>
          <div className="skeleton-category"></div>
          <div className="skeleton-stock"></div>
          <div className="skeleton-rating"></div>
          <div className="skeleton-actions">
            <div className="skeleton-button"></div>
            <div className="skeleton-button"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="dashboard skeleton">
      <div className="skeleton-title"></div>
      <div className="stats-grid">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="stat-card skeleton">
            <div className="skeleton-stat-title"></div>
            <div className="skeleton-stat-number"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// ROUTER CONFIGURATION
// =============================================================================

const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <GeneralErrorBoundary />,
    children: [
      {
        index: true,
        element: (
          <div className="home-page">
            <h1>📊 Data Loading Demo</h1>
            <p>Explore modern data loading patterns with React Router v6.4+</p>
            <div className="home-links">
              <Link to="/products" className="btn-primary">Browse Products</Link>
              <Link to="/dashboard" className="btn-secondary">View Dashboard</Link>
            </div>
          </div>
        )
      },
      {
        path: 'products',
        children: [
          {
            index: true,
            element: <ProductsList />,
            loader: productsLoader
          },
          {
            path: 'new',
            element: <CreateProduct />,
            action: createProductAction
          },
          {
            path: ':productId',
            element: <ProductDetail />,
            loader: productLoader,
            errorElement: <ProductErrorBoundary />
          },
          {
            path: ':productId/edit',
            element: <EditProduct />,
            loader: productLoader,
            action: updateProductAction,
            errorElement: <ProductErrorBoundary />
          }
        ]
      },
      {
        path: 'dashboard',
        element: <Dashboard />,
        loader: dashboardLoader
      },
      {
        path: 'users/:userId',
        element: <UserProfile />,
        loader: userProfileLoader
      }
    ]
  }
]);

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function DataLoadingApp() {
  return <RouterProvider router={router} />;
}

export default DataLoadingApp;

// =============================================================================
// CSS STYLES
// =============================================================================

const styles = `
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

/* Loading States */
.loading-bar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: #e0e0e0;
  z-index: 1000;
}

.loading-progress {
  height: 100%;
  background: linear-gradient(90deg, #667eea, #764ba2);
  animation: loading 2s ease-in-out infinite;
}

@keyframes loading {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.submitting-indicator {
  position: fixed;
  top: 20px;
  right: 20px;
  background: #4caf50;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  z-index: 1000;
  animation: fadeIn 0.3s ease;
}

/* Navigation */
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
  transition: all 0.3s;
}

.nav-links a:hover,
.nav-links a.active {
  background-color: rgba(255, 255, 255, 0.1);
  color: white;
}

.refresh-btn {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.3);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Main Content */
.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  transition: opacity 0.3s;
}

.main-content.loading {
  opacity: 0.7;
}

/* Products */
.products-page {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.filters {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.filter-form {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-input {
  flex: 1;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  transition: opacity 0.3s;
}

.products-grid.filtering {
  opacity: 0.5;
}

.product-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  transition: transform 0.3s, box-shadow 0.3s;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
}

.product-card h3 {
  margin: 0 0 1rem 0;
  color: #333;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0.5rem 0;
}

.category {
  color: #666;
  font-size: 0.9rem;
}

.stock {
  color: #666;
  font-size: 0.9rem;
}

.rating {
  margin: 0.5rem 0;
  font-weight: bold;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* Product Detail */
.product-detail {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.product-header {
  margin-bottom: 2rem;
}

.back-link {
  color: #667eea;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
}

.product-content {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-info {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: 2rem;
}

.product-image {
  font-size: 4rem;
  text-align: center;
  padding: 2rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.reviews-section {
  border-top: 1px solid #eee;
  padding-top: 2rem;
}

.reviews-toggle {
  background: #f8f9fa;
  border: 1px solid #ddd;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  margin-bottom: 1rem;
}

.reviews-list {
  display: grid;
  gap: 1rem;
}

.review-item {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
}

.review-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
  font-size: 0.9rem;
  color: #666;
}

/* Dashboard */
.dashboard {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.stat-card {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
}

.dashboard-section {
  margin: 3rem 0;
}

.orders-list {
  display: grid;
  gap: 0.5rem;
}

.order-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-completed {
  background: #d4edda;
  color: #155724;
}

.status-pending {
  background: #fff3cd;
  color: #856404;
}

.top-products {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.top-product {
  background: #f8f9fa;
  border-radius: 8px;
  overflow: hidden;
}

.top-product a {
  display: block;
  padding: 1rem;
  text-decoration: none;
  color: inherit;
}

.top-product:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}

/* Forms */
.product-form {
  max-width: 600px;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
  color: #333;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  border-color: #667eea;
  outline: none;
}

.form-group textarea {
  height: 100px;
  resize: vertical;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
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

/* Error States */
.error-page {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  border: 1px solid #f5c6cb;
}

.error-details {
  margin: 1rem 0;
  text-align: left;
}

.error-details pre {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  overflow-x: auto;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* Empty States */
.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}

/* Skeletons */
.skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0% { opacity: 1; }
  50% { opacity: 0.5; }
  100% { opacity: 1; }
}

.skeleton-title {
  height: 1.5rem;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 1rem;
}

.skeleton-price {
  height: 2rem;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  width: 60%;
}

.skeleton-category,
.skeleton-stock,
.skeleton-rating {
  height: 1rem;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  width: 80%;
}

.skeleton-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.skeleton-button {
  height: 2.5rem;
  background: #e0e0e0;
  border-radius: 4px;
  flex: 1;
}

.skeleton-stat-title {
  height: 1rem;
  background: #e0e0e0;
  border-radius: 4px;
  margin-bottom: 1rem;
  width: 70%;
  margin-left: auto;
  margin-right: auto;
}

.skeleton-stat-number {
  height: 3rem;
  background: #e0e0e0;
  border-radius: 4px;
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}

/* Home Page */
.home-page {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.home-links {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
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

  .products-grid {
    grid-template-columns: 1fr;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .product-info {
    grid-template-columns: 1fr;
  }

  .filter-form {
    flex-direction: column;
  }

  .form-actions,
  .error-actions,
  .home-links {
    flex-direction: column;
  }
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}