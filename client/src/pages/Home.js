import React, {useContext} from 'react'
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

export default function Home() {
  const {user} = useContext(AuthContext)
  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.id : null},
  })

  return (
    <div>
      <h1>Home</h1>
    </div>
  )
}
