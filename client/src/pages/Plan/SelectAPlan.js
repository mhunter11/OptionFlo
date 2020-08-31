import React, {useState, useEffect, useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'

import WhatWeProvide from '../Homepage/WhatWeProvide'
import FAQ from '../Homepage/FAQ'
import PlanCard from './PlanCard'
import Loading from '../../components/Loading'
import useProtectedRoute from '../../util/useProtectedRoute'

import {FirebaseContext} from '../../context/auth'
import {GET_USER_INFO} from '../../util/gql'

import styles from './SelectAPlan.module.scss'

export default function SelectAPlan() {
  useProtectedRoute()
  // const {firebase, currentUser} = useContext(FirebaseContext)
  // const user = currentUser

  // const {loading, error, data} = useQuery(GET_USER_INFO, {
  //   variables: {
  //     myUserId: user ? user.uid : null,
  //   },
  // })

  // if (loading) {
  //   return <Loading />
  // }

  // if (error) {
  //   if (!firebase.user) {
  //     return <Redirect to="/" />
  //   } else {
  //     //Keep loading if we're waiting for a user that is logged in
  //     return <Loading />
  //   }
  // }

  // if (data == null && loading) {
  //   //firebase.auth.signOut(); //Just sign the user out
  //   return <Redirect to="/" />
  // }

  // if (!user && !loading) {
  //   return <Redirect to="/login">Please login</Redirect>
  // }

  // if (!data && !loading) {
  //   return <Redirect to="/" />
  // }

  // if (!data.getUser && !loading) {
  //   return <Redirect to="/login">Please login</Redirect>
  // }

  return (
    <div>
      <div className={styles.bg_color}>
        <WhatWeProvide />
      </div>
      <PlanCard />
      <div className={styles.bg_color}>
        <FAQ />
      </div>
    </div>
  )
}
