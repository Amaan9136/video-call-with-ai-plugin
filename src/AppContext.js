// get firebase ref from app context and use the same ref everywhere

import { createContext, useState } from 'react';
import { SyncLoader } from 'react-spinners';

export const AppContext = createContext({
  appState: {},
  setAppState: () => { },
  hostDetails: {},
  setHostDetails: () => { },
});

export const Loader = ({ message = "Loading..." }) => (
  <>
    <div className="transparent-background flex-col">
      <SyncLoader color="white" />
      <div className='mt-4'>{message}</div>
    </div>
  </>
);

export default function AppContextProvider({ children }) {
  const [hostDetails, setHostDetails] = useState({});
  const [appState, setAppState] = useState({
    model: {
      showModel: false,
      modelNeedInput: false,
      modelMsg: '',
      modelType: '',
    },
    loaderShow: false,
    calendar: {
      showCalendar: false,
      calendarDate: '',
    },
    showChatbot: false,
  });

  const AppContextValues = {
    appState,
    setAppState,
    hostDetails,
    setHostDetails,
  };

  return (
    <AppContext.Provider value={AppContextValues}>
      {children}
    </AppContext.Provider>
  );
}
