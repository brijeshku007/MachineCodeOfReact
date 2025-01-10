// 6. Create a Tabs Component
// Question: Build a Tabs component where clicking a tab displays its content.

import React, { useState } from 'react';

function Tabs() {
  const [activeTab, setActiveTab] = useState(0);

  const tabs = [
    { title: 'Tab 1', content: 'Content for Tab 1' },
    { title: 'Tab 2', content: 'hi i am tab  2' },
    { title: 'Tab 3', content: 'hello ji i am 3' },
  ];

  return (
    <div>
      <div className="tab-buttons">
        {tabs.map((tab, index) => (
          <button
            key={index}
            onClick={() => setActiveTab(index)}
            style={{
              fontWeight: activeTab === index ? 'bold' : 'normal',
              color:activeTab===index?'pink':'white',
            }}
          >
            {tab.title}
          </button>
        ))}
      </div>
      <div className="tab-content">
        <p>{tabs[activeTab].content}</p>
      </div>
    </div>
  );
}

export default Tabs;

