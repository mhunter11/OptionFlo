import React, {useState, useContext} from 'react'
import {Link} from 'react-router-dom'
import {Button} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import swal from 'sweetalert'
import styles from './Login.module.scss'
import {Redirect} from 'react-router'
import {FirebaseContext} from '../../context/auth'

import {useForm} from '../../util/hooks'

import {
  WELCOME_BACK,
  SIGN_UP_BUTTON,
  SIGN_UP_UPDATES,
  ALREADY_ACCOUNT,
  SIGN_IN,
} from './login-data'

function Login(props) {
  const {firebase} = useContext(FirebaseContext)

  const [errors] = useState({})

  const [goHome, setHome] = useState(false)

  const {onChange, onSubmit, values} = useForm(loginUserCallback, {
    username: '',
    password: '',
  })

  const [addFirebaseId] = useMutation(GIVE_EXISTING_USERS_FIREBASE_ID, {
    update(_, result) {
      console.log(result)
    },
    onError(err) {
      setHome(true)
      console.log(err)
    },
  })

  function loginUserCallback() {
    firebase.auth
      .signInWithEmailAndPassword(values.username, values.password)
      .then(async function (data) {
        if (data == null) {
          swal('Login Failed', 'Invalid email or password!', 'error')
          return
        }

        // if (!data.user.emailVerified) {
        //   swal(
        //     'Not Verified',
        //     'Your account has not been verified. Please check your email for instructions to verify your email.\nIf you just verified your account, try logging out and logging back in.',
        //     'error'
        //   )
        //   firebase.auth.signOut()
        //   return
        // }

        const firebaseId = data.user.uid
        const res = await addFirebaseId({
          variables: {email: values.username, firebaseId},
        })
        console.log(res, values.username, firebaseId)
        setHome(true)
      })
      .catch(function () {
        swal(
          'Error',
          'Email and password, do not match please try again'
        )
      })
  }

  function resetPassword(e) {
    e.preventDefault()

    if (values.username == '') {
      swal(
        'No Email',
        'You must enter an email to do a password reset',
        'warning'
      )
      return
    }

    swal({
      title: 'Reset Password',
      text:
        'Would you like to send a password reset to ' + values.username + '?',
      icon: 'info',
      buttons: true,
    })
      .then(willReset => {
        if (willReset) {
          return firebase.auth.sendPasswordResetEmail(values.username)
        }
      })
      .then(function () {
        swal(
          'Success',
          'An email has been sent to ' +
            values.username +
            '. Please look for instructions to reset your password.',
          'success'
        )
      })
      .catch(function (error) {
        swal('Error', 'An error has occured: "' + error + '"', 'error')
      })
  }

  if (goHome) {
    return <Redirect to="/" />
  }

  return (
    <div className={styles.form_container}>
      <div className={styles.container}>
        <div className={styles.welcome_back_container}>
          <h3 className={styles.h3}>{WELCOME_BACK}</h3>
          <h5 className={styles.h5}>{SIGN_UP_UPDATES}</h5>
          <h5 className={styles.h5}>{ALREADY_ACCOUNT}</h5>
          <Link to="/register" className={styles.sign_up_button}>
            {SIGN_UP_BUTTON}
          </Link>
        </div>
        <div className={styles.form}>
          <h2 className={styles.h2}>{SIGN_IN}</h2>
          <form onSubmit={onSubmit} noValidate className={styles.form_submit}>
            <div className={styles.input_container}>
              <input
                className={styles.input}
                label="Email"
                placeholder="Email"
                name="username"
                type="text"
                value={values.username}
                error={errors.username ? true : false}
                onChange={onChange}
              />
              <input
                className={styles.input}
                label="Password"
                placeholder="Password"
                name="password"
                type="password"
                value={values.password}
                error={errors.password ? true : false}
                onChange={onChange}
              />
            </div>
            <div className={styles.submit_buttons}>
              <Button type="submit" primary className={styles.primary}>
                Login
              </Button>
              <Button onClick={resetPassword} secondary>
                Reset Password
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

const GIVE_EXISTING_USERS_FIREBASE_ID = gql`
  mutation giveExistingUsersFirebaseId($email: String!, $firebaseId: String!) {
    giveExistingUsersFirebaseId(email: $email, firebaseId: $firebaseId) {
      id
      email
      username
      createdAt
      firebaseId
      type
      stripeId
    }
  }
`

export default Login
