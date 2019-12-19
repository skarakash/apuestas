import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import EndedEvents from './Components/EndedEvents';
import Inplay from './Components/Inplay/Inplay';
import LoginPage from './Components/Login';


function App() {
  return (
      <Router>
          <div style={{height: '100%'}}>
              <Switch>
                  <Route exact path="/">
                      <LoginPage />
                  </Route>
                  <Route path="/endedevents">
                      <EndedEvents />
                  </Route>
                  <Route path="/inplay">
                      <Inplay />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
