import React, {useContext} from 'react'
import {Redirect, Link} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation, useQuery} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {GET_USER_INFO} from '../../util/gql'
import {ENVIRONMENT} from '../../env'
import {FirebaseContext} from '../../context/auth'

import styles from './Account.module.scss'

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

export default function Account() {
  const {firebase, currentUser} = useContext(FirebaseContext)
  const user = currentUser
  const {loading, data} = useQuery(GET_USER_INFO, {
    variables: {myUserId: user ? user.uid : null},
  })
  const [changeCreditCard] = useMutation(CHANGE_CREDIT_CARD)

  if (loading) {
    return <div>Loading...</div>
  }

  if (!data && !loading) {
    return <div>data is undefined</div>
  }

  if (!firebase.user) {
    return <Redirect to="/login">Please login</Redirect>
  }

  if (data.getUser.type === 'free' || data.getUser.type === '') {
    return <Redirect to="/subscription">Please subscribe</Redirect>
  }

  return (
    <div>
      {(data.getUser.admin === true) && <Link to="/admin">Admin Panel</Link>}
      <div>{data.getUser.email}</div>
      <div>your current credit card last 4 digits: {data.getUser.ccLast4}</div>
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
    </div>
  )
}
