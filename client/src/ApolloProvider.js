import React, {useState} from 'react'
import App from './App'
import ApolloClient from 'apollo-client'
import {InMemoryCache} from 'apollo-cache-inmemory'
import {createHttpLink} from 'apollo-link-http'
import {ApolloProvider} from '@apollo/react-hooks'
import {setContext} from 'apollo-link-context'
import {FirebaseContext} from './context/auth'
import * as firebase from 'firebase/app'
import 'firebase/auth'
import {ENVIRONMENT} from './env'
import Loading from './components/Loading';

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

const httpLink = createHttpLink({
  uri: ENVIRONMENT.GRAPHQL_URL,
  // credentials: ENVIRONMENT.CORS,
})

const authLink = setContext(async () => {
  let token = await firebase.auth().currentUser.getIdToken()
  if (token == null) {
    token = localStorage.getItem('firebaseToken')
  }
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

firebase.initializeApp(firebaseConfig);

function FirebaseApolloApp(props) {
  const auth = firebase.auth();

  const idToken = localStorage.getItem('firebaseToken');
  const [currentUser, setCurrentUser] = useState(auth.currentUser);
  const shouldLoad = (auth.currentUser != null && idToken == null) || (idToken != null && auth.currentUser == null);
  const [isLoading, setIsLoading] = useState(shouldLoad);

  auth.onAuthStateChanged(async function(newUser) {
    if (currentUser != newUser) {
      //Only apply an update if there's a change
      setCurrentUser(newUser);
    }

    try {
      if (newUser != currentUser) {
        localStorage.setItem("is_signin", true);
        setIsLoading(true);
        let token = await newUser.getIdToken();
        localStorage.setItem('firebaseToken', token);
      } else if (newUser == null) {
        localStorage.setItem("is_signin", false);
        localStorage.removeItem('firebaseToken');
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  });

  return (
    <FirebaseContext.Provider
      value={{firebase: firebase, currentUser: currentUser}}
    >
      <ApolloProvider client={client}>
        { 
          isLoading ? <Loading /> : <App />
        }
      </ApolloProvider>
    </FirebaseContext.Provider>
  )
}

export default FirebaseApolloApp
