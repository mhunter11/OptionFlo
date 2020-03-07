import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import { AuthProvider } from "./context/auth"
// import AuthRoute from './util/AuthRoute'

import MenuBar from './components/MenuBar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import LandingPage from './pages/LandingPage'


import 'semantic-ui-css/semantic.min.css';
import './App.css';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Container>
          <MenuBar />
          <Route exact path="/" component={LandingPage} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/home" component={Home} />
        </Container>
      </Router>
    </AuthProvider>
  );
}
