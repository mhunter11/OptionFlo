import React, {useReducer, createContext} from 'react'
import * as firebase from "firebase/app";
import "firebase/auth";

var firebaseConfig = {
  apiKey: "AIzaSyAgutAAgyrONuxJ0vx1NeF2f_MXZuDRoVE",
  authDomain: "optionflo.firebaseapp.com",
  databaseURL: "https://optionflo.firebaseio.com",
  projectId: "optionflo",
  storageBucket: "optionflo.appspot.com",
  messagingSenderId: "670216300705",
  appId: "1:670216300705:web:a23eb05e655d5ee31fa8e0",
  measurementId: "G-XWZW8XQ52E"
};


class Firebase {
  constructor() {
    firebase.initializeApp(firebaseConfig);

    this.auth = firebase.auth();
    this.database = firebase.database();

    this.user = null;

    this.auth.onAuthStateChanged(this.authStateChanged);
  }

  authStateChanged(newUser) {
    this.user = newUser;
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
