// 🚀 Basic Routing - Complete Working Example
// This demonstrates a fully functional basic routing setup

import React from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink } from 'react-router-dom';

// Page Components
function Home() {
  return (
    <div className="page">
      <h1>🏠 Welcome to Home Page</h1>
      <p>This is the home page of our application.</p>
      <div className="page-info">
        <h3>What you can do here:</h3>
        <ul>
          <li>Browse our products</li>
          <li>Learn about our company</li>
          <li>Get in touch with us</li>
        </ul>
      </div>
      <div className="navigation-demo">
        <h3>Try navigating with these links:</h3>
        <Link to="/about" className="demo-link">Go to About →</Link>
        <Link to="/products" className="demo-link">View Products →</Link>
      </div>
    </div>
  );
}

function About() {
  return (
    <div className="page">
      <h1>ℹ️ About Us</h1>
      <p>We are a company dedicated to building amazing React applications.</p>
      <div className="page-info">
        <h3>Our Mission:</h3>
        <p>To help developers master React Router and build better web applications.</p>

        <h3>Our Values:</h3>
        <ul>
          <li>Quality education</li>
          <li>Practical examples</li>
          <li>Clear explanations</li>
        </ul>
      </div>
      <div className="navigation-demo">
        <Link to="/contact" className="demo-link">Contact Us →</Link>
        <Link to="/" className="demo-link">← Back to Home</Link>
      </div>
    </div>
  );
}

function Products() {
  const products = [
    { id: 1, name: 'React Router Course', price: '$49' },
    { id: 2, name: 'Advanced React Patterns', price: '$79' },
    { id: 3, name: 'Full Stack React', price: '$99' }
  ];

  return (
    <div className="page">
      <h1>📦 Our Products</h1>
      <p>Check out our amazing React learning resources!</p>

      <div className="products-grid">
        {products.map(product => (
          <div key={product.id} className="product-card">
            <h3>{product.name}</h3>
            <p className="price">{product.price}</p>
            <button className="btn-primary">Learn More</button>
          </div>
        ))}
      </div>

      <div className="navigation-demo">
        <Link to="/contact" className="demo-link">Questions? Contact Us →</Link>
      </div>
    </div>
  );
}

function Contact() {
  return (
    <div className="page">
      <h1>📞 Contact Us</h1>
      <p>We'd love to hear from you!</p>

      <div className="contact-info">
        <div className="contact-method">
          <h3>📧 Email</h3>
          <p>hello@reactrouter.com</p>
        </div>

        <div className="contact-method">
          <h3>📱 Phone</h3>
          <p>+1 (555) 123-4567</p>
        </div>

        <div className="contact-method">
          <h3>🏢 Address</h3>
          <p>123 React Street<br />Router City, RC 12345</p>
        </div>
      </div>

      <div className="contact-form">
        <h3>Send us a message:</h3>
        <form>
          <input type="text" placeholder="Your Name" className="form-input" />
          <input type="email" placeholder="Your Email" className="form-input" />
          <textarea placeholder="Your Message" className="form-textarea"></textarea>
          <button type="submit" className="btn-primary">Send Message</button>
        </form>
      </div>
    </div>
  );
}

function NotFound() {
  return (
    <div className="page not-found">
      <h1>🚫 404 - Page Not Found</h1>
      <p>Oops! The page you're looking for doesn't exist.</p>
      <div className="not-found-help">
        <h3>What you can do:</h3>
        <ul>
          <li>Check the URL for typos</li>
          <li>Go back to the home page</li>
          <li>Use the navigation menu above</li>
        </ul>
      </div>
      <div className="navigation-demo">
        <Link to="/" className="demo-link">← Go Home</Link>
        <Link to="/products" className="demo-link">Browse Products</Link>
      </div>
    </div>
  );
}

