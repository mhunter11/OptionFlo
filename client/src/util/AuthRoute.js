import React, {useContext} from 'react'
import {Route, Redirect} from 'react-router-dom'

import {FirebaseContext} from '../context/auth'

function AuthRoute({component: Component, ...rest}) {
  const {user} = useContext(FirebaseContext)

  return (
    <Route
      {...rest}
      render={props => (user ? <Redirect to="/" /> : <Component {...props} />)}
    />
  )
}

export default AuthRoute
