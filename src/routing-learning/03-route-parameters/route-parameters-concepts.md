# 🎯 Route Parameters - Dynamic URLs

## 🤔 What Are Route Parameters?

Route parameters allow you to create dynamic URLs that can capture values from the URL path. Instead of creating separate routes for each product, user, or post, you can use parameters to handle dynamic content.

## 🔄 Static vs Dynamic Routes

### **Static Routes (Limited):**
```jsx
// ❌ Not scalable - need a route for every product
<Routes>
  <Route path="/products/laptop" element={<LaptopPage />} />
  <Route path="/products/phone" element={<PhonePage />} />
  <Route path="/products/tablet" element={<TabletPage />} />
  {/* What about 1000+ products? */}
</Routes>
```

### **Dynamic Routes (Scalable):**
```jsx
// ✅ One route handles all products
<Routes>
  <Route path="/products/:id" element={<ProductPage />} />
</Routes>
```

**URLs this handles:**
- `/products/laptop` → id = "laptop"
- `/products/123` → id = "123"
- `/products/anything` → id = "anything"

## 🧩 Types of Route Parameters

### **1. Path Parameters (URL Segments)**
Captured from URL segments using `:paramName` syntax.

```jsx
<Route path="/users/:userId" element={<UserProfile />} />
<Route path="/posts/:postId/comments/:commentId" element={<Comment />} />
```

**Examples:**
- `/users/123` → userId = "123"
- `/posts/abc/comments/xyz` → postId = "abc", commentId = "xyz"

### **2. Query Parameters (URL Search)**
Captured from URL search string using `?key=value&key2=value2`.

```jsx
// URL: /products?category=electronics&sort=price&page=2
// category = "electronics", sort = "price", page = "2"
```

### **3. Optional Parameters**
Parameters that may or may not be present.

```jsx
<Route path="/products/:category?/:id?" element={<ProductPage />} />
```

**Matches:**
- `/products` → category = undefined, id = undefined
- `/products/electronics` → category = "electronics", id = undefined
- `/products/electronics/123` → category = "electronics", id = "123"

## 🪝 useParams Hook

The `useParams` hook extracts path parameters from the current URL.

### **Basic Usage:**
```jsx
import { useParams } from 'react-router-dom';

function ProductPage() {
  const { id } = useParams();
  
  return (
    <div>
      <h1>Product Details</h1>
      <p>Product ID: {id}</p>
    </div>
  );
}

// Route: <Route path="/products/:id" element={<ProductPage />} />
// URL: /products/123 → id = "123"
```

### **Multiple Parameters:**
```jsx
function BlogPost() {
  const { category, postId } = useParams();
  
  return (
    <div>
      <h1>Blog Post</h1>
      <p>Category: {category}</p>
      <p>Post ID: {postId}</p>
    </div>
  );
}

// Route: <Route path="/blog/:category/:postId" element={<BlogPost />} />
// URL: /blog/tech/react-hooks → category = "tech", postId = "react-hooks"
```

### **With Default Values:**
```jsx
function ProductPage() {
  const { id = 'default' } = useParams();
  
  return (
    <div>
      <h1>Product: {id}</h1>
    </div>
  );
}
```

## 🔍 useSearchParams Hook

The `useSearchParams` hook handles query parameters (search params).

### **Basic Usage:**
```jsx
import { useSearchParams } from 'react-router-dom';

function ProductList() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const category = searchParams.get('category');
  const sort = searchParams.get('sort');
  const page = searchParams.get('page') || '1';
  
  return (
    <div>
      <h1>Products</h1>
      <p>Category: {category}</p>
      <p>Sort: {sort}</p>
      <p>Page: {page}</p>
    </div>
  );
}

// URL: /products?category=electronics&sort=price&page=2
```

### **Updating Search Parameters:**
```jsx
function ProductFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const handleCategoryChange = (category) => {
    setSearchParams(prev => {
      prev.set('category', category);
      return prev;
    });
  };
  
  const handleSortChange = (sort) => {
    setSearchParams(prev => {
      prev.set('sort', sort);
      prev.delete('page'); // Reset page when sorting changes
      return prev;
    });
  };
  
  return (
    <div>
      <button onClick={() => handleCategoryChange('electronics')}>
        Electronics
      </button>
      <button onClick={() => handleSortChange('price')}>
        Sort by Price
      </button>
    </div>
  );
}
```

