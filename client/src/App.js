import React from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import { AuthProvider } from "./context/auth";
// import AuthRoute from './util/AuthRoute'

import MenuBar from "./components/MenuBar";
import Flow from "./pages/Flow";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import Subscription from "./pages/Subscription";

import "semantic-ui-css/semantic.min.css";
import "./App.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <MenuBar />
        <Route exact path="/" component={LandingPage} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/flow" component={Flow} />
        <Route exact path="/subscription" component={Subscription} />
      </Router>
    </AuthProvider>
  );
}
