// 🎯 Route Parameters - Complete Working Examples
// This demonstrates all types of route parameters in action

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useParams, useSearchParams, Navigate } from 'react-router-dom';

// =============================================================================
// EXAMPLE 1: E-commerce with Path Parameters
// =============================================================================

// Mock product data
const PRODUCTS = {
  1: { id: 1, name: 'MacBook Pro', price: 1999, category: 'electronics', brand: 'Apple' },
  2: { id: 2, name: 'iPhone 15', price: 999, category: 'electronics', brand: 'Apple' },
  3: { id: 3, name: 'Nike Air Max', price: 129, category: 'shoes', brand: 'Nike' },
  4: { id: 4, name: 'React Handbook', price: 29, category: 'books', brand: 'TechBooks' }
};

const CATEGORIES = {
  electronics: { name: 'Electronics', icon: '💻' },
  shoes: { name: 'Shoes', icon: '👟' },
  books: { name: 'Books', icon: '📚' }
};

// Product List Component
function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();

  const category = searchParams.get('category');
  const sort = searchParams.get('sort') || 'name';
  const search = searchParams.get('search') || '';

  // Filter and sort products
  let filteredProducts = Object.values(PRODUCTS);

  if (category) {
    filteredProducts = filteredProducts.filter(p => p.category === category);
  }

  if (search) {
    filteredProducts = filteredProducts.filter(p =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );
  }

  filteredProducts.sort((a, b) => {
    if (sort === 'price') return a.price - b.price;
    if (sort === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  const handleFilterChange = (key, value) => {
    setSearchParams(prev => {
      if (value) {
        prev.set(key, value);
      } else {
        prev.delete(key);
      }
      prev.delete('page'); // Reset pagination
      return prev;
    });
  };

  return (
    <div className="product-list">
      <h1>🛍️ Products</h1>

      {/* Filters */}
      <div className="filters">
        <div className="filter-group">
          <label>Category:</label>
          <select
            value={category || ''}
            onChange={(e) => handleFilterChange('category', e.target.value)}
          >
            <option value="">All Categories</option>
            {Object.entries(CATEGORIES).map(([key, cat]) => (
              <option key={key} value={key}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>

        <div className="filter-group">
          <label>Sort by:</label>
          <select
            value={sort}
            onChange={(e) => handleFilterChange('sort', e.target.value)}
          >
            <option value="name">Name</option>
            <option value="price">Price</option>
          </select>
        </div>

        <div className="filter-group">
          <label>Search:</label>
          <input
            type="text"
            value={search}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            placeholder="Search products..."
          />
        </div>
      </div>

      {/* Current filters display */}
      <div className="active-filters">
        <strong>Active Filters:</strong>
        {category && <span className="filter-tag">Category: {CATEGORIES[category].name}</span>}
        {search && <span className="filter-tag">Search: "{search}"</span>}
        <span className="filter-tag">Sort: {sort}</span>
      </div>

      {/* Products grid */}
      <div className="products-grid">
        {filteredProducts.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>
            <p className="category">{CATEGORIES[product.category].icon} {CATEGORIES[product.category].name}</p>
            <p className="brand">Brand: {product.brand}</p>

            {/* Link with path parameter */}
            <Link
              to={`/products/${product.id}`}
              className="btn-primary"
            >
              View Details
            </Link>

            {/* Link preserving current search params */}
            <Link
              to={`/products/${product.id}?${searchParams.toString()}`}
              className="btn-secondary"
            >
              View (Keep Filters)
            </Link>
          </div>
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-results">
          <h3>No products found</h3>
          <p>Try adjusting your filters</p>
        </div>
      )}
    </div>
  );
}

// Product Detail Component - Uses Path Parameters
function ProductDetail() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();

  // Get optional query parameters
  const color = searchParams.get('color');
  const size = searchParams.get('size');
  const returnFilters = searchParams.get('category') || searchParams.get('search');

  // Find product
  const product = PRODUCTS[productId];

  // Validate product exists
  if (!product) {
    return (
      <div className="error-page">
        <h1>❌ Product Not Found</h1>
        <p>Product with ID "{productId}" doesn't exist.</p>
        <Link to="/products" className="btn-primary">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="breadcrumb">
        <Link to="/products">Products</Link>
        {returnFilters && (
          <>
            {' > '}
            <Link to={`/products?${searchParams.toString()}`}>
              Filtered Results
            </Link>
          </>
        )}
        {' > '} {product.name}
      </div>

      <div className="product-info">
        <h1>{product.name}</h1>
        <p className="product-id">Product ID: {productId}</p>
        <p className="price">${product.price}</p>
        <p className="category">
          {CATEGORIES[product.category].icon} {CATEGORIES[product.category].name}
        </p>
        <p className="brand">Brand: {product.brand}</p>

        {/* Show selected options if any */}
        {color && <p className="selected-option">Selected Color: <strong>{color}</strong></p>}
        {size && <p className="selected-option">Selected Size: <strong>{size}</strong></p>}
      </div>

      {/* Product options */}
      <div className="product-options">
        <h3>Customize Your Product:</h3>
        <div className="option-group">
          <label>Color:</label>
          <div className="option-buttons">
            <Link to={`/products/${productId}?color=red`} className={`option-btn ${color === 'red' ? 'active' : ''}`}>
              Red
            </Link>
            <Link to={`/products/${productId}?color=blue`} className={`option-btn ${color === 'blue' ? 'active' : ''}`}>
              Blue
            </Link>
            <Link to={`/products/${productId}?color=black`} className={`option-btn ${color === 'black' ? 'active' : ''}`}>
              Black
            </Link>
          </div>
        </div>

        <div className="option-group">
          <label>Size:</label>
          <div className="option-buttons">
            <Link to={`/products/${productId}?${new URLSearchParams({ ...Object.fromEntries(searchParams), size: 'small' })}`}
              className={`option-btn ${size === 'small' ? 'active' : ''}`}>
              Small
            </Link>
            <Link to={`/products/${productId}?${new URLSearchParams({ ...Object.fromEntries(searchParams), size: 'medium' })}`}
              className={`option-btn ${size === 'medium' ? 'active' : ''}`}>
              Medium
            </Link>
            <Link to={`/products/${productId}?${new URLSearchParams({ ...Object.fromEntries(searchParams), size: 'large' })}`}
              className={`option-btn ${size === 'large' ? 'active' : ''}`}>
              Large
            </Link>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="product-actions">
        <Link
          to={returnFilters ? `/products?${searchParams.toString()}` : '/products'}
          className="btn-secondary"
        >
          ← Back to {returnFilters ? 'Filtered Results' : 'Products'}
        </Link>
        <button className="btn-primary">Add to Cart</button>
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 2: User Profile with Multiple Parameters
// =============================================================================

// Mock user data
const USERS = {
  1: { id: 1, name: 'John Doe', email: 'john@example.com', posts: 15, followers: 120 },
  2: { id: 2, name: 'Jane Smith', email: 'jane@example.com', posts: 8, followers: 89 },
  3: { id: 3, name: 'Bob Johnson', email: 'bob@example.com', posts: 23, followers: 156 }
};

// User Profile Component - Multiple Path Parameters
function UserProfile() {
  const { userId, tab = 'profile' } = useParams();
  const [searchParams] = useSearchParams();

  const user = USERS[userId];

  if (!user) {
    return (
      <div className="error-page">
        <h1>❌ User Not Found</h1>
        <p>User with ID "{userId}" doesn't exist.</p>
        <Link to="/users" className="btn-primary">← Back to Users</Link>
      </div>
    );
  }

  const validTabs = ['profile', 'posts', 'settings'];
  if (!validTabs.includes(tab)) {
    return <Navigate to={`/users/${userId}/profile`} replace />;
  }

  return (
    <div className="user-profile">
      <div className="user-header">
        <h1>{user.name}</h1>
        <p>{user.email}</p>
        <div className="user-stats">
          <span>{user.posts} posts</span>
          <span>{user.followers} followers</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <nav className="tab-nav">
        <Link
          to={`/users/${userId}/profile`}
          className={`tab ${tab === 'profile' ? 'active' : ''}`}
        >
          👤 Profile
        </Link>
        <Link
          to={`/users/${userId}/posts`}
          className={`tab ${tab === 'posts' ? 'active' : ''}`}
        >
          📝 Posts
        </Link>
        <Link
          to={`/users/${userId}/settings`}
          className={`tab ${tab === 'settings' ? 'active' : ''}`}
        >
          ⚙️ Settings
        </Link>
      </nav>

      {/* Tab Content */}
      <div className="tab-content">
        {tab === 'profile' && <UserProfileTab user={user} />}
        {tab === 'posts' && <UserPostsTab user={user} searchParams={searchParams} />}
        {tab === 'settings' && <UserSettingsTab user={user} />}
      </div>
    </div>
  );
}

function UserProfileTab({ user }) {
  return (
    <div className="profile-tab">
      <h2>Profile Information</h2>
      <div className="profile-info">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        <p><strong>Posts:</strong> {user.posts}</p>
        <p><strong>Followers:</strong> {user.followers}</p>
      </div>
    </div>
  );
}

function UserPostsTab({ user, searchParams }) {
  const sort = searchParams.get('sort') || 'date';
  const filter = searchParams.get('filter') || 'all';

  return (
    <div className="posts-tab">
      <h2>Posts by {user.name}</h2>

      <div className="posts-filters">
        <Link to={`/users/${user.id}/posts?sort=date`}
          className={sort === 'date' ? 'active' : ''}>
          Sort by Date
        </Link>
        <Link to={`/users/${user.id}/posts?sort=title`}
          className={sort === 'title' ? 'active' : ''}>
          Sort by Title
        </Link>
      </div>

      <p>Showing {user.posts} posts (sorted by {sort})</p>
    </div>
  );
}

function UserSettingsTab({ user }) {
  return (
    <div className="settings-tab">
      <h2>Settings for {user.name}</h2>
      <p>User settings would go here...</p>
    </div>
  );
}

// Users List Component
function UsersList() {
  return (
    <div className="users-list">
      <h1>👥 Users</h1>
      <div className="users-grid">
        {Object.values(USERS).map(user => (
          <div key={user.id} className="user-card">
            <h3>{user.name}</h3>
            <p>{user.email}</p>
            <p>{user.posts} posts • {user.followers} followers</p>
            <Link to={`/users/${user.id}`} className="btn-primary">
              View Profile
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 3: Search with Query Parameters
// =============================================================================

function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1');
  const resultsPerPage = 5;

  // Mock search results
  const allResults = query ? [
    { id: 1, title: `${query} in React`, type: 'article' },
    { id: 2, title: `Advanced ${query} Techniques`, type: 'tutorial' },
    { id: 3, title: `${query} Best Practices`, type: 'guide' },
    { id: 4, title: `${query} Examples`, type: 'code' },
    { id: 5, title: `${query} Documentation`, type: 'docs' },
    { id: 6, title: `${query} Community Discussion`, type: 'forum' },
    { id: 7, title: `${query} Video Tutorial`, type: 'video' },
    { id: 8, title: `${query} Case Study`, type: 'article' }
  ] : [];

  const filteredResults = category === 'all'
    ? allResults
    : allResults.filter(r => r.type === category);

  const totalPages = Math.ceil(filteredResults.length / resultsPerPage);
  const startIndex = (page - 1) * resultsPerPage;
  const paginatedResults = filteredResults.slice(startIndex, startIndex + resultsPerPage);

  const updateSearch = (newParams) => {
    setSearchParams(prev => {
      Object.entries(newParams).forEach(([key, value]) => {
        if (value) {
          prev.set(key, value);
        } else {
          prev.delete(key);
        }
      });
      return prev;
    });
  };

  return (
    <div className="search-page">
      <h1>🔍 Search</h1>

      {/* Search Form */}
      <div className="search-form">
        <input
          type="text"
          value={query}
          onChange={(e) => updateSearch({ q: e.target.value, page: '1' })}
          placeholder="Search for anything..."
          className="search-input"
        />

        <select
          value={category}
          onChange={(e) => updateSearch({ category: e.target.value, page: '1' })}
          className="category-select"
        >
          <option value="all">All Categories</option>
          <option value="article">Articles</option>
          <option value="tutorial">Tutorials</option>
          <option value="guide">Guides</option>
          <option value="code">Code Examples</option>
          <option value="docs">Documentation</option>
          <option value="forum">Forum</option>
          <option value="video">Videos</option>
        </select>
      </div>

      {/* Search Results */}
      {query && (
        <div className="search-results">
          <div className="results-info">
            <h2>Results for "{query}"</h2>
            <p>
              Found {filteredResults.length} results
              {category !== 'all' && ` in ${category}`}
              {totalPages > 1 && ` (Page ${page} of ${totalPages})`}
            </p>
          </div>

          <div className="results-list">
            {paginatedResults.map(result => (
              <div key={result.id} className="result-item">
                <h3>{result.title}</h3>
                <p className="result-type">Type: {result.type}</p>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button
                onClick={() => updateSearch({ page: (page - 1).toString() })}
                disabled={page === 1}
                className="btn-secondary"
              >
                ← Previous
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i + 1}
                  onClick={() => updateSearch({ page: (i + 1).toString() })}
                  className={`page-btn ${page === i + 1 ? 'active' : ''}`}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => updateSearch({ page: (page + 1).toString() })}
                disabled={page === totalPages}
                className="btn-secondary"
              >
                Next →
              </button>
            </div>
          )}
        </div>
      )}

      {!query && (
        <div className="search-placeholder">
          <h3>Start typing to search...</h3>
          <p>Try searching for "React", "JavaScript", or "CSS"</p>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function RouteParametersApp() {
  return (
    <BrowserRouter>
      <div className="app">
        <nav className="main-nav">
          <Link to="/" className="nav-brand">🎯 Route Parameters Demo</Link>
          <div className="nav-links">
            <Link to="/products">Products</Link>
            <Link to="/users">Users</Link>
            <Link to="/search">Search</Link>
          </div>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ProductList />} />
            <Route path="/products/:productId" element={<ProductDetail />} />
            <Route path="/users" element={<UsersList />} />
            <Route path="/users/:userId" element={<UserProfile />} />
            <Route path="/users/:userId/:tab" element={<UserProfile />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

function HomePage() {
  return (
    <div className="home-page">
      <h1>🎯 Route Parameters Examples</h1>
      <p>Explore different types of route parameters:</p>

      <div className="examples-grid">
        <div className="example-card">
          <h3>🛍️ E-commerce</h3>
          <p>Path parameters for product details, query parameters for filters</p>
          <Link to="/products" className="btn-primary">View Products</Link>
        </div>

        <div className="example-card">
          <h3>👥 User Profiles</h3>
          <p>Multiple path parameters for user profiles with tabs</p>
          <Link to="/users" className="btn-primary">View Users</Link>
        </div>

        <div className="example-card">
          <h3>🔍 Search</h3>
          <p>Query parameters for search, filters, and pagination</p>
          <Link to="/search" className="btn-primary">Try Search</Link>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  return (
    <div className="error-page">
      <h1>🚫 404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <Link to="/" className="btn-primary">← Go Home</Link>
    </div>
  );
}

export default RouteParametersApp;

// CSS Styles
const styles = `
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.main-nav {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.nav-brand {
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

.main-content {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 8px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.filter-group label {
  font-weight: bold;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.active-filters {
  margin-bottom: 1rem;
  padding: 0.5rem;
}

.filter-tag {
  background-color: #e3f2fd;
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  border-radius: 12px;
  font-size: 0.9rem;
}

.products-grid,
.users-grid,
.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-top: 1rem;
}

.product-card,
.user-card,
.example-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  transition: transform 0.3s;
}

.product-card:hover,
.user-card:hover,
.example-card:hover {
  transform: translateY(-2px);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 0.5rem 0;
}

.btn-primary,
.btn-secondary {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  text-decoration: none;
  font-weight: 500;
  text-align: center;
  cursor: pointer;
  border: none;
  margin: 0.25rem;
  transition: background-color 0.3s;
}

.btn-primary {
  background-color: #3498db;
  color: white;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.btn-secondary {
  background-color: #95a5a6;
  color: white;
}

.btn-secondary:hover {
  background-color: #7f8c8d;
}

.product-detail {
  max-width: 800px;
  margin: 0 auto;
}

.breadcrumb {
  margin-bottom: 1rem;
  color: #666;
}

.breadcrumb a {
  color: #3498db;
  text-decoration: none;
}

.product-info {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.product-options {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
}

.option-group {
  margin-bottom: 1rem;
}

.option-buttons {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.5rem;
}

.option-btn {
  padding: 0.5rem 1rem;
  border: 2px solid #ddd;
  border-radius: 4px;
  text-decoration: none;
  color: #333;
  transition: all 0.3s;
}

.option-btn:hover {
  border-color: #3498db;
}

.option-btn.active {
  border-color: #3498db;
  background-color: #3498db;
  color: white;
}

.user-profile {
  max-width: 800px;
  margin: 0 auto;
}

.user-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  text-align: center;
}

.user-stats {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 1rem;
}

.user-stats span {
  background-color: #f8f9fa;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.tab-nav {
  display: flex;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 1rem;
  overflow: hidden;
}

.tab {
  flex: 1;
  padding: 1rem;
  text-align: center;
  text-decoration: none;
  color: #666;
  transition: all 0.3s;
}

.tab:hover {
  background-color: #f8f9fa;
}

.tab.active {
  background-color: #3498db;
  color: white;
}

.tab-content {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.search-form {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.search-input {
  flex: 1;
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.search-input:focus {
  border-color: #3498db;
  outline: none;
}

.category-select {
  padding: 1rem;
  border: 2px solid #ddd;
  border-radius: 8px;
  font-size: 1rem;
}

.results-list {
  margin: 1rem 0;
}

.result-item {
  background: white;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.result-type {
  color: #666;
  font-size: 0.9rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 2rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.page-btn.active {
  background-color: #3498db;
  color: white;
  border-color: #3498db;
}

.error-page {
  text-align: center;
  padding: 2rem;
}

.no-results {
  text-align: center;
  padding: 2rem;
  color: #666;
}

.search-placeholder {
  text-align: center;
  padding: 4rem 2rem;
  color: #666;
}

.home-page {
  text-align: center;
  padding: 2rem;
}

.selected-option {
  background-color: #e8f5e8;
  padding: 0.5rem;
  border-radius: 4px;
  border-left: 4px solid #27ae60;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}