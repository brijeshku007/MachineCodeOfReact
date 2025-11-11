// 🪝 Navigation Hooks - Complete Working Examples
// This demonstrates all navigation hooks with real-world scenarios

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, useNavigate, useLocation, useParams, useSearchParams } from 'react-router-dom';

// =============================================================================
// EXAMPLE 1: E-commerce Checkout Flow with Navigation
// =============================================================================

// Mock data
const PRODUCTS = [
  { id: 1, name: 'MacBook Pro', price: 1999, image: '💻' },
  { id: 2, name: 'iPhone 15', price: 999, image: '📱' },
  { id: 3, name: 'AirPods Pro', price: 249, image: '🎧' }
];

// Shopping Cart Context (simplified)
const CartContext = React.createContext();

function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  const addToCart = (product) => {
    setCart(prev => [...prev, { ...product, quantity: 1, id: Date.now() }]);
  };

  const removeFromCart = (id) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCart([]);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  return (
    <CartContext.Provider value={{
      cart, addToCart, removeFromCart, clearCart,
      user, login, logout
    }}>
      {children}
    </CartContext.Provider>
  );
}

// Product List with Navigation
function ProductList() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const cart = React.useContext(CartContext);

  const category = searchParams.get('category') || 'all';
  const sort = searchParams.get('sort') || 'name';

  // Track page view
  useEffect(() => {
    console.log('📊 Page view tracked:', location.pathname);
  }, [location.pathname]);

  const viewProduct = (product) => {
    // Navigate with state
    navigate(`/products/${product.id}`, {
      state: {
        product,
        returnTo: location.pathname + location.search,
        viewedAt: new Date().toISOString()
      }
    });
  };

  const addToCartAndNavigate = (product) => {
    cart.addToCart(product);

    // Navigate to cart with success message
    navigate('/cart', {
      state: {
        message: `${product.name} added to cart!`,
        addedProduct: product
      }
    });
  };

  return (
    <div className="product-list">
      <div className="page-header">
        <h1>🛍️ Products</h1>
        <div className="location-info">
          <small>Current path: {location.pathname}</small>
          {location.search && <small>Query: {location.search}</small>}
        </div>
      </div>

      <div className="filters">
        <select
          value={category}
          onChange={(e) => navigate(`?category=${e.target.value}&sort=${sort}`)}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="accessories">Accessories</option>
        </select>

        <select
          value={sort}
          onChange={(e) => navigate(`?category=${category}&sort=${e.target.value}`)}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <div className="products-grid">
        {PRODUCTS.map(product => (
          <div key={product.id} className="product-card">
            <div className="product-image">{product.image}</div>
            <h3>{product.name}</h3>
            <p className="price">${product.price}</p>

            <div className="product-actions">
              <button
                onClick={() => viewProduct(product)}
                className="btn-secondary"
              >
                View Details
              </button>
              <button
                onClick={() => addToCartAndNavigate(product)}
                className="btn-primary"
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="navigation-examples">
        <h3>Navigation Examples:</h3>
        <button onClick={() => navigate('/cart')}>Go to Cart</button>
        <button onClick={() => navigate(-1)}>Go Back</button>
        <button onClick={() => navigate('/', { replace: true })}>Go Home (Replace)</button>
      </div>
    </div>
  );
}

// Product Detail with Navigation State
function ProductDetail() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const cart = React.useContext(CartContext);

  // Get product from state or find by ID
  const { product, returnTo, viewedAt } = location.state || {};
  const productData = product || PRODUCTS.find(p => p.id === parseInt(productId));

  if (!productData) {
    return (
      <div className="error-page">
        <h2>Product Not Found</h2>
        <button onClick={() => navigate('/products')}>← Back to Products</button>
      </div>
    );
  }

  const addToCart = () => {
    cart.addToCart(productData);

    // Navigate to cart with confirmation
    navigate('/cart', {
      state: {
        message: `${productData.name} added to cart!`,
        addedProduct: productData
      }
    });
  };

  const goBack = () => {
    if (returnTo) {
      navigate(returnTo);
    } else {
      navigate(-1); // Browser back
    }
  };

  return (
    <div className="product-detail">
      <div className="detail-header">
        <button onClick={goBack} className="back-btn">
          ← {returnTo ? 'Back to Products' : 'Go Back'}
        </button>
        {viewedAt && (
          <small>Viewed at: {new Date(viewedAt).toLocaleTimeString()}</small>
        )}
      </div>

      <div className="product-info">
        <div className="product-image-large">{productData.image}</div>
        <div className="product-details">
          <h1>{productData.name}</h1>
          <p className="price">${productData.price}</p>
          <p className="description">
            This is a detailed description of the {productData.name}.
          </p>

          <div className="product-actions">
            <button onClick={addToCart} className="btn-primary">
              Add to Cart
            </button>
            <button onClick={() => navigate('/products')} className="btn-secondary">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>

      <div className="location-debug">
        <h3>🔍 Location Debug Info:</h3>
        <pre>{JSON.stringify(location, null, 2)}</pre>
      </div>
    </div>
  );
}

// Shopping Cart with State Messages
function ShoppingCart() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = React.useContext(CartContext);

  const { message, addedProduct } = location.state || {};

  // Clear message after showing it
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        // Replace current state to remove message
        navigate(location.pathname, { replace: true });
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [message, navigate, location.pathname]);

  const proceedToCheckout = () => {
    if (cart.cart.length === 0) {
      alert('Your cart is empty!');
      return;
    }

    navigate('/checkout', {
      state: {
        cartItems: cart.cart,
        total: cart.cart.reduce((sum, item) => sum + item.price, 0)
      }
    });
  };

  const continueShopping = () => {
    navigate('/products');
  };

  return (
    <div className="shopping-cart">
      <h1>🛒 Shopping Cart</h1>

      {message && (
        <div className="success-message">
          ✅ {message}
          {addedProduct && (
            <div className="added-product">
              {addedProduct.image} {addedProduct.name}
            </div>
          )}
        </div>
      )}

      {cart.cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <button onClick={continueShopping} className="btn-primary">
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.cart.map(item => (
              <div key={item.id} className="cart-item">
                <span className="item-image">{item.image}</span>
                <span className="item-name">{item.name}</span>
                <span className="item-price">${item.price}</span>
                <button
                  onClick={() => cart.removeFromCart(item.id)}
                  className="remove-btn"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <p className="total">
              Total: ${cart.cart.reduce((sum, item) => sum + item.price, 0)}
            </p>

            <div className="cart-actions">
              <button onClick={continueShopping} className="btn-secondary">
                Continue Shopping
              </button>
              <button onClick={proceedToCheckout} className="btn-primary">
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// =============================================================================
// EXAMPLE 2: Multi-Step Form with Navigation
// =============================================================================

function MultiStepCheckout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cartItems, total } = location.state || {};

  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    shipping: {},
    payment: {},
    review: {}
  });

  // Redirect if no cart items
  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      navigate('/cart', {
        state: { message: 'Please add items to cart before checkout' },
        replace: true
      });
    }
  }, [cartItems, navigate]);

  const nextStep = (stepData) => {
    const newFormData = { ...formData, ...stepData };
    setFormData(newFormData);

    if (currentStep < 3) {
      const nextStepNum = currentStep + 1;
      setCurrentStep(nextStepNum);
      navigate(`/checkout/step-${nextStepNum}`, {
        state: {
          cartItems,
          total,
          formData: newFormData,
          step: nextStepNum
        }
      });
    } else {
      // Complete checkout
      completeCheckout(newFormData);
    }
  };

  const previousStep = () => {
    if (currentStep > 1) {
      const prevStepNum = currentStep - 1;
      setCurrentStep(prevStepNum);
      navigate(`/checkout/step-${prevStepNum}`, {
        state: {
          cartItems,
          total,
          formData,
          step: prevStepNum
        }
      });
    }
  };

  const completeCheckout = async (finalData) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      navigate('/checkout/success', {
        state: {
          orderData: finalData,
          orderNumber: Math.random().toString(36).substr(2, 9).toUpperCase(),
          total
        },
        replace: true
      });
    } catch (error) {
      navigate('/checkout/error', {
        state: { error: error.message }
      });
    }
  };

  if (!cartItems) {
    return <div>Loading...</div>;
  }

  return (
    <div className="checkout">
      <div className="checkout-header">
        <h1>Checkout</h1>
        <div className="step-indicator">
          <span className={currentStep >= 1 ? 'active' : ''}>1. Shipping</span>
          <span className={currentStep >= 2 ? 'active' : ''}>2. Payment</span>
          <span className={currentStep >= 3 ? 'active' : ''}>3. Review</span>
        </div>
      </div>

      <div className="checkout-content">
        {currentStep === 1 && (
          <ShippingStep
            data={formData.shipping}
            onNext={nextStep}
            onCancel={() => navigate('/cart')}
          />
        )}

        {currentStep === 2 && (
          <PaymentStep
            data={formData.payment}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}

        {currentStep === 3 && (
          <ReviewStep
            formData={formData}
            cartItems={cartItems}
            total={total}
            onNext={nextStep}
            onPrevious={previousStep}
          />
        )}
      </div>
    </div>
  );
}

