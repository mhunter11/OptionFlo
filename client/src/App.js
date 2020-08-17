import React from 'react'
import {BrowserRouter as Router, Route} from 'react-router-dom'
import Footer from './components/Footer'
import {Nav} from './components/navigation'
import Flow from './pages/Flow/Flow'
import HistoricalFlow from './pages/Flow/HistoricalFlow'
import Register from './pages/Account/Register'
import Login from './pages/Account/Login'
import Home from './pages/Homepage/Home'
import Subscription from './pages/Subscription/Subscription'
import Account from './pages/Account/Account'
import VerifyEmail from './pages/Account/VerifyEmail'
import ResetPassword from './pages/Account/ResetPassword'
import SelectAPlan from './pages/Plan/SelectAPlan'
import Admin from './pages/Account/Admin'

import 'semantic-ui-css/semantic.min.css'
import './App.css'

export default function App() {
  return (
    <Router>
      <Nav />
      <Route exact path="/" component={Home} />
      <Route exact path="/email" component={VerifyEmail} />
      <Route exact path="/select-a-plan" component={SelectAPlan} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/register" component={Register} />
      <Route exact path="/flow" component={Flow} />
      <Route exact path="/subscription" component={Subscription} />
      <Route exact path="/account" component={Account} />
      <Route exact path="/reset" component={ResetPassword} />
      <Route exact path="/historical-flow" component={HistoricalFlow} />
      <Route exact path="/admin" component={Admin} />
      <Footer />
    </Router>
  )
}
