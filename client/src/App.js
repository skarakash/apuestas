import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";

import ShowDataForm from './Components/ShowDataForm';
import Home from './Components/Home';


function App() {
  return (
      <Router>
          <div>
              <nav>
                  <ul>
                      <li>
                          <Link to="/showDataForm">Show Data Form</Link>
                      </li>
                      <li>
                          <Link to="/">Home</Link>
                      </li>
                  </ul>
              </nav>

              <Switch>
                  <Route path="/showDataForm">
                      <ShowDataForm />
                  </Route>
                  <Route path="/">
                      <Home />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