// Checkout Steps
function ShippingStep({ data, onNext, onCancel }) {
  const [shipping, setShipping] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ shipping });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-step">
      <h2>Shipping Information</h2>

      <div className="form-group">
        <label>Full Name:</label>
        <input
          type="text"
          value={shipping.name || ''}
          onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
          required
        />
      </div>

      <div className="form-group">
        <label>Address:</label>
        <input
          type="text"
          value={shipping.address || ''}
          onChange={(e) => setShipping({ ...shipping, address: e.target.value })}
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onCancel} className="btn-secondary">
          Cancel
        </button>
        <button type="submit" className="btn-primary">
          Continue to Payment
        </button>
      </div>
    </form>
  );
}

function PaymentStep({ data, onNext, onPrevious }) {
  const [payment, setPayment] = useState(data);

  const handleSubmit = (e) => {
    e.preventDefault();
    onNext({ payment });
  };

  return (
    <form onSubmit={handleSubmit} className="checkout-step">
      <h2>Payment Information</h2>

      <div className="form-group">
        <label>Card Number:</label>
        <input
          type="text"
          value={payment.cardNumber || ''}
          onChange={(e) => setPayment({ ...payment, cardNumber: e.target.value })}
          placeholder="1234 5678 9012 3456"
          required
        />
      </div>

      <div className="form-group">
        <label>Expiry Date:</label>
        <input
          type="text"
          value={payment.expiry || ''}
          onChange={(e) => setPayment({ ...payment, expiry: e.target.value })}
          placeholder="MM/YY"
          required
        />
      </div>

      <div className="form-actions">
        <button type="button" onClick={onPrevious} className="btn-secondary">
          Back to Shipping
        </button>
        <button type="submit" className="btn-primary">
          Review Order
        </button>
      </div>
    </form>
  );
}

