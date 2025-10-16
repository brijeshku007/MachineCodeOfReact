import React, { useReducer, useState } from 'react';

/**
 * useReducer Analogy - Real World Examples
 * 
 * This explains useReducer using familiar real-world analogies
 * to make the concept crystal clear.
 */

// ANALOGY 1: Bank Account (Easy to understand)
const BankAnalogy = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🏦 Bank Account Analogy</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
          <h3>🏛️ Traditional Bank (useState)</h3>
          <p><strong>You:</strong> "I want my balance to be $500"</p>
          <p><strong>Bank:</strong> "OK, your balance is now $500"</p>

          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            <strong>Problem:</strong> You have to calculate everything yourself!
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h3>🏦 Modern Bank (useReducer)</h3>
          <p><strong>You:</strong> "I want to deposit $100"</p>
          <p><strong>Bank:</strong> "Processing... Your new balance is $600"</p>

          <div style={{ fontSize: '14px', color: '#666', marginTop: '10px' }}>
            <strong>Benefit:</strong> The bank handles all the calculations!
          </div>
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h4>🎯 The Point:</h4>
        <p>
          <strong>useState:</strong> You tell React exactly what the new state should be<br />
          <strong>useReducer:</strong> You tell React what happened, and it figures out the new state
        </p>
      </div>
    </div>
  );
};

// ANALOGY 2: Restaurant Order (Actions and Responses)
const RestaurantAnalogy = () => {
  return (
    <div style={{ padding: '20px', border: '2px solid #fd7e14', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🍕 Restaurant Order Analogy</h2>

      <div style={{ marginBottom: '20px' }}>
        <h3>How Ordering Food Works:</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '15px' }}>
          <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px', textAlign: 'center' }}>
            <h4>1. You (Component)</h4>
            <p>🗣️ "I want a pizza"</p>
            <small>Send an action</small>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px', textAlign: 'center' }}>
            <h4>2. Kitchen (Reducer)</h4>
            <p>👨‍🍳 "Making pizza..."</p>
            <small>Process the action</small>
          </div>

          <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px', textAlign: 'center' }}>
            <h4>3. Result (New State)</h4>
            <p>🍕 "Here's your pizza!"</p>
            <small>Return new state</small>
          </div>
        </div>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h4>🎯 In React Terms:</h4>
        <ul>
          <li><strong>You (Component):</strong> dispatch({`{type: 'ORDER_PIZZA'}`})</li>
          <li><strong>Kitchen (Reducer):</strong> Receives action, processes it</li>
          <li><strong>Result (New State):</strong> {`{orders: [...orders, 'pizza']}`}</li>
        </ul>
      </div>
    </div>
  );
};

// PRACTICAL EXAMPLE: Simple Calculator
function calculatorReducer(state, action) {
  console.log('🧮 Calculator:', { state, action });

  switch (action.type) {
    case 'ADD':
      return { result: state.result + action.payload };
    case 'SUBTRACT':
      return { result: state.result - action.payload };
    case 'MULTIPLY':
      return { result: state.result * action.payload };
    case 'DIVIDE':
      return { result: state.result / action.payload };
    case 'CLEAR':
      return { result: 0 };
    default:
      return state;
  }
}

