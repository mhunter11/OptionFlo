import React, {useContext, useState} from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import {Redirect} from 'react-router'

import styles from './Login.module.scss'

import {FirebaseContext} from '../../context/auth'
import {useForm} from '../../util/hooks'
import swal from 'sweetalert'

import {
  WELCOME_BACK,
  SIGN_IN_BUTTON,
  SIGN_UP_UPDATES,
  ALREADY_ACCOUNT,
  SIGN_UP,
} from './login-data'

function Register(props) {
  const {firebase} = useContext(FirebaseContext)
  const [errors, setErrors] = useState({})
  const [goHome, setHome] = useState(false)

  const {onChange, onSubmit, values} = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [addUser] = useMutation(REGISTER_USER, {
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values,
  })

  function registerUser() {
    if (values.username === '') {
      swal(
        'Invalid Twitter account',
        'Please enter a valid Twitter account',
        'warning'
      )
      return
    }
    if (values.password !== values.confirmPassword) {
      swal(
        'Mismatched Passwords',
        'The passwords entered do not match, please try again',
        'warning'
      )
      return
    }

    if (!(/\d/.test(values.password) && /[a-zA-Z]/.test(values.password))) {
      swal(
        'Password Requirement',
        'Your password must include at least one letter and one number',
        'error'
      )
      return
    }

    if (values.password.length < 6) {
      swal(
        'Password Requirement',
        'Your password must be at least 6 characters long',
        'error'
      )
      return
    }

    firebase.auth()
      .createUserWithEmailAndPassword(values.email, values.password)
      .then(function (data) {
        let user = data.user
        user.sendEmailVerification()
        values.uid = user.uid
        return user.updateProfile({
          displayName: values.username,
        })
      })
      .then(function () {
        addUser()
        firebase.auth().signOut()
        swal(
          'Created',
          'Your account has been created\nPlease sign in',
          'success'
        )
        setHome(true)
      })
      .catch(function (error) {
        swal(
          'Error',
          'There was an error creating your account\n' + error,
          'error'
        )
      })
  }

  if (goHome) {
    return <Redirect to="/login" />
  }

  return (
    <div className={styles.form_container}>
      <div className={styles.container}>
        <div className={styles.welcome_back_container}>
          <h3 className={styles.h3}>{WELCOME_BACK}</h3>
          <h5 className={styles.h5}>{SIGN_UP_UPDATES}</h5>
          <h5 className={styles.h5}>{ALREADY_ACCOUNT}</h5>
          <Link to="/login" className={styles.sign_up_button}>
            {SIGN_IN_BUTTON}
          </Link>
        </div>
        <div className={styles.form}>
          <h2 className={styles.h2}>{SIGN_UP}</h2>
          <form onSubmit={onSubmit} noValidate className={styles.form_submit}>
            <div className={styles.input_container}>
              <input
                className={styles.input}
                label="Username"
                placeholder="Username"
                name="username"
                type="text"
                value={values.username}
                error={errors.username}
                onChange={onChange}
              />
              <input
                className={styles.input}
                label="Email"
                placeholder="Email"
                name="email"
                type="email"
                value={values.email}
                error={errors.email}
                onChange={onChange}
              />
              <input
                className={styles.input}
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={values.password}
                error={errors.password}
                onChange={onChange}
              />
              <input
                className={styles.input}
                label="Confirm Password"
                placeholder="Confirm Password"
                name="confirmPassword"
                type="password"
                value={values.confirmPassword}
                error={errors.confirmPassword}
                onChange={onChange}
              />
            </div>
            <div className={styles.submit_buttons}>
              <Button type="submit" primary className={styles.primary}>
                Sign Up
              </Button>
            </div>
          </form>
          {Object.keys(errors).length > 0 && (
            <div className="ui error message">
              <ul className="list">
                {Object.values(errors).map(value => (
                  <li key={value}>{value}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

const REGISTER_USER = gql`
  mutation register($uid: String!) {
    register(registerInput: {uid: $uid}) {
      id
      email
      username
      createdAt
    }
  }
`

export default Register
