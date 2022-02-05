import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './components/Home'
import UserPage from './components/UserPage'

export default function App() {

  return (

    <Router>
    <div>
      <nav>

          <Link to="/">Go Home</Link>


      </nav>

      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route path="/users/:uid">
          <UserPage/>
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </div>
  </Router>
  );
}