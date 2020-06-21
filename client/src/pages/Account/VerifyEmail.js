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
  let mode
  let actionCode

  useEffect(() => {
    mode = getParameterByName('mode')
    actionCode = getParameterByName('oobCode')

    var auth = firebase.auth()

    console.log(mode)
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
          .then(e => {
            swal('Success', 'Your password has successfully changed', 'success')
            console.log(e)

            setResetPassword(true)
          })
          .catch(e => {
            console.log(e)
            swal(
              'Error',
              'Invalid or expired code, please try resetting your passoword again. If you have already reset your password, then no futher action is needed.',
              'error'
            )
          })
        break
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
    return <ResetPassword actionCode={actionCode} firebase={firebase} />
  }
}

export default VerifyEmail
