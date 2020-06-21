import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import * as firebase from 'firebase/app'
import 'firebase/auth'

import {AuthProvider} from './context/auth'
// import AuthRoute from './util/AuthRoute'

import Footer from './components/Footer'
import MenuBar from './components/MenuBar'
import Flow from './pages/Flow/Flow'
import Register from './pages/Account/Register'
import Login from './pages/Account/Login'
import Home from './pages/Homepage/Home'
import LandingPage from './pages/Homepage/LandingPage'
import Subscription from './pages/Subscription/Subscription'
import Account from './pages/Account/Account'
import VerifyEmail from './pages/Account/VerifyEmail'
import ResetPassword from './pages/Account/ResetPassword'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

import {ENVIRONMENT} from './env'

const {
  API,
  APP_ID,
  DB_URL,
  DOMAIN,
  SENDER_ID,
  MEASURE_ID,
} = ENVIRONMENT.FIREBASE_INFO

var firebaseConfig = {
  apiKey: API,
  authDomain: DOMAIN,
  databaseURL: DB_URL,
  projectId: 'optionflo',
  storageBucket: 'optionflo.appspot.com',
  messagingSenderId: SENDER_ID,
  appId: APP_ID,
  measurementId: MEASURE_ID,
}
var firebaseInstance = firebase.initializeApp(firebaseConfig)

export default function App() {
  return (
    <AuthProvider>
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
        <Route
          exact
          path="/reset"
          component={() => <ResetPassword firebase={firebaseInstance} />}
        />
        <Footer />
      </Router>
    </AuthProvider>
  )
}
