import React, { useState } from 'react';

function Accordion() {
  const items = [
    { title: 'Section 1', content: 'Content for section 1' },
    { title: 'Section 2', content: 'Content for section 2' },
    { title: 'Section 3', content: 'Content for section 3' },
  ];
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleIndex = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div>
      {items.map((item, index) => (
        <div key={index}>
          <h3 onClick={() => toggleIndex(index)}>{item.title}</h3>
          {activeIndex === index && <p>{item.content}</p>}
        </div>
      ))}
    </div>
  );
}

export default Accordion;