function ReviewStep({ formData, cartItems, total, onNext, onPrevious }) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    await onNext({ confirmed: true });
    setLoading(false);
  };

  return (
    <div className="checkout-step">
      <h2>Review Your Order</h2>

      <div className="review-section">
        <h3>Shipping Information</h3>
        <p>{formData.shipping.name}</p>
        <p>{formData.shipping.address}</p>
      </div>

      <div className="review-section">
        <h3>Payment Information</h3>
        <p>Card ending in {formData.payment.cardNumber?.slice(-4)}</p>
      </div>

      <div className="review-section">
        <h3>Order Items</h3>
        {cartItems.map(item => (
          <div key={item.id} className="review-item">
            <span>{item.image} {item.name}</span>
            <span>${item.price}</span>
          </div>
        ))}
        <div className="review-total">
          <strong>Total: ${total}</strong>
        </div>
      </div>

      <div className="form-actions">
        <button onClick={onPrevious} className="btn-secondary" disabled={loading}>
          Back to Payment
        </button>
        <button onClick={handleSubmit} className="btn-primary" disabled={loading}>
          {loading ? 'Processing...' : 'Place Order'}
        </button>
      </div>
    </div>
  );
}

// Success and Error Pages
function CheckoutSuccess() {
  const navigate = useNavigate();
  const location = useLocation();
  const cart = React.useContext(CartContext);

  const { orderData, orderNumber, total } = location.state || {};

  useEffect(() => {
    // Clear cart after successful order
    cart.clearCart();
  }, [cart]);

  if (!orderData) {
    return (
      <div className="error-page">
        <h2>Order information not found</h2>
        <button onClick={() => navigate('/')}>Go Home</button>
      </div>
    );
  }

  return (
    <div className="success-page">
      <div className="success-content">
        <h1>✅ Order Successful!</h1>
        <p>Thank you for your purchase!</p>

        <div className="order-details">
          <h3>Order Details</h3>
          <p><strong>Order Number:</strong> {orderNumber}</p>
          <p><strong>Total:</strong> ${total}</p>
          <p><strong>Shipping to:</strong> {orderData.shipping.name}</p>
        </div>

        <div className="success-actions">
          <button onClick={() => navigate('/')} className="btn-primary">
            Continue Shopping
          </button>
          <button onClick={() => navigate('/orders')} className="btn-secondary">
            View Orders
          </button>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 3: Search with Navigation State
// =============================================================================

function SearchPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || 'all';
  const page = parseInt(searchParams.get('page') || '1');

  // Mock search results
  const results = query ? [
    { id: 1, title: `${query} in React`, type: 'article' },
    { id: 2, title: `Advanced ${query}`, type: 'tutorial' },
    { id: 3, title: `${query} Best Practices`, type: 'guide' }
  ] : [];

  const updateSearch = (newParams) => {
    const params = new URLSearchParams(searchParams);

    Object.entries(newParams).forEach(([key, value]) => {
      if (value && value !== 'all') {
        params.set(key, value);
      } else {
        params.delete(key);
      }
    });

    setSearchParams(params);
  };

  const viewResult = (result) => {
    navigate(`/search/result/${result.id}`, {
      state: {
        result,
        searchQuery: query,
        returnTo: location.pathname + location.search
      }
    });
  };

  return (
    <div className="search-page">
      <h1>🔍 Search</h1>

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
        >
          <option value="all">All Categories</option>
          <option value="article">Articles</option>
          <option value="tutorial">Tutorials</option>
          <option value="guide">Guides</option>
        </select>
      </div>

      {query && (
        <div className="search-results">
          <h2>Results for "{query}"</h2>
          <p>Found {results.length} results</p>

          <div className="results-list">
            {results.map(result => (
              <div key={result.id} className="result-item">
                <h3>{result.title}</h3>
                <p>Type: {result.type}</p>
                <button
                  onClick={() => viewResult(result)}
                  className="btn-primary"
                >
                  View Result
                </button>
              </div>
            ))}
          </div>

          <div className="pagination">
            <button
              onClick={() => updateSearch({ page: (page - 1).toString() })}
              disabled={page === 1}
            >
              Previous
            </button>
            <span>Page {page}</span>
            <button
              onClick={() => updateSearch({ page: (page + 1).toString() })}
            >
              Next
            </button>
          </div>
        </div>
      )}

      <div className="location-info">
        <h3>Current Location Info:</h3>
        <p>Pathname: {location.pathname}</p>
        <p>Search: {location.search}</p>
        <p>State: {JSON.stringify(location.state)}</p>
      </div>
    </div>
  );
}

function SearchResult() {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const { result, searchQuery, returnTo } = location.state || {};

  if (!result) {
    return (
      <div className="error-page">
        <h2>Result not found</h2>
        <button onClick={() => navigate('/search')}>Back to Search</button>
      </div>
    );
  }

  return (
    <div className="search-result">
      <div className="result-header">
        <button
          onClick={() => navigate(returnTo || '/search')}
          className="back-btn"
        >
          ← Back to Search Results
        </button>
        {searchQuery && (
          <p>From search: "{searchQuery}"</p>
        )}
      </div>

      <div className="result-content">
        <h1>{result.title}</h1>
        <p>Type: {result.type}</p>
        <p>This would contain the full content of the search result.</p>
      </div>

      <div className="result-actions">
        <button onClick={() => navigate('/search')} className="btn-secondary">
          New Search
        </button>
        <button onClick={() => navigate(-1)} className="btn-primary">
          Go Back
        </button>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function NavigationHooksApp() {
  return (
    <CartProvider>
      <BrowserRouter>
        <div className="app">
          <nav className="main-nav">
            <Link to="/" className="nav-brand">🪝 Navigation Hooks Demo</Link>
            <div className="nav-links">
              <Link to="/products">Products</Link>
              <Link to="/cart">Cart</Link>
              <Link to="/search">Search</Link>
            </div>
          </nav>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/products/:productId" element={<ProductDetail />} />
              <Route path="/cart" element={<ShoppingCart />} />

              {/* Multi-step checkout */}
              <Route path="/checkout" element={<MultiStepCheckout />} />
              <Route path="/checkout/step-:step" element={<MultiStepCheckout />} />
              <Route path="/checkout/success" element={<CheckoutSuccess />} />
              <Route path="/checkout/error" element={<div>Checkout Error</div>} />

              {/* Search */}
              <Route path="/search" element={<SearchPage />} />
              <Route path="/search/result/:resultId" element={<SearchResult />} />

              {/* Orders (placeholder) */}
              <Route path="/orders" element={<div>Your Orders</div>} />

              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
        </div>
      </BrowserRouter>
    </CartProvider>
  );
}

function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="home-page">
      <h1>🪝 Navigation Hooks Examples</h1>
      <p>Explore different navigation patterns and hooks:</p>

      <div className="examples-grid">
        <div className="example-card">
          <h3>🛍️ E-commerce Flow</h3>
          <p>Product browsing with navigation state, cart management, and checkout flow</p>
          <button onClick={() => navigate('/products')} className="btn-primary">
            Browse Products
          </button>
        </div>

        <div className="example-card">
          <h3>📝 Multi-Step Forms</h3>
          <p>Checkout process with navigation between steps and state preservation</p>
          <button onClick={() => navigate('/checkout')} className="btn-primary">
            Try Checkout
          </button>
        </div>

        <div className="example-card">
          <h3>🔍 Search & Results</h3>
          <p>Search functionality with URL parameters and result navigation</p>
          <button onClick={() => navigate('/search')} className="btn-primary">
            Search Demo
          </button>
        </div>
      </div>

      <div className="hooks-overview">
        <h2>🎯 Navigation Hooks Demonstrated</h2>
        <div className="hooks-list">
          <div className="hook-item">
            <h4>useNavigate</h4>
            <p>Programmatic navigation with state and options</p>
          </div>
          <div className="hook-item">
            <h4>useLocation</h4>
            <p>Access current location, state, and search parameters</p>
          </div>
          <div className="hook-item">
            <h4>useParams</h4>
            <p>Extract route parameters from dynamic URLs</p>
          </div>
          <div className="hook-item">
            <h4>useSearchParams</h4>
            <p>Manage query parameters in the URL</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div className="error-page">
      <h1>🚫 404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist.</p>
      <div className="error-actions">
        <button onClick={() => navigate('/')} className="btn-primary">
          Go Home
        </button>
        <button onClick={() => navigate(-1)} className="btn-secondary">
          Go Back
        </button>
      </div>
    </div>
  );
}

export default NavigationHooksApp;

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

/* Product List Styles */
.product-list {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.page-header {
  margin-bottom: 2rem;
}

.location-info {
  margin-top: 0.5rem;
}

.location-info small {
  display: block;
  color: #666;
  font-size: 0.8rem;
}

.filters {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
}

.filters select {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.product-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
  transition: transform 0.3s;
}

.product-card:hover {
  transform: translateY(-2px);
}

.product-image {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
}

.product-actions {
  display: flex;
  gap: 0.5rem;
  justify-content: center;
}

.navigation-examples {
  margin-top: 2rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
}

.navigation-examples button {
  margin-right: 1rem;
}

/* Product Detail Styles */
.product-detail {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.back-btn {
  background: none;
  border: none;
  color: #1976d2;
  cursor: pointer;
  font-size: 1rem;
}

.product-info {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.product-image-large {
  font-size: 8rem;
  text-align: center;
}

.location-debug {
  margin-top: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
}

.location-debug pre {
  font-size: 0.8rem;
  overflow-x: auto;
}

/* Shopping Cart Styles */
.shopping-cart {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 2rem;
  border: 1px solid #c3e6cb;
}

.added-product {
  margin-top: 0.5rem;
  font-weight: bold;
}

.empty-cart {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: auto 1fr auto auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.item-image {
  font-size: 2rem;
}

.remove-btn {
  background: #e74c3c;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.cart-summary {
  border-top: 2px solid #eee;
  padding-top: 1rem;
}

.total {
  font-size: 1.5rem;
  font-weight: bold;
  text-align: right;
  margin-bottom: 1rem;
}

.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
}

/* Checkout Styles */
.checkout {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.checkout-header {
  margin-bottom: 2rem;
}

.step-indicator {
  display: flex;
  gap: 2rem;
  margin-top: 1rem;
}

.step-indicator span {
  padding: 0.5rem 1rem;
  background: #f8f9fa;
  border-radius: 4px;
  color: #666;
}

.step-indicator span.active {
  background: #1976d2;
  color: white;
}

.checkout-step {
  max-width: 500px;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  font-weight: bold;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.review-section {
  margin-bottom: 2rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 4px;
}

.review-item {
  display: flex;
  justify-content: space-between;
  padding: 0.5rem 0;
  border-bottom: 1px solid #eee;
}

.review-total {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 2px solid #ddd;
  text-align: right;
}

/* Success Page Styles */
.success-page {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.success-content h1 {
  color: #28a745;
  margin-bottom: 1rem;
}

.order-details {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin: 2rem 0;
  text-align: left;
}

.success-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Search Styles */
.search-page {
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
  border-color: #1976d2;
  outline: none;
}

.results-list {
  margin: 2rem 0;
}

.result-item {
  background: #f8f9fa;
  padding: 1.5rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  background: white;
  cursor: pointer;
  border-radius: 4px;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Button Styles */
.btn-primary, .btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  cursor: pointer;
  text-decoration: none;
  display: inline-block;
  text-align: center;
  transition: all 0.3s;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-primary:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
}

/* Home Page Styles */
.home-page {
  text-align: center;
  padding: 2rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.example-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.hooks-overview {
  margin-top: 3rem;
  text-align: left;
}

.hooks-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.hook-item {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0,0,0,0.1);
}

.hook-item h4 {
  margin: 0 0 0.5rem 0;
  color: #1976d2;
}

.hook-item p {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

/* Error Page Styles */
.error-page {
  background: white;
  padding: 3rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.error-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

/* Responsive Design */
@media (max-width: 768px) {
  .main-content {
    padding: 1rem;
  }
  
  .products-grid {
    grid-template-columns: 1fr;
  }
  
  .product-info {
    grid-template-columns: 1fr;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .search-form {
    flex-direction: column;
  }
  
  .cart-actions,
  .form-actions,
  .success-actions {
    flex-direction: column;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}