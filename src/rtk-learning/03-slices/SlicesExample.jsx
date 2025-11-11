// 🍰 Advanced Slices - Complete Working Examples
// This demonstrates advanced slice patterns and state management techniques

import React, { useState } from 'react';
import { createSlice, createEntityAdapter, createSelector, configureStore } from '@reduxjs/toolkit';
import { Provider, useSelector, useDispatch } from 'react-redux';

// =============================================================================
// EXAMPLE 1: E-commerce Product Management with Entity Adapter
// =============================================================================

// Mock product data
const INITIAL_PRODUCTS = [
  { id: 1, name: 'MacBook Pro', price: 1999, category: 'Electronics', stock: 15, rating: 4.8, inStock: true },
  { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', stock: 0, rating: 4.7, inStock: false },
  { id: 3, name: 'Nike Air Max', price: 129, category: 'Clothing', stock: 45, rating: 4.5, inStock: true },
  { id: 4, name: 'React Handbook', price: 29, category: 'Books', stock: 78, rating: 4.9, inStock: true },
  { id: 5, name: 'Coffee Maker', price: 89, category: 'Home', stock: 12, rating: 4.2, inStock: true }
];

// Create entity adapter for normalized state
const productsAdapter = createEntityAdapter({
  sortComparer: (a, b) => a.name.localeCompare(b.name)
});

// Advanced products slice
const productsSlice = createSlice({
  name: 'products',
  initialState: productsAdapter.getInitialState({
    filters: {
      category: 'all',
      priceRange: [0, 2000],
      inStock: false,
      minRating: 0
    },
    ui: {
      view: 'grid',
      sortBy: 'name',
      sortOrder: 'asc'
    }
  }),
  reducers: {
    // Entity adapter methods
    addProduct: productsAdapter.addOne,
    updateProduct: productsAdapter.updateOne,
    removeProduct: productsAdapter.removeOne,
    setProducts: productsAdapter.setAll,

    // Custom business logic
    purchaseProduct: (state, action) => {
      const { productId, quantity } = action.payload;
      const product = state.entities[productId];
      if (product && product.stock >= quantity) {
        product.stock -= quantity;
        product.inStock = product.stock > 0;
      }
    },

    // Filter management
    setFilter: (state, action) => {
      const { filterType, value } = action.payload;
      state.filters[filterType] = value;
    },

    clearFilters: (state) => {
      state.filters = {
        category: 'all',
        priceRange: [0, 2000],
        inStock: false,
        minRating: 0
      };
    },

    // UI state management
    setView: (state, action) => {
      state.ui.view = action.payload;
    },

    setSorting: (state, action) => {
      const { sortBy, sortOrder } = action.payload;
      state.ui.sortBy = sortBy;
      state.ui.sortOrder = sortOrder;
    }
  }
});

// Export entity selectors
export const {
  selectAll: selectAllProducts,
  selectById: selectProductById,
  selectIds: selectProductIds
} = productsAdapter.getSelectors(state => state.products);

// Advanced memoized selectors
export const selectFilteredProducts = createSelector(
  [selectAllProducts, (state) => state.products.filters, (state) => state.products.ui],
  (products, filters, ui) => {
    let filtered = [...products];

    // Apply filters
    if (filters.category !== 'all') {
      filtered = filtered.filter(p => p.category === filters.category);
    }

    if (filters.inStock) {
      filtered = filtered.filter(p => p.inStock);
    }

    filtered = filtered.filter(p =>
      p.price >= filters.priceRange[0] &&
      p.price <= filters.priceRange[1] &&
      p.rating >= filters.minRating
    );

    // Apply sorting
    filtered.sort((a, b) => {
      let comparison = 0;
      switch (ui.sortBy) {
        case 'name': comparison = a.name.localeCompare(b.name); break;
        case 'price': comparison = a.price - b.price; break;
        case 'rating': comparison = a.rating - b.rating; break;
        case 'stock': comparison = a.stock - b.stock; break;
        default: comparison = 0;
      }
      return ui.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }
);

export const selectProductStats = createSelector(
  [selectAllProducts],
  (products) => ({
    total: products.length,
    inStock: products.filter(p => p.inStock).length,
    averagePrice: products.reduce((sum, p) => sum + p.price, 0) / products.length || 0,
    averageRating: products.reduce((sum, p) => sum + p.rating, 0) / products.length || 0,
    categories: [...new Set(products.map(p => p.category))]
  })
);

export const {
  addProduct, updateProduct, removeProduct, setProducts, purchaseProduct,
  setFilter, clearFilters, setView, setSorting
} = productsSlice.actions;// 
=============================================================================
// EXAMPLE 2: Shopping Cart with Complex State Logic
// =============================================================================

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: {},
    discounts: [],
    totals: { subtotal: 0, tax: 0, total: 0 }
  },
  reducers: {
    addToCart: (state, action) => {
      const { productId, product, quantity = 1 } = action.payload;

      if (state.items[productId]) {
        state.items[productId].quantity += quantity;
      } else {
        state.items[productId] = {
          productId,
          name: product.name,
          price: product.price,
          quantity
        };
      }

      cartSlice.caseReducers.calculateTotals(state);
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      delete state.items[productId];
      cartSlice.caseReducers.calculateTotals(state);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      if (state.items[productId] && quantity > 0) {
        state.items[productId].quantity = quantity;
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    applyDiscount: (state, action) => {
      const discount = action.payload;
      if (!state.discounts.find(d => d.code === discount.code)) {
        state.discounts.push(discount);
        cartSlice.caseReducers.calculateTotals(state);
      }
    },

    clearCart: (state) => {
      state.items = {};
      state.discounts = [];
      state.totals = { subtotal: 0, tax: 0, total: 0 };
    },

    // Internal calculation reducer
    calculateTotals: (state) => {
      const subtotal = Object.values(state.items).reduce(
        (sum, item) => sum + (item.price * item.quantity), 0
      );

      const discountAmount = state.discounts.reduce(
        (sum, discount) => sum + (subtotal * discount.percentage / 100), 0
      );

      const taxableAmount = subtotal - discountAmount;
      const tax = taxableAmount * 0.08; // 8% tax

      state.totals = {
        subtotal: Math.round(subtotal * 100) / 100,
        discount: Math.round(discountAmount * 100) / 100,
        tax: Math.round(tax * 100) / 100,
        total: Math.round((taxableAmount + tax) * 100) / 100
      };
    }
  }
});

export const {
  addToCart, removeFromCart, updateQuantity,
  applyDiscount, clearCart
} = cartSlice.actions;

// =============================================================================
// STORE CONFIGURATION
// =============================================================================

const store = configureStore({
  reducer: {
    products: productsSlice.reducer,
    cart: cartSlice.reducer
  }
});

// Initialize with sample data
store.dispatch(setProducts(INITIAL_PRODUCTS));

// =============================================================================
// COMPONENTS
// =============================================================================

function ProductCatalog() {
  const dispatch = useDispatch();
  const filteredProducts = useSelector(selectFilteredProducts);
  const stats = useSelector(selectProductStats);
  const filters = useSelector(state => state.products.filters);
  const ui = useSelector(state => state.products.ui);

  return (
    <div className="product-catalog">
      <div className="catalog-header">
        <h2>📦 Product Catalog</h2>
        <div className="stats">
          <span>Total: {stats.total}</span>
          <span>In Stock: {stats.inStock}</span>
          <span>Avg Price: ${stats.averagePrice.toFixed(2)}</span>
          <span>Avg Rating: ⭐{stats.averageRating.toFixed(1)}</span>
        </div>
      </div>

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.category}
          onChange={(e) => dispatch(setFilter({ filterType: 'category', value: e.target.value }))}
        >
          <option value="all">All Categories</option>
          {stats.categories.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>

        <label>
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) => dispatch(setFilter({ filterType: 'inStock', value: e.target.checked }))}
          />
          In Stock Only
        </label>

        <label>
          Min Rating: {filters.minRating}
          <input
            type="range"
            min="0"
            max="5"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => dispatch(setFilter({ filterType: 'minRating', value: parseFloat(e.target.value) }))}
          />
        </label>

        <button onClick={() => dispatch(clearFilters())}>Clear Filters</button>
      </div>

      {/* Sorting */}
      <div className="sorting">
        <select
          value={ui.sortBy}
          onChange={(e) => dispatch(setSorting({ sortBy: e.target.value, sortOrder: ui.sortOrder }))}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
          <option value="rating">Sort by Rating</option>
          <option value="stock">Sort by Stock</option>
        </select>

        <button
          onClick={() => dispatch(setSorting({
            sortBy: ui.sortBy,
            sortOrder: ui.sortOrder === 'asc' ? 'desc' : 'asc'
          }))}
        >
          {ui.sortOrder === 'asc' ? '↑' : '↓'}
        </button>

        <button
          onClick={() => dispatch(setView(ui.view === 'grid' ? 'list' : 'grid'))}
        >
          View: {ui.view}
        </button>
      </div>

      {/* Products */}
      <div className={`products-${ui.view}`}>
        {filteredProducts.map(product => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {filteredProducts.length === 0 && (
        <div className="no-products">No products match your filters</div>
      )}
    </div>
  );
}

function ProductCard({ product }) {
  const dispatch = useDispatch();

  const handlePurchase = () => {
    dispatch(purchaseProduct({ productId: product.id, quantity: 1 }));
    dispatch(addToCart({
      productId: product.id,
      product,
      quantity: 1
    }));
  };

  return (
    <div className={`product-card ${!product.inStock ? 'out-of-stock' : ''}`}>
      <h3>{product.name}</h3>
      <p className="price">${product.price}</p>
      <p className="category">{product.category}</p>
      <p className="rating">⭐ {product.rating}</p>
      <p className="stock">Stock: {product.stock}</p>

      <button
        onClick={handlePurchase}
        disabled={!product.inStock}
        className="btn-primary"
      >
        {product.inStock ? 'Add to Cart' : 'Out of Stock'}
      </button>
    </div>
  );
}

function ShoppingCart() {
  const dispatch = useDispatch();
  const cartItems = useSelector(state => state.cart.items);
  const totals = useSelector(state => state.cart.totals);
  const discounts = useSelector(state => state.cart.discounts);

  const itemsArray = Object.values(cartItems);

  return (
    <div className="shopping-cart">
      <h2>🛒 Shopping Cart</h2>

      {itemsArray.length === 0 ? (
        <p>Your cart is empty</p>
      ) : (
        <>
          <div className="cart-items">
            {itemsArray.map(item => (
              <div key={item.productId} className="cart-item">
                <span>{item.name}</span>
                <span>${item.price}</span>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => dispatch(updateQuantity({
                    productId: item.productId,
                    quantity: parseInt(e.target.value)
                  }))}
                />
                <span>${(item.price * item.quantity).toFixed(2)}</span>
                <button
                  onClick={() => dispatch(removeFromCart(item.productId))}
                  className="btn-danger"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          <div className="cart-totals">
            <div>Subtotal: ${totals.subtotal}</div>
            {totals.discount > 0 && <div>Discount: -${totals.discount}</div>}
            <div>Tax: ${totals.tax}</div>
            <div className="total">Total: ${totals.total}</div>
          </div>

          <div className="cart-actions">
            <button onClick={() => dispatch(clearCart())} className="btn-secondary">
              Clear Cart
            </button>
            <button
              onClick={() => dispatch(applyDiscount({ code: 'SAVE10', percentage: 10 }))}
              className="btn-secondary"
            >
              Apply 10% Discount
            </button>
          </div>
        </>
      )}
    </div>
  );
}

// =============================================================================
// MAIN APP
// =============================================================================

function SlicesApp() {
  const [activeTab, setActiveTab] = useState('catalog');

  return (
    <Provider store={store}>
      <div className="slices-app">
        <header className="app-header">
          <h1>🍰 Advanced Slices Demo</h1>
          <nav className="tab-nav">
            <button
              onClick={() => setActiveTab('catalog')}
              className={activeTab === 'catalog' ? 'active' : ''}
            >
              Product Catalog
            </button>
            <button
              onClick={() => setActiveTab('cart')}
              className={activeTab === 'cart' ? 'active' : ''}
            >
              Shopping Cart
            </button>
          </nav>
        </header>

        <main className="app-content">
          {activeTab === 'catalog' && <ProductCatalog />}
          {activeTab === 'cart' && <ShoppingCart />}
        </main>

        <footer className="slice-concepts">
          <h3>🎯 Advanced Slice Concepts Demonstrated:</h3>
          <ul>
            <li><strong>Entity Adapter:</strong> Normalized state with automatic CRUD operations</li>
            <li><strong>Memoized Selectors:</strong> Performance-optimized data filtering and sorting</li>
            <li><strong>Complex State Logic:</strong> Cart calculations and business rules</li>
            <li><strong>Cross-Slice Actions:</strong> Products affecting cart state</li>
            <li><strong>Internal Reducers:</strong> Private calculation methods</li>
          </ul>
        </footer>
      </div>
    </Provider>
  );
}

export default SlicesApp;// ===
==========================================================================
// CSS STYLES
// =============================================================================

const styles = `
.slices-app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 2rem;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  margin-bottom: 2rem;
  text-align: center;
  color: white;
}

.app-header h1 {
  margin: 0 0 1rem 0;
  font-size: 2.5rem;
}

.tab-nav {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

.tab-nav button {
  padding: 0.75rem 1.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s;
}

.tab-nav button:hover {
  background: rgba(255, 255, 255, 0.2);
}

.tab-nav button.active {
  background: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.app-content {
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

/* Product Catalog */
.product-catalog {
  max-width: 1200px;
  margin: 0 auto;
}

.catalog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #eee;
}

.stats {
  display: flex;
  gap: 2rem;
  font-size: 0.9rem;
  color: #666;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1rem;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.filters select,
.filters input[type="range"] {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.filters label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
}

.sorting {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem;
  background: #e3f2fd;
  border-radius: 8px;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
}

.products-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.product-card {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  transition: all 0.3s;
  border: 2px solid transparent;
}

.product-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  border-color: #667eea;
}

.product-card.out-of-stock {
  opacity: 0.6;
  background: #f5f5f5;
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
  margin: 0.5rem 0;
}

.rating {
  margin: 0.5rem 0;
}

.stock {
  font-size: 0.9rem;
  color: #666;
  margin: 0.5rem 0;
}

.no-products {
  text-align: center;
  padding: 3rem;
  color: #666;
  font-style: italic;
}

/* Shopping Cart */
.shopping-cart {
  max-width: 800px;
  margin: 0 auto;
}

.cart-items {
  margin-bottom: 2rem;
}

.cart-item {
  display: grid;
  grid-template-columns: 2fr 1fr 100px 1fr auto;
  gap: 1rem;
  align-items: center;
  padding: 1rem;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 0.5rem;
}

.cart-item input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  text-align: center;
}

.cart-totals {
  background: #e3f2fd;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.cart-totals > div {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.total {
  font-size: 1.2rem;
  font-weight: bold;
  border-top: 2px solid #ddd;
  padding-top: 0.5rem;
  margin-top: 1rem;
}

.cart-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
}

/* Buttons */
.btn-primary,
.btn-secondary,
.btn-danger {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background: #5a6268;
}

.btn-danger {
  background: #dc3545;
  color: white;
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn-danger:hover {
  background: #c82333;
}

/* Slice Concepts */
.slice-concepts {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 2rem;
  color: white;
}

.slice-concepts h3 {
  margin: 0 0 1rem 0;
  text-align: center;
}

.slice-concepts ul {
  max-width: 800px;
  margin: 0 auto;
  padding-left: 1.5rem;
}

.slice-concepts li {
  margin-bottom: 0.5rem;
}

.slice-concepts strong {
  color: #ffd700;
}

/* Responsive Design */
@media (max-width: 768px) {
  .slices-app {
    padding: 1rem;
  }

  .catalog-header {
    flex-direction: column;
    gap: 1rem;
  }

  .stats {
    flex-wrap: wrap;
    justify-content: center;
  }

  .filters,
  .sorting {
    flex-direction: column;
    align-items: stretch;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .cart-item {
    grid-template-columns: 1fr;
    text-align: center;
  }

  .cart-actions {
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