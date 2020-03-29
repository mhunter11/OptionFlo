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
    variables: {myUserId: user ? user.id : null},
  })

  useEffect(() => {
    const socket = socketIOClient(process.env.REACT_DATA_SERVER_URL)

    socket.on('all_options', data => setOptions(data))

    socket.on('options', function (data) {
      let newOptionData = options
      newOptionData.unshift(...data)
      setOptions(newOptionData)
    })

    socket.on('clear', function () {
      setOptions([])
    })
  }, [])

  if (loading) {
    return null
  }

  if (!user) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (error) {
    console.error(error)
    return <div>Error!</div>
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

  return (
    <div>
      <div>
        <ul>
          {options.map((data, index) => (
            <FlowList {...data} key={index} />
          ))}
        </ul>
      </div>
    </div>
  )
}
