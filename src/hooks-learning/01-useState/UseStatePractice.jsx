import React, { useState } from 'react';

/**
 * useState Practice Exercise
 * 
 * Try to implement these features using useState:
 * 1. Shopping Cart with add/remove items
 * 2. Color picker with preview
 * 3. Multi-step form
 */

const UseStatePractice = () => {
  // TODO: Implement these state variables
  // Hint: Think about what data types you need

  // 1. Shopping Cart State
  // - cart items (array)
  // - total price (number)
  const items = [{ id: 1, name: "Item 1", price: 100 }, { id: 2, name: "Item 2", price: 200 },
  { id: 3, name: "Item 3", price: 300 }, { id: 4, name: "Item 4", price: 400 }];
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);

  //logic to add into the cart 
  const handleAdd = (id) => {
    const selectedItem = items.find(item => item.id === id);
    if (!selectedItem) return;
    const alreadyExists = cartItems.some(item => item.id === selectedItem.id);
    setCartItems(prev => {
      if (alreadyExists) return prev;
      return [...prev, selectedItem];
    });

    // Separate state update (not inside setCartItems)
    setTotalPrice(prev => {
      if (alreadyExists) return prev;
      return (prev + selectedItem.price);
    });
  };

  const removeItem = (id) => {
    const itemToRemove = cartItems.find(item => item.id === id);
    setCartItems(prev => {
      if (!itemToRemove) return prev;
      return prev.filter(item => item.id !== id);
    });
    setTotalPrice(prev => {
      if (!itemToRemove) return prev;
      return (prev - itemToRemove.price);
    })
  };




  const ClearCart = () => {
    setCartItems([])
    setTotalPrice(0)
  }

  // 2. Color Picker State
  // - selected color (string)
  // - color history (array)
  const [selectedColor, setSelectedColor] = useState('');
  const [colorHistory, setColorHistory] = useState([]);
  const Buttons = ["red", "blue", "green", "yellow", "purple"];
  const handleColor = (button) => {
    setSelectedColor(button)
    setColorHistory(prev => [...prev, button])
  }
  const clearHistory = () => {
    setColorHistory([]);
    setSelectedColor('');
  }



  // 3. Multi-step Form State
  // - current step (number)
  // - form data (object)
  // - validation errors (object)
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    street: "",
    city: "",
  });
  const handlechange=(e)=>{
    setFormData(pre=>({...pre,[e.target.id]:e.target.value}))
  }
  const handleSubmit=()=>{
    alert(JSON.stringify(formData));
    setCurrentStep(1);
    setFormData({
      name: "",
      email: "",
      street: "",
      city: "",
    });
  }
  const next=()=>{
    setCurrentStep(pre=>pre+1)
  }
  const back=()=>{
    setCurrentStep(pre=>pre-1);
  }

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '800px',
      margin: '0 auto'
    },
    section: {
      marginBottom: '30px',
      padding: '20px',
      border: '1px solid #ddd',
      borderRadius: '8px'
    },
    button: {
      padding: '8px 16px',
      margin: '5px',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      backgroundColor: '#007bff',
      color: 'white'
    }
  };

  return (
    <div style={styles.container}>
      <h1>useState Practice Exercises</h1>

      {/* Exercise 1: Shopping Cart */}
      <div style={styles.section}>
        <h2>Exercise 1: Shopping Cart</h2>
        <p>Implement a shopping cart with:</p>
        <ul>
          <li>Add items with name and price</li>
          <li>Remove items</li>
          <li>Show total price</li>
          <li>Clear entire cart</li>
        </ul>

        {/* TODO: Implement shopping cart UI */}
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your shopping cart implementation goes here...

          {
            items.map((itme, index) => {
              return <div key={index}>
                <span>{itme.name} - ${itme.price}</span>
                <button style={styles.button} onClick={() => handleAdd(itme.id)} >Add to Cart</button>

              </div>
            })
          }
          <div>
            <span>Total: ${totalPrice}</span>
            <button style={styles.button} onClick={ClearCart}>Clear Cart</button>
            {
              cartItems.length > 0 ? (<div>
                {
                  cartItems.map((item, index) => {
                    return <div key={index}>
                      <span>{item.name}-${item.price}</span>
                      <button onClick={() => removeItem(item.id)}>
                        remove cart item
                      </button>
                    </div>
                  })
                }
              </div>) : (
                <div>
                  No item in the cart
                </div>
              )
            }
          </div>

        </div>
      </div>

      {/* Exercise 2: Color Picker */}
      <div style={styles.section}>
        <h2>Exercise 2: Color Picker</h2>
        <p>Create a color picker that:</p>
        <ul>
          <li>Shows color buttons (red, blue, green, yellow, purple)</li>
          <li>Displays selected color as background</li>
          <li>Keeps history of selected colors</li>
          <li>Allows clearing history</li>
        </ul>

        {/* TODO: Implement color picker UI */}
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your color picker implementation goes here...
          <div style={{ height: "500px", width: "500px", backgroundColor: `${selectedColor}` }}>
            <button onClick={clearHistory}>Clear History</button>
            <div style={{ height: "60px", width: "100%", backgroundColor: "red", display: "flex", justifyItems: "center", alignItems: "center" }} >
              {Buttons.map((button) => {
                return (
                  <button style={{ height: "60px", width: "100px", backgroundColor: `${button}` }}
                    onClick={() => handleColor(button)}
                  >{button}</button>)
              })}
            </div>

          </div>
        </div>
      </div>

      {/* Exercise 3: Multi-step Form */}
      <div style={styles.section}>
        <h2>Exercise 3: Multi-step Form</h2>
        <p>Build a 3-step form:</p>
        <ul>
          <li>Step 1: Personal info (name, email)</li>
          <li>Step 2: Address (street, city, zip)</li>
          <li>Step 3: Review and submit</li>
          <li>Navigation: Next, Previous, Submit buttons</li>
          <li>Form validation</li>
        </ul>

        {/* TODO: Implement multi-step form UI */}
        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your multi-step form implementation goes here...

          <div style={{}}>
            <h1>multi-step form</h1>
            <form action="submit">
             { currentStep===1&&<div>
                <h3>Personal Information</h3>
              <label htmlFor="name">Name</label>
              <input type="text"  id='name' value={formData.name} onChange={(e)=>handlechange(e)}/><br /> <br />
              <label htmlFor="email">Email</label>
              <input type="email"  id='email' value={formData.email} onChange={(e)=>handlechange(e)}/>
              <br /><br />
              <button onClick={next}>next</button>
               </div>
               }
                { currentStep===2 &&<div>
                <h3>Address Information</h3>
              <label htmlFor="street">Street</label>
              <input type="text"  id='street' value={formData.street} onChange={(e)=>handlechange(e)}/><br /> <br />
              <label htmlFor="city">City</label>
              <input type="text"  id='city' value={formData.city} onChange={(e)=>handlechange(e)}/>
              <br /><br />
              <button onClick={back}>Back</button>
              <button onClick={next}>Next</button>
               </div>}
               { currentStep===3&&<div>
                <h3>full Information</h3>
              <label htmlFor="name">Name</label>
              <input type="text"  id='name' disabled value={formData.name}/><br /> <br />
              <label htmlFor="email">Email</label>
              <input type="email"  id='eamil' disabled value={formData.email}/> <br /><br />
              <label htmlFor="street">Street</label>
              <input type="text"  id='street'disabled value={formData.street}/><br /> <br />
              <label htmlFor="city">City</label>
              <input type="text"  id='city' disabled value={formData.city}/>
              <br /><br />
              <button onClick={back}>Back</button>
              <button onClick={handleSubmit}>submit</button>
               </div>
               }
            </form>


          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3>💡 Tips for Practice:</h3>
        <ul>
          <li>Start with defining your state structure</li>
          <li>Think about what data types you need (string, number, array, object)</li>
          <li>Use functional updates when state depends on previous state</li>
          <li>Remember to use spread operator for objects and arrays</li>
          <li>Test your implementation thoroughly</li>
        </ul>
      </div>
    </div>
  );
};

export default UseStatePractice;