import React, {useState, useContext} from 'react'
import swal from 'sweetalert'
import {Button, Form} from 'semantic-ui-react'
import {Redirect} from 'react-router'
import {FirebaseContext} from '../../context/auth'
import UserView from '../../components/UserView'
import styles from './Login.module.scss'
import {useForm} from '../../util/hooks'

export default function ResetPassword(props) {
  const [resetPasswordTrue, setResetPasswordTrue] = useState(false)
  const {firebase} = useContext(FirebaseContext);
  const actionCode = props.actionCode

  console.log(firebase)
  // const context = useContext(AuthContext)
  const [errors, setErrors] = useState({})

  const {onChange, onSubmit, values} = useForm(newPasswordCallback, {
    password: '',
    confirmPassword: '',
  })

  function newPasswordCallback() {
    if (values.password != values.confirmPassword) {
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
    if (values.password.length <= 6) {
      swal(
        'Password Requirement',
        'Your password must be at least 6 characters long',
        'error'
      )
      return
    }
    // do firebase stuff
    firebase
      .auth
      .confirmPasswordReset(actionCode, values.password)
      .then(_ => {
        setResetPasswordTrue(true)
        swal("Password Reset", "Your password has been reset, you can now login with your new password", "success");
      })
      .catch(err => {
        swal('Error', 'An error has occured: "' + err + '"', 'error')
      })

    if (resetPasswordTrue) {
      return <Redirect to="/" />
    }
  }

  if (resetPasswordTrue) {
    return <Redirect to="/login" />
  }

  return (
    // <UserView>
      <div className={styles.form_container}>
        <Form onSubmit={onSubmit}>
          <h2>Set up a new password</h2>
          <Form.Input
            label="New Password"
            placeholder="Password"
            name="password"
            type="password"
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Form.Input
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="password"
            value={values.confirmPassword}
            error={errors.confirmPassword ? true : false}
            onChange={onChange}
          />
          <Button type="submit" primary>
            Change
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
    // </UserView>
  )
}