const CalculatorExample = () => {
  const [state, dispatch] = useReducer(calculatorReducer, { result: 0 });
  const [inputValue, setInputValue] = useState('');

  const handleOperation = (operation) => {
    const number = parseFloat(inputValue) || 0;
    dispatch({ type: operation, payload: number });
    setInputValue('');
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #6f42c1', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🧮 Simple Calculator - useReducer in Action</h2>

      <div style={{ marginBottom: '20px' }}>
        <div style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>
          Result: {state.result}
        </div>

        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter a number"
          style={{ padding: '8px', marginRight: '10px', width: '150px' }}
        />
      </div>

      <div style={{ marginBottom: '20px' }}>
        <button onClick={() => handleOperation('ADD')} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>
          + Add
        </button>
        <button onClick={() => handleOperation('SUBTRACT')} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>
          - Subtract
        </button>
        <button onClick={() => handleOperation('MULTIPLY')} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>
          × Multiply
        </button>
        <button onClick={() => handleOperation('DIVIDE')} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>
          ÷ Divide
        </button>
        <button onClick={() => dispatch({ type: 'CLEAR' })} style={{ padding: '10px 15px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>
          Clear
        </button>
      </div>

      <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
        <h4>🎯 What's Happening:</h4>
        <ol>
          <li>You enter a number and click an operation</li>
          <li>We dispatch an action like {`{type: 'ADD', payload: 5}`}</li>
          <li>The reducer receives this action and current state</li>
          <li>The reducer calculates the new result</li>
          <li>React updates the component with the new state</li>
        </ol>
      </div>
    </div>
  );
};

// COMPARISON: Same thing with useState vs useReducer
const ComparisonExample = () => {
  // useState version
  const [countState, setCountState] = useState(0);

  // useReducer version
  const countReducerFunction = (state, action) => {
    switch (action.type) {
      case 'INCREMENT': return state + 1;
      case 'DECREMENT': return state - 1;
      case 'RESET': return 0;
      default: return state;
    }
  };
  const [countReducerState, dispatch] = useReducer(countReducerFunction, 0);

  return (
    <div style={{ padding: '20px', border: '2px solid #17a2b8', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>⚖️ Side-by-Side Comparison</h2>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>useState Version</h3>
          <p>Count: <strong>{countState}</strong></p>
          <button onClick={() => setCountState(countState + 1)} style={{ padding: '8px', margin: '2px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>+1</button>
          <button onClick={() => setCountState(countState - 1)} style={{ padding: '8px', margin: '2px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>-1</button>
          <button onClick={() => setCountState(0)} style={{ padding: '8px', margin: '2px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>Reset</button>

          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <strong>Code:</strong><br />
            <code>setCountState(countState + 1)</code>
          </div>
        </div>

        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3>useReducer Version</h3>
          <p>Count: <strong>{countReducerState}</strong></p>
          <button onClick={() => dispatch({ type: 'INCREMENT' })} style={{ padding: '8px', margin: '2px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}>+1</button>
          <button onClick={() => dispatch({ type: 'DECREMENT' })} style={{ padding: '8px', margin: '2px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}>-1</button>
          <button onClick={() => dispatch({ type: 'RESET' })} style={{ padding: '8px', margin: '2px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>Reset</button>

          <div style={{ marginTop: '10px', fontSize: '12px' }}>
            <strong>Code:</strong><br />
            <code>dispatch({`{type: 'INCREMENT'}`})</code>
          </div>
        </div>
      </div>

      <div style={{ marginTop: '20px', padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
        <h4>🤔 Which is Better?</h4>
        <p>
          <strong>For this simple counter:</strong> useState is simpler and better<br />
          <strong>For complex state:</strong> useReducer becomes much more powerful
        </p>
      </div>
    </div>
  );
};

// Main component
const UseReducerAnalogy = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1000px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '3px solid #17a2b8',
      paddingBottom: '10px',
      marginBottom: '30px',
      textAlign: 'center'
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>useReducer - Real World Analogies</h1>

      <div style={{ marginBottom: '30px', padding: '20px', backgroundColor: '#d1ecf1', borderRadius: '8px' }}>
        <h2>🎯 Let's Make useReducer Crystal Clear!</h2>
        <p>Sometimes code concepts are easier to understand with real-world examples. Let's explore useReducer through familiar situations!</p>
      </div>

      <BankAnalogy />
      <RestaurantAnalogy />
      <CalculatorExample />
      <ComparisonExample />

      <div style={{ padding: '20px', backgroundColor: '#d4edda', borderRadius: '8px', marginTop: '30px' }}>
        <h3>🎉 Now You Get It!</h3>
        <div style={{ fontSize: '16px', lineHeight: '1.6' }}>
          <p><strong>useReducer is like having a smart assistant:</strong></p>
          <ul>
            <li>🗣️ You tell it what happened (dispatch an action)</li>
            <li>🧠 It figures out what to do (reducer function)</li>
            <li>✨ It gives you the result (new state)</li>
          </ul>

          <p style={{ marginTop: '15px' }}>
            <strong>The magic:</strong> All your state logic is organized in one place (the reducer),
            making it easier to understand, test, and debug!
          </p>
        </div>
      </div>
    </div>
  );
};

export default UseReducerAnalogy;