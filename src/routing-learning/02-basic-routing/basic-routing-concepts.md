# 🚀 Basic Routing - Setting Up Your First Routes

## 🎯 What You'll Learn

- How to set up React Router in your application
- Creating your first routes with BrowserRouter
- Using Route, Routes, Link, and NavLink components
- Building a basic navigation system
- Understanding route matching and rendering

## 📦 Installation & Setup

### **Step 1: Install React Router**
```bash
npm install react-router-dom
```

### **Step 2: Basic App Structure**
```jsx
// main.jsx or index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

### **Step 3: Wrap App with Router**
```jsx
// App.jsx
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <AppRoutes />
      </div>
    </BrowserRouter>
  );
}

export default App;
```

## 🧩 Core Components Deep Dive

### **1. BrowserRouter**
The foundation component that enables routing.

```jsx
import { BrowserRouter } from 'react-router-dom';

function App() {
  return (
    <BrowserRouter>
      {/* All your routed components go here */}
      <Navigation />
      <MainContent />
    </BrowserRouter>
  );
}
```

**Key Points:**
- ✅ Must wrap your entire app
- ✅ Only use ONE router per app
- ✅ Enables clean URLs like `/about`
- ✅ Handles browser history automatically

### **2. Routes & Route**
Define which component renders for each URL.

```jsx
import { Routes, Route } from 'react-router-dom';

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
      <Route path="/contact" element={<Contact />} />
      <Route path="/products" element={<Products />} />
    </Routes>
  );
}
```

**Route Props:**
- **`path`** - URL pattern to match
- **`element`** - Component to render when path matches
- **`index`** - Default route for parent (we'll cover in nested routing)

### **3. Link Component**
Creates navigation links (replaces `<a>` tags).

```jsx
import { Link } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <Link to="/">Home</Link>
      <Link to="/about">About</Link>
      <Link to="/contact">Contact</Link>
    </nav>
  );
}
```

**Why Link instead of `<a>`?**
- ✅ Prevents page reload
- ✅ Maintains React state
- ✅ Faster navigation
- ✅ Works with React Router history

**❌ Don't do this:**
```jsx
<a href="/about">About</a> // This will reload the page!
```

**✅ Do this:**
```jsx
<Link to="/about">About</Link> // This navigates without reload
```

### **4. NavLink Component**
Like Link, but with active state styling.

```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav>
      <NavLink 
        to="/" 
        className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
      >
        Home
      </NavLink>
      
      <NavLink 
        to="/about"
        style={({ isActive }) => ({
          color: isActive ? '#ff6b6b' : '#333',
          fontWeight: isActive ? 'bold' : 'normal'
        })}
      >
        About
      </NavLink>
    </nav>
  );
}
```

**NavLink Features:**
- ✅ Automatically adds `active` class to current route
- ✅ Provides `isActive` boolean in className/style functions
- ✅ Perfect for navigation menus
- ✅ Visual feedback for current page

## 🎨 Path Matching Rules

### **Exact Matching (Default in v6)**
```jsx
<Routes>
  <Route path="/" element={<Home />} />           {/* Matches only "/" */}
  <Route path="/about" element={<About />} />     {/* Matches only "/about" */}
  <Route path="/contact" element={<Contact />} /> {/* Matches only "/contact" */}
</Routes>
```

### **Wildcard Matching**
```jsx
<Routes>
  <Route path="/products/*" element={<Products />} />  {/* Matches "/products/anything" */}
  <Route path="*" element={<NotFound />} />            {/* Matches any unmatched route */}
</Routes>
```

### **Route Priority**
Routes are matched in the order they're defined:

```jsx
<Routes>
  <Route path="/products/new" element={<NewProduct />} />     {/* More specific - higher priority */}
  <Route path="/products/:id" element={<ProductDetail />} />  {/* Less specific - lower priority */}
  <Route path="*" element={<NotFound />} />                   {/* Catch-all - lowest priority */}
</Routes>
```

## 🏗️ Complete Basic Routing Example

### **File Structure:**
```
src/
├── components/
│   ├── Home.jsx
│   ├── About.jsx
│   ├── Contact.jsx
│   ├── Products.jsx
│   ├── Navigation.jsx
│   └── NotFound.jsx
├── App.jsx
└── main.jsx
```

### **App.jsx:**
```jsx
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';
import Products from './components/Products';
import NotFound from './components/NotFound';
import './App.css';

