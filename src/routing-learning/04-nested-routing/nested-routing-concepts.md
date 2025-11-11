# 🏗️ Nested Routing - Building Complex Route Hierarchies

## 🤔 What is Nested Routing?

Nested routing allows you to create complex route hierarchies where routes can have child routes. This enables you to build layouts with shared components and create more organized, maintainable routing structures.

## 🎯 Why Use Nested Routing?

### **Without Nested Routing (Repetitive):**
```jsx
// ❌ Repetitive - every route needs the same layout
<Routes>
  <Route path="/dashboard" element={
    <DashboardLayout>
      <DashboardHome />
    </DashboardLayout>
  } />
  <Route path="/dashboard/profile" element={
    <DashboardLayout>
      <Profile />
    </DashboardLayout>
  } />
  <Route path="/dashboard/settings" element={
    <DashboardLayout>
      <Settings />
    </DashboardLayout>
  } />
</Routes>
```

### **With Nested Routing (Clean):**
```jsx
// ✅ Clean - shared layout, organized hierarchy
<Routes>
  <Route path="/dashboard" element={<DashboardLayout />}>
    <Route index element={<DashboardHome />} />
    <Route path="profile" element={<Profile />} />
    <Route path="settings" element={<Settings />} />
  </Route>
</Routes>
```

## 🧩 Core Concepts

### **1. Parent Routes**
Routes that contain child routes and typically render a layout.

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  {/* Child routes go here */}
</Route>
```

### **2. Child Routes**
Routes nested inside parent routes.

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="profile" element={<Profile />} />      {/* /dashboard/profile */}
  <Route path="settings" element={<Settings />} />    {/* /dashboard/settings */}
</Route>
```

### **3. Index Routes**
Default child route that renders when the parent path is matched exactly.

```jsx
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />         {/* /dashboard */}
  <Route path="profile" element={<Profile />} />      {/* /dashboard/profile */}
</Route>
```

### **4. Outlet Component**
Placeholder where child route components are rendered.

```jsx
import { Outlet } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard">
      <nav>Dashboard Navigation</nav>
      <main>
        <Outlet /> {/* Child routes render here */}
      </main>
    </div>
  );
}
```

## 🏗️ Building Nested Route Structures

### **Basic Nested Routes:**
```jsx
function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Root level routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        
        {/* Nested dashboard routes */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="settings" element={<Settings />} />
          <Route path="analytics" element={<Analytics />} />
        </Route>
        
        {/* Nested admin routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminHome />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="reports" element={<Reports />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### **Layout Components with Outlet:**
```jsx
import { Outlet, NavLink } from 'react-router-dom';

function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <header className="dashboard-header">
        <h1>Dashboard</h1>
      </header>
      
      <nav className="dashboard-nav">
        <NavLink to="/dashboard" end>Home</NavLink>
        <NavLink to="/dashboard/profile">Profile</NavLink>
        <NavLink to="/dashboard/settings">Settings</NavLink>
        <NavLink to="/dashboard/analytics">Analytics</NavLink>
      </nav>
      
      <main className="dashboard-content">
        <Outlet /> {/* Child components render here */}
      </main>
    </div>
  );
}
```

## 🎨 Advanced Nested Routing Patterns

### **1. Multi-Level Nesting:**
```jsx
<Routes>
  <Route path="/admin" element={<AdminLayout />}>
    <Route index element={<AdminHome />} />
    
    {/* Users section with sub-routes */}
    <Route path="users" element={<UsersLayout />}>
      <Route index element={<UsersList />} />
      <Route path=":userId" element={<UserDetail />} />
      <Route path=":userId/edit" element={<UserEdit />} />
      <Route path="new" element={<UserCreate />} />
    </Route>
    
    {/* Products section with sub-routes */}
    <Route path="products" element={<ProductsLayout />}>
      <Route index element={<ProductsList />} />
      <Route path=":productId" element={<ProductDetail />} />
      <Route path="categories" element={<CategoriesList />} />
    </Route>
  </Route>
