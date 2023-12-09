import React, { useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faKeyboard, faChain } from "@fortawesome/free-solid-svg-icons";
import "./Home.scss";
import firepadRef from '../../server/firebase';

export default function Input({ setUserName }) {
  const inputRef = useRef();
  const joinRef = useRef();

  const handleInputClick = () => {
    const name = inputRef.current.value;
    const joinValue = joinRef.current.value;
    if (joinValue){
      alert("You cannot join and host at the same time!");
      return;
    }
    setUserName(name);
  };

  const urlParams = new URLSearchParams(window.location.search);
  const joinKey = urlParams.get("id");
  useEffect(() => {
    if (joinKey) {
      joinRef.current.value = joinKey;
    }
    window.history.replaceState(null, "Meet", window.location.pathname);
  }, [joinKey]);

  const handleJoinClick = async () => {
    try {
      const joinValue = joinRef.current.value;
      const snapshot = await firepadRef.root.once('value');
      const allKeys = snapshot.exists() ? Object.keys(snapshot.val()) : [];
      if (allKeys.includes(joinValue)) {
        const name = prompt("Enter Name to Join Meeting");
        setUserName(name);
      } else {
        alert("Meeting ID is invalid!");
        joinRef.current.value='';
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      alert("Error fetching data from Firebase. Please check console for details.");
    }
  };

  return (
    <>
      <div className="home-page">
        <Header>
          <div className="action-btn">
            <div className="input-block">
              <div className="input-section">
                <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                <input ref={inputRef} placeholder="Enter Name to Host" />
              </div>
            </div>
            <button className="btn" onClick={handleInputClick}>
              <FontAwesomeIcon className="icon-block" icon={faVideo} />
              New Meeting
            </button>
          </div>
          <div className="action-btn">
            <div className="input-block">
              <div className="input-section">
                <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                <input ref={joinRef} placeholder="Enter a code or link" />
              </div>
            </div>
            <button className="btn" onClick={handleJoinClick}>
              <FontAwesomeIcon className="icon-block" icon={faChain} />
              Join Meeting
            </button>
          </div>
        </Header>
      </div>
    </>
  );
}
