import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';


import ShowDataForm from './Components/ShowDataForm';
import Home from './Components/Home';
import AllByDate from './Components/AllByDate';


function App() {
  return (
      <Router>
          <div>
              <nav>
                  <ul>
                      <li>
                          <Link to="/">Home</Link>
                      </li>
                      <li>
                          <Link to="/showDataForm">Show Data Form</Link>
                      </li>
                      <li>
                          <Link to="/byDate">All by date</Link>
                      </li>
                  </ul>
              </nav>

              <Switch>
                  <Route exact path="/">
                      <Home />
                  </Route>
                  <Route path="/showDataForm">
                      <ShowDataForm />
                  </Route>
                  <Route path="/byDate">
                      <AllByDate />
                  </Route>
              </Switch>
          </div>
      </Router>
  );
}

export default App;