// Navigation Component with NavLink
function Navigation() {
  return (
    <nav className="navigation">
      <div className="nav-brand">
        <Link to="/">🚀 ReactRouter Demo</Link>
      </div>

      <ul className="nav-links">
        <li>
          <NavLink
            to="/"
            className={({ isActive }) => isActive ? 'nav-link active' : 'nav-link'}
            end // This ensures only exact "/" matches, not "/about" etc.
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

// Main App Component
function BasicRoutingApp() {
  return (
    <BrowserRouter>
      <div className="app">
        <Navigation />

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/products" element={<Products />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>

        <footer className="footer">
          <p>© 2024 React Router Demo. Built with ❤️ and React Router v6</p>
        </footer>
      </div>
    </BrowserRouter>
  );
}

// Demonstration of Link vs NavLink differences
export function LinkVsNavLinkDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🔗 Link vs NavLink Comparison</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        {/* Link Demo */}
        <div style={{ border: '2px solid #3498db', borderRadius: '8px', padding: '20px' }}>
          <h3>🔗 Link Component</h3>
          <p>Basic navigation without active state:</p>

          <div className="demo-links">
            <Link to="/" style={{
              display: 'block',
              padding: '8px 16px',
              margin: '5px 0',
              backgroundColor: '#ecf0f1',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              Home (Link)
            </Link>
            <Link to="/about" style={{
              display: 'block',
              padding: '8px 16px',
              margin: '5px 0',
              backgroundColor: '#ecf0f1',
              textDecoration: 'none',
              borderRadius: '4px'
            }}>
              About (Link)
            </Link>
          </div>

          <div style={{ marginTop: '15px', fontSize: '14px', color: '#7f8c8d' }}>
            <strong>Use Link when:</strong>
            <ul>
              <li>You don't need active state styling</li>
              <li>For buttons or call-to-action links</li>
              <li>For links within content</li>
            </ul>
          </div>
        </div>

        {/* NavLink Demo */}
        <div style={{ border: '2px solid #e74c3c', borderRadius: '8px', padding: '20px' }}>
          <h3>🎯 NavLink Component</h3>
          <p>Navigation with active state styling:</p>

          <div className="demo-nav-links">
            <NavLink
              to="/"
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 16px',
                margin: '5px 0',
                backgroundColor: isActive ? '#e74c3c' : '#ecf0f1',
                color: isActive ? 'white' : '#2c3e50',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
              end
            >
              Home (NavLink)
            </NavLink>
            <NavLink
              to="/about"
              style={({ isActive }) => ({
                display: 'block',
                padding: '8px 16px',
                margin: '5px 0',
                backgroundColor: isActive ? '#e74c3c' : '#ecf0f1',
                color: isActive ? 'white' : '#2c3e50',
                textDecoration: 'none',
                borderRadius: '4px',
                fontWeight: isActive ? 'bold' : 'normal'
              })}
            >
              About (NavLink)
            </NavLink>
          </div>

          <div style={{ marginTop: '15px', fontSize: '14px', color: '#7f8c8d' }}>
            <strong>Use NavLink when:</strong>
            <ul>
              <li>Building navigation menus</li>
              <li>You need active state styling</li>
              <li>Users need visual feedback</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Route Matching Demo
export function RouteMatchingDemo() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🎯 Route Matching Examples</h2>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>How Routes Match URLs:</h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginTop: '15px' }}>
          <div>
            <h4>Route Definition</h4>
            <code style={{ backgroundColor: '#e9ecef', padding: '4px 8px', display: 'block', margin: '5px 0' }}>
              path="/"
            </code>
            <code style={{ backgroundColor: '#e9ecef', padding: '4px 8px', display: 'block', margin: '5px 0' }}>
              path="/about"
            </code>
            <code style={{ backgroundColor: '#e9ecef', padding: '4px 8px', display: 'block', margin: '5px 0' }}>
              path="/products"
            </code>
            <code style={{ backgroundColor: '#e9ecef', padding: '4px 8px', display: 'block', margin: '5px 0' }}>
              path="*"
            </code>
          </div>

          <div>
            <h4>Matches URL</h4>
            <div style={{ color: '#28a745', margin: '5px 0' }}>✅ /</div>
            <div style={{ color: '#28a745', margin: '5px 0' }}>✅ /about</div>
            <div style={{ color: '#28a745', margin: '5px 0' }}>✅ /products</div>
            <div style={{ color: '#28a745', margin: '5px 0' }}>✅ /anything-else</div>
          </div>

          <div>
            <h4>Renders Component</h4>
            <div style={{ margin: '5px 0' }}>Home</div>
            <div style={{ margin: '5px 0' }}>About</div>
            <div style={{ margin: '5px 0' }}>Products</div>
            <div style={{ margin: '5px 0' }}>NotFound</div>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h3>⚠️ Important Notes:</h3>
        <ul>
          <li><strong>Order matters:</strong> Routes are matched from top to bottom</li>
          <li><strong>First match wins:</strong> Only the first matching route renders</li>
          <li><strong>Catch-all route:</strong> <code>path="*"</code> should always be last</li>
          <li><strong>Exact matching:</strong> React Router v6 uses exact matching by default</li>
        </ul>
      </div>
    </div>
  );
}

// CSS Styles (you would put this in a separate CSS file)
const styles = `
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.navigation {
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
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 2rem;
}

.nav-link {
  color: rgba(255, 255, 255, 0.8);
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  color: white;
  background-color: rgba(255, 255, 255, 0.1);
  transform: translateY(-1px);
}

.nav-link.active {
  color: white;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
}

.main-content {
  flex: 1;
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
}

.page {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.page h1 {
  color: #2c3e50;
  margin-bottom: 1rem;
}

.page-info {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  border-left: 4px solid #3498db;
}

.navigation-demo {
  margin-top: 2rem;
  padding: 1rem;
  background-color: #e8f4fd;
  border-radius: 8px;
}

.demo-link {
  display: inline-block;
  margin: 0.5rem 1rem 0.5rem 0;
  padding: 0.5rem 1rem;
  background-color: #3498db;
  color: white;
  text-decoration: none;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}

.demo-link:hover {
  background-color: #2980b9;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin: 2rem 0;
}

.product-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
  transition: transform 0.3s ease;
}

.product-card:hover {
  transform: translateY(-5px);
}

.price {
  font-size: 1.5rem;
  font-weight: bold;
  color: #e74c3c;
  margin: 1rem 0;
}

.btn-primary {
  background-color: #3498db;
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #2980b9;
}

.contact-info {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.contact-method {
  background-color: #f8f9fa;
  padding: 1.5rem;
  border-radius: 8px;
  text-align: center;
}

.contact-form {
  background-color: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
  margin-top: 2rem;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 0.75rem;
  margin: 0.5rem 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
}

.form-textarea {
  height: 120px;
  resize: vertical;
}

.not-found {
  text-align: center;
  color: #e74c3c;
}

.not-found-help {
  background-color: #fff5f5;
  padding: 1.5rem;
  border-radius: 8px;
  margin: 2rem 0;
  border-left: 4px solid #e74c3c;
}

.footer {
  background-color: #2c3e50;
  color: white;
  text-align: center;
  padding: 1rem;
  margin-top: auto;
}
`;

// Add styles to document (in a real app, you'd use a CSS file)
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}

export default BasicRoutingApp;