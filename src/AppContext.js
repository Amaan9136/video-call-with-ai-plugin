import { createContext, useState } from 'react';
import { SyncLoader } from 'react-spinners';

export const AppContext = createContext({
  appState: false,
  setAppState: () => { },
});

export const Loader = ({ message = "Loading..." }) => (
<>
<div className="transparent-background flex-col">
    <SyncLoader color="white" />
    <div className='mt-4'>{message}</div>
  </div>
  </>
);

export function handleSendMail(message) {
  fetch('http://127.0.0.1:5000/send-mail', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ message }),
  })
    .then(response => response.text())
    .then(data => {
      console.log(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

export default function AppContextProvider({ children }) {
  const [appState, setAppState] = useState({
    model: { 
      showModel: false, 
      modelNeedInput: false, 
      modelMsg: '' ,
    modelType: '',
  },
    loaderShow: false,
    calendar: {
      showCalendar: false,
    }
  });

  const AppContextValues = {
    appState,
    setAppState,
  };

  return (
    <AppContext.Provider value={AppContextValues}>
      {children}
    </AppContext.Provider>
  );
}
