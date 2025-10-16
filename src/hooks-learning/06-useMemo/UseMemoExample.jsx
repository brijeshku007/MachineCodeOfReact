import React, { useState, useMemo, memo } from 'react';

/**
 * useMemo Hook - Complete Learning Example
 * 
 * This demonstrates useMemo for performance optimization:
 * 1. Problem: Expensive calculations on every render
 * 2. Solution: Memoized values with useMemo
 * 3. Performance comparison demos
 * 4. Real-world use cases
 */

// Expensive calculation function
const expensiveCalculation = (numbers) => {
  console.log('💰 Running expensive calculation...');
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += numbers.reduce((sum, num) => sum + num, 0);
  }
  return result;
};

// Demo 1: Problem without useMemo
const WithoutUseMemo = () => {
  const [count, setCount] = useState(0);
  const [numbers] = useState([1, 2, 3, 4, 5]);
  const [name, setName] = useState('');

  // This runs on EVERY render, even when numbers haven't changed
  const expensiveValue = expensiveCalculation(numbers);

  return (
    <div style={{ padding: '20px', border: '2px solid #dc3545', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>❌ Problem: Without useMemo</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Expensive calculation result: <strong>{expensiveValue}</strong></p>
        <p>Count: <strong>{count}</strong></p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type here to trigger re-renders"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Increment Count
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Problem:</strong> The expensive calculation runs every time you type or increment count,
        even though the numbers array never changes! Check the console logs.
      </div>
    </div>
  );
};

// Demo 2: Solution with useMemo
const WithUseMemo = () => {
  const [count, setCount] = useState(0);
  const [numbers] = useState([1, 2, 3, 4, 5]);
  const [name, setName] = useState('');

  // This only runs when numbers change (which never happens in this example)
  const expensiveValue = useMemo(() => {
    return expensiveCalculation(numbers);
  }, [numbers]);

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>✅ Solution: With useMemo</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Expensive calculation result: <strong>{expensiveValue}</strong></p>
        <p>Count: <strong>{count}</strong></p>

        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type here - calculation won't run!"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Increment Count
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Solution:</strong> The expensive calculation only runs when the numbers array changes.
        Type or increment count - no expensive calculation! Check the console.
      </div>
    </div>
  );
};

// Demo 3: Dynamic dependencies
const DynamicDependencies = () => {
  const [multiplier, setMultiplier] = useState(1);
  const [numbers, setNumbers] = useState([1, 2, 3, 4, 5]);
  const [triggerRender, setTriggerRender] = useState(0);

  // This recalculates when numbers OR multiplier changes
  const calculatedValue = useMemo(() => {
    console.log('🔢 Calculating with multiplier...');
    return numbers.reduce((sum, num) => sum + num, 0) * multiplier;
  }, [numbers, multiplier]);

  // This only depends on numbers
  const averageValue = useMemo(() => {
    console.log('📊 Calculating average...');
    return numbers.reduce((sum, num) => sum + num, 0) / numbers.length;
  }, [numbers]);

  const addNumber = () => {
    setNumbers(prev => [...prev, Math.floor(Math.random() * 10) + 1]);
  };

  const removeNumber = () => {
    setNumbers(prev => prev.slice(0, -1));
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🔢 Dynamic Dependencies</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Numbers: [{numbers.join(', ')}]</p>
        <p>Multiplier: <strong>{multiplier}</strong></p>
        <p>Calculated Value (sum × multiplier): <strong>{calculatedValue}</strong></p>
        <p>Average Value: <strong>{averageValue.toFixed(2)}</strong></p>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={addNumber}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Random Number
        </button>
        <button
          onClick={removeNumber}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Remove Last Number
        </button>
        <button
          onClick={() => setMultiplier(multiplier + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}
        >
          Increase Multiplier
        </button>
        <button
          onClick={() => setTriggerRender(triggerRender + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#17a2b8', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Force Re-render
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#cce5ff', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Watch the console:</strong> See which calculations run when you change different values!
      </div>
    </div>
  );
};

// Demo 4: Object reference stability
const ProductCard = memo(({ product, onAddToCart }) => {
  console.log(`🛍️ ProductCard rendered for ${product.name}`);

  return (
    <div style={{
      padding: '15px',
      margin: '10px',
      border: '1px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h4>{product.name}</h4>
      <p>Price: ${product.price}</p>
      <p>Category: {product.category}</p>
      <button
        onClick={() => onAddToCart(product)}
        style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Add to Cart
      </button>
    </div>
  );
});

const ProductList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [cart, setCart] = useState([]);

  const allProducts = [
    { id: 1, name: 'Laptop', price: 999, category: 'electronics' },
    { id: 2, name: 'Phone', price: 699, category: 'electronics' },
    { id: 3, name: 'Shirt', price: 29, category: 'clothing' },
    { id: 4, name: 'Jeans', price: 79, category: 'clothing' },
    { id: 5, name: 'Book', price: 15, category: 'books' },
    { id: 6, name: 'Headphones', price: 199, category: 'electronics' }
  ];

  // Memoized filtered and sorted products
  const processedProducts = useMemo(() => {
    console.log('🔍 Processing products...');

    let result = allProducts;

    // Filter by search term
    if (searchTerm) {
      result = result.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by category
    if (category !== 'all') {
      result = result.filter(product => product.category === category);
    }

    // Sort
    result = [...result].sort((a, b) => {
      if (sortBy === 'name') return a.name.localeCompare(b.name);
      if (sortBy === 'price') return a.price - b.price;
      return 0;
    });

    return result;
  }, [searchTerm, category, sortBy]);

  // Memoized cart summary
  const cartSummary = useMemo(() => {
    console.log('🛒 Calculating cart summary...');
    return {
      itemCount: cart.length,
      totalPrice: cart.reduce((sum, item) => sum + item.price, 0)
    };
  }, [cart]);

  const addToCart = (product) => {
    setCart(prev => [...prev, product]);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #9c27b0', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🛍️ Product List with useMemo Optimization</h2>

      <div style={{ marginBottom: '20px', padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
        <h3>Cart Summary</h3>
        <p>Items: {cartSummary.itemCount} | Total: ${cartSummary.totalPrice}</p>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <input
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search products..."
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          style={{ padding: '8px', marginRight: '10px' }}
        >
          <option value="all">All Categories</option>
          <option value="electronics">Electronics</option>
          <option value="clothing">Clothing</option>
          <option value="books">Books</option>
        </select>

        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          style={{ padding: '8px' }}
        >
          <option value="name">Sort by Name</option>
          <option value="price">Sort by Price</option>
        </select>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
        {processedProducts.map(product => (
          <ProductCard
            key={product.id}
            product={product}
            onAddToCart={addToCart}
          />
        ))}
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Optimization:</strong> Products are only re-processed when search, category, or sort changes.
        Cart summary only recalculates when cart changes. ProductCards only re-render when needed!
      </div>
    </div>
  );
};

// Demo 5: Performance comparison
const PerformanceComparison = () => {
  const [data, setData] = useState(Array.from({ length: 1000 }, (_, i) => i + 1));
  const [multiplier, setMultiplier] = useState(1);
  const [triggerRender, setTriggerRender] = useState(0);

  // Without useMemo - recalculates every render
  const start1 = performance.now();
  const withoutMemo = data.reduce((sum, num) => sum + num * multiplier, 0);
  const end1 = performance.now();
  const timeWithoutMemo = end1 - start1;

  // With useMemo - only recalculates when dependencies change
  const withMemo = useMemo(() => {
    const start = performance.now();
    const result = data.reduce((sum, num) => sum + num * multiplier, 0);
    const end = performance.now();
    console.log(`useMemo calculation took: ${end - start}ms`);
    return result;
  }, [data, multiplier]);

  return (
    <div style={{ padding: '20px', border: '2px solid #fd7e14', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>⚡ Performance Comparison</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h4>Without useMemo</h4>
          <p>Result: {withoutMemo}</p>
          <p>Calculation time: {timeWithoutMemo.toFixed(4)}ms</p>
          <p style={{ fontSize: '12px', color: '#856404' }}>Runs on every render</p>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#d1ecf1', borderRadius: '4px' }}>
          <h4>With useMemo</h4>
          <p>Result: {withMemo}</p>
          <p style={{ fontSize: '12px', color: '#0c5460' }}>Only runs when data or multiplier changes</p>
        </div>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>Multiplier: <strong>{multiplier}</strong></p>
        <p>Data length: <strong>{data.length}</strong></p>
      </div>

      <div>
        <button
          onClick={() => setMultiplier(multiplier + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#fd7e14', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Change Multiplier (affects both)
        </button>
        <button
          onClick={() => setData(prev => [...prev, prev.length + 1])}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6f42c1', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Data (affects both)
        </button>
        <button
          onClick={() => setTriggerRender(triggerRender + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Force Re-render (only affects non-memoized)
        </button>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Notice:</strong> The "Force Re-render" button only affects the non-memoized calculation.
        The memoized version doesn't recalculate unless dependencies change!
      </div>
    </div>
  );
};

// Main component
const UseMemoExample = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #9c27b0',
      paddingBottom: '10px',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useMemo Hook - Value Memoization</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#f3e5f5', borderRadius: '8px' }}>
        <h2>🎯 What You'll Learn:</h2>
        <ul>
          <li><strong>The Problem:</strong> Expensive calculations running on every render</li>
          <li><strong>The Solution:</strong> useMemo to memoize calculated values</li>
          <li><strong>Dependencies:</strong> When memoized values recalculate</li>
          <li><strong>Performance Impact:</strong> Measuring the difference</li>
          <li><strong>Real-World Usage:</strong> Product filtering and cart calculations</li>
        </ul>
        <p><strong>💡 Pro Tip:</strong> Open browser console to see calculation logs!</p>
      </div>

      <WithoutUseMemo />
      <WithUseMemo />
      <DynamicDependencies />
      <ProductList />
      <PerformanceComparison />

      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', marginTop: '30px' }}>
        <h2>🎓 Key useMemo Concepts</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>✅ When to Use useMemo:</h3>
            <ul>
              <li>Expensive calculations (loops, sorting, filtering)</li>
              <li>Creating objects/arrays for child components</li>
              <li>Processing large datasets</li>
              <li>Complex computations with dependencies</li>
            </ul>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>❌ When NOT to Use useMemo:</h3>
            <ul>
              <li>Simple calculations (basic math, strings)</li>
              <li>Values that change frequently</li>
              <li>No performance issues observed</li>
              <li>Premature optimization</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3>🔑 Remember:</h3>
          <ul>
            <li><strong>useMemo memoizes values</strong> - recalculates only when dependencies change</li>
            <li><strong>Include all dependencies</strong> - use ESLint exhaustive-deps rule</li>
            <li><strong>Has overhead</strong> - only use for genuinely expensive operations</li>
            <li><strong>Measure performance</strong> - profile before and after optimization</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseMemoExample;