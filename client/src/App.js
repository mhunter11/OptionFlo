import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'

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
import ResetPassword from './pages/Account/ResetPassword'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

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
        <Route exact path="/account" component={Account} />
        <Route exact path="/reset" component={ResetPassword} />
        <Footer />
      </Router>
    </AuthProvider>
  )
}
