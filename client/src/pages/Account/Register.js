import React, {useContext, useState} from 'react'
import cx from 'classnames'
import {Button, Form} from 'semantic-ui-react'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'
import { Redirect } from 'react-router';

import styles from './Register.module.scss'

import {AuthContext} from '../../context/auth'
import {useForm} from '../../util/hooks'
import swal from 'sweetalert';

function Register(props) {
  const firebase = props.firebase;
  const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})
  const [goHome, setHome] = useState(false);

  const {onChange, onSubmit, values} = useForm(registerUser, {
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  })

  const [addUser, {loading}] = useMutation(REGISTER_USER, {
    update(_, {data: {register: userData}}) {
      context.login(userData)
      props.history.push('/')
    },
    onError(err) {
      setErrors(err.graphQLErrors[0].extensions.exception.errors)
    },
    variables: values,
  })

  function registerUser() {
    if (values.password != values.confirmPassword) {
      swal("Mismatched Passwords", "The passwords entered do not match, please try again", "warning");
      return;
    }

    if (!(/\d/.test(values.password) && /[a-zA-Z]/.test(values.password))) {
      swal("Password Requirement", "Your password must include at least one letter and one number", "error");
      return;
    }

    if (values.password.length < 6) {
      swal("Password Requirement", "Your password must be at least 6 characters long", "error");
      return;
    }

    firebase.auth().createUserWithEmailAndPassword(values.email, values.password).then(function(data) {
      let user = data.user;
      user.sendEmailVerification();
      return user.updateProfile({
        displayName: values.username
      });
    }).then(function() {
      swal('Created', "Your account has been created\nPlease check your email for a verification link", "success");
      setHome(true);
    }).catch(function(error) {
      swal("Error", "There was an error creating your account\n" + error, "error");
    });
  }

  if (goHome) {
    return <Redirect to='/' />
  }

  return (
    <div className={styles.form_container}>
      <Form
        onSubmit={onSubmit}
        noValidate
        className={cx(loading ? 'loading' : '', styles.container)}
      >
        <h1>Register</h1>
        <Form.Input
          label="Username"
          placeholder="Username.."
          name="username"
          type="text"
          value={values.username}
          error={errors.username ? true : false}
          onChange={onChange}
        />
        <Form.Input
          label="Email"
          placeholder="Email.."
          name="email"
          type="email"
          value={values.email}
          error={errors.email ? true : false}
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
        <Form.Input
          label="Confirm Password"
          placeholder="Confirm Password.."
          name="confirmPassword"
          type="password"
          value={values.confirmPassword}
          error={errors.confirmPassword ? true : false}
          onChange={onChange}
        />
        <Button type="submit" primary>
          Register
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

const REGISTER_USER = gql`
  mutation register(
    $username: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      registerInput: {
        username: $username
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      id
      email
      username
      createdAt
      token
    }
  }
`

export default Register
