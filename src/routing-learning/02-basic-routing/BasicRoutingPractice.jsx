// 🎯 Basic Routing Practice - Hands-on Exercises
// Complete these exercises to master basic routing concepts

import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

// =============================================================================
// EXERCISE 1: Create a Simple Blog Application
// =============================================================================

// TODO: Create these page components for a blog
function BlogHome() {
  return (
    <div className="exercise-page">
      <h1>📝 My Blog</h1>
      <p>Welcome to my personal blog!</p>

      {/* TODO: Add navigation links to other pages */}
      <div className="blog-preview">
        <h3>Recent Posts:</h3>
        <ul>
          <li>How to Learn React Router</li>
          <li>Building Better Web Applications</li>
          <li>JavaScript Tips and Tricks</li>
        </ul>
      </div>
    </div>
  );
}

function BlogPosts() {
  const posts = [
    { id: 1, title: 'How to Learn React Router', date: '2024-01-15' },
    { id: 2, title: 'Building Better Web Applications', date: '2024-01-10' },
    { id: 3, title: 'JavaScript Tips and Tricks', date: '2024-01-05' }
  ];

  return (
    <div className="exercise-page">
      <h1>📚 All Blog Posts</h1>

      <div className="posts-list">
        {posts.map(post => (
          <div key={post.id} className="post-item">
            <h3>{post.title}</h3>
            <p>Published: {post.date}</p>
            {/* TODO: Add a "Read More" link for each post */}
          </div>
        ))}
      </div>
    </div>
  );
}

function BlogAbout() {
  return (
    <div className="exercise-page">
      <h1>👋 About Me</h1>
      <p>I'm a web developer passionate about React and modern web technologies.</p>

      <div className="about-content">
        <h3>Skills:</h3>
        <ul>
          <li>React & React Router</li>
          <li>JavaScript & TypeScript</li>
          <li>Node.js & Express</li>
          <li>CSS & Styled Components</li>
        </ul>

        {/* TODO: Add a link back to home */}
      </div>
    </div>
  );
}

// TODO: Create a BlogNavigation component
function BlogNavigation() {
  return (
    <nav className="blog-nav">
      {/* TODO: Implement navigation with NavLink components */}
      {/* Should include: Home, Posts, About */}
      {/* Use active styling for current page */}
    </nav>
  );
}

