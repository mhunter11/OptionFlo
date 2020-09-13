import React, {useContext} from 'react'
import {Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'

import Loading from './Loading'

import {GET_USER_INFO} from '../util/gql'
import {FirebaseContext} from '../context/auth'

import styles from './UserView.module.scss'

export default function UserView({children}) {
  const {firebase} = useContext(FirebaseContext)
  const user = firebase.user;
  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {
      myUserId: user ? user.uid : null,
    },
  })

  if (loading) {
    return <Loading />
  }

  if (error) {
    return <Redirect to="/" />
  }

  if (!user && !loading) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (!data && !loading) {
    return <Redirect to="/" />
  }

  if (!data.getUser && !loading) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (data.getUser.type === 'free' || data.getUser.type === '') {
    return <Redirect to="/select-a-plan">Please subscribe</Redirect>
  }
  return <div className={styles.container}>{children}</div>
}
