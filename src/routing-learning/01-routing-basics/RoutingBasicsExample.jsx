// 🌐 React Routing Basics - Practical Example
// This example demonstrates the difference between routing and non-routing approaches

import React, { useState } from 'react';

// ❌ WITHOUT ROUTING - Problems Demo
export function WithoutRoutingExample() {
  const [currentPage, setCurrentPage] = useState('home');

  return (
    <div style={{ padding: '20px', border: '2px solid #ff6b6b', borderRadius: '8px' }}>
      <h2>❌ WITHOUT Routing (Problems)</h2>

      {/* Navigation */}
      <nav style={{ marginBottom: '20px' }}>
        <button
          onClick={() => setCurrentPage('home')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentPage === 'home' ? '#ff6b6b' : '#f0f0f0'
          }}
        >
          Home
        </button>
        <button
          onClick={() => setCurrentPage('about')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentPage === 'about' ? '#ff6b6b' : '#f0f0f0'
          }}
        >
          About
        </button>
        <button
          onClick={() => setCurrentPage('contact')}
          style={{
            margin: '0 10px',
            padding: '8px 16px',
            backgroundColor: currentPage === 'contact' ? '#ff6b6b' : '#f0f0f0'
          }}
        >
          Contact
        </button>
      </nav>

      {/* Content */}
      <div style={{ minHeight: '200px', backgroundColor: '#fff5f5', padding: '20px' }}>
        {currentPage === 'home' && <HomePage />}
        {currentPage === 'about' && <AboutPage />}
        {currentPage === 'contact' && <ContactPage />}
      </div>

      {/* Problems List */}
      <div style={{ marginTop: '20px', color: '#d63031' }}>
        <h3>Problems with this approach:</h3>
        <ul>
          <li>❌ URL doesn't change (always shows same URL)</li>
          <li>❌ Can't share specific page URLs</li>
          <li>❌ Browser back/forward buttons don't work</li>
          <li>❌ Can't bookmark specific pages</li>
          <li>❌ No SEO benefits</li>
          <li>❌ Poor user experience</li>
        </ul>
      </div>
    </div>
  );
}

// ✅ WITH ROUTING - Solution Demo (Conceptual)
export function WithRoutingConcept() {
  return (
    <div style={{ padding: '20px', border: '2px solid #00b894', borderRadius: '8px' }}>
      <h2>✅ WITH Routing (Solution)</h2>

      <div style={{ backgroundColor: '#f0fff4', padding: '20px', borderRadius: '4px' }}>
        <h3>How React Router solves these problems:</h3>

        <div style={{ marginBottom: '15px' }}>
          <h4>🔗 URL Changes:</h4>
          <code style={{ backgroundColor: '#e8f5e8', padding: '4px 8px' }}>
            myapp.com/ → myapp.com/about → myapp.com/contact
          </code>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>📱 Shareable URLs:</h4>
          <p>Users can share: <code>myapp.com/about</code> and others land directly on About page</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>⬅️➡️ Browser Navigation:</h4>
          <p>Back/Forward buttons work naturally</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>🔖 Bookmarking:</h4>
          <p>Users can bookmark specific pages</p>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <h4>🔍 SEO Benefits:</h4>
          <p>Search engines can index individual pages</p>
        </div>
      </div>

      <div style={{ marginTop: '20px', color: '#00b894' }}>
        <h3>✅ Benefits of React Router:</h3>
        <ul>
          <li>✅ Clean, shareable URLs</li>
          <li>✅ Browser navigation works perfectly</li>
          <li>✅ Bookmarkable pages</li>
          <li>✅ SEO-friendly</li>
          <li>✅ Better user experience</li>
          <li>✅ Professional web app behavior</li>
        </ul>
      </div>
    </div>
  );
}

// Sample page components
function HomePage() {
  return (
    <div>
      <h3>🏠 Home Page</h3>
      <p>Welcome to our website! This is the home page.</p>
      <p><strong>Current URL:</strong> {window.location.href}</p>
    </div>
  );
}

function AboutPage() {
  return (
    <div>
      <h3>ℹ️ About Page</h3>
      <p>Learn more about our company and mission.</p>
      <p><strong>Current URL:</strong> {window.location.href}</p>
    </div>
  );
}

function ContactPage() {
  return (
    <div>
      <h3>📞 Contact Page</h3>
      <p>Get in touch with us!</p>
      <p><strong>Current URL:</strong> {window.location.href}</p>
    </div>
  );
}

