import React, {useContext, useState, useEffect} from 'react'
import {Redirect} from 'react-router-dom'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import Loading from '../../components/Loading'

import {FirebaseContext} from '../../context/auth'

import {GET_ALL_USERS, GET_USER_INFO} from '../../util/gql'

import styles from './Admin.module.scss'

function ColumnView(props) {
  const [updateUser] = useMutation(UPDATE_USER_TYPE)
  const [updatedType, setUpdatedType] = useState('')
  useEffect(() => {
    setUpdatedType(props.type)
  }, [])
  const updateUserType = e => {
    e.preventDefault()
    updateUser({variables: {username: props.username}})
    if (updatedType === 'standard') {
      return setUpdatedType('')
    } else {
      return setUpdatedType('standard')
    }
  }
  return (
    <div>
      <div className={styles.container}>
        <div className={styles.account_type}>
          <div className={styles.account_content}>Email:</div>
          <div className={styles.account_content}>Username:</div>
          <div className={styles.account_content}>Type:</div>
          <div className={styles.account_content}>stripeId:</div>
          <div className={styles.account_content}>ccLast4:</div>
        </div>
        <div>
          <div className={styles.user_content}>{props.email}</div>
          <div className={styles.user_content}>{props.username}</div>
          <div className={styles.user_content}>{updatedType}</div>
          <div className={styles.user_content}>{props.stripeId}</div>
          <div className={styles.user_content}>{props.ccLast4}</div>
        </div>
      </div>
      <div className={styles.ban_hammer_button}>
        <button onClick={updateUserType}>Update</button>
      </div>
    </div>
  )
}

function AdminView() {
  const {loading, error, data} = useQuery(GET_ALL_USERS)
  const [searchUser, setSearchUser] = useState('')
  const [result, setResult] = useState({})
  const [searchResult, setSearchResult] = useState(false)

  if (loading) {
    return <Loading />
  }

  function filterData(user) {
    if (user.length === 0) {
      return setSearchResult(false)
    }
    const filteredUser = data.getAllUsers.filter(x => x.email === user)
    setResult(filteredUser)
    return setSearchResult(true)
  }
  return (
    <div>
      <div className={styles.button_container}>
        <input
          type="text"
          value={searchUser}
          onChange={e => setSearchUser(e.target.value)}
          onKeyPress={e => (e.key === 'Enter' ? filterData(searchUser) : null)}
          placeholder="Email..."
        />
        <button
          className={styles.button}
          onClick={() => filterData(searchUser)}
        >
          Search
        </button>
      </div>
      {!searchResult &&
        data.getAllUsers.map(user => {
          return (
            <ColumnView
              key={user.username}
              email={user.email}
              username={user.username}
              type={user.type}
              ccLast4={user.ccLast4}
              stripeId={user.stripeId}
            />
          )
        })}
      {searchResult &&
        result.map(user => {
          return (
            <ColumnView
              key={user.username}
              email={user.email}
              username={user.username}
              type={user.type}
              ccLast4={user.ccLast4}
              stripeId={user.stripeId}
            />
          )
        })}
    </div>
  )
}

export default function Admin() {
  const {firebase, currentUser} = useContext(FirebaseContext)
  const user = currentUser;
  const {loading, error, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.id : null},
  })

  if (loading) {
    return <div>Loading...</div>
  }

  if (data.getUser.admin === true) {
    return <AdminView></AdminView>
  }

  return <Redirect to="/" />
}

const UPDATE_USER_TYPE = gql`
  mutation updateUserType($username: String!) {
    updateUserType(username: $username) {
      id
      email
      type
    }
  }
`
