// get firebase ref from app context and use the same ref everywhere
import React, { Suspense, StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./index.css";
import { Provider } from "react-redux";
import { createStore } from "redux";
import { userReducer } from "./store/reducer";
import AppContextProvider, { Loader } from "./AppContext";
import reportWebVitals from "./reportWebVitals";

export const store = createStore(userReducer);
// store has all the values of db
const routes = [
  {
    path: "/",
    component: React.lazy(() => import("./App")),
  },
  {
    path: "/summary",
    component: React.lazy(() => import("./pages/Summary/Summary")),
  },
];

const Root = () => (
  <Router>
    <Provider store={store}>
      <AppContextProvider>
          <Suspense fallback={<Loader />}>
            <Routes>
              {routes.map(({ path, component: Component }) => (
                <Route key={path} path={path} element={<Component />} />
              ))}
            </Routes>
          </Suspense>
      </AppContextProvider>
    </Provider>
  </Router>
);


const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <StrictMode>
    <Root />
  </StrictMode>
);

reportWebVitals();
