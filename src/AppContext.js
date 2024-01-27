// get firebase ref from app context and use the same ref everywhere
import { createContext, useState } from 'react';

export const AppContext = createContext({
  appState: {},
  setAppState: () => { },
});

export default function AppContextProvider({ children }) {
  const [hostDetails, setHostDetails] = useState({});
  const [appData, setAppData] = useState({
    transcriptionMsg: '',
    keyPoints: []
  });
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
    appData,
    setAppData
  };

  return (
    <AppContext.Provider value={AppContextValues}>
      {children}
    </AppContext.Provider>
  );
}
