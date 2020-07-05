import React, {useState, useContext} from 'react'
import {Button, Form} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import swal from 'sweetalert'
import styles from './Login.module.scss'
import {Redirect} from 'react-router'
import {FirebaseContext} from '../../context/auth'

import {useForm} from '../../util/hooks'

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

        if (!data.user.emailVerified) {
          swal(
            'Not Verified',
            'Your account has not been verified. Please check your email for instructions to verify your email.\nIf you just verified your account, try logging out and logging back in.',
            'error'
          )
          firebase.auth.signOut()
          return
        }
        const firebaseId = data.user.uid
        const res = await addFirebaseId({
          variables: {email: values.username, firebaseId},
        })
        console.log(res, values.username, firebaseId)
        setHome(true)
      })
      .catch(function (error) {
        swal('Error', 'An error has occured: "' + error + '"', 'error')
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
      <Form onSubmit={onSubmit} noValidate>
        <h1>Login</h1>
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Password"
          placeholder="Password.."
          name="password"
          type="password"
          value={values.password}
          error={errors.password ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Login
        </Button>
        <Button onClick={resetPassword} secondary>
          Reset Password
        </Button>
      </Form>
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