import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';


import ShowDataForm from './Components/ShowDataForm';
import Home from './Components/Home';
import AllByDate from './Components/AllByDate';
import Inplay from './Components/Inplay';


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
                          <Link to="/byDate">All by date</Link>
                      </li>
                      <li>
                          <Link to="/inplay">Inplay</Link>
                      </li>
                  </ul>
              </nav>

              <Switch>
                  <Route path="/showDataForm">
                      <ShowDataForm />
                  </Route>
                  <Route path="/byDate">
                      <AllByDate />
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
