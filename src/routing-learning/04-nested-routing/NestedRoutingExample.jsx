// 🏗️ Nested Routing - Complete Working Examples
// This demonstrates complex nested routing patterns with real-world applications

import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Link, NavLink, Outlet, useParams, useOutletContext, Navigate } from 'react-router-dom';

// =============================================================================
// EXAMPLE 1: E-commerce Admin Dashboard
// =============================================================================

// Mock data
const ADMIN_DATA = {
  stats: {
    totalProducts: 1247,
    totalOrders: 892,
    totalUsers: 3456,
    revenue: 125430
  },
  products: [
    { id: 1, name: 'MacBook Pro', price: 1999, category: 'Electronics', stock: 15 },
    { id: 2, name: 'iPhone 15', price: 999, category: 'Electronics', stock: 32 },
    { id: 3, name: 'Nike Air Max', price: 129, category: 'Shoes', stock: 45 },
    { id: 4, name: 'React Handbook', price: 29, category: 'Books', stock: 78 }
  ],
  orders: [
    { id: 1001, customer: 'John Doe', total: 1999, status: 'completed', date: '2024-01-15' },
    { id: 1002, customer: 'Jane Smith', total: 158, status: 'pending', date: '2024-01-16' },
    { id: 1003, customer: 'Bob Johnson', total: 999, status: 'shipped', date: '2024-01-17' }
  ],
  users: [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'customer', joined: '2023-06-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'admin', joined: '2023-03-22' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'customer', joined: '2023-08-10' }
  ]
};

// Main Admin Layout Component
function AdminLayout() {
  const [user] = useState({ name: 'Admin User', role: 'admin' });

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="header-left">
          <Link to="/admin" className="admin-logo">
            🏪 E-commerce Admin
          </Link>
        </div>
        <div className="header-right">
          <span className="user-info">Welcome, {user.name}</span>
          <button className="logout-btn">Logout</button>
        </div>
      </header>

      <div className="admin-body">
        {/* Admin Sidebar Navigation */}
        <nav className="admin-sidebar">
          <ul className="nav-menu">
            <li>
              <NavLink
                to="/admin"
                end
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                📦 Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/orders"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                🛒 Orders
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                👥 Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/settings"
                className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
              >
                ⚙️ Settings
              </NavLink>
            </li>
          </ul>
        </nav>

        {/* Main Content Area - Child routes render here */}
        <main className="admin-content">
          <Outlet context={{ adminData: ADMIN_DATA, user }} />
        </main>
      </div>
    </div>
  );
}

