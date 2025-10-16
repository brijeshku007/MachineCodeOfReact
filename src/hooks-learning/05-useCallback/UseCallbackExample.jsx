import React, { useState, useCallback, useMemo, memo } from 'react';

/**
 * useCallback Hook - Complete Learning Example
 * 
 * This demonstrates useCallback for performance optimization:
 * 1. Problem: Unnecessary re-renders without useCallback
 * 2. Solution: Memoized callbacks with useCallback
 * 3. Performance comparison demos
 * 4. Real-world use cases
 */

// Child component that shows when it re-renders
const ExpensiveChild = memo(({ onClick, label, data }) => {
  console.log(`🔄 ${label} child re-rendered`);

  // Simulate expensive rendering
  const expensiveValue = useMemo(() => {
    console.log(`💰 Expensive calculation for ${label}`);
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
      result += Math.random();
    }
    return result;
  }, [label]);

  return (
    <div style={{
      padding: '15px',
      margin: '10px 0',
      border: '2px solid #ddd',
      borderRadius: '8px',
      backgroundColor: '#f8f9fa'
    }}>
      <h4>{label}</h4>
      <p>Expensive calculation result: {expensiveValue.toFixed(2)}</p>
      <p>Data: {data}</p>
      <button
        onClick={onClick}
        style={{
          padding: '8px 16px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer'
        }}
      >
        Click me
      </button>
    </div>
  );
});

// Demo 1: Problem without useCallback
const WithoutUseCallback = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  // This creates a NEW function on every render
  const handleClick = () => {
    console.log('Button clicked without useCallback');
  };

  // Track renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ padding: '20px', border: '2px solid #dc3545', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>❌ Problem: Without useCallback</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Parent renders: <strong>{renderCount}</strong></p>
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

      <ExpensiveChild
        onClick={handleClick}
        label="Without useCallback"
        data={`Count: ${count}`}
      />

      <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Problem:</strong> Every time you type in the input, the ExpensiveChild re-renders
        because handleClick is a new function reference each time!
      </div>
    </div>
  );
};

// Demo 2: Solution with useCallback
const WithUseCallback = () => {
  const [count, setCount] = useState(0);
  const [name, setName] = useState('');
  const [renderCount, setRenderCount] = useState(0);

  // This function is memoized - same reference unless dependencies change
  const handleClick = useCallback(() => {
    console.log('Button clicked with useCallback');
  }, []); // Empty dependencies = never changes

  // This function depends on count - changes when count changes
  const handleClickWithCount = useCallback(() => {
    console.log('Current count:', count);
  }, [count]); // Changes when count changes

  // Track renders
  React.useEffect(() => {
    setRenderCount(prev => prev + 1);
  });

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>✅ Solution: With useCallback</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Parent renders: <strong>{renderCount}</strong></p>
        <p>Count: <strong>{count}</strong></p>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Type here - child won't re-render!"
          style={{ padding: '8px', marginRight: '10px', width: '250px' }}
        />
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Increment Count
        </button>
      </div>

      <ExpensiveChild
        onClick={handleClick}
        label="With useCallback (stable)"
        data={`Count: ${count}`}
      />

      <ExpensiveChild
        onClick={handleClickWithCount}
        label="With useCallback (depends on count)"
        data={`Count: ${count}`}
      />

      <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '14px' }}>
        <strong>Solution:</strong> The first child only re-renders when count changes (because data prop changes).
        The second child re-renders when count changes (because handleClickWithCount depends on count).
        Neither re-renders when you type in the input!
      </div>
    </div>
  );
};

