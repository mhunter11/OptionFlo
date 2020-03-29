import React, {useContext} from 'react'
import {Link, Redirect} from 'react-router-dom'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {AuthContext} from '../context/auth'

const GET_USER_INFO = gql`
  query getUserInfo($myUserId: String!) {
    getUser(userId: $myUserId) {
      type
      stripeId
      id
      createdAt
      username
      email
    }
  }
`

export default function Account() {
  const {user} = useContext(AuthContext)
  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.id : null},
  })

  if (loading) {
    return null
  }

  if (!data && !loading) {
    return <div>data is undefined</div>
  }

  if (!data.getUser) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (data.getUser.type === 'free' || data.getUser.type === '') {
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  return <div>{data.getUser.email}</div>
}
