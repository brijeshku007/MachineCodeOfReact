# useRef Hook - Deep Dive Concepts

## 🎯 What is useRef?

useRef is a React hook that returns a **mutable ref object** whose `.current` property is initialized to the passed argument. The returned object will persist for the full lifetime of the component.

### Basic Syntax
```javascript
const ref = useRef(initialValue);
```

---

## 🔍 Two Main Use Cases

### 1. **Accessing DOM Elements**
```javascript
function MyComponent() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus(); // Direct DOM manipulation
  };
  
  return (
    <div>
      <input ref={inputRef} type="text" />
      <button onClick={focusInput}>Focus Input</button>
    </div>
  );
}
```

### 2. **Storing Mutable Values**
```javascript
function MyComponent() {
  const countRef = useRef(0);
  
  const increment = () => {
    countRef.current += 1;
    console.log(countRef.current); // Doesn't trigger re-render
  };
  
  return <button onClick={increment}>Count: {countRef.current}</button>;
}
```

---

## 🆚 useRef vs useState

### **Key Differences:**

| useRef | useState |
|--------|----------|
| Doesn't trigger re-renders | Triggers re-renders |
| Mutable `.current` property | Immutable state |
| Persists across renders | Persists across renders |
| Synchronous updates | Asynchronous updates |

### **Example Comparison:**
```javascript
function Comparison() {
  const [stateCount, setStateCount] = useState(0);
  const refCount = useRef(0);
  
  const incrementState = () => {
    setStateCount(prev => prev + 1); // Triggers re-render
  };
  
  const incrementRef = () => {
    refCount.current += 1; // No re-render
    console.log('Ref count:', refCount.current);
  };
  
  return (
    <div>
      <p>State count: {stateCount}</p>
      <p>Ref count: {refCount.current}</p>
      <button onClick={incrementState}>Increment State</button>
      <button onClick={incrementRef}>Increment Ref</button>
    </div>
  );
}
```

---

## 🎨 DOM Access Use Cases

### 1. **Focus Management**
```javascript
function LoginForm() {
  const usernameRef = useRef(null);
  const passwordRef = useRef(null);
  
  useEffect(() => {
    // Focus username input on mount
    usernameRef.current.focus();
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!usernameRef.current.value) {
      usernameRef.current.focus();
      return;
    }
    if (!passwordRef.current.value) {
      passwordRef.current.focus();
      return;
    }
    // Submit form
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input ref={usernameRef} placeholder="Username" />
      <input ref={passwordRef} type="password" placeholder="Password" />
      <button type="submit">Login</button>
    </form>
  );
}
```

### 2. **Scroll Control**
```javascript
function ScrollToTop() {
  const topRef = useRef(null);
  
  const scrollToTop = () => {
    topRef.current.scrollIntoView({ behavior: 'smooth' });
  };
  
  return (
    <div>
      <div ref={topRef}>Top of the page</div>
      {/* Long content */}
      <div style={{ height: '2000px' }}>Long content...</div>
      <button onClick={scrollToTop}>Scroll to Top</button>
    </div>
  );
}
```

### 3. **Canvas/Video Control**
```javascript
function VideoPlayer() {
  const videoRef = useRef(null);
  
  const play = () => videoRef.current.play();
  const pause = () => videoRef.current.pause();
  const setVolume = (volume) => {
    videoRef.current.volume = volume;
  };
  
  return (
    <div>
      <video ref={videoRef} src="video.mp4" />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <input 
        type="range" 
        min="0" 
        max="1" 
        step="0.1"
        onChange={(e) => setVolume(e.target.value)}
      />
    </div>
  );
}
```

---

## 💾 Persistent Values Use Cases

### 1. **Previous Values**
```javascript
function usePrevious(value) {
  const ref = useRef();
  
  useEffect(() => {
    ref.current = value;
  });
  
  return ref.current;
}

function MyComponent({ count }) {
  const prevCount = usePrevious(count);
  
  return (
    <div>
      <p>Current: {count}</p>
      <p>Previous: {prevCount}</p>
    </div>
  );
}
```

### 2. **Timer IDs**
```javascript
function Timer() {
  const [seconds, setSeconds] = useState(0);
  const intervalRef = useRef(null);
  
  const start = () => {
    if (!intervalRef.current) {
      intervalRef.current = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);
    }
  };
  
  const stop = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };
  
  const reset = () => {
    stop();
    setSeconds(0);
  };
  
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);
  
  return (
    <div>
      <p>Seconds: {seconds}</p>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}
```

### 3. **Instance Variables**
```javascript
function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const socketRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  
  useEffect(() => {
    const connectWebSocket = () => {
      socketRef.current = new WebSocket('ws://localhost:8080');
      
      socketRef.current.onopen = () => {
        reconnectAttemptsRef.current = 0;
        console.log('Connected');
      };
      
      socketRef.current.onmessage = (event) => {
        const message = JSON.parse(event.data);
        setMessages(prev => [...prev, message]);
      };
      
      socketRef.current.onclose = () => {
        if (reconnectAttemptsRef.current < 5) {
          reconnectAttemptsRef.current += 1;
          setTimeout(connectWebSocket, 1000 * reconnectAttemptsRef.current);
        }
      };
    };
    
    connectWebSocket();
    
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []);
  
  const sendMessage = (text) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(JSON.stringify({ text }));
    }
  };
  
  return (
    <div>
      {messages.map((msg, index) => (
        <div key={index}>{msg.text}</div>
      ))}
      <button onClick={() => sendMessage('Hello')}>Send Message</button>
    </div>
  );
}
```

