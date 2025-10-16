import React, { useState } from "react";

const Calculator = () => {
  const [input, setInput] = useState("");
  const [result, setResult] = useState("");

  const handleClick = (value) => {
    setInput(input + value);
  };

  const clearInput = () => {
    setInput("");
    setResult("");
  };

  const calculateResult = () => {
    try {
      const evalResult = eval(input); // Be cautious with eval; this is a simple demo.
      setResult(evalResult);
    } catch (error) {
      setResult("Error");
    }
  };

  const styles = {
    calculator: {
      width: "300px",
      margin: "50px auto",
      padding: "20px",
      border: "2px solid #ccc",
      borderRadius: "10px",
      backgroundColor: "#f9f9f9",
    },
    display: {
      marginBottom: "20px",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      backgroundColor: "#fff",
      textAlign: "right",
    },
    input: {
      fontSize: "1.5em",
    },
    result: {
      fontSize: "1.2em",
      color: "gray",
    },
    buttons: {
      display: "grid",
      gridTemplateColumns: "repeat(4, 1fr)",
      gap: "10px",
    },
    button: {
      padding: "15px",
      fontSize: "1.2em",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
      backgroundColor: "#007bff",
      color: "white",
    },
    buttonHover: {
      backgroundColor: "#0056b3",
    },
  };

  return (
    <div style={styles.calculator}>
      <div style={styles.display}>
        <div style={styles.input}>{input || "0"}</div>
        <div style={styles.result}>{result}</div>
      </div>
      <div style={styles.buttons}>
        {["7", "8", "9", "4", "5", "6", "1", "2", "3", "0", ".", "+"].map((num) => (
          <button
            key={num}
            style={styles.button}
            onClick={() => handleClick(num)}
          >
            {num}
          </button>
        ))}
        <button style={styles.button} onClick={() => handleClick("-")}>
          -
        </button>
        <button style={styles.button} onClick={() => handleClick("*")}>
          *
        </button>
        <button style={styles.button} onClick={() => handleClick("/")}>
          /
        </button>
        <button style={styles.button} onClick={clearInput}>
          C
        </button>
        <button style={styles.button} onClick={calculateResult}>
          =
        </button>
      </div>
    </div>
  );
};

export default Calculator;
