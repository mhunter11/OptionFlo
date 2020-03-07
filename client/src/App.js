import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'semantic-ui-react'

import MenuBar from './components/MenuBar'
import Home from './pages/Home'
import Register from './pages/Register'
import Login from './pages/Login'
import Homepage from './pages/Homepage'


import 'semantic-ui-css/semantic.min.css';
import './App.css';

export default function App() {
  return (
    <Router>
      <Container>
        <MenuBar />
        <Route exact path="/" component={Home} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/register" component={Register} />
        <Route exact path="/home" component={Homepage} />
      </Container>
    </Router>
  );
}
