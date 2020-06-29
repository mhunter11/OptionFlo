import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import * as firebase from 'firebase/app'

import Footer from './components/Footer'
import MenuBar from './components/MenuBar'
import Flow from './pages/Flow/Flow'
import HistoricalFlow from './pages/Flow/HistoricalFlow'
import Register from './pages/Account/Register'
import Login from './pages/Account/Login'
import Home from './pages/Homepage/Home'
import LandingPage from './pages/Homepage/LandingPage'
import Subscription from './pages/Subscription/Subscription'
import Account from './pages/Account/Account'
import Admin from './pages/Account/Admin'
import VerifyEmail from './pages/Account/VerifyEmail'

import 'firebase/auth'
import 'semantic-ui-css/semantic.min.css'
import './App.css'

var firebaseConfig = {
  apiKey: 'AIzaSyAgutAAgyrONuxJ0vx1NeF2f_MXZuDRoVE',
  authDomain: 'optionflo.firebaseapp.com',
  databaseURL: 'https://optionflo.firebaseio.com',
  projectId: 'optionflo',
  storageBucket: 'optionflo.appspot.com',
  messagingSenderId: '670216300705',
  appId: '1:670216300705:web:a23eb05e655d5ee31fa8e0',
  measurementId: 'G-XWZW8XQ52E',
}
var firebaseInstance = firebase.initializeApp(firebaseConfig)

export default function App() {
  return (
    <Router>
      <MenuBar />
      <Route exact path="/" component={LandingPage} />
      <Route exact path="/home" component={Home} />
      <Route
        exact
        path="/email"
        component={() => <VerifyEmail firebase={firebaseInstance} />}
      />
      <Route
        exact
        path="/login"
        component={() => <Login firebase={firebaseInstance} />}
      />
      <Route
        exact
        path="/register"
        component={() => <Register firebase={firebaseInstance} />}
      />
      <Route exact path="/flow" component={Flow} />
      <Route exact path="/subscription" component={Subscription} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/historical-flow" component={HistoricalFlow} />
      <Route exact path="/admin" component={Admin} />
      <Footer />
    </Router>
  )
}