function App() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />
        
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/products" element={<Products />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
```

### **Navigation.jsx:**
```jsx
import { NavLink } from 'react-router-dom';

function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <NavLink to="/">MyApp</NavLink>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/about" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            About
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/products" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Products
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/contact" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Contact
          </NavLink>
        </li>
      </ul>
    </nav>
  );
}

export default Navigation;
```

## 🎨 Basic Styling for Routes

### **App.css:**
```css
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navigation {
  background-color: #2c3e50;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: #bdc3c7;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  transition: all 0.3s ease;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
}

.nav-link.active {
  color: #3498db;
  background-color: rgba(52, 152, 219, 0.1);
}

.main-content {
  flex: 1;
  padding: 2rem;
}
```

## 🚨 Common Mistakes & Solutions

### **❌ Mistake 1: Using `<a>` tags**
```jsx
// Wrong - causes page reload
<a href="/about">About</a>
```

```jsx
// Correct - client-side navigation
<Link to="/about">About</Link>
```

### **❌ Mistake 2: Multiple Routers**
```jsx
// Wrong - multiple routers
function App() {
  return (
    <BrowserRouter>
      <Header />
    </BrowserRouter>
    <BrowserRouter>  {/* ❌ Don't do this */}
      <Routes>...</Routes>
    </BrowserRouter>
  );
}
```

```jsx
// Correct - single router
function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>...</Routes>
    </BrowserRouter>
  );
}
```

### **❌ Mistake 3: Routes outside Router**
```jsx
// Wrong - Routes must be inside Router
function App() {
  return (
    <div>
      <Routes>  {/* ❌ No Router wrapper */}
        <Route path="/" element={<Home />} />
      </Routes>
    </div>
  );
}
```

```jsx
// Correct - Routes inside Router
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}
```

## 🧪 Testing Your Routes

### **Manual Testing Checklist:**
- [ ] Navigate to each route via links
- [ ] Type URLs directly in browser
- [ ] Use browser back/forward buttons
- [ ] Check active states on navigation
- [ ] Test 404 page with invalid URLs

### **URL Testing:**
```
✅ http://localhost:3000/          → Home page
✅ http://localhost:3000/about     → About page
✅ http://localhost:3000/contact   → Contact page
✅ http://localhost:3000/products  → Products page
✅ http://localhost:3000/invalid   → 404 page
```

## 🎯 Best Practices

### **1. Consistent Route Structure**
```jsx
// Good - consistent naming
<Route path="/" element={<Home />} />
<Route path="/about" element={<About />} />
<Route path="/contact" element={<Contact />} />

// Avoid - inconsistent naming
<Route path="/home" element={<Home />} />
<Route path="/about-us" element={<About />} />
<Route path="/contact_us" element={<Contact />} />
```

### **2. Always Include 404 Route**
```jsx
<Routes>
  <Route path="/" element={<Home />} />
  <Route path="/about" element={<About />} />
  <Route path="*" element={<NotFound />} />  {/* Always include this */}
</Routes>
```

### **3. Organize Routes in Separate File**
```jsx
// routes.jsx
import { Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import About from './components/About';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/about" element={<About />} />
    </Routes>
  );
}
```

## 🎉 What You've Accomplished

After completing this section, you can:

- ✅ Set up React Router in any React application
- ✅ Create basic routes with path and element props
- ✅ Build navigation with Link and NavLink components
- ✅ Style active navigation states
- ✅ Handle 404 pages with catch-all routes
- ✅ Understand route matching and priority

## 🚀 What's Next?

Now that you have basic routing working, you're ready to learn about:

1. **Route Parameters** → `03-route-parameters` - Dynamic URLs like `/products/123`
2. **Nested Routing** → `04-nested-routing` - Complex route hierarchies
3. **Navigation Hooks** → `05-navigation-hooks` - Programmatic navigation

---

**🎉 Congratulations! You've built your first routed React application!**

**Next:** `03-route-parameters/route-parameters-concepts.md`