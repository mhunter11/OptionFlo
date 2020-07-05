import React, {useState} from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'
import {setContext} from 'apollo-link-context'
import {FirebaseContext, Firebase} from './context/auth'
import {ENVIRONMENT} from './env'

const httpLink = createHttpLink({
  uri: ENVIRONMENT.GRAPHQL_URL,
  credentials: ENVIRONMENT.CORS,
})

const firebaseInstance = new Firebase()

const authLink = setContext(async () => {
  let token = await firebaseInstance.user.getIdToken()
  if (token == null) {
    token = localStorage.getItem('firebaseToken')
  }
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
})

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
})

function FirebaseApolloApp(props) {
  const [currentUser, setCurrentUser] = useState(firebaseInstance.user)

  firebaseInstance.onAuthStateChanged = function (newUser) {
    setCurrentUser(newUser)
  }

  return (
    <FirebaseContext.Provider
      value={{firebase: firebaseInstance, currentUser: currentUser}}
    >
      <ApolloProvider client={client}>
        <App />
      </ApolloProvider>
    </FirebaseContext.Provider>
  )
}

export default FirebaseApolloApp