### **Working with Search Params Object:**
```jsx
function ProductSearch() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // Get all params as an object
  const params = Object.fromEntries(searchParams.entries());
  
  // Update multiple params at once
  const updateFilters = (newFilters) => {
    setSearchParams(newFilters);
  };
  
  return (
    <div>
      <pre>{JSON.stringify(params, null, 2)}</pre>
      
      <button onClick={() => updateFilters({ 
        category: 'books', 
        sort: 'title', 
        page: '1' 
      })}>
        Show Books
      </button>
    </div>
  );
}
```

## 🎨 Real-World Examples

### **1. E-commerce Product Page**
```jsx
// Route: /products/:productId
function ProductDetail() {
  const { productId } = useParams();
  const [searchParams] = useSearchParams();
  
  const color = searchParams.get('color');
  const size = searchParams.get('size');
  
  // Fetch product data based on productId
  const [product, setProduct] = useState(null);
  
  useEffect(() => {
    fetchProduct(productId).then(setProduct);
  }, [productId]);
  
  if (!product) return <div>Loading...</div>;
  
  return (
    <div>
      <h1>{product.name}</h1>
      <p>ID: {productId}</p>
      {color && <p>Selected Color: {color}</p>}
      {size && <p>Selected Size: {size}</p>}
      
      <Link to={`/products/${productId}?color=red&size=large`}>
        View in Red, Large
      </Link>
    </div>
  );
}
```

### **2. User Profile with Tabs**
```jsx
// Route: /users/:userId/:tab?
function UserProfile() {
  const { userId, tab = 'profile' } = useParams();
  
  const renderTabContent = () => {
    switch (tab) {
      case 'profile':
        return <UserProfileTab userId={userId} />;
      case 'posts':
        return <UserPostsTab userId={userId} />;
      case 'settings':
        return <UserSettingsTab userId={userId} />;
      default:
        return <div>Tab not found</div>;
    }
  };
  
  return (
    <div>
      <nav>
        <Link to={`/users/${userId}/profile`}>Profile</Link>
        <Link to={`/users/${userId}/posts`}>Posts</Link>
        <Link to={`/users/${userId}/settings`}>Settings</Link>
      </nav>
      
      {renderTabContent()}
    </div>
  );
}
```

### **3. Search Results with Pagination**
```jsx
// Route: /search
function SearchResults() {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const query = searchParams.get('q') || '';
  const page = parseInt(searchParams.get('page') || '1');
  const category = searchParams.get('category') || 'all';
  
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  
  useEffect(() => {
    searchAPI({ query, page, category })
      .then(data => {
        setResults(data.results);
        setTotalPages(data.totalPages);
      });
  }, [query, page, category]);
  
  const handlePageChange = (newPage) => {
    setSearchParams(prev => {
      prev.set('page', newPage.toString());
      return prev;
    });
  };
  
  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <p>Category: {category} | Page: {page}</p>
      
      <div className="results">
        {results.map(result => (
          <div key={result.id}>{result.title}</div>
        ))}
      </div>
      
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => handlePageChange(i + 1)}
            className={page === i + 1 ? 'active' : ''}
          >
            {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
```

## 🔗 Creating Links with Parameters

### **Path Parameters:**
```jsx
function ProductList() {
  const products = [
    { id: 1, name: 'Laptop' },
    { id: 2, name: 'Phone' },
    { id: 3, name: 'Tablet' }
  ];
  
  return (
    <div>
      {products.map(product => (
        <Link 
          key={product.id} 
          to={`/products/${product.id}`}
        >
          {product.name}
        </Link>
      ))}
    </div>
  );
}
```

### **Query Parameters:**
```jsx
function CategoryFilter() {
  const categories = ['electronics', 'books', 'clothing'];
  
  return (
    <div>
      {categories.map(category => (
        <Link 
          key={category}
          to={`/products?category=${category}&page=1`}
        >
          {category}
        </Link>
      ))}
    </div>
  );
}
```

### **Combining Path and Query Parameters:**
```jsx
function ProductLink({ productId, color, size }) {
  const searchParams = new URLSearchParams();
  if (color) searchParams.set('color', color);
  if (size) searchParams.set('size', size);
  
  const queryString = searchParams.toString();
  const to = `/products/${productId}${queryString ? `?${queryString}` : ''}`;
  
  return <Link to={to}>View Product</Link>;
}
```

