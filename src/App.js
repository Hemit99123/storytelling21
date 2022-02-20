import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Home from './components/Home'
import UserPage from './components/UserPage'
import NotFound from "./components/NotFound";
import CommentPage from "./components/CommentPage"

export default function App() {

  return (

    <Router>
    <div>
      <nav>

          <Link to="/">StoryTelling21</Link>


      </nav>

      {/* A <Switch> looks through its children <Route>s and
          renders the first one that matches the current URL. */}
      <Switch>
        <Route exact path="/users/:uid">
          <UserPage/>
        </Route>
        <Route exact path="/">
          <Home />
        </Route>
        <Route exact path="/comments/:id">
          <CommentPage />
        </Route>
        <Route component={NotFound} />
      </Switch>
    </div>
  </Router>
  );
}
