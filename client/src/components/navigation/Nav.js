import React, {useContext} from 'react'

import {FirebaseContext} from '../../context/auth'

import LargeScreenNav from './LargeScreenNav'
import SmallScreenNav from './SmallScreenNav'

export function Nav() {
  const {firebase, currentUser} = useContext(FirebaseContext)

  const performSignout = () => {
    firebase.auth().signOut()
  }

  const user = currentUser ? true : false
  return (
    <>
      <LargeScreenNav user={user} logout={performSignout} />
      <SmallScreenNav user={user} logout={performSignout} />
    </>
  )
}