## ⚠️ Parameter Validation & Error Handling

### **Validating Parameters:**
```jsx
function ProductPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Validate ID format
    if (!id || !/^\d+$/.test(id)) {
      setError('Invalid product ID');
      return;
    }
    
    fetchProduct(id)
      .then(setProduct)
      .catch(() => setError('Product not found'));
  }, [id]);
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  if (!product) {
    return <div>Loading...</div>;
  }
  
  return <div>{product.name}</div>;
}
```

### **Type Conversion:**
```jsx
function PaginatedList() {
  const [searchParams] = useSearchParams();
  
  // Convert string to number with validation
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'));
  const limit = Math.min(100, Math.max(10, parseInt(searchParams.get('limit') || '20')));
  
  return (
    <div>
      <p>Page: {page}, Items per page: {limit}</p>
    </div>
  );
}
```

## 🎯 Best Practices

### **1. Use Descriptive Parameter Names**
```jsx
// ✅ Good - clear parameter names
<Route path="/users/:userId/posts/:postId" element={<Post />} />

// ❌ Avoid - unclear parameter names
<Route path="/users/:id/posts/:id2" element={<Post />} />
```

### **2. Validate Parameters**
```jsx
function UserProfile() {
  const { userId } = useParams();
  
  // Validate userId format
  if (!userId || !/^\d+$/.test(userId)) {
    return <Navigate to="/404" replace />;
  }
  
  // Continue with valid userId
}
```

### **3. Handle Missing Parameters Gracefully**
```jsx
function ProductPage() {
  const { id } = useParams();
  
  if (!id) {
    return <Navigate to="/products" replace />;
  }
  
  // Continue with valid id
}
```

### **4. Use Search Params for Filters**
```jsx
// ✅ Good - filters in search params
// URL: /products?category=electronics&sort=price&page=2

// ❌ Avoid - filters in path params
// URL: /products/electronics/price/2
```

### **5. Preserve Search Params When Navigating**
```jsx
function ProductCard({ product }) {
  const [searchParams] = useSearchParams();
  
  // Preserve current filters when viewing product
  const productUrl = `/products/${product.id}?${searchParams.toString()}`;
  
  return (
    <Link to={productUrl}>
      {product.name}
    </Link>
  );
}
```

## 🚨 Common Mistakes

### **❌ Mistake 1: Not handling undefined parameters**
```jsx
// Wrong - can crash if id is undefined
function ProductPage() {
  const { id } = useParams();
  return <h1>Product {id.toUpperCase()}</h1>; // Error if id is undefined
}

// Correct - handle undefined
function ProductPage() {
  const { id } = useParams();
  if (!id) return <div>Product not found</div>;
  return <h1>Product {id.toUpperCase()}</h1>;
}
```

### **❌ Mistake 2: Forgetting parameter types**
```jsx
// Wrong - parameters are always strings
function ProductPage() {
  const { id } = useParams();
  const productId = id + 1; // String concatenation: "123" + 1 = "1231"
}

// Correct - convert to number
function ProductPage() {
  const { id } = useParams();
  const productId = parseInt(id) + 1; // Number addition: 123 + 1 = 124
}
```

### **❌ Mistake 3: Not encoding special characters**
```jsx
// Wrong - special characters can break URLs
<Link to={`/search?q=${query}`}>Search</Link>

// Correct - encode parameters
<Link to={`/search?q=${encodeURIComponent(query)}`}>Search</Link>
```

## 🎉 What You've Learned

After mastering route parameters, you can:

- ✅ Create dynamic routes with path parameters
- ✅ Handle query parameters for filters and pagination
- ✅ Use useParams and useSearchParams hooks effectively
- ✅ Build scalable routing for dynamic content
- ✅ Validate and handle parameter errors
- ✅ Create complex URLs with multiple parameters

## 🚀 What's Next?

Now that you understand parameters, you're ready for:

1. **Nested Routing** → `04-nested-routing` - Complex route hierarchies
2. **Navigation Hooks** → `05-navigation-hooks` - Programmatic navigation
3. **Route Guards** → `06-route-guards` - Protected routes

---

**🎉 You can now build dynamic, scalable routing systems!**

**Next:** `04-nested-routing/nested-routing-concepts.md`