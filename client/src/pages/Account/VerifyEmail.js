import React, {useState, useEffect} from 'react'
import swal from 'sweetalert'
import {Redirect} from 'react-router'

import ResetPassword from './ResetPassword'

function getParameterByName(name) {
  name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]')
  var regexS = '[\\?&]' + name + '=([^&#]*)'
  var regex = new RegExp(regexS)
  var results = regex.exec(window.location.href)
  if (results == null) return ''
  else return decodeURIComponent(results[1].replace(/\+/g, ' '))
}

function VerifyEmail(props) {
  let firebase = props.firebase

  const [home, setHome] = useState(false)
  const [signIn, setSignIn] = useState(false)
  const [resetPassword, setResetPassword] = useState(false)

  useEffect(() => {
    var mode = getParameterByName('mode')
    var actionCode = getParameterByName('oobCode')

    var auth = firebase.auth()

    switch (mode) {
      case 'verifyEmail': {
        auth
          .applyActionCode(actionCode)
          .then(() => {
            swal(
              'Success',
              'Your email has successfully been verified',
              'success'
            )

            setSignIn(true)
          })
          .catch(() => {
            swal(
              'Error',
              'Invalid or expired code, please try verifying your email again. If you have already verified your email, then no futher action is needed.',
              'error'
            )

            setHome(true)
          })
        break
      }
      case 'resetPassword': {
        auth
          .verifyPasswordResetCode(actionCode)
          .then(() => {
            swal('Success', 'Your password has successfully changed', 'success')

            setResetPassword(true)
          })
          .catch(() => {
            'Error',
              'Invalid or expired code, please try resetting your passoword again. If you have already reset your password, then no futher action is needed.',
              'error'
          })
      }
    }
  })

  if (home) {
    return <Redirect to="/" />
  } else if (signIn) {
    return <Redirect to="/login" />
  } else if (resetPassword) {
    return <ResetPassword actionCode={actionCode} firebase={firebase} />
  } else {
    return <div></div>
  }
}

export default VerifyEmail