// TODO: Complete the BlogApp component
function BlogApp() {
  return (
    <BrowserRouter>
      <div className="blog-app">
        {/* TODO: Add BlogNavigation component */}

        <main className="blog-content">
          <Routes>
            {/* TODO: Define routes for:
                - "/" -> BlogHome
                - "/posts" -> BlogPosts  
                - "/about" -> BlogAbout
                - "*" -> 404 page
            */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// =============================================================================
// EXERCISE 2: E-commerce Navigation
// =============================================================================

// TODO: Create an e-commerce site with these pages
function ShopHome() {
  return (
    <div className="exercise-page">
      <h1>🛍️ Welcome to Our Shop</h1>
      <p>Find amazing products at great prices!</p>

      <div className="featured-categories">
        <h3>Featured Categories:</h3>
        {/* TODO: Add Link components to navigate to different categories */}
        <div className="category-grid">
          <div className="category-card">Electronics</div>
          <div className="category-card">Clothing</div>
          <div className="category-card">Books</div>
          <div className="category-card">Home & Garden</div>
        </div>
      </div>
    </div>
  );
}

function ShopProducts() {
  const products = [
    { id: 1, name: 'Laptop', price: '$999', category: 'Electronics' },
    { id: 2, name: 'T-Shirt', price: '$29', category: 'Clothing' },
    { id: 3, name: 'Book', price: '$19', category: 'Books' },
    { id: 4, name: 'Plant Pot', price: '$15', category: 'Home & Garden' }
  ];

  return (
    <div className="exercise-page">
      <h1>📦 All Products</h1>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <p className="category">{product.category}</p>
            <button className="btn">Add to Cart</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function ShopCart() {
  return (
    <div className="exercise-page">
      <h1>🛒 Shopping Cart</h1>
      <p>Your cart is empty.</p>

      {/* TODO: Add a link to continue shopping */}
      <div className="cart-actions">
        {/* Link to products page */}
      </div>
    </div>
  );
}

function ShopAccount() {
  return (
    <div className="exercise-page">
      <h1>👤 My Account</h1>
      <p>Manage your account settings and order history.</p>

      <div className="account-sections">
        <div className="account-section">
          <h3>Profile Information</h3>
          <p>Update your personal details</p>
        </div>
        <div className="account-section">
          <h3>Order History</h3>
          <p>View your past orders</p>
        </div>
      </div>
    </div>
  );
}

// TODO: Create ShopNavigation component
function ShopNavigation() {
  return (
    <nav className="shop-nav">
      <div className="nav-brand">
        {/* TODO: Add Link to home page */}
        <span>🛍️ MyShop</span>
      </div>

      <ul className="nav-links">
        {/* TODO: Add NavLink components for:
            - Home
            - Products  
            - Cart
            - Account
        */}
      </ul>
    </nav>
  );
}

// TODO: Complete the ShopApp component
function ShopApp() {
  return (
    <BrowserRouter>
      <div className="shop-app">
        {/* TODO: Add ShopNavigation */}

        <main className="shop-content">
          <Routes>
            {/* TODO: Define routes for all shop pages */}
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

// =============================================================================
// EXERCISE 3: Portfolio Website
// =============================================================================

// TODO: Create a personal portfolio with these sections
function PortfolioHome() {
  return (
    <div className="exercise-page">
      <h1>👨‍💻 John Doe - Web Developer</h1>
      <p>Creating amazing web experiences with React</p>

      {/* TODO: Add navigation to other sections */}
    </div>
  );
}

function PortfolioProjects() {
  const projects = [
    { name: 'E-commerce App', tech: 'React, Node.js', status: 'Completed' },
    { name: 'Task Manager', tech: 'React, Firebase', status: 'In Progress' },
    { name: 'Weather App', tech: 'React, API', status: 'Completed' }
  ];

  return (
    <div className="exercise-page">
      <h1>💼 My Projects</h1>

      <div className="projects-grid">
        {projects.map((project, index) => (
          <div key={index} className="project-card">
            <h3>{project.name}</h3>
            <p>Tech: {project.tech}</p>
            <p>Status: {project.status}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioSkills() {
  const skills = [
    'React & React Router',
    'JavaScript & TypeScript',
    'HTML & CSS',
    'Node.js & Express',
    'MongoDB & PostgreSQL',
    'Git & GitHub'
  ];

  return (
    <div className="exercise-page">
      <h1>🚀 My Skills</h1>

      <div className="skills-list">
        {skills.map((skill, index) => (
          <div key={index} className="skill-item">
            {skill}
          </div>
        ))}
      </div>
    </div>
  );
}

function PortfolioContact() {
  return (
    <div className="exercise-page">
      <h1>📧 Get In Touch</h1>
      <p>Let's work together on your next project!</p>

      <div className="contact-info">
        <p>Email: john@example.com</p>
        <p>LinkedIn: /in/johndoe</p>
        <p>GitHub: /johndoe</p>
      </div>
    </div>
  );
}

// TODO: Complete the PortfolioApp
function PortfolioApp() {
  return (
    <BrowserRouter>
      <div className="portfolio-app">
        {/* TODO: Create navigation */}
        {/* TODO: Define routes */}
      </div>
    </BrowserRouter>
  );
}

// =============================================================================
// EXERCISE SOLUTIONS (Uncomment to see solutions)
// =============================================================================

/*
// SOLUTION 1: Blog Navigation
function BlogNavigationSolution() {
  return (
    <nav className="blog-nav">
      <div className="nav-brand">
        <Link to="/">📝 My Blog</Link>
      </div>
      
      <ul className="nav-links">
        <li>
          <NavLink 
            to="/" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end
          >
            Home
          </NavLink>
        </li>
        <li>
          <NavLink 
            to="/posts" 
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
          >
            Posts
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
      </ul>
    </nav>
  );
}

// SOLUTION 1: Blog App Complete
function BlogAppSolution() {
  return (
    <BrowserRouter>
      <div className="blog-app">
        <BlogNavigationSolution />
        
        <main className="blog-content">
          <Routes>
            <Route path="/" element={<BlogHome />} />
            <Route path="/posts" element={<BlogPosts />} />
            <Route path="/about" element={<BlogAbout />} />
            <Route path="*" element={<div>404 - Page Not Found</div>} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
*/

// =============================================================================
// PRACTICE COMPONENT SELECTOR
// =============================================================================

export default function BasicRoutingPractice() {
  const [currentExercise, setCurrentExercise] = useState('blog');

  const exercises = {
    blog: { component: BlogApp, title: '📝 Blog Application' },
    shop: { component: ShopApp, title: '🛍️ E-commerce Site' },
    portfolio: { component: PortfolioApp, title: '👨‍💻 Portfolio Website' }
  };

  const CurrentExercise = exercises[currentExercise].component;

  return (
    <div style={{ padding: '20px' }}>
      <h1>🎯 Basic Routing Practice Exercises</h1>

      <div className="exercise-selector">
        <h2>Choose an exercise to complete:</h2>
        <div className="exercise-buttons">
          {Object.entries(exercises).map(([key, exercise]) => (
            <button
              key={key}
              onClick={() => setCurrentExercise(key)}
              className={`exercise-btn ${currentExercise === key ? 'active' : ''}`}
              style={{
                margin: '0 10px',
                padding: '10px 20px',
                backgroundColor: currentExercise === key ? '#3498db' : '#ecf0f1',
                color: currentExercise === key ? 'white' : '#2c3e50',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '16px'
              }}
            >
              {exercise.title}
            </button>
          ))}
        </div>
      </div>

      <div className="exercise-instructions">
        <h3>📋 Instructions:</h3>
        <ol>
          <li>Complete the TODO comments in the selected exercise</li>
          <li>Implement proper routing with BrowserRouter, Routes, and Route</li>
          <li>Create navigation with Link and NavLink components</li>
          <li>Add active state styling to navigation</li>
          <li>Include a 404 page for unmatched routes</li>
        </ol>
      </div>

      <div className="exercise-content">
        <h2>Current Exercise: {exercises[currentExercise].title}</h2>
        <div style={{
          border: '2px solid #3498db',
          borderRadius: '8px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <CurrentExercise />
        </div>
      </div>

      <div className="exercise-tips">
        <h3>💡 Tips:</h3>
        <ul>
          <li><strong>Start with the navigation:</strong> Create the nav component first</li>
          <li><strong>Use NavLink for menus:</strong> It provides active state styling</li>
          <li><strong>Use Link for buttons:</strong> When you don't need active states</li>
          <li><strong>Always include a catch-all route:</strong> <code>path="*"</code> for 404 pages</li>
          <li><strong>Test your routes:</strong> Try typing URLs directly in the browser</li>
        </ul>
      </div>
    </div>
  );
}

// Basic styles for exercises
const exerciseStyles = `
.exercise-page {
  padding: 20px;
  max-width: 800px;
  margin: 0 auto;
}

.blog-nav, .shop-nav {
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

.category-grid, .products-grid, .projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.category-card, .product-card, .project-card {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 8px;
  text-align: center;
  border: 1px solid #dee2e6;
}

.price {
  font-weight: bold;
  color: #e74c3c;
}

.btn {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.skills-list {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  margin-top: 1rem;
}

.skill-item {
  background-color: #3498db;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  font-size: 0.9rem;
}

.posts-list {
  margin-top: 1rem;
}

.post-item {
  background: #f8f9fa;
  padding: 1rem;
  margin-bottom: 1rem;
  border-radius: 8px;
  border-left: 4px solid #3498db;
}

.account-sections {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-top: 1rem;
}

.account-section {
  background: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = exerciseStyles;
  document.head.appendChild(styleSheet);
}