</Routes>
```

**URL Structure:**
```
/admin                    → AdminLayout + AdminHome
/admin/users              → AdminLayout + UsersLayout + UsersList
/admin/users/123          → AdminLayout + UsersLayout + UserDetail
/admin/users/123/edit     → AdminLayout + UsersLayout + UserEdit
/admin/products           → AdminLayout + ProductsLayout + ProductsList
```

### **2. Conditional Nested Routes:**
```jsx
function AdminLayout() {
  const { user } = useAuth();
  
  return (
    <div className="admin-layout">
      <AdminNav />
      
      <main>
        {user.role === 'admin' ? (
          <Outlet />
        ) : (
          <div>Access Denied</div>
        )}
      </main>
    </div>
  );
}
```

### **3. Nested Routes with Parameters:**
```jsx
<Routes>
  <Route path="/blog" element={<BlogLayout />}>
    <Route index element={<BlogHome />} />
    <Route path=":category" element={<CategoryLayout />}>
      <Route index element={<CategoryPosts />} />
      <Route path=":postId" element={<PostDetail />} />
      <Route path=":postId/edit" element={<PostEdit />} />
    </Route>
  </Route>
</Routes>
```

**URL Examples:**
```
/blog                     → BlogLayout + BlogHome
/blog/tech                → BlogLayout + CategoryLayout + CategoryPosts
/blog/tech/react-hooks    → BlogLayout + CategoryLayout + PostDetail
/blog/tech/react-hooks/edit → BlogLayout + CategoryLayout + PostEdit
```

## 🔗 Navigation in Nested Routes

### **Relative Navigation:**
```jsx
function DashboardNav() {
  return (
    <nav>
      {/* Relative to current route */}
      <NavLink to="." end>Dashboard Home</NavLink>      {/* /dashboard */}
      <NavLink to="profile">Profile</NavLink>           {/* /dashboard/profile */}
      <NavLink to="settings">Settings</NavLink>         {/* /dashboard/settings */}
      
      {/* Absolute paths */}
      <NavLink to="/dashboard/analytics">Analytics</NavLink>
      
      {/* Going up levels */}
      <NavLink to="..">Back to Main</NavLink>           {/* Goes up one level */}
    </nav>
  );
}
```

### **Programmatic Navigation:**
```jsx
import { useNavigate } from 'react-router-dom';

