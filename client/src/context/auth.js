import {createContext} from 'react';
import 'firebase/auth';

const FirebaseContext = createContext({
  firebase: null,
  currentUser: null,
});

export {FirebaseContext};
