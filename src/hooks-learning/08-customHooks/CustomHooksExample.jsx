import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';

/**
 * Custom Hooks - Complete Learning Example
 * 
 * This demonstrates building and using custom hooks:
 * 1. Basic custom hooks (useCounter, useToggle)
 * 2. Data fetching hooks (useFetch, useApi)
 * 3. Storage hooks (useLocalStorage)
 * 4. UI interaction hooks (useDebounce, useClickOutside)
 * 5. Form handling hooks (useForm)
 * 6. Real-world application examples
 */

// ===== CUSTOM HOOKS DEFINITIONS =====

// 1. Basic Counter Hook
function useCounter(initialValue = 0) {
  const [count, setCount] = useState(initialValue);
  
  const increment = useCallback(() => setCount(prev => prev + 1), []);
  const decrement = useCallback(() => setCount(prev => prev - 1), []);
  const reset = useCallback(() => setCount(initialValue), [initialValue]);
  const setValue = useCallback((value) => setCount(value), []);
  
  return {
    count,
    increment,
    decrement,
    reset,
    setValue
  };
}

// 2. Toggle Hook
function useToggle(initialValue = false) {
  const [value, setValue] = useState(initialValue);
  
  const toggle = useCallback(() => setValue(prev => !prev), []);
  const setTrue = useCallback(() => setValue(true), []);
  const setFalse = useCallback(() => setValue(false), []);
  
  return [value, { toggle, setTrue, setFalse, setValue }];
}

// 3. Local Storage Hook
function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });
  
  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  }, [key, storedValue]);
  
  const removeValue = useCallback(() => {
    try {
      window.localStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error);
    }
  }, [key, initialValue]);
  
  return [storedValue, setValue, removeValue];
}

// 4. Debounce Hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    
    return () => clearTimeout(handler);
  }, [value, delay]);
  
  return debouncedValue;
}

// 5. Fetch Hook
function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    if (!url) return;
    
    const abortController = new AbortController();
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Mock API response based on URL
        let mockData;
        if (url.includes('users')) {
          mockData = [
            { id: 1, name: 'John Doe', email: 'john@example.com' },
            { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
            { id: 3, name: 'Bob Johnson', email: 'bob@example.com' }
          ];
        } else if (url.includes('posts')) {
          mockData = [
            { id: 1, title: 'First Post', content: 'This is the first post' },
            { id: 2, title: 'Second Post', content: 'This is the second post' }
          ];
        } else {
          throw new Error('Unknown endpoint');
        }
        
        if (abortController.signal.aborted) return;
        
        setData(mockData);
      } catch (err) {
        if (err.name !== 'AbortError') {
          setError(err);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    
    return () => abortController.abort();
  }, [url]);
  
  return { data, loading, error };
}

// 6. Click Outside Hook
function useClickOutside(ref, callback) {
  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };
    
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [ref, callback]);
}

