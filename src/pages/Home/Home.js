import React, { useContext, useEffect, useRef } from 'react';
import Header from '../../components/Header/Header';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faVideo, faKeyboard, faChain } from "@fortawesome/free-solid-svg-icons";
import "./Home.css";
import firepadRef from '../../server/firebase';
import Model from '../../components/Model/Model';
import { AppContext, /* startVideoRecording */ } from '../../AppContext';
import Loader from '../../AppLoader';
import Calendar from 'react-calendar';
import { Link } from 'react-router-dom';

// home to start recording
// meeting footer to stop recording

export default function Home({ setUserName }) {
  const inputRef = useRef(null);
  const joinRef = useRef(null);
  const { appState, setAppState, hostDetails } = useContext(AppContext);
  function handleCalendar() {
    setAppState({
      ...appState,
      calendar: {
        ...appState.calendar,
        showCalendar: !appState.calendar.showCalendar,
      },
    });
  }

  const handleCalendarChange = (selectedDate) => {
    const dateString = selectedDate.toISOString();
    localStorage.setItem('selectedDate', selectedDate);
    setAppState({
      ...appState,
      calendar: {
        showCalendar: !appState.calendar.showCalendar,
        calendarDate: dateString,
      },
      loaderShow: false,
      model: {
        showModel: true,
        modelType: 'date',
        modelMsg: "Date Set Successfully!"
      }
    });
  };

  const handleNewMeeting = () => {
    const name = inputRef.current.value.trim();
    const joinValue = joinRef.current.value.trim();
    const isValidInput = /^[a-zA-Z\s]*$/.test(name);
    if (!isValidInput || name === '') {
      setAppState({
        loaderShow: false,
        model: {
          showModel: true,
          modelNeedInput: false,
          modelMsg: "Enter a valid Name!"
        }
      });
    } else if (joinValue) {
      setAppState({
        loaderShow: false,
        model: {
          showModel: true,
          modelNeedInput: false,
          modelMsg: "You cannot join and host the meeting at same time!"
        }
      });
    } else {
      setAppState({
        loaderShow: false,
        model: {
          showModel: true,
          modelNeedInput: true,
          modelType: 'check-email',
          modelMsg: "Would you like to send a meeting reminder via email? If yes, please provide the description of the email."
        }
      });
      setUserName(name);
    }
    // startVideoRecording();
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
    setAppState({ ...appState, loaderShow: true });
    const joinValue = joinRef.current.value;
    try {
      const snapshot = await firepadRef.root.once('value');
      const allKeys = snapshot.exists() ? Object.keys(snapshot.val()) : [];
      if (allKeys.includes(joinValue)) {
        setAppState(prevState => ({
          ...prevState,
          loaderShow: false,
          model: {
            showModel: true,
            modelNeedInput: true,
            modelType: 'join',
            modelMsg: 'Enter Name to Join Meeting:'
          }
        }));
      } else {
        setAppState(prevState => ({
          ...prevState,
          loaderShow: false,
          model: {
            showModel: true,
            modelNeedInput: false,
            modelMsg: 'Meeting ID is invalid!'
          }
        }));
        joinRef.current.value = '';
      }
    } catch (error) {
      console.error("Error fetching data from Firebase:", error);
      alert("Error fetching data from Firebase. Please check console for details.");
    }
  };


  return (
    <>
      {appState.loaderShow && <Loader message={"Getting Info..."} />}
      {(appState.model.showModel && appState.model.modelNeedInput) ? (
        // model for joiner
        <Model setUserName={setUserName} />
      ) : (
        appState.model.showModel && (
          <Model />
        )
      )}
      {appState.model.showModel && hostDetails.isHost && (
        // send email if host
        <Model />
      )}
      <div className="flex justify-center p-3">
        {appState.calendar && appState.calendar.showCalendar && (
          <Calendar
            className='react-calendar'
            onChange={handleCalendarChange}
            value={appState.calendar.calendarDate || new Date()}
          />
        )}
      </div>
      <div className="home-page">
        <Header handleCalendar={handleCalendar} />
        <div className="body">
          <div className="left-side">
            <div className="content mr-10">
              <h2>Premium video meetings. Now free for everyone.</h2>
              <p>
                We re-engineered the service we built for secure business
                meetings, WeXpert Meet, to make it free and available for all.
              </p>
              <div className="action-btn">
                <div className="input-block">
                  <div className="input-section">
                    <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                    <input
                      ref={inputRef}
                      placeholder="Enter Name to Host"
                    />
                  </div>
                </div>
                <button className="btn" onClick={handleNewMeeting}>
                  <FontAwesomeIcon className="icon-block" icon={faVideo} />
                  New Meeting
                </button>
              </div>
              <div className="action-btn">
                <div className="input-block">
                  <div className="input-section">
                    <FontAwesomeIcon className="icon-block" icon={faKeyboard} />
                    <input
                      ref={joinRef}
                      placeholder="Enter a code or link"
                    />
                  </div>
                </div>
                <button className="btn" onClick={handleJoinClick}>
                  <FontAwesomeIcon className="icon-block" icon={faChain} />
                  Join Meeting
                </button>
              </div>
            </div>
            <div className="help-text">
              <Link to="/">Learn more</Link> about WeXpert-Meet
            </div>
          </div>
          <div className="right-side">
            <div className="content">
              <img src={process.env.PUBLIC_URL + '/assets/meetImg.jpg'} alt="Meet" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