---

## 🔄 useRef with useEffect

### **Avoiding Stale Closures:**
```javascript
function Counter() {
  const [count, setCount] = useState(0);
  const countRef = useRef(count);
  
  // Keep ref in sync with state
  useEffect(() => {
    countRef.current = count;
  }, [count]);
  
  useEffect(() => {
    const timer = setInterval(() => {
      // This always has the latest count value
      console.log('Current count:', countRef.current);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []); // Empty deps - no stale closure
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={() => setCount(count + 1)}>Increment</button>
    </div>
  );
}
```

---

## 🎯 Advanced Patterns

### 1. **Forwarding Refs**
```javascript
const FancyInput = forwardRef((props, ref) => {
  return (
    <div className="fancy-input">
      <input ref={ref} {...props} />
    </div>
  );
});

function Parent() {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    inputRef.current.focus();
  };
  
  return (
    <div>
      <FancyInput ref={inputRef} placeholder="Type here" />
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}
```

### 2. **Imperative Handle**
```javascript
const CustomInput = forwardRef((props, ref) => {
  const inputRef = useRef(null);
  
  useImperativeHandle(ref, () => ({
    focus: () => inputRef.current.focus(),
    clear: () => {
      inputRef.current.value = '';
    },
    getValue: () => inputRef.current.value
  }));
  
  return <input ref={inputRef} {...props} />;
});

function Parent() {
  const customInputRef = useRef(null);
  
  const handleClick = () => {
    customInputRef.current.focus();
    console.log(customInputRef.current.getValue());
    customInputRef.current.clear();
  };
  
  return (
    <div>
      <CustomInput ref={customInputRef} />
      <button onClick={handleClick}>Focus & Clear</button>
    </div>
  );
}
```

### 3. **Callback Refs**
```javascript
function DynamicList({ items }) {
  const itemRefs = useRef({});
  
  const setItemRef = (id) => (element) => {
    if (element) {
      itemRefs.current[id] = element;
    } else {
      delete itemRefs.current[id];
    }
  };
  
  const scrollToItem = (id) => {
    const element = itemRefs.current[id];
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  return (
    <div>
      {items.map(item => (
        <div
          key={item.id}
          ref={setItemRef(item.id)}
          onClick={() => scrollToItem(item.id)}
        >
          {item.name}
        </div>
      ))}
    </div>
  );
}
```

---

## ⚠️ Common Pitfalls

### 1. **Don't Use Ref Values in Render**
```javascript
// ❌ Wrong - ref values in render
function BadComponent() {
  const countRef = useRef(0);
  
  return (
    <div>
      <p>Count: {countRef.current}</p> {/* Won't update on screen */}
      <button onClick={() => countRef.current += 1}>Increment</button>
    </div>
  );
}

// ✅ Correct - use state for render values
function GoodComponent() {
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  
  const increment = () => {
    const newCount = count + 1;
    setCount(newCount);
    countRef.current = newCount;
  };
  
  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```

### 2. **Ref Initialization Timing**
```javascript
// ❌ Wrong - accessing ref before it's set
function BadComponent() {
  const inputRef = useRef(null);
  
  // This runs before the input is rendered
  inputRef.current.focus(); // Error: Cannot read property 'focus' of null
  
  return <input ref={inputRef} />;
}

// ✅ Correct - use useEffect
function GoodComponent() {
  const inputRef = useRef(null);
  
  useEffect(() => {
    // This runs after the input is rendered
    inputRef.current.focus();
  }, []);
  
  return <input ref={inputRef} />;
}
```

### 3. **Conditional Refs**
```javascript
// ❌ Problematic - conditional ref
function ConditionalComponent({ showInput }) {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    // inputRef.current might be null if showInput is false
    inputRef.current?.focus();
  };
  
  return (
    <div>
      {showInput && <input ref={inputRef} />}
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}

// ✅ Better - check if ref exists
function BetterComponent({ showInput }) {
  const inputRef = useRef(null);
  
  const focusInput = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };
  
  return (
    <div>
      {showInput && <input ref={inputRef} />}
      <button onClick={focusInput}>Focus</button>
    </div>
  );
}
```

---

## 🎓 Best Practices

### ✅ **DO:**
- Use for DOM access and manipulation
- Store mutable values that don't trigger re-renders
- Keep timer IDs, intervals, and subscriptions
- Use with useEffect for cleanup
- Check if ref.current exists before using

### ❌ **DON'T:**
- Use ref values directly in render
- Mutate refs during rendering
- Use refs for values that should trigger re-renders
- Access refs before component mounts
- Overuse refs instead of proper React patterns

---

## 🧪 Testing useRef

```javascript
import { render, fireEvent } from '@testing-library/react';

function FocusableInput() {
  const inputRef = useRef(null);
  
  const focus = () => inputRef.current.focus();
  
  return (
    <div>
      <input ref={inputRef} data-testid="input" />
      <button onClick={focus} data-testid="focus-btn">Focus</button>
    </div>
  );
}

test('should focus input when button is clicked', () => {
  const { getByTestId } = render(<FocusableInput />);
  
  const input = getByTestId('input');
  const button = getByTestId('focus-btn');
  
  fireEvent.click(button);
  
  expect(input).toHaveFocus();
});
```

This comprehensive guide covers all aspects of useRef for DOM access and persistent values!