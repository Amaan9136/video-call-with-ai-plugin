import React, { useContext, useEffect, useRef, useState } from 'react';
import { AppContext, Loader } from '../../AppContext';
import { handleSendMail, downloadVideo } from '../../server/http';
import './Summary.css';
import Chatbot from '../../components/Chatbot/Chatbot';
import Model from '../../components/Model/Model';

export default function Summary() {
  const { appState, setAppState } = useContext(AppContext);
  const [data, setData] = useState({
    keyPoints: [],
    transcribe: '',
    summary: '',
  });
  const messageRef = useRef(null);
  useEffect(() => {
    const storedKeyPoints = localStorage.getItem('keyPoints');
    if (storedKeyPoints) {
      setData((prevData) => ({
        ...prevData,
        keyPoints: JSON.parse(storedKeyPoints),
      }));
      localStorage.removeItem('keyPoints');
    }

    const storedTranscribe = localStorage.getItem('transcript');
    if (storedTranscribe) {
      setData((prevData) => ({
        ...prevData,
        transcribe: storedTranscribe,
      }));
      localStorage.removeItem('transcript');
    }

    setAppState((prevAppState) => ({
      ...prevAppState,
      loaderShow: true,
    }));

    const loaderTimeout = setTimeout(() => {
      setAppState((prevAppState) => ({
        ...prevAppState,
        loaderShow: false,
      }));
    }, 0);

    return () => {
      clearTimeout(loaderTimeout);
    };
  }, [setAppState]);

  return (
    <>
      {appState.model.showModel && (
        <Model />
      )}
      {appState.loaderShow ? (
        <Loader message="Heading to the Summary Page. Hold tight, we're almost there!" />
      ) : (
        <div className="flex flex-col justify-center items-center min-h-screen text-xl">
          <div ref={messageRef} className="p-10 rounded-xl max-w-screen-xl">
            <h1 className="text-5xl font-semibold mb-3 border-b-2 pb-3">Summary:</h1>
            {data.keyPoints.length !== 0 && (
              <div className="mb-3 border-b-2 pb-3">
                <h1 className="text-3xl text-lg font-semibold mb-1">Key Points Discussed:</h1>
                <ul>
                  {data.keyPoints.map((point, index) => (
                    <li className="list-disc ml-5" key={index}>
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {data.transcribe && (
              <div className="mb-3 border-b-2 pb-3 border-gray-300">
                <h1 className="text-3xl text-lg font-semibold mb-1">Transcribed Data:</h1>
                {data.transcribe}
              </div>
            )}
            <div className="mb-3 border-b-2 pb-3">
              <h1 className="text-3xl text-lg font-semibold mb-1">Brief Description:</h1>
              A key focus of the kickoff meeting is addressing potential ambiguities in process implementations, with the project lead providing clarity. Legal considerations, such as permissions for specific project activities, are discussed to prevent complications later in the project timeline. For instance, issues like testing a car on city roads may arise, and addressing these legal aspects during the kickoff meeting helps avoid unplanned delays in project implementation.
            </div>
            <div className="flex gap-5 mt-3">
              <button className="btn" onClick={() => { handleSendMail(setAppState, "The Meeting Was Ended", messageRef.current.innerHTML); }}>Send Summary as Email</button>
              <button className="btn" onClick={() => { downloadVideo(setAppState); }}>Download Session Video</button>
              <button className="btn" onClick={() => { setAppState(prevState => ({ ...prevState, showChatbot: !prevState.showChatbot })); }}>{appState.showChatbot ? 'Close' : 'Open'} Chatbot</button>
            </div>
          </div>
          {appState.showChatbot && <Chatbot />}
        </div>
      )}
    </>
  );
}
