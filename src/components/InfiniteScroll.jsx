import React, { useEffect, useState } from 'react';

function InfiniteScroll() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100
      ) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const loadMore = () => {
    if (items.length >= 100) {
      setHasMore(false);
      return;
    }
    setTimeout(() => {
      setItems((prev) =>
        prev.concat(Array.from({ length: 20 }, (_, i) => `Item ${prev.length + i + 1}`))
      );
    }, 1000);
  };

  return (
    <div>
      <ul>
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
      {hasMore && <p>Loading more...</p>}
    </div>
  );
}

export default InfiniteScroll;
