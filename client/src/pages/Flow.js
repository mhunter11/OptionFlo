import React, {useState, useEffect, useContext} from 'react'
import {Link, Redirect} from 'react-router-dom'
import socketIOClient from 'socket.io-client'
import {useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {AuthContext} from '../context/auth'

import FlowList from './FlowList'

// import styles from './Flow.module.css'

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

export default function Flow() {
  const [options, setOptions] = useState([])

  const {user} = useContext(AuthContext)

  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {
      myUserId: user ? user.id : null,
    },
  })

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_APP_DATA_SERVER_URL)

    socket.on('all_options', function (data) {
      setOptions(options => [...data, ...options])
    })

    socket.on('options', function (data) {
      setOptions(options => [...data, ...options])
    })

    socket.on('clear', function () {
      setOptions([])
    })
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    console.error(error)
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
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  console.log(options)
  return (
    <div>
      <ul>
        {options.map((data, index) => (
          <FlowList {...data} key={index} />
        ))}
      </ul>
    </div>
  )
}