// Demo 3: Performance comparison
const PerformanceComparison = () => {
  const [count, setCount] = useState(0);
  const [triggerRender, setTriggerRender] = useState(0);

  // Without useCallback - new function every time
  const unstableCallback = () => {
    console.log('Unstable callback');
  };

  // With useCallback - stable function
  const stableCallback = useCallback(() => {
    console.log('Stable callback');
  }, []);

  // Function that depends on count
  const countDependentCallback = useCallback(() => {
    console.log('Count is:', count);
  }, [count]);

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📊 Performance Comparison</h2>

      <div style={{ marginBottom: '15px' }}>
        <p>Count: <strong>{count}</strong></p>
        <button
          onClick={() => setCount(count + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Change Count (affects dependent callback)
        </button>
        <button
          onClick={() => setTriggerRender(triggerRender + 1)}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Force Re-render (doesn't affect stable callback)
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
        <ExpensiveChild
          onClick={unstableCallback}
          label="Unstable Callback"
          data="Re-renders every time"
        />

        <ExpensiveChild
          onClick={stableCallback}
          label="Stable Callback"
          data="Only re-renders when needed"
        />

        <ExpensiveChild
          onClick={countDependentCallback}
          label="Count-Dependent Callback"
          data={`Depends on count: ${count}`}
        />
      </div>

      <div style={{ padding: '10px', backgroundColor: '#cce5ff', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Watch the console:</strong> See which children re-render when you click the buttons!
      </div>
    </div>
  );
};

// Demo 4: Real-world example - Todo list
const TodoItem = memo(({ todo, onToggle, onDelete }) => {
  console.log(`📋 TodoItem ${todo.id} rendered`);

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      padding: '10px',
      margin: '5px 0',
      backgroundColor: todo.completed ? '#d4edda' : '#fff',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
      />
      <span style={{
        marginLeft: '10px',
        textDecoration: todo.completed ? 'line-through' : 'none',
        flex: 1
      }}>
        {todo.text}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
      >
        Delete
      </button>
    </div>
  );
});

const TodoListExample = () => {
  const [todos, setTodos] = useState([
    { id: 1, text: 'Learn useCallback', completed: false },
    { id: 2, text: 'Build a todo app', completed: false },
    { id: 3, text: 'Optimize performance', completed: true }
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [filter, setFilter] = useState('all');

  // Memoized callbacks - won't cause unnecessary re-renders
  const handleToggle = useCallback((id) => {
    setTodos(prev => prev.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  }, []); // No dependencies needed because we use functional update

  const handleDelete = useCallback((id) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  }, []);

  const handleAdd = useCallback(() => {
    if (newTodo.trim()) {
      setTodos(prev => [...prev, {
        id: Date.now(),
        text: newTodo,
        completed: false
      }]);
      setNewTodo('');
    }
  }, [newTodo]); // Depends on newTodo

  const filteredTodos = useMemo(() => {
    return todos.filter(todo => {
      if (filter === 'active') return !todo.completed;
      if (filter === 'completed') return todo.completed;
      return true;
    });
  }, [todos, filter]);

  return (
    <div style={{ padding: '20px', border: '2px solid #9c27b0', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📋 Real-World Example: Optimized Todo List</h2>

      <div style={{ marginBottom: '15px' }}>
        <input
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Add new todo..."
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button
          onClick={handleAdd}
          style={{ padding: '8px 16px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Add Todo
        </button>
      </div>

      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => setFilter('all')}
          style={{
            padding: '6px 12px',
            margin: '2px',
            backgroundColor: filter === 'all' ? '#9c27b0' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          All
        </button>
        <button
          onClick={() => setFilter('active')}
          style={{
            padding: '6px 12px',
            margin: '2px',
            backgroundColor: filter === 'active' ? '#9c27b0' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Active
        </button>
        <button
          onClick={() => setFilter('completed')}
          style={{
            padding: '6px 12px',
            margin: '2px',
            backgroundColor: filter === 'completed' ? '#9c27b0' : '#6c757d',
            color: 'white',
            border: 'none',
            borderRadius: '4px'
          }}
        >
          Completed
        </button>
      </div>

      <div>
        {filteredTodos.map(todo => (
          <TodoItem
            key={todo.id}
            todo={todo}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Optimization:</strong> TodoItems only re-render when their specific todo changes,
        not when you change the filter or add new todos, thanks to useCallback + React.memo!
      </div>
    </div>
  );
};

// Main component
const UseCallbackExample = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #007bff',
      paddingBottom: '10px',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useCallback Hook - Performance Optimization</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#e7f3ff', borderRadius: '8px' }}>
        <h2>🎯 What You'll Learn:</h2>
        <ul>
          <li><strong>The Problem:</strong> Unnecessary re-renders due to new function references</li>
          <li><strong>The Solution:</strong> useCallback to memoize functions</li>
          <li><strong>Performance Impact:</strong> See the difference in action</li>
          <li><strong>Real-World Usage:</strong> Optimized todo list example</li>
        </ul>
        <p><strong>💡 Pro Tip:</strong> Open browser console to see render logs!</p>
      </div>

      <WithoutUseCallback />
      <WithUseCallback />
      <PerformanceComparison />
      <TodoListExample />

      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', marginTop: '30px' }}>
        <h2>🎓 Key useCallback Concepts</h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '20px' }}>
          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>✅ When to Use useCallback:</h3>
            <ul>
              <li>Passing callbacks to React.memo components</li>
              <li>Callbacks used in other hook dependencies</li>
              <li>Expensive function creation</li>
              <li>Preventing child re-renders</li>
            </ul>
          </div>

          <div style={{ padding: '15px', backgroundColor: 'white', borderRadius: '4px' }}>
            <h3>❌ When NOT to Use useCallback:</h3>
            <ul>
              <li>Simple callbacks not passed to children</li>
              <li>Child components not optimized with memo</li>
              <li>No performance issues observed</li>
              <li>Premature optimization</li>
            </ul>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h3>🔑 Remember:</h3>
          <ul>
            <li><strong>useCallback memoizes functions</strong> - same reference unless dependencies change</li>
            <li><strong>Works with React.memo</strong> - prevents unnecessary child re-renders</li>
            <li><strong>Has overhead</strong> - only use when you have performance issues</li>
            <li><strong>Include all dependencies</strong> - use ESLint exhaustive-deps rule</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default UseCallbackExample;