function DashboardComponent() {
  const navigate = useNavigate();
  
  const goToProfile = () => {
    navigate('profile');        // Relative: /dashboard/profile
  };
  
  const goToSettings = () => {
    navigate('/dashboard/settings'); // Absolute
  };
  
  const goBack = () => {
    navigate(-1);               // Browser back
  };
  
  const goUp = () => {
    navigate('..');             // Up one level
  };
  
  return (
    <div>
      <button onClick={goToProfile}>View Profile</button>
      <button onClick={goToSettings}>Settings</button>
      <button onClick={goBack}>Go Back</button>
      <button onClick={goUp}>Go Up</button>
    </div>
  );
}
```

## 🎯 Real-World Examples

### **1. E-commerce Admin Panel:**
```jsx
function EcommerceApp() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Admin panel with nested routes */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          
          {/* Products management */}
          <Route path="products" element={<ProductsLayout />}>
            <Route index element={<ProductsList />} />
            <Route path="new" element={<ProductCreate />} />
            <Route path=":productId" element={<ProductDetail />} />
            <Route path=":productId/edit" element={<ProductEdit />} />
            <Route path="categories" element={<CategoriesManagement />} />
          </Route>
          
          {/* Orders management */}
          <Route path="orders" element={<OrdersLayout />}>
            <Route index element={<OrdersList />} />
            <Route path=":orderId" element={<OrderDetail />} />
            <Route path="pending" element={<PendingOrders />} />
            <Route path="completed" element={<CompletedOrders />} />
          </Route>
          
          {/* Users management */}
          <Route path="users" element={<UsersLayout />}>
            <Route index element={<UsersList />} />
            <Route path=":userId" element={<UserProfile />} />
            <Route path="roles" element={<RoleManagement />} />
          </Route>
          
          {/* Settings */}
          <Route path="settings" element={<SettingsLayout />}>
            <Route index element={<GeneralSettings />} />
            <Route path="payment" element={<PaymentSettings />} />
            <Route path="shipping" element={<ShippingSettings />} />
            <Route path="notifications" element={<NotificationSettings />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
```

### **2. Learning Management System:**
```jsx
<Routes>
  <Route path="/courses" element={<CoursesLayout />}>
    <Route index element={<CoursesList />} />
    
    <Route path=":courseId" element={<CourseLayout />}>
      <Route index element={<CourseOverview />} />
      
      <Route path="lessons" element={<LessonsLayout />}>
        <Route index element={<LessonsList />} />
        <Route path=":lessonId" element={<LessonDetail />} />
        <Route path=":lessonId/quiz" element={<LessonQuiz />} />
      </Route>
      
      <Route path="assignments" element={<AssignmentsLayout />}>
        <Route index element={<AssignmentsList />} />
        <Route path=":assignmentId" element={<AssignmentDetail />} />
        <Route path=":assignmentId/submit" element={<AssignmentSubmit />} />
      </Route>
      
      <Route path="discussions" element={<DiscussionsLayout />}>
        <Route index element={<DiscussionsList />} />
        <Route path=":topicId" element={<DiscussionTopic />} />
      </Route>
    </Route>
  </Route>
</Routes>
```

## 🔄 Outlet Context

Pass data from parent to child routes using Outlet context.

### **Parent Component:**
```jsx
import { Outlet } from 'react-router-dom';

function CourseLayout() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  
  useEffect(() => {
    fetchCourse(courseId).then(setCourse);
  }, [courseId]);
  
  if (!course) return <div>Loading...</div>;
  
  return (
    <div className="course-layout">
      <CourseHeader course={course} />
      <CourseNav courseId={courseId} />
      
      <main>
        {/* Pass course data to child routes */}
        <Outlet context={{ course }} />
      </main>
    </div>
  );
}
```

### **Child Component:**
```jsx
import { useOutletContext } from 'react-router-dom';

function LessonsList() {
  const { course } = useOutletContext();
  
  return (
    <div>
      <h2>Lessons for {course.title}</h2>
      {course.lessons.map(lesson => (
        <div key={lesson.id}>{lesson.title}</div>
      ))}
    </div>
  );
}
```

## 🎨 Layout Patterns

### **1. Sidebar Layout:**
```jsx
function DashboardLayout() {
  return (
    <div className="dashboard-layout">
      <aside className="sidebar">
        <nav>
          <NavLink to="/dashboard" end>Dashboard</NavLink>
          <NavLink to="/dashboard/profile">Profile</NavLink>
          <NavLink to="/dashboard/settings">Settings</NavLink>
        </nav>
      </aside>
      
      <main className="main-content">
        <Outlet />
      </main>
    </div>
  );
}
```

### **2. Tab Layout:**
```jsx
function ProfileLayout() {
  return (
    <div className="profile-layout">
      <div className="profile-header">
        <h1>User Profile</h1>
      </div>
      
      <nav className="tab-nav">
        <NavLink to="/profile" end className="tab">Personal Info</NavLink>
        <NavLink to="/profile/security" className="tab">Security</NavLink>
        <NavLink to="/profile/preferences" className="tab">Preferences</NavLink>
        <NavLink to="/profile/billing" className="tab">Billing</NavLink>
      </nav>
      
      <div className="tab-content">
        <Outlet />
      </div>
    </div>
  );
}
```

### **3. Master-Detail Layout:**
```jsx
function EmailLayout() {
  return (
    <div className="email-layout">
      <aside className="email-list">
        <EmailList />
      </aside>
      
      <main className="email-detail">
        <Outlet />
      </main>
    </div>
  );
}

