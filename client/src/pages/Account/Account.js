import React, {useContext} from 'react'
import {Redirect, Link} from 'react-router-dom'
import swal from 'sweetalert'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {GET_USER_INFO} from '../../util/gql'
import {ENVIRONMENT} from '../../env'
import {FirebaseContext} from '../../context/auth'

import Loading from '../../components/Loading'

import styles from './Account.module.scss'

import OPTION_FLO_LOGO from '../../images/optionflo-icon.png'

const CHANGE_CREDIT_CARD = gql`
  mutation changeCreditCard($source: String!, $ccLast4: String!) {
    changeCreditCard(source: $source, ccLast4: $ccLast4) {
      id
      email
      ccLast4
      type
    }
  }
`

const CANCEL_SUBSCRIPTION = gql`
  mutation cancelSubscription {
    cancelSubscription {
      id
      type
    }
  }
`

export default function Account() {
  const {firebase, currentUser} = useContext(FirebaseContext)
  const user = currentUser
  const {loading, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.uid : null},
  })

  const [changeCreditCard] = useMutation(CHANGE_CREDIT_CARD)
  const [cancelSubscription] = useMutation(CANCEL_SUBSCRIPTION)

  if (loading) {
    return <Loading />
  }

  if (!data && !loading) {
    return <div>data is undefined</div>
  }

  if (!firebase.user) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (data.getUser.type === 'free' || data.getUser.type === '') {
    return <Redirect to="/select-a-plan">Please subscribe</Redirect>
  }

  return (
    <div className={styles.account_container}>
      <div className={styles.container}>
        <div className={styles.account_infomation}>
          <div className={styles.logo_div}>
            <img
              className={styles.logo}
              src={OPTION_FLO_LOGO}
              alt="OptionFlo Logo"
            />
          </div>
          <div className={styles.user_info}>
            <div className={styles.user}>{data.getUser.username}</div>
            <div className={styles.email}>{data.getUser.email}</div>
            <div className={styles.user}>
              Credit Card last 4 digits: {data.getUser.ccLast4}
            </div>
            {data.getUser.type === 'standard' && (
              <StripeCheckout
                name="OptionFlo"
                currency="USD"
                token={async token => {
                  const response = await changeCreditCard({
                    variables: {source: token.id, ccLast4: token.card.last4},
                  })
                  console.log(response)
                }}
                stripeKey={ENVIRONMENT.STRIPE_PUBLISHABLE}
                panelLabel="Change card"
              >
                <button className={styles.stripe_checkout_button}>
                  Change credit card
                </button>
              </StripeCheckout>
            )}
          </div>
        </div>

        <div>
          {data.getUser.admin === true && (
            <div className={styles.button_container}>
              <Link className={styles.paid_button} to="/admin">
                Admin Panel
              </Link>
            </div>
          )}
          <div className={styles.user_type}>
            {data.getUser.type === '' && (
              <div className={styles.button_container}>
                <a className={styles.paid_button}>Status: Free User</a>
              </div>
            )}
            {data.getUser.type === 'standard' && (
              <>
                <div className={styles.button_container}>
                  <div className={styles.paid_button}>Status: Paid User</div>
                </div>
                <div className={styles.button_container}>
                  <buttton
                    className={styles.paid_button}
                    onClick={async e => {
                      swal(
                        'Success',
                        'Your subscription has been cancelled',
                        'success'
                      )
                      const response = await cancelSubscription()
                      console.log(response)
                    }}
                  >
                    Cancel Account
                  </buttton>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
