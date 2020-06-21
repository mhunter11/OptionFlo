import React, {useState} from 'react'
import {Button, Form} from 'semantic-ui-react'

import UserView from '../../components/UserView'

import {useForm} from '../../util/hooks'

export default function ResetPassword(props) {
  const firebase = props.firebase
  const actionCode = props.actionCode
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
    firebase.auth().confirmPasswordReset(actionCode, values.password).then((data) => {
      if (data == null) {
        swal('Reset Password Failed', 'Invalid password!', 'error')
          return
      }
    })
  return (
    <UserView>
      <div>
        <Form onSubmit={onSubmit}>
          <h2>Set up a new password</h2>
          <Form.Input
            label="New Password"
            placeholder="Password"
            name="password"
            type="text"
            value={values.password}
            error={errors.password ? true : false}
            onChange={onChange}
          />
          <Form.Input
            label="Confirm Password"
            placeholder="Confirm Password"
            name="confirmPassword"
            type="text"
            value={values.confirmPassword}
            error={errors.confirmPassword ? true : false}
            onChange={onChange}
          />
          <Button type="submit" primary>
            Login
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
    </UserView>
  )
}
