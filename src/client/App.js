import React from "react";
import Home from "./Home";
import SlideShow from "./SlideShow";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

export default function App() {
  return (
    <Router>
      <Switch>
        <Route path="/slideshow/:username/:gistId">
          <SlideShow />
        </Route>
        <Route path="/">
          <Home />
        </Route>
      </Switch>
    </Router>
  );
}
