import React, {useReducer, createContext} from 'react'
import * as firebase from "firebase/app";
import "firebase/auth";

import {ENVIRONMENT} from '../env'

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


class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this.auth = firebase.auth();

    this.user = firebase.user;
    this.idToken = localStorage.getItem('firebaseToken');

    //If we don't have a token, but the user is logged in
    if (this.user != null && this.idToken == null) {
      let self = this;
      this.user.getIdToken().then(function(token) {
        if (self.idToken != token) {
          self.idToken = token;
          localStorage.setItem('firebaseToken', token);
        }
      }).catch(function(error) {
        console.log(error);
        self.idToken = null;
      });
    }

    this.authStateChanged = this.authStateChanged.bind(this);

    this.auth.onAuthStateChanged(this.authStateChanged);
    this.onAuthStateChanged = null;

  }

  authStateChanged(newUser) {
    this.user = newUser;

    if (this.user) {
      let self = this;
      this.user.getIdToken().then(function(token) {
        if (self.token != token) {
          self.idToken = token;
          localStorage.setItem('firebaseToken', token);
        }
      }).catch(function(error) {
        console.log(error);
        localStorage.removeItem('firebaseToken')
        self.idToken = null;
      })
    } else {
      this.idToken = null;
      localStorage.removeItem('firebaseToken')
    }

    if (this.onAuthStateChanged != null) {
      this.onAuthStateChanged(newUser);
    }
  }
}

const FirebaseContext = createContext({
  firebase: null,
  currentUser: null
});

function FirebaseProvider(props) {
  let firebaseInstance = new Firebase();

  return <FirebaseContext.Provider value={{firebase: firebaseInstance}} />
}

export {FirebaseContext, FirebaseProvider, Firebase}