// Admin Dashboard Home
function AdminDashboard() {
  const { adminData } = useOutletContext();
  const { stats } = adminData;

  return (
    <div className="dashboard">
      <h1>📊 Dashboard Overview</h1>

      <div className="stats-grid">
        <div className="stat-card">
          <h3>Total Products</h3>
          <p className="stat-number">{stats.totalProducts.toLocaleString()}</p>
          <Link to="/admin/products" className="stat-link">View Products →</Link>
        </div>

        <div className="stat-card">
          <h3>Total Orders</h3>
          <p className="stat-number">{stats.totalOrders.toLocaleString()}</p>
          <Link to="/admin/orders" className="stat-link">View Orders →</Link>
        </div>

        <div className="stat-card">
          <h3>Total Users</h3>
          <p className="stat-number">{stats.totalUsers.toLocaleString()}</p>
          <Link to="/admin/users" className="stat-link">View Users →</Link>
        </div>

        <div className="stat-card">
          <h3>Revenue</h3>
          <p className="stat-number">${stats.revenue.toLocaleString()}</p>
          <span className="stat-link">This Month</span>
        </div>
      </div>

      <div className="recent-activity">
        <h2>Recent Activity</h2>
        <div className="activity-list">
          <div className="activity-item">
            <span className="activity-icon">📦</span>
            <span>New product "MacBook Pro" added</span>
            <span className="activity-time">2 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">🛒</span>
            <span>Order #1003 marked as shipped</span>
            <span className="activity-time">4 hours ago</span>
          </div>
          <div className="activity-item">
            <span className="activity-icon">👤</span>
            <span>New user registration: Bob Johnson</span>
            <span className="activity-time">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Products Section Layout
function ProductsLayout() {
  return (
    <div className="products-section">
      <div className="section-header">
        <h1>📦 Products Management</h1>
        <nav className="section-nav">
          <NavLink
            to="/admin/products"
            end
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            All Products
          </NavLink>
          <NavLink
            to="/admin/products/categories"
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            Categories
          </NavLink>
          <NavLink
            to="/admin/products/inventory"
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            Inventory
          </NavLink>
          <Link to="/admin/products/new" className="btn-primary">
            + Add Product
          </Link>
        </nav>
      </div>

      <div className="section-content">
        <Outlet />
      </div>
    </div>
  );
}

// Products List
function ProductsList() {
  const { adminData } = useOutletContext();
  const { products } = adminData;

  return (
    <div className="products-list">
      <div className="list-header">
        <h2>All Products ({products.length})</h2>
        <div className="list-actions">
          <input type="search" placeholder="Search products..." className="search-input" />
          <select className="filter-select">
            <option value="">All Categories</option>
            <option value="electronics">Electronics</option>
            <option value="shoes">Shoes</option>
            <option value="books">Books</option>
          </select>
        </div>
      </div>

      <div className="products-table">
        <div className="table-header">
          <span>Product</span>
          <span>Category</span>
          <span>Price</span>
          <span>Stock</span>
          <span>Actions</span>
        </div>

        {products.map(product => (
          <div key={product.id} className="table-row">
            <span className="product-name">{product.name}</span>
            <span className="product-category">{product.category}</span>
            <span className="product-price">${product.price}</span>
            <span className={`product-stock ${product.stock < 20 ? 'low-stock' : ''}`}>
              {product.stock}
            </span>
            <div className="product-actions">
              <Link to={`/admin/products/${product.id}`} className="btn-small">View</Link>
              <Link to={`/admin/products/${product.id}/edit`} className="btn-small">Edit</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Product Detail
function ProductDetail() {
  const { productId } = useParams();
  const { adminData } = useOutletContext();
  const product = adminData.products.find(p => p.id === parseInt(productId));

  if (!product) {
    return (
      <div className="error-page">
        <h2>Product Not Found</h2>
        <p>Product with ID {productId} doesn't exist.</p>
        <Link to="/admin/products" className="btn-primary">← Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="product-detail">
      <div className="detail-header">
        <Link to="/admin/products" className="back-link">← Back to Products</Link>
        <h1>{product.name}</h1>
      </div>

      <div className="detail-content">
        <div className="detail-section">
          <h3>Product Information</h3>
          <div className="detail-grid">
            <div className="detail-item">
              <label>Name:</label>
              <span>{product.name}</span>
            </div>
            <div className="detail-item">
              <label>Category:</label>
              <span>{product.category}</span>
            </div>
            <div className="detail-item">
              <label>Price:</label>
              <span>${product.price}</span>
            </div>
            <div className="detail-item">
              <label>Stock:</label>
              <span className={product.stock < 20 ? 'low-stock' : ''}>{product.stock}</span>
            </div>
          </div>
        </div>

        <div className="detail-actions">
          <Link to={`/admin/products/${product.id}/edit`} className="btn-primary">
            Edit Product
          </Link>
          <button className="btn-danger">Delete Product</button>
        </div>
      </div>
    </div>
  );
}

// Product Categories
function ProductCategories() {
  const categories = [
    { name: 'Electronics', count: 2, description: 'Computers, phones, gadgets' },
    { name: 'Shoes', count: 1, description: 'Athletic and casual footwear' },
    { name: 'Books', count: 1, description: 'Educational and reference books' }
  ];

  return (
    <div className="categories-list">
      <div className="list-header">
        <h2>Product Categories</h2>
        <button className="btn-primary">+ Add Category</button>
      </div>

      <div className="categories-grid">
        {categories.map(category => (
          <div key={category.name} className="category-card">
            <h3>{category.name}</h3>
            <p className="category-description">{category.description}</p>
            <p className="category-count">{category.count} products</p>
            <div className="category-actions">
              <button className="btn-small">Edit</button>
              <button className="btn-small btn-danger">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Orders Section Layout
function OrdersLayout() {
  return (
    <div className="orders-section">
      <div className="section-header">
        <h1>🛒 Orders Management</h1>
        <nav className="section-nav">
          <NavLink
            to="/admin/orders"
            end
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            All Orders
          </NavLink>
          <NavLink
            to="/admin/orders/pending"
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            Pending
          </NavLink>
          <NavLink
            to="/admin/orders/completed"
            className={({ isActive }) => `section-tab ${isActive ? 'active' : ''}`}
          >
            Completed
          </NavLink>
        </nav>
      </div>

      <div className="section-content">
        <Outlet />
      </div>
    </div>
  );
}

// Orders List
function OrdersList() {
  const { adminData } = useOutletContext();
  const { orders } = adminData;

  return (
    <div className="orders-list">
      <div className="list-header">
        <h2>All Orders ({orders.length})</h2>
      </div>

      <div className="orders-table">
        <div className="table-header">
          <span>Order ID</span>
          <span>Customer</span>
          <span>Total</span>
          <span>Status</span>
          <span>Date</span>
          <span>Actions</span>
        </div>

        {orders.map(order => (
          <div key={order.id} className="table-row">
            <span className="order-id">#{order.id}</span>
            <span className="order-customer">{order.customer}</span>
            <span className="order-total">${order.total}</span>
            <span className={`order-status status-${order.status}`}>
              {order.status}
            </span>
            <span className="order-date">{order.date}</span>
            <div className="order-actions">
              <Link to={`/admin/orders/${order.id}`} className="btn-small">View</Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// =============================================================================
// EXAMPLE 2: Learning Management System
// =============================================================================

// Mock course data
const COURSE_DATA = {
  id: 1,
  title: 'Complete React Development',
  instructor: 'John Doe',
  students: 1247,
  progress: 65,
  modules: [
    {
      id: 1,
      title: 'React Fundamentals',
      lessons: [
        { id: 1, title: 'Introduction to React', duration: '15 min', completed: true },
        { id: 2, title: 'Components and JSX', duration: '20 min', completed: true },
        { id: 3, title: 'Props and State', duration: '25 min', completed: false }
      ]
    },
    {
      id: 2,
      title: 'React Hooks',
      lessons: [
        { id: 4, title: 'useState Hook', duration: '18 min', completed: false },
        { id: 5, title: 'useEffect Hook', duration: '22 min', completed: false }
      ]
    }
  ]
};

// Course Layout
function CourseLayout() {
  const { courseId } = useParams();
  const [course] = useState(COURSE_DATA); // In real app, fetch based on courseId

  return (
    <div className="course-layout">
      <div className="course-header">
        <div className="course-info">
          <h1>{course.title}</h1>
          <p>Instructor: {course.instructor} • {course.students} students</p>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{ width: `${course.progress}%` }}
            ></div>
            <span className="progress-text">{course.progress}% Complete</span>
          </div>
        </div>
      </div>

      <div className="course-body">
        <nav className="course-nav">
          <NavLink
            to={`/courses/${courseId}`}
            end
            className={({ isActive }) => `course-tab ${isActive ? 'active' : ''}`}
          >
            📚 Overview
          </NavLink>
          <NavLink
            to={`/courses/${courseId}/lessons`}
            className={({ isActive }) => `course-tab ${isActive ? 'active' : ''}`}
          >
            🎥 Lessons
          </NavLink>
          <NavLink
            to={`/courses/${courseId}/assignments`}
            className={({ isActive }) => `course-tab ${isActive ? 'active' : ''}`}
          >
            📝 Assignments
          </NavLink>
          <NavLink
            to={`/courses/${courseId}/discussions`}
            className={({ isActive }) => `course-tab ${isActive ? 'active' : ''}`}
          >
            💬 Discussions
          </NavLink>
        </nav>

        <main className="course-content">
          <Outlet context={{ course }} />
        </main>
      </div>
    </div>
  );
}

// Course Overview
function CourseOverview() {
  const { course } = useOutletContext();

  return (
    <div className="course-overview">
      <h2>Course Overview</h2>

      <div className="overview-grid">
        <div className="overview-section">
          <h3>What You'll Learn</h3>
          <ul>
            <li>React fundamentals and core concepts</li>
            <li>Modern React hooks and patterns</li>
            <li>State management and data flow</li>
            <li>Building real-world applications</li>
          </ul>
        </div>

        <div className="overview-section">
          <h3>Course Structure</h3>
          <p>{course.modules.length} modules with interactive lessons</p>
          <p>Hands-on projects and assignments</p>
          <p>Community discussions and support</p>
        </div>

        <div className="overview-section">
          <h3>Your Progress</h3>
          <div className="progress-stats">
            <div className="stat">
              <span className="stat-number">{course.progress}%</span>
              <span className="stat-label">Completed</span>
            </div>
            <div className="stat">
              <span className="stat-number">
                {course.modules.reduce((acc, module) =>
                  acc + module.lessons.filter(l => l.completed).length, 0
                )}
              </span>
              <span className="stat-label">Lessons Done</span>
            </div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <Link to={`/courses/${course.id}/lessons`} className="btn-primary">
          Continue Learning
        </Link>
        <Link to={`/courses/${course.id}/assignments`} className="btn-secondary">
          View Assignments
        </Link>
      </div>
    </div>
  );
}

// Lessons Layout
function LessonsLayout() {
  return (
    <div className="lessons-layout">
      <Outlet />
    </div>
  );
}

// Lessons List
function LessonsList() {
  const { course } = useOutletContext();

  return (
    <div className="lessons-list">
      <h2>Course Lessons</h2>

      {course.modules.map(module => (
        <div key={module.id} className="module-section">
          <h3 className="module-title">{module.title}</h3>

          <div className="lessons-grid">
            {module.lessons.map(lesson => (
              <div key={lesson.id} className={`lesson-card ${lesson.completed ? 'completed' : ''}`}>
                <div className="lesson-info">
                  <h4>{lesson.title}</h4>
                  <p className="lesson-duration">{lesson.duration}</p>
                </div>

                <div className="lesson-actions">
                  {lesson.completed && <span className="completed-badge">✓</span>}
                  <Link
                    to={`/courses/${course.id}/lessons/${lesson.id}`}
                    className="btn-small"
                  >
                    {lesson.completed ? 'Review' : 'Start'}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// Individual Lesson
function LessonDetail() {
  const { courseId, lessonId } = useParams();
  const { course } = useOutletContext();

  // Find the lesson
  const lesson = course.modules
    .flatMap(module => module.lessons)
    .find(l => l.id === parseInt(lessonId));

  if (!lesson) {
    return (
      <div className="error-page">
        <h2>Lesson Not Found</h2>
        <Link to={`/courses/${courseId}/lessons`} className="btn-primary">
          ← Back to Lessons
        </Link>
      </div>
    );
  }

  return (
    <div className="lesson-detail">
      <div className="lesson-header">
        <Link to={`/courses/${courseId}/lessons`} className="back-link">
          ← Back to Lessons
        </Link>
        <h1>{lesson.title}</h1>
        <p className="lesson-meta">Duration: {lesson.duration}</p>
      </div>

      <div className="lesson-content">
        <div className="video-placeholder">
          <div className="video-mock">
            🎥 Video Content: {lesson.title}
            <p>This would contain the actual lesson video</p>
          </div>
        </div>

        <div className="lesson-text">
          <h3>Lesson Overview</h3>
          <p>This lesson covers the fundamentals of {lesson.title.toLowerCase()}.</p>

          <h3>Key Points</h3>
          <ul>
            <li>Understanding the core concepts</li>
            <li>Practical examples and use cases</li>
            <li>Best practices and common patterns</li>
          </ul>
        </div>

        <div className="lesson-actions">
          <button className="btn-primary">
            {lesson.completed ? 'Mark as Incomplete' : 'Mark as Complete'}
          </button>
          <Link to={`/courses/${courseId}/lessons/${lesson.id}/quiz`} className="btn-secondary">
            Take Quiz
          </Link>
        </div>
      </div>
    </div>
  );
}

// =============================================================================
// MAIN APP COMPONENT
// =============================================================================

function NestedRoutingApp() {
  const [currentExample, setCurrentExample] = useState('admin');

  if (currentExample === 'admin') {
    return (
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<ExampleSelector onSelect={setCurrentExample} />} />

            {/* Admin Dashboard with Nested Routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />

              {/* Products Section */}
              <Route path="products" element={<ProductsLayout />}>
                <Route index element={<ProductsList />} />
                <Route path="categories" element={<ProductCategories />} />
                <Route path="inventory" element={<div>Inventory Management</div>} />
                <Route path="new" element={<div>Add New Product</div>} />
                <Route path=":productId" element={<ProductDetail />} />
                <Route path=":productId/edit" element={<div>Edit Product</div>} />
              </Route>

              {/* Orders Section */}
              <Route path="orders" element={<OrdersLayout />}>
                <Route index element={<OrdersList />} />
                <Route path="pending" element={<div>Pending Orders</div>} />
                <Route path="completed" element={<div>Completed Orders</div>} />
                <Route path=":orderId" element={<div>Order Detail</div>} />
              </Route>

              {/* Users Section */}
              <Route path="users" element={<div>Users Management</div>} />

              {/* Settings Section */}
              <Route path="settings" element={<div>Settings</div>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  if (currentExample === 'course') {
    return (
      <BrowserRouter>
        <div className="app">
          <Routes>
            <Route path="/" element={<ExampleSelector onSelect={setCurrentExample} />} />

            {/* Course with Nested Routes */}
            <Route path="/courses/:courseId" element={<CourseLayout />}>
              <Route index element={<CourseOverview />} />

              {/* Lessons Section */}
              <Route path="lessons" element={<LessonsLayout />}>
                <Route index element={<LessonsList />} />
                <Route path=":lessonId" element={<LessonDetail />} />
                <Route path=":lessonId/quiz" element={<div>Lesson Quiz</div>} />
              </Route>

              {/* Assignments Section */}
              <Route path="assignments" element={<div>Assignments List</div>} />

              {/* Discussions Section */}
              <Route path="discussions" element={<div>Course Discussions</div>} />
            </Route>
          </Routes>
        </div>
      </BrowserRouter>
    );
  }

  return null;
}

// Example Selector Component
function ExampleSelector({ onSelect }) {
  return (
    <div className="example-selector">
      <h1>🏗️ Nested Routing Examples</h1>
      <p>Choose an example to explore nested routing patterns:</p>

      <div className="examples-grid">
        <div className="example-card">
          <h3>🏪 E-commerce Admin</h3>
          <p>Complex admin dashboard with multiple nested sections for products, orders, and users management.</p>
          <div className="example-features">
            <span className="feature-tag">Multi-level nesting</span>
            <span className="feature-tag">Shared layouts</span>
            <span className="feature-tag">Data context</span>
          </div>
          <button
            onClick={() => onSelect('admin')}
            className="btn-primary"
          >
            Explore Admin Dashboard
          </button>
          <Link to="/admin" className="example-link">Go to /admin →</Link>
        </div>

        <div className="example-card">
          <h3>📚 Learning Platform</h3>
          <p>Course management system with lessons, assignments, and discussions organized in nested routes.</p>
          <div className="example-features">
            <span className="feature-tag">Course structure</span>
            <span className="feature-tag">Progress tracking</span>
            <span className="feature-tag">Content organization</span>
          </div>
          <button
            onClick={() => onSelect('course')}
            className="btn-primary"
          >
            Explore Course Platform
          </button>
          <Link to="/courses/1" className="example-link">Go to /courses/1 →</Link>
        </div>
      </div>

      <div className="routing-structure">
        <h2>🗂️ Routing Structure Examples</h2>

        <div className="structure-examples">
          <div className="structure-example">
            <h3>Admin Dashboard Structure:</h3>
            <pre className="route-tree">
              {`/admin                          → AdminLayout + Dashboard
├── /admin/products             → AdminLayout + ProductsLayout + ProductsList
│   ├── /admin/products/new     → AdminLayout + ProductsLayout + NewProduct
│   ├── /admin/products/123     → AdminLayout + ProductsLayout + ProductDetail
│   └── /admin/products/categories → AdminLayout + ProductsLayout + Categories
├── /admin/orders               → AdminLayout + OrdersLayout + OrdersList
│   ├── /admin/orders/pending   → AdminLayout + OrdersLayout + PendingOrders
│   └── /admin/orders/1001      → AdminLayout + OrdersLayout + OrderDetail
└── /admin/users                → AdminLayout + UsersManagement`}
            </pre>
          </div>

          <div className="structure-example">
            <h3>Course Platform Structure:</h3>
            <pre className="route-tree">
              {`/courses/1                     → CourseLayout + CourseOverview
├── /courses/1/lessons          → CourseLayout + LessonsLayout + LessonsList
│   ├── /courses/1/lessons/1    → CourseLayout + LessonsLayout + LessonDetail
│   └── /courses/1/lessons/1/quiz → CourseLayout + LessonsLayout + LessonQuiz
├── /courses/1/assignments      → CourseLayout + AssignmentsList
└── /courses/1/discussions      → CourseLayout + DiscussionsList`}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NestedRoutingApp;

// CSS Styles
const styles = `
.app {
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background-color: #f5f5f5;
}

/* Admin Layout Styles */
.admin-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.admin-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.admin-logo {
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  font-weight: bold;
}

.user-info {
  margin-right: 1rem;
}

.logout-btn {
  background: rgba(255,255,255,0.2);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  cursor: pointer;
}

.admin-body {
  flex: 1;
  display: flex;
}

.admin-sidebar {
  width: 250px;
  background: white;
  box-shadow: 2px 0 10px rgba(0,0,0,0.1);
  padding: 2rem 0;
}

.nav-menu {
  list-style: none;
  padding: 0;
  margin: 0;
}

.nav-item {
  display: block;
  padding: 1rem 2rem;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.nav-item:hover {
  background-color: #f8f9fa;
  color: #333;
}

.nav-item.active {
  background-color: #e3f2fd;
  color: #1976d2;
  border-left-color: #1976d2;
}

.admin-content {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
}

/* Dashboard Styles */
.dashboard h1 {
  margin-bottom: 2rem;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  text-align: center;
}

.stat-card h3 {
  margin: 0 0 1rem 0;
  color: #666;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}

.stat-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 0.9rem;
  margin-top: 1rem;
  display: inline-block;
}

.recent-activity {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.activity-list {
  margin-top: 1rem;
}

.activity-item {
  display: flex;
  align-items: center;
  padding: 1rem 0;
  border-bottom: 1px solid #eee;
}

.activity-icon {
  margin-right: 1rem;
  font-size: 1.2rem;
}

.activity-time {
  margin-left: auto;
  color: #666;
  font-size: 0.9rem;
}

/* Section Styles */
.section-header {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  margin-bottom: 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h1 {
  margin: 0;
  color: #333;
}

.section-nav {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.section-tab {
  padding: 0.75rem 1.5rem;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  transition: all 0.3s;
}

.section-tab:hover {
  background-color: #f8f9fa;
}

.section-tab.active {
  background-color: #1976d2;
  color: white;
}

.section-content {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  overflow: hidden;
}

/* Table Styles */
.products-table,
.orders-table {
  width: 100%;
}

.table-header,
.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
  padding: 1rem 2rem;
  align-items: center;
}

.table-header {
  background-color: #f8f9fa;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 0.5px;
}

.table-row {
  border-bottom: 1px solid #eee;
}

.table-row:hover {
  background-color: #f8f9fa;
}

.low-stock {
  color: #e74c3c;
  font-weight: bold;
}

.product-actions,
.order-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  border: 1px solid #ddd;
  background: white;
  color: #666;
  text-decoration: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-small:hover {
  background-color: #f8f9fa;
  border-color: #1976d2;
  color: #1976d2;
}

.btn-danger {
  border-color: #e74c3c;
  color: #e74c3c;
}

.btn-danger:hover {
  background-color: #e74c3c;
  color: white;
}

/* Order Status Styles */
.order-status {
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: bold;
  text-transform: uppercase;
}

.status-pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-completed {
  background-color: #d4edda;
  color: #155724;
}

.status-shipped {
  background-color: #cce5ff;
  color: #004085;
}

/* Course Layout Styles */
.course-layout {
  min-height: 100vh;
  background: white;
}

.course-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
}

.course-info h1 {
  margin: 0 0 0.5rem 0;
  font-size: 2rem;
}

.course-info p {
  margin: 0 0 1rem 0;
  opacity: 0.9;
}

.progress-bar {
  background: rgba(255,255,255,0.2);
  border-radius: 10px;
  height: 20px;
  position: relative;
  overflow: hidden;
}

.progress-fill {
  background: white;
  height: 100%;
  border-radius: 10px;
  transition: width 0.3s ease;
}

.progress-text {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 0.8rem;
  font-weight: bold;
  color: #333;
}

.course-body {
  display: flex;
  min-height: calc(100vh - 200px);
}

.course-nav {
  width: 250px;
  background: #f8f9fa;
  padding: 2rem 0;
  display: flex;
  flex-direction: column;
}

.course-tab {
  padding: 1rem 2rem;
  color: #666;
  text-decoration: none;
  transition: all 0.3s;
  border-left: 3px solid transparent;
}

.course-tab:hover {
  background-color: white;
  color: #333;
}

.course-tab.active {
  background-color: white;
  color: #1976d2;
  border-left-color: #1976d2;
}

.course-content {
  flex: 1;
  padding: 2rem;
}

/* Course Overview Styles */
.overview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin: 2rem 0;
}

.overview-section {
  background: #f8f9fa;
  padding: 2rem;
  border-radius: 8px;
}

.overview-section h3 {
  margin-top: 0;
  color: #333;
}

.progress-stats {
  display: flex;
  gap: 2rem;
}

.stat {
  text-align: center;
}

.stat-number {
  display: block;
  font-size: 2rem;
  font-weight: bold;
  color: #1976d2;
}

.stat-label {
  font-size: 0.9rem;
  color: #666;
}

/* Lessons Styles */
.module-section {
  margin-bottom: 3rem;
}

.module-title {
  color: #333;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #e3f2fd;
}

.lessons-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1rem;
}

.lesson-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.3s;
}

.lesson-card:hover {
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  transform: translateY(-2px);
}

.lesson-card.completed {
  border-color: #4caf50;
  background-color: #f1f8e9;
}

.lesson-info h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.lesson-duration {
  margin: 0;
  color: #666;
  font-size: 0.9rem;
}

.lesson-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.completed-badge {
  color: #4caf50;
  font-size: 1.2rem;
}

/* Lesson Detail Styles */
.lesson-header {
  margin-bottom: 2rem;
}

.back-link {
  color: #1976d2;
  text-decoration: none;
  margin-bottom: 1rem;
  display: inline-block;
}

.lesson-header h1 {
  margin: 0.5rem 0;
  color: #333;
}

.lesson-meta {
  color: #666;
  margin: 0;
}

.video-placeholder {
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 2rem;
}

.video-mock {
  padding: 4rem 2rem;
  text-align: center;
  color: #666;
  font-size: 1.2rem;
}

.lesson-text {
  margin-bottom: 2rem;
}

.lesson-text h3 {
  color: #333;
  margin-top: 2rem;
}

.lesson-actions {
  display: flex;
  gap: 1rem;
}

/* Button Styles */
.btn-primary,
.btn-secondary {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 4px;
  font-weight: 500;
  text-decoration: none;
  cursor: pointer;
  transition: all 0.3s;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background-color: #1976d2;
  color: white;
}

.btn-primary:hover {
  background-color: #1565c0;
}

.btn-secondary {
  background-color: #f8f9fa;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background-color: #e9ecef;
  border-color: #adb5bd;
}

/* Example Selector Styles */
.example-selector {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.example-selector h1 {
  text-align: center;
  margin-bottom: 1rem;
  color: #333;
}

.example-selector p {
  text-align: center;
  color: #666;
  margin-bottom: 3rem;
}

.examples-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 2rem;
  margin-bottom: 3rem;
}

.example-card {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  text-align: center;
}

.example-card h3 {
  margin-top: 0;
  color: #333;
}

.example-features {
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.feature-tag {
  background-color: #e3f2fd;
  color: #1976d2;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
}

.example-link {
  display: block;
  margin-top: 1rem;
  color: #1976d2;
  text-decoration: none;
  font-size: 0.9rem;
}

.routing-structure {
  margin-top: 4rem;
}

.structure-examples {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(500px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.structure-example {
  background: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
}

.route-tree {
  background: #f8f9fa;
  padding: 1rem;
  border-radius: 4px;
  font-size: 0.9rem;
  line-height: 1.6;
  overflow-x: auto;
}

/* Responsive Design */
@media (max-width: 768px) {
  .admin-body,
  .course-body {
    flex-direction: column;
  }
  
  .admin-sidebar,
  .course-nav {
    width: 100%;
  }
  
  .examples-grid {
    grid-template-columns: 1fr;
  }
  
  .structure-examples {
    grid-template-columns: 1fr;
  }
}
`;

// Add styles to document
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = styles;
  document.head.appendChild(styleSheet);
}