// Router Types Comparison
export function RouterTypesComparison() {
  return (
    <div style={{ padding: '20px' }}>
      <h2>🔧 Router Types Comparison</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>

        {/* BrowserRouter */}
        <div style={{ border: '2px solid #0984e3', borderRadius: '8px', padding: '15px' }}>
          <h3>🌐 BrowserRouter</h3>
          <div style={{ backgroundColor: '#f0f8ff', padding: '10px', borderRadius: '4px' }}>
            <h4>URLs look like:</h4>
            <code>myapp.com/about</code><br />
            <code>myapp.com/products/123</code>
          </div>

          <div style={{ marginTop: '10px' }}>
            <h4>✅ Pros:</h4>
            <ul>
              <li>Clean, professional URLs</li>
              <li>SEO-friendly</li>
              <li>Better user experience</li>
              <li>No # symbol in URLs</li>
            </ul>

            <h4>❌ Cons:</h4>
            <ul>
              <li>Requires server configuration</li>
              <li>May not work on all hosting platforms</li>
            </ul>
          </div>
        </div>

        {/* HashRouter */}
        <div style={{ border: '2px solid #e17055', borderRadius: '8px', padding: '15px' }}>
          <h3>🔗 HashRouter</h3>
          <div style={{ backgroundColor: '#fff5f0', padding: '10px', borderRadius: '4px' }}>
            <h4>URLs look like:</h4>
            <code>myapp.com/#/about</code><br />
            <code>myapp.com/#/products/123</code>
          </div>

          <div style={{ marginTop: '10px' }}>
            <h4>✅ Pros:</h4>
            <ul>
              <li>Works without server setup</li>
              <li>Compatible with all hosting</li>
              <li>Easy to deploy</li>
              <li>Good for GitHub Pages</li>
            </ul>

            <h4>❌ Cons:</h4>
            <ul>
              <li>URLs have # symbol</li>
              <li>Less SEO-friendly</li>
              <li>Looks less professional</li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
        <h3>🎯 Which Router to Choose?</h3>
        <ul>
          <li><strong>BrowserRouter:</strong> Use for production apps with proper server setup</li>
          <li><strong>HashRouter:</strong> Use for simple deployments or GitHub Pages</li>
          <li><strong>MemoryRouter:</strong> Use for testing or React Native</li>
        </ul>
      </div>
    </div>
  );
}

// URL Structure Explanation
export function URLStructureDemo() {
  const exampleURL = "https://myapp.com/products/123?category=electronics&sort=price#reviews";

  return (
    <div style={{ padding: '20px' }}>
      <h2>🔍 Understanding URL Structure</h2>

      <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
        <h3>Example URL Breakdown:</h3>
        <div style={{
          fontFamily: 'monospace',
          fontSize: '16px',
          backgroundColor: '#fff',
          padding: '15px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          marginBottom: '20px'
        }}>
          {exampleURL}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <h4>🌐 Protocol:</h4>
            <code style={{ backgroundColor: '#e3f2fd', padding: '4px 8px' }}>https://</code>
            <p>Secure HTTP protocol</p>
          </div>

          <div>
            <h4>🏠 Domain:</h4>
            <code style={{ backgroundColor: '#f3e5f5', padding: '4px 8px' }}>myapp.com</code>
            <p>Your website domain</p>
          </div>

          <div>
            <h4>📍 Path:</h4>
            <code style={{ backgroundColor: '#e8f5e8', padding: '4px 8px' }}>/products/123</code>
            <p>Route path (React Router handles this)</p>
          </div>

          <div>
            <h4>❓ Query Parameters:</h4>
            <code style={{ backgroundColor: '#fff3e0', padding: '4px 8px' }}>?category=electronics&sort=price</code>
            <p>Additional data (React Router can access)</p>
          </div>

          <div>
            <h4>🔗 Hash/Fragment:</h4>
            <code style={{ backgroundColor: '#fce4ec', padding: '4px 8px' }}>#reviews</code>
            <p>Page section (limited React Router support)</p>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '8px' }}>
        <h3>🎯 What React Router Manages:</h3>
        <ul>
          <li>✅ <strong>Path:</strong> <code>/products/123</code> - Maps to components</li>
          <li>✅ <strong>Query Parameters:</strong> <code>?category=electronics</code> - Accessible via hooks</li>
          <li>⚠️ <strong>Hash:</strong> <code>#reviews</code> - Limited support, mainly for HashRouter</li>
        </ul>
      </div>
    </div>
  );
}

// Main demo component
export default function RoutingBasicsDemo() {
  const [activeDemo, setActiveDemo] = useState('comparison');

  return (
    <div style={{ padding: '20px' }}>
      <h1>🌐 React Routing Basics - Interactive Demo</h1>

      {/* Demo Navigation */}
      <nav style={{ marginBottom: '30px' }}>
        <button
          onClick={() => setActiveDemo('comparison')}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: activeDemo === 'comparison' ? '#0984e3' : '#f0f0f0',
            color: activeDemo === 'comparison' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          With vs Without Routing
        </button>
        <button
          onClick={() => setActiveDemo('routers')}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: activeDemo === 'routers' ? '#0984e3' : '#f0f0f0',
            color: activeDemo === 'routers' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Router Types
        </button>
        <button
          onClick={() => setActiveDemo('url')}
          style={{
            margin: '0 10px',
            padding: '10px 20px',
            backgroundColor: activeDemo === 'url' ? '#0984e3' : '#f0f0f0',
            color: activeDemo === 'url' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          URL Structure
        </button>
      </nav>

      {/* Demo Content */}
      {activeDemo === 'comparison' && (
        <div>
          <WithoutRoutingExample />
          <div style={{ margin: '30px 0' }}></div>
          <WithRoutingConcept />
        </div>
      )}

      {activeDemo === 'routers' && <RouterTypesComparison />}
      {activeDemo === 'url' && <URLStructureDemo />}
    </div>
  );
}