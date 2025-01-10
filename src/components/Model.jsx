import React, { useState } from 'react';
const Modal=()=>{
  const [isOpen,setIsOpen]=useState(false);
  const handelOpen=()=>{
    setIsOpen(!isOpen);
  }
  return(
    <div>
      <button onClick={handelOpen}>{isOpen ?"close":"open"}</button>
      {isOpen &&<div>
        <h1>hi brother kaise ho</h1>
        <h2>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Aut asperiores blanditiis deleniti quisquam nemo quae, cumque vero optio eligendi nisi itaque? A animi, ipsam consequatur quia deserunt necessitatibus impedit minus?</h2>
        </div>}
    </div>
  )
}

export default Modal;
