// Performance Optimization with React.memo
// Question: Demonstrate how to optimize a component using React.memo to prevent unnecessary re-renders.

import React, { useState, memo } from 'react';

const ChildComponent = memo(({ count }) => {
  console.log('ChildComponent rendered');
  return <p>Count from Parent: {count}</p>;
});

function ParentComponent() {
  const [count, setCount] = useState(0);
  const [text, setText] = useState('');

  return (
    <div>
      <ChildComponent count={count} />
      <button onClick={() => setCount(count + 1)}>Increment Count</button>
      <input
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Type something"
      />
    </div>
  );
}

export default ParentComponent;
