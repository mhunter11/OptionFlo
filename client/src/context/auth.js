import React, {useReducer, createContext} from 'react'
import * as firebase from "firebase/app";
import "firebase/auth";

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


class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this.auth = firebase.auth();
    this.database = firebase.database();

    this.user = null;
    this.idToken = null;

    this.auth.onAuthStateChanged(this.authStateChanged);
  }

  authStateChanged(newUser) {
    this.user = newUser;

    if (this.user) {
      let self = this;
      this.user.getIdToken(/* forceRefresh */ true).then(function(token) {
        self.idToken = token;
      }).catch(function(error) {
        console.log(error);
        self.idToken = null;
      })
    } else {
      self.idToken = null;
    }
  }
}

const FirebaseContext = createContext({
  firebase: null
});

function FirebaseProvider(props) {
  let firebaseInstance = new Firebase();
  //let firebaseInstance = null;

  return <FirebaseContext.Provider value={{firebase: firebaseInstance}} />
}

export {FirebaseContext, FirebaseProvider, Firebase}
