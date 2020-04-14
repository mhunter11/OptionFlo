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

const GET_OPTIONS = gql`
  {
    getOptions {
      ticker
      put_call
      time
      sentiment
      option_symbol
      option_activity_type
      open_interest
      date_expiration
      date
      description
      ask
      cost_basis
      trade_count
    }
  }
`

export default function Flow() {
  const [options, setOptions] = useState([])

  const {user} = useContext(AuthContext)

  const {loading: loadingR, error: errorR, data: dataR} = useQuery(
    GET_USER_INFO,
    {
      variables: {
        myUserId: user ? user.id : null,
      },
    }
  )

  const {loading, error, data} = useQuery(GET_OPTIONS)

  console.log(data)

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

  if (loadingR) {
    return <div>Loading...</div>
  }

  if (errorR) {
    console.error(errorR)
    return <Redirect to="/" />
  }

  if (!user && !loadingR) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (!dataR && !loadingR) {
    return <Redirect to="/" />
  }

  if (!dataR.getUser && !loadingR) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (dataR.getUser.type === 'free' || dataR.getUser.type === '') {
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