// 7. Form Hook
function useForm(initialValues, validationRules = {}) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  
  const setValue = useCallback((name, value) => {
    setValues(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  }, [errors]);
  
  const setFieldTouched = useCallback((name) => {
    setTouched(prev => ({ ...prev, [name]: true }));
  }, []);
  
  const validate = useCallback(() => {
    const newErrors = {};
    
    Object.keys(validationRules).forEach(field => {
      const rule = validationRules[field];
      const value = values[field];
      
      if (rule.required && (!value || value.toString().trim() === '')) {
        newErrors[field] = rule.required;
      } else if (rule.pattern && value && !rule.pattern.test(value)) {
        newErrors[field] = rule.patternMessage || 'Invalid format';
      }
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [values, validationRules]);
  
  const reset = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  }, [initialValues]);
  
  return {
    values,
    errors,
    touched,
    setValue,
    setFieldTouched,
    validate,
    reset,
    isValid: Object.keys(errors).length === 0
  };
}

// ===== DEMO COMPONENTS =====

// Demo 1: Basic Custom Hooks
const BasicHooksDemo = () => {
  const counter = useCounter(0);
  const [isVisible, visibilityControls] = useToggle(true);
  const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light');

  return (
    <div style={{ padding: '20px', border: '2px solid #007bff', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🎯 Basic Custom Hooks</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
        {/* Counter Hook */}
        <div style={{ padding: '15px', backgroundColor: '#e3f2fd', borderRadius: '4px' }}>
          <h3>useCounter</h3>
          <p>Count: <strong>{counter.count}</strong></p>
          <button onClick={counter.increment} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}>+</button>
          <button onClick={counter.decrement} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>-</button>
          <button onClick={counter.reset} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Reset</button>
        </div>

        {/* Toggle Hook */}
        <div style={{ padding: '15px', backgroundColor: '#f3e5f5', borderRadius: '4px' }}>
          <h3>useToggle</h3>
          <p>Visible: <strong>{isVisible ? 'Yes' : 'No'}</strong></p>
          {isVisible && <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px' }}>👋 Hello there!</div>}
          <button onClick={visibilityControls.toggle} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#9c27b0', color: 'white', border: 'none', borderRadius: '4px' }}>Toggle</button>
          <button onClick={visibilityControls.setTrue} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}>Show</button>
          <button onClick={visibilityControls.setFalse} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}>Hide</button>
        </div>

        {/* LocalStorage Hook */}
        <div style={{ padding: '15px', backgroundColor: '#e8f5e8', borderRadius: '4px' }}>
          <h3>useLocalStorage</h3>
          <p>Theme: <strong>{theme}</strong></p>
          <button onClick={() => setTheme('light')} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#ffc107', color: 'black', border: 'none', borderRadius: '4px' }}>Light</button>
          <button onClick={() => setTheme('dark')} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#343a40', color: 'white', border: 'none', borderRadius: '4px' }}>Dark</button>
          <button onClick={removeTheme} style={{ padding: '5px 10px', margin: '2px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}>Remove</button>
        </div>
      </div>

      <div style={{ padding: '10px', backgroundColor: '#cce5ff', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>Custom Hooks Benefits:</strong> Reusable logic, cleaner components, easier testing, and better separation of concerns!
      </div>
    </div>
  );
};

// Demo 2: Data Fetching Hook
const DataFetchingDemo = () => {
  const [endpoint, setEndpoint] = useState('');
  const { data, loading, error } = useFetch(endpoint);

  return (
    <div style={{ padding: '20px', border: '2px solid #28a745', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🌐 Data Fetching Hook</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <button 
          onClick={() => setEndpoint('/api/users')}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Fetch Users
        </button>
        <button 
          onClick={() => setEndpoint('/api/posts')}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Fetch Posts
        </button>
        <button 
          onClick={() => setEndpoint('')}
          style={{ padding: '8px 16px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Clear
        </button>
      </div>

      {loading && (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px', marginBottom: '15px' }}>
          🔄 Loading data...
        </div>
      )}

      {error && (
        <div style={{ padding: '15px', backgroundColor: '#f8d7da', borderRadius: '4px', marginBottom: '15px' }}>
          ❌ Error: {error.message}
        </div>
      )}

      {data && (
        <div style={{ padding: '15px', backgroundColor: '#d4edda', borderRadius: '4px' }}>
          <h4>Data Loaded:</h4>
          <pre style={{ backgroundColor: 'white', padding: '10px', borderRadius: '4px', fontSize: '12px' }}>
            {JSON.stringify(data, null, 2)}
          </pre>
        </div>
      )}

      <div style={{ padding: '10px', backgroundColor: '#d4edda', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>useFetch Hook:</strong> Handles loading states, error handling, and request cancellation automatically!
      </div>
    </div>
  );
};

// Demo 3: Debounced Search
const DebouncedSearchDemo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const [searchCount, setSearchCount] = useState(0);

  // Mock search results
  const allItems = [
    'Apple', 'Banana', 'Cherry', 'Date', 'Elderberry',
    'Fig', 'Grape', 'Honeydew', 'Kiwi', 'Lemon'
  ];

  const searchResults = useMemo(() => {
    if (!debouncedSearchTerm) return [];
    return allItems.filter(item =>
      item.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [debouncedSearchTerm]);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setSearchCount(prev => prev + 1);
      console.log('🔍 Searching for:', debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <div style={{ padding: '20px', border: '2px solid #ffc107', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🔍 Debounced Search Hook</h2>
      
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search fruits..."
          style={{ padding: '10px', width: '300px', border: '1px solid #ddd', borderRadius: '4px' }}
        />
      </div>

      <div style={{ marginBottom: '15px' }}>
        <p>Current input: <strong>"{searchTerm}"</strong></p>
        <p>Debounced value: <strong>"{debouncedSearchTerm}"</strong></p>
        <p>Search count: <strong>{searchCount}</strong></p>
      </div>

      {searchResults.length > 0 && (
        <div style={{ padding: '15px', backgroundColor: '#fff3cd', borderRadius: '4px' }}>
          <h4>Search Results ({searchResults.length}):</h4>
          <ul>
            {searchResults.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        </div>
      )}

      <div style={{ padding: '10px', backgroundColor: '#fff3cd', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>useDebounce Hook:</strong> Delays search execution until user stops typing for 500ms. 
        Perfect for API calls and expensive operations!
      </div>
    </div>
  );
};

// Demo 4: Click Outside Hook
const ClickOutsideDemo = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useClickOutside(dropdownRef, () => {
    if (isOpen) {
      setIsOpen(false);
      console.log('🖱️ Clicked outside - closing dropdown');
    }
  });

  return (
    <div style={{ padding: '20px', border: '2px solid #dc3545', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>🖱️ Click Outside Hook</h2>
      
      <div style={{ position: 'relative', display: 'inline-block' }}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{ padding: '10px 20px', backgroundColor: '#dc3545', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          {isOpen ? 'Close' : 'Open'} Dropdown
        </button>
        
        {isOpen && (
          <div
            ref={dropdownRef}
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              backgroundColor: 'white',
              border: '1px solid #ddd',
              borderRadius: '4px',
              padding: '10px',
              minWidth: '200px',
              boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
              zIndex: 1000
            }}
          >
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Option 1</div>
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Option 2</div>
            <div style={{ padding: '8px', borderBottom: '1px solid #eee' }}>Option 3</div>
            <div style={{ padding: '8px' }}>Option 4</div>
          </div>
        )}
      </div>

      <div style={{ padding: '10px', backgroundColor: '#f8d7da', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>useClickOutside Hook:</strong> Automatically closes dropdowns, modals, and popups when clicking outside. 
        Try clicking outside the dropdown to close it!
      </div>
    </div>
  );
};

// Demo 5: Form Hook
const FormDemo = () => {
  const form = useForm(
    { name: '', email: '', message: '' },
    {
      name: { required: 'Name is required' },
      email: { 
        required: 'Email is required',
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        patternMessage: 'Please enter a valid email'
      },
      message: { required: 'Message is required' }
    }
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.validate()) {
      alert(`Form submitted!\n${JSON.stringify(form.values, null, 2)}`);
      form.reset();
    }
  };

  return (
    <div style={{ padding: '20px', border: '2px solid #9c27b0', borderRadius: '8px', marginBottom: '30px' }}>
      <h2>📝 Form Hook</h2>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Name:</label>
          <input
            type="text"
            value={form.values.name}
            onChange={(e) => form.setValue('name', e.target.value)}
            onBlur={() => form.setFieldTouched('name')}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '300px',
              border: form.errors.name && form.touched.name ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          {form.errors.name && form.touched.name && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {form.errors.name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Email:</label>
          <input
            type="email"
            value={form.values.email}
            onChange={(e) => form.setValue('email', e.target.value)}
            onBlur={() => form.setFieldTouched('email')}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '300px',
              border: form.errors.email && form.touched.email ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px'
            }}
          />
          {form.errors.email && form.touched.email && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {form.errors.email}
            </div>
          )}
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Message:</label>
          <textarea
            value={form.values.message}
            onChange={(e) => form.setValue('message', e.target.value)}
            onBlur={() => form.setFieldTouched('message')}
            style={{
              padding: '8px',
              width: '100%',
              maxWidth: '300px',
              height: '80px',
              border: form.errors.message && form.touched.message ? '2px solid #dc3545' : '1px solid #ddd',
              borderRadius: '4px',
              resize: 'vertical'
            }}
          />
          {form.errors.message && form.touched.message && (
            <div style={{ color: '#dc3545', fontSize: '12px', marginTop: '5px' }}>
              {form.errors.message}
            </div>
          )}
        </div>

        <div>
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              margin: '5px',
              backgroundColor: form.isValid ? '#28a745' : '#6c757d',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: form.isValid ? 'pointer' : 'not-allowed'
            }}
          >
            Submit
          </button>
          <button
            type="button"
            onClick={form.reset}
            style={{ padding: '10px 20px', margin: '5px', backgroundColor: '#6c757d', color: 'white', border: 'none', borderRadius: '4px' }}
          >
            Reset
          </button>
        </div>
      </form>

      <div style={{ padding: '10px', backgroundColor: '#f3e5f5', borderRadius: '4px', fontSize: '14px', marginTop: '15px' }}>
        <strong>useForm Hook:</strong> Handles form state, validation, error messages, and touched fields automatically!
      </div>
    </div>
  );
};

// Main component
const CustomHooksExample = () => {
  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1200px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif'
    },
    title: {
      color: '#333',
      borderBottom: '2px solid #9c27b0',
      paddingBottom: 'e;sExamplook CustomH default};

export
  );v>
di</div>
    
      </   </div>
     /ul>
          <i> timers</lndtions acrip subsn upleaAlways c - nup</strong>e cleaandlng>H   <li><stro        
 hook</li>ility per sibresponrong> - One d</sthem focuseg>Keep ttron     <li><s
       i>unctions</lrays, far objects, alues,- vrong> nything</steturn atrong>R  <li><s       .</li>
   tc, eeCallback usct,fe, useEfStatetrong> - uses</sr hookl othean calng>Ctro><s        <li   li>
 "</use "s withustom hookprefix cg> - Always "</stron with "usert<strong>Sta        <li>ul>
         <  
   3>es:</htom Hook Rul<h3>🔑 Cus  
        ' }}> '4pxdius:, borderRa'#fff3cd'undColor: ackgro5px', bing: '1paddstyle={{ v <di         </div>

       v>
   </diul>
        </        >
   rns</lition patteac inter  <li>UI       /li>
     on<lidatiling and varm hand     <li>Fo      
   /li>tching< data feation andgr>API inte      <li     </li>
   nsment pattermanage state <li>Complex           /li>
   nents<ple compo multigic used in     <li>Lo      l>
   <u       </h3>
     stom Hooks: Cuto Create <h3>🎯 When       >
      }}ius: '4px'', borderRadr: 'whitegroundColoack'15px', bdding: e={{ pa   <div styl           
 
         </div>     >
     </ul    >
    /lihitecture<ble arcd flexisable an <li>Compo  
           /li>s<n of concernseparatiotter i>Be <l        </li>
     ingggnd debung a testisieri>Ea  <l            li>
</onentsfocused compeaner, more     <li>Cl          nents</li>
cross compologic atateful e sablli>Reus     <        
 l><u   
         3>fits:</hBene Hook omst✅ Cuh3>           <}}>
 : '4px' adius', borderR: 'whitelorackgroundCo: '15px', b paddingyle={{<div st         }}>
  x'om: '20pmarginBott: '20px', gap(2, 1fr)', atumns: 'repeemplateColdT 'grid', gri display:v style={{        <di       
2>
 s Mastery</hm Hook>🎓 Custo  <h2}}>
      30px' nTop: '8px', margius: 'orderRadicf1', b: '#d1eolor backgroundCing: '20px',{ paddyle={     <div st
 Demo />
orm <F/>
     o kOutsideDemic   <Cl
   Demo />edSearch   <Debounc/>
   emo FetchingD      <Data/>
emo icHooksD  <Bas  >

      </divp>
  ble code!</lean, reusaeapon for cur secret wthey're yoly shines - t reale Reac are wherm hooksng> Custo Tip:</stro Proong>💡><str       <pl>
    </uli>
     y</elfectivs ef hookustom test c How to</strong>ong>Testing:    <li><str    i>
  concerns</lf ion oter separatents and betaner componng> Cle:</stronefitsance Berong>Perform   <li><st>
       /literactions<ng, UI inm handlig, forhinta fetc/strong> DaPatterns:<orld trong>Real-W   <li><s    
   li>ty</functionalix r comple hooks fog multipleininCombstrong> </on:ositing>Hook Comp<li><stro         /li>
 c< logistateful reusable > Buildingion:</strongreatok CCustom Holi><strong>       <    <ul>
       earn:</h2>
 You'll L>🎯 What       <h2x' }}>
 '8perRadius: bord'#f3e5f5', roundColor: ackgg: '20px', b0px', paddin'3Bottom: {{ margine= <div styl  

   ic</h1>Reusable Log - stom Hooks}>Custyles.title<h1 style={  >
    r}.containele={stylesdiv styn (
    <ur ret
  };

  } '30px'
   ttom:arginBo   m',
   10px