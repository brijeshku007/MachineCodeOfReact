import React, { useState, useRef } from "react";

function StopWatch() {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const persist = useRef(null);

  const start = () => {
    if (!isRunning) {
      setIsRunning(true);
      persist.current = setInterval(() => {
        setTime((prev) => prev + 1);
      }, 1000);
    }
  };

  const stop = () => {
    setIsRunning(false);
    clearInterval(persist.current);
  };

  const reset = () => {
    setIsRunning(false);
    clearInterval(persist.current);
    setTime(0);
  };

  return (
    <div>
      <h1>{time}s</h1>
      <button onClick={start}>Start</button>
      <button onClick={stop}>Stop</button>
      <button onClick={reset}>Reset</button>
    </div>
  );
}

export default StopWatch;
