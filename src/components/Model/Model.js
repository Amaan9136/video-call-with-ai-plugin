import React, { useContext } from 'react';
import './Model.css';
import { AppContext } from '../../AppContext';

export default function Model({ message, setUserName, inputRef }) {
  const { appState, setAppState } = useContext(AppContext);

  const handleConfirm = () => {
    if (setUserName && inputRef.current.value) {
      const name = inputRef.current.value.trim();
      const isValidInput = /^[a-zA-Z\s]*$/.test(name);
      if (!isValidInput || name === '') {
        console.log("invalid");
        setAppState({
          ...appState,
          model: {
            ...appState.model,
            showModel: true,
            modelNeedInput: false,
            modelMsg: "Enter a valid Name!"
          }
        });
      } else {
        setUserName(name);
        setAppState({ ...appState, model: { ...appState.model, showModel: false } });
      }
    }
  };

  const handleCancel = () => {
    setAppState({ ...appState, model: { ...appState.model, showModel: false } });
  };

  return (
    <div className="transparent-background">
      <div className="model-box from-top bg-gray-800 rounded-lg shadow-md px-8 mb-2 pt-4 font-semibold">
        <div className='message'>
          {message}
        </div>
        {setUserName && (
          <div className='operation'>
            <input
              className="text-[1.2rem] border-gray-700 rounded px-3 py-2 mt-2 outline-none font-normal focus:border-emerald-500 border-[3px] bg-gray-900"
              ref={inputRef}
            />
          </div>
        )}
        <div className={`py-3 flex justify-${appState.model.modelNeedInput ? 'end' : 'center'}`}>
          <button
            className={`text-white border border-white px-4 py-2 rounded ${appState.model.modelNeedInput ? 'mr-4':''} hover:bg-gray-600 hover:border-gray-600`}
            onClick={handleCancel}
          >
            Cancel
          </button>
          {appState.model.modelNeedInput && (
            <button
              onClick={handleConfirm}
              className="bg-emerald-500 border border-emerald-500 px-4 py-2 rounded hover:bg-emerald-700 hover:border-emerald-700 text-white shadow-md"
            >
              Confirm
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
