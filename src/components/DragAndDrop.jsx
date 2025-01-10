import React, { useState } from 'react';

function DragAndDrop() {
  const [items, setItems] = useState(['Item 1', 'Item 2', 'Item 3', 'Item 4']);
  const [draggingIndex, setDraggingIndex] = useState(null);

  const handleDragStart = (index) => {
    setDraggingIndex(index);
  };

  const handleDragOver = (index) => {
    if (draggingIndex === index) return;

    const newItems = [...items];
    const draggedItem = newItems.splice(draggingIndex, 1)[0];
    newItems.splice(index, 0, draggedItem);

    setDraggingIndex(index);
    setItems(newItems);
  };

  const handleDrop = () => {
    setDraggingIndex(null);
  };

  return (
    <ul>
      {items.map((item, index) => (
        <li
          key={index}
          draggable
          onDragStart={() => handleDragStart(index)}
          onDragOver={(e) => {
            e.preventDefault();
            handleDragOver(index);
          }}
          onDrop={handleDrop}
          style={{
            padding: '8px',
            margin: '4px',
            border: '1px solid #ccc',
            background: draggingIndex === index ? '#f0f0f0' : '#fff',
          }}
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

export default DragAndDrop;
