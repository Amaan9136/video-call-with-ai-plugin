import React, { useRef } from 'react'

export default function Input({setUserName}) {
  const inputRef = useRef();

  const handleInputClick = () => {
    const name = inputRef.current.value;
    setUserName(name);
  };

  return (
    <>
    <input
      type="text"
      placeholder="Enter your name"
      ref={inputRef}
    />
    <button onClick={handleInputClick}>Submit</button>
  </>
  )
}
