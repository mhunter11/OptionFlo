import React from 'react'
import {Link} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import OPTIONFLO_ICON from '../images/optionflo-icon.png'

import styles from './Subscription.module.css'

import {SUBSCRIPTION_BENEFITS} from './subscription-data'

export default function SubscriptionCard() {
  const [createSub] = useMutation(CREATE_SUBSCRIPTION)
  return (
    <div className={styles.container}>
      <div className={styles.card_container}>
        <div className={styles.content}>
          <h3 className={styles.h3}>$60 / Monthly Plan</h3>
          <Link to="/register" className={styles.button}>
            Sign up!
          </Link>
        </div>
        <div>
          {SUBSCRIPTION_BENEFITS.map((data, i) => {
            return (
              <li className={styles.list_item} key={i}>
                {data}
              </li>
            )
          })}
        </div>
        <h6 className={styles.h6}>Already sign up subscribe!</h6>
        <StripeCheckout
          name="OptionFlo"
          currency="USD"
          image={OPTIONFLO_ICON}
          token={async token => {
            const response = await createSub({
              variables: {source: token.id},
            })
            console.log(response)
          }}
          stripeKey={process.env.REACT_APP_STRIPE_PUBLISHABLE}
          amount={6000}
        />
      </div>
    </div>
  )
}

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription($source: String!) {
    createSubscription(source: $source) {
      id
      email
      type
    }
  }
`
