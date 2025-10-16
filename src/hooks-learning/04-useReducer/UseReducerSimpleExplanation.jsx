import React, { useState, useReducer } from 'react';

/**
 * useReducer - Simple Step-by-Step Explanation
 * 
 * This component explains useReducer from the ground up with clear comparisons
 * to useState and gradually increasing complexity.
 */

// STEP 1: Simple Counter with useState (what you already know)
const CounterWithUseState = () => {
  const [count, setCount] = useState(0);

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🔵 Counter with useState (What you know)</h3>
      <p>Count: <strong>{count}</strong></p>
      <button onClick={() => setCount(count + 1)}>+1</button>
      <button onClick={() => setCount(count - 1)}>-1</button>
      <button onClick={() => setCount(0)}>Reset</button>

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <strong>How it works:</strong> We directly call setCount with new values
      </div>
    </div>
  );
};

// STEP 2: Same Counter with useReducer (new way)
// First, we need a "reducer" function - think of it as a "state updater"
function counterReducer(currentState, action) {
  console.log('🔄 Reducer called with:', { currentState, action });

  // The reducer decides what to do based on the "action type"
  if (action.type === 'INCREMENT') {
    return { count: currentState.count + 1 };
  }

  if (action.type === 'DECREMENT') {
    return { count: currentState.count - 1 };
  }

  if (action.type === 'RESET') {
    return { count: 0 };
  }

  // If we don't recognize the action, return the current state unchanged
  return currentState;
}

const CounterWithUseReducer = () => {
  // useReducer takes: (reducer function, initial state)
  // Returns: [current state, dispatch function]
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🟢 Same Counter with useReducer (New way)</h3>
      <p>Count: <strong>{state.count}</strong></p>

      {/* Instead of setCount, we "dispatch" actions */}
      <button onClick={() => dispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => dispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => dispatch({ type: 'RESET' })}>Reset</button>

      <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
        <strong>How it works:</strong> We send "actions" to the reducer, which decides what to do
      </div>
    </div>
  );
};

// STEP 3: Let's break down what happens step by step
const StepByStepExplanation = () => {
  const [state, dispatch] = useReducer(counterReducer, { count: 0 });
  const [lastAction, setLastAction] = useState(null);

  const handleDispatch = (action) => {
    setLastAction(action);
    dispatch(action);
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🟡 Step-by-Step Breakdown</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '15px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h4>1. Current State</h4>
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {JSON.stringify(state, null, 2)}
          </pre>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h4>2. Last Action</h4>
          <pre style={{ margin: 0, fontSize: '12px' }}>
            {lastAction ? JSON.stringify(lastAction, null, 2) : 'No action yet'}
          </pre>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h4>3. What Happens</h4>
          <div style={{ fontSize: '12px' }}>
            {lastAction ? (
              <div>
                Reducer receives action<br />
                → Calculates new state<br />
                → Component re-renders
              </div>
            ) : (
              'Click a button to see!'
            )}
          </div>
        </div>
      </div>

      <p>Count: <strong>{state.count}</strong></p>
      <button onClick={() => handleDispatch({ type: 'INCREMENT' })}>+1</button>
      <button onClick={() => handleDispatch({ type: 'DECREMENT' })}>-1</button>
      <button onClick={() => handleDispatch({ type: 'RESET' })}>Reset</button>

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>Watch the flow:</strong> Click buttons and see how action → reducer → new state works!
      </div>
    </div>
  );
};

// STEP 4: Why is this useful? Let's see with a more complex example
function todoReducer(currentState, action) {
  console.log('📋 Todo Reducer:', { currentState, action });

  switch (action.type) {
    case 'ADD_TODO':
      return {
        ...currentState,
        todos: [...currentState.todos, {
          id: Date.now(),
          text: action.payload,
          completed: false
        }]
      };

    case 'TOGGLE_TODO':
      return {
        ...currentState,
        todos: currentState.todos.map(todo =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        )
      };

    case 'DELETE_TODO':
      return {
        ...currentState,
        todos: currentState.todos.filter(todo => todo.id !== action.payload)
      };

    default:
      return currentState;
  }
}