// Routes
<Route path="/email" element={<EmailLayout />}>
  <Route index element={<EmailPlaceholder />} />
  <Route path=":emailId" element={<EmailDetail />} />
</Route>
```

## ⚠️ Common Patterns & Best Practices

### **1. Always Use Index Routes:**
```jsx
// ✅ Good - has index route
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route index element={<DashboardHome />} />
  <Route path="profile" element={<Profile />} />
</Route>

// ❌ Avoid - no index route, /dashboard shows empty content
<Route path="/dashboard" element={<DashboardLayout />}>
  <Route path="profile" element={<Profile />} />
</Route>
```

### **2. Consistent Route Structure:**
```jsx
// ✅ Good - consistent structure
<Route path="/admin" element={<AdminLayout />}>
  <Route index element={<AdminHome />} />
  <Route path="users" element={<UsersLayout />}>
    <Route index element={<UsersList />} />
    <Route path=":userId" element={<UserDetail />} />
  </Route>
  <Route path="products" element={<ProductsLayout />}>
    <Route index element={<ProductsList />} />
    <Route path=":productId" element={<ProductDetail />} />
  </Route>
</Route>
```

### **3. Handle Loading States in Layouts:**
```jsx
function CourseLayout() {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetchCourse(courseId)
      .then(setCourse)
      .finally(() => setLoading(false));
  }, [courseId]);
  
  if (loading) {
    return <div className="loading">Loading course...</div>;
  }
  
  if (!course) {
    return <div className="error">Course not found</div>;
  }
  
  return (
    <div className="course-layout">
      <CourseHeader course={course} />
      <Outlet context={{ course }} />
    </div>
  );
}
```

## 🚨 Common Mistakes

### **❌ Mistake 1: Forgetting Outlet**
```jsx
// Wrong - child routes won't render
function Layout() {
  return (
    <div>
      <nav>Navigation</nav>
      <main>
        {/* Missing <Outlet /> */}
      </main>
    </div>
  );
}
```

### **❌ Mistake 2: Incorrect Path Structure**
```jsx
// Wrong - child paths should be relative
<Route path="/dashboard" element={<Layout />}>
  <Route path="/dashboard/profile" element={<Profile />} /> {/* ❌ Absolute path */}
</Route>

// Correct - relative paths
<Route path="/dashboard" element={<Layout />}>
  <Route path="profile" element={<Profile />} /> {/* ✅ Relative path */}
</Route>
```

### **❌ Mistake 3: Not Using Index Routes**
```jsx
// Wrong - /dashboard shows empty content
<Route path="/dashboard" element={<Layout />}>
  <Route path="profile" element={<Profile />} />
</Route>

// Correct - /dashboard shows DashboardHome
<Route path="/dashboard" element={<Layout />}>
  <Route index element={<DashboardHome />} />
  <Route path="profile" element={<Profile />} />
</Route>
```

## 🎉 What You've Mastered

After completing nested routing, you can:

- ✅ Build complex route hierarchies with shared layouts
- ✅ Use Outlet to render child components
- ✅ Create index routes for default content
- ✅ Navigate between nested routes effectively
- ✅ Pass data between parent and child routes
- ✅ Build scalable, maintainable routing structures

## 🚀 What's Next?

Now that you understand nested routing, you're ready for:

1. **Navigation Hooks** → `05-navigation-hooks` - Programmatic navigation
2. **Route Guards** → `06-route-guards` - Protected routes
3. **Advanced Routing** → `07-advanced-routing` - Complex patterns

---

**🎉 You can now build complex, hierarchical routing systems!**

**Next:** `05-navigation-hooks/navigation-hooks-concepts.md`