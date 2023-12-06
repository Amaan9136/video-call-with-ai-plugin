import React, { useState, useRef } from 'react';
import App from './App';
// window.history.replaceState(null, "Meet", "?id=" + firepadRef.key);

export default function Home() {
  const [userName, setUserName] = useState('');
  const inputRef = useRef();

  const handleInputClick = () => {
    const name = inputRef.current.value;
    setUserName(name);
  };

  return (
    <>
      {userName ? (
        <App name={userName} />
      ) : (
        <>
          <input
            type="text"
            placeholder="Enter your name"
            ref={inputRef}
          />
          <button onClick={handleInputClick}>Submit</button>
        </>
      )}
    </>
  );
}