const TodoWithUseReducer = () => {
  const [state, dispatch] = useReducer(todoReducer, { todos: [] });
  const [inputText, setInputText] = useState('');

  const addTodo = () => {
    if (inputText.trim()) {
      dispatch({ type: 'ADD_TODO', payload: inputText });
      setInputText('');
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #dc3545', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🔴 Todo App - Why useReducer is Powerful</h3>

      <div style={{ marginBottom: '15px' }}>
        <input
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Add a todo..."
          style={{ padding: '8px', marginRight: '10px', width: '200px' }}
        />
        <button onClick={addTodo} style={{ padding: '8px 16px' }}>Add</button>
      </div>

      <div>
        {state.todos.map(todo => (
          <div key={todo.id} style={{
            display: 'flex',
            alignItems: 'center',
            padding: '8px',
            margin: '4px 0',
            backgroundColor: todo.completed ? '#d4edda' : '#f8f9fa',
            borderRadius: '4px'
          }}>
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch({ type: 'TOGGLE_TODO', payload: todo.id })}
            />
            <span style={{
              marginLeft: '10px',
              textDecoration: todo.completed ? 'line-through' : 'none',
              flex: 1
            }}>
              {todo.text}
            </span>
            <button
              onClick={() => dispatch({ type: 'DELETE_TODO', payload: todo.id })}
              style={{ padding: '4px 8px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <div style={{ marginTop: '15px', fontSize: '14px', color: '#666' }}>
        <strong>Why useReducer here?</strong> We have complex state (array of todos) with multiple operations (add, toggle, delete).
        All the logic is centralized in the reducer function!
      </div>
    </div>
  );
};

// STEP 5: useState vs useReducer - When to use which?
const ComparisonGuide = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #6f42c1', borderRadius: '8px', marginBottom: '20px' }}>
      <h3>🟣 useState vs useReducer - When to Use Which?</h3>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h4>✅ Use useState When:</h4>
          <ul style={{ fontSize: '14px' }}>
            <li>Simple state (string, number, boolean)</li>
            <li>Independent state updates</li>
            <li>State doesn't depend on previous state</li>
            <li>Few state variables</li>
          </ul>

          <h5>Example:</h5>
          <pre style={{ fontSize: '12px', backgroundColor: 'white', padding: '8px', borderRadius: '4px' }}>
            {`const [name, setName] = useState('');
const [age, setAge] = useState(0);
const [email, setEmail] = useState('');`}
          </pre>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h4>✅ Use useReducer When:</h4>
          <ul style={{ fontSize: '14px' }}>
            <li>Complex state (objects, arrays)</li>
            <li>Multiple related state values</li>
            <li>State updates depend on previous state</li>
            <li>Complex update logic</li>
          </ul>

          <h5>Example:</h5>
          <pre style={{ fontSize: '12px', backgroundColor: 'white', padding: '8px', borderRadius: '4px' }}>
            {`const [state, dispatch] = useReducer(
  reducer, 
  { 
    todos: [], 
    filter: 'all', 
    loading: false 
  }
);`}
          </pre>
        </div>
      </div>
    </div>
  );
};

// Main component
const UseReducerSimpleExplanation = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '3px solid #9c27b0',
      paddingBottom: '10px',
      marginBottom: '30px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useReducer - Simple Step-by-Step Explanation</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
        <h2>🎯 What You'll Understand:</h2>
        <ol>
          <li><strong>What useReducer is</strong> - A different way to manage state</li>
          <li><strong>How it works</strong> - Actions → Reducer → New State</li>
          <li><strong>When to use it</strong> - Complex state vs simple state</li>
          <li><strong>Why it's useful</strong> - Centralized logic, predictable updates</li>
        </ol>
      </div>

      <CounterWithUseState />
      <CounterWithUseReducer />
      <StepByStepExplanation />
      <TodoWithUseReducer />
      <ComparisonGuide />

      <div style={{ padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px', marginTop: '30px' }}>
        <h3>🎓 Key Takeaways:</h3>
        <ul>
          <li><strong>useReducer is just another way to manage state</strong> - like useState but for complex scenarios</li>
          <li><strong>Actions are just objects</strong> - they describe what happened</li>
          <li><strong>Reducer is just a function</strong> - it takes current state + action, returns new state</li>
          <li><strong>dispatch is like setState</strong> - but instead of new state, you send actions</li>
          <li><strong>All state logic is in one place</strong> - the reducer function</li>
        </ul>

        <div style={{ marginTop: '15px', fontSize: '14px' }}>
          <strong>💡 Think of it like this:</strong><br />
          useState: "Here's the new state" → setCount(5)<br />
          useReducer: "Here's what happened" → dispatch({`{type: 'SET_COUNT', payload: 5}`})
        </div>
      </div>
    </div>
  );
};

export default UseReducerSimpleExplanation;