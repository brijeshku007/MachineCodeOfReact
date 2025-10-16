import React, { useReducer, useState } from 'react';

/**
 * useReducer Practice Exercises
 * 
 * Complete these exercises to master useReducer:
 * 1. Bank Account Manager
 * 2. Quiz Application
 * 3. Chat Application
 * 4. Game State Manager
 */

const UseReducerPractice = () => {
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
      backgroundColor: '#9c27b0',
      color: 'white'
    },
    input: {
      padding: '8px',
      margin: '5px',
      border: '1px solid #ddd',
      borderRadius: '4px'
    }
  };

  return (
    <div style={styles.container}>
      <h1>useReducer Practice Exercises</h1>

      {/* Exercise 1: Bank Account Manager */}
      <div style={styles.section}>
        <h2>Exercise 1: Bank Account Manager</h2>
        <p>Create a bank account manager with useReducer:</p>
        <ul>
          <li>Initial state: balance: 1000, transactions: [], accountLocked: false</li>
          <li>Actions: DEPOSIT, WITHDRAW, LOCK_ACCOUNT, UNLOCK_ACCOUNT, VIEW_TRANSACTIONS</li>
          <li>Rules: Can't withdraw more than balance, can't do transactions when locked</li>
          <li>Track all transactions with timestamp and type</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your bank account implementation goes here...

          {/* TODO: Implement bank account reducer and UI */}
          <div style={{ marginTop: '20px' }}>
            <h3>Account Status</h3>
            <p>Balance: $0.00</p>
            <p>Status: Active</p>

            <div>
              <input style={styles.input} type="number" placeholder="Amount" />
              <button style={styles.button}>Deposit</button>
              <button style={styles.button}>Withdraw</button>
              <button style={styles.button}>Lock Account</button>
            </div>

            <h4>Transaction History</h4>
            <div>No transactions yet</div>
          </div>
        </div>
      </div>

      {/* Exercise 2: Quiz Application */}
      <div style={styles.section}>
        <h2>Exercise 2: Quiz Application</h2>
        <p>Build a quiz app with useReducer:</p>
        <ul>
          <li>State: questions, currentQuestion, score, answers, isComplete, timeLeft</li>
          <li>Actions: START_QUIZ, ANSWER_QUESTION, NEXT_QUESTION, FINISH_QUIZ, TICK_TIMER</li>
          <li>Features: Multiple choice questions, timer, score calculation</li>
          <li>Show results at the end with correct/incorrect answers</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your quiz application implementation goes here...

          {/* TODO: Implement quiz reducer and UI */}
          <div style={{ marginTop: '20px' }}>
            <h3>React Quiz</h3>
            <p>Question 1 of 5</p>
            <p>Time left: 30s</p>

            <div>
              <h4>What is React?</h4>
              <div>
                <label><input type="radio" name="answer" /> A database</label><br />
                <label><input type="radio" name="answer" /> A JavaScript library</label><br />
                <label><input type="radio" name="answer" /> A CSS framework</label><br />
                <label><input type="radio" name="answer" /> A web server</label>
              </div>

              <button style={styles.button}>Next Question</button>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 3: Chat Application */}
      <div style={styles.section}>
        <h2>Exercise 3: Chat Application</h2>
        <p>Create a chat app state manager:</p>
        <ul>
          <li>State: messages, users, currentUser, typing, unreadCount</li>
          <li>Actions: SEND_MESSAGE, ADD_USER, REMOVE_USER, SET_TYPING, MARK_READ</li>
          <li>Features: Message timestamps, user status, typing indicators</li>
          <li>Message types: text, system (user joined/left)</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your chat application implementation goes here...

          {/* TODO: Implement chat reducer and UI */}
          <div style={{ marginTop: '20px' }}>
            <h3>Chat Room</h3>
            <div style={{
              height: '200px',
              border: '1px solid #ddd',
              padding: '10px',
              overflowY: 'auto',
              backgroundColor: '#f9f9f9'
            }}>
              <div>No messages yet</div>
            </div>

            <div style={{ marginTop: '10px' }}>
              <input style={{ ...styles.input, width: '200px' }} placeholder="Type a message..." />
              <button style={styles.button}>Send</button>
            </div>

            <div style={{ marginTop: '10px' }}>
              <small>Users online: 1</small>
            </div>
          </div>
        </div>
      </div>

      {/* Exercise 4: Game State Manager */}
      <div style={styles.section}>
        <h2>Exercise 4: Tic-Tac-Toe Game</h2>
        <p>Build a tic-tac-toe game with useReducer:</p>
        <ul>
          <li>State: board (3x3 array), currentPlayer, winner, gameStatus, moveHistory</li>
          <li>Actions: MAKE_MOVE, RESET_GAME, UNDO_MOVE, NEW_GAME</li>
          <li>Features: Win detection, draw detection, move history</li>
          <li>Game modes: Player vs Player, Player vs Computer</li>
        </ul>

        <div style={{ color: '#666', fontStyle: 'italic' }}>
          Your tic-tac-toe game implementation goes here...

          {/* TODO: Implement game reducer and UI */}
          <div style={{ marginTop: '20px' }}>
            <h3>Tic-Tac-Toe</h3>
            <p>Current Player: X</p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 60px)',
              gap: '2px',
              marginBottom: '20px'
            }}>
              {Array(9).fill(null).map((_, i) => (
                <button
                  key={i}
                  style={{
                    width: '60px',
                    height: '60px',
                    fontSize: '24px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white'
                  }}
                >

                </button>
              ))}
            </div>

            <div>
              <button style={styles.button}>New Game</button>
              <button style={styles.button}>Undo Move</button>
            </div>

            <div style={{ marginTop: '10px' }}>
              <h4>Move History</h4>
              <div>No moves yet</div>
            </div>
          </div>
        </div>
      </div>

      <div style={styles.section}>
        <h3>💡 Implementation Tips:</h3>
        <ul>
          <li><strong>Start with State Design:</strong> Define your initial state structure first</li>
          <li><strong>Action Types:</strong> Use constants for action types to avoid typos</li>
          <li><strong>Pure Reducers:</strong> No side effects, always return new state</li>
          <li><strong>Immutable Updates:</strong> Use spread operator for objects and arrays</li>
          <li><strong>Default Case:</strong> Always include default case in switch statements</li>
          <li><strong>Action Creators:</strong> Create helper functions for dispatching actions</li>
        </ul>

        <h3>🎯 Learning Goals:</h3>
        <ul>
          <li>Master complex state management with useReducer</li>
          <li>Understand when useReducer is better than useState</li>
          <li>Practice writing pure reducer functions</li>
          <li>Learn to design action types and payloads</li>
          <li>Handle complex state transitions</li>
        </ul>

        <h3>🧪 Testing Your Reducers:</h3>
        <p>Remember to test your reducers independently:</p>
        <pre style={{
          backgroundColor: '#f8f9fa',
          padding: '10px',
          borderRadius: '4px',
          fontSize: '12px'
        }}>
          {`// Example test
const initialState = { balance: 1000 };
const action = { type: 'DEPOSIT', payload: 500 };
const newState = bankReducer(initialState, action);
expect(newState.balance).toBe(1500);`}
        </pre>
      </div>
    </div>
  );
};

export default UseReducerPractice;