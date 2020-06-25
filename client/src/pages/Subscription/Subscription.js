import React from 'react'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import OPTIONFLO_ICON from '../../images/optionflo-icon.png'
import {ENVIRONMENT} from '../../env'

import Card from './Card'

import {SUBSCRIPTION_BENEFITS, SubscriptionCardData} from './subscription-data'

import styles from './Subscription.module.scss'

export default function Subscription() {
  const [createSub] = useMutation(CREATE_SUBSCRIPTION)
  const MONTHLY_PLAN = '$30 / Monthly Plan'
  return (
    <div className={styles.bg_color}>
      <div className={styles.bg_color_container}>
        <div className={styles.container}>
          <Card {...SubscriptionCardData} />
          <div className={styles.card_subscription_container}>
            <h3 className={styles.h3}>Already sign up?</h3>
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
              stripeKey={ENVIRONMENT.STRIPE_PUBLISHABLE}
              amount={6000}
            >
              <button className={styles.stripe_checkout_button}>
                Pay with Card
              </button>
            </StripeCheckout>
          </div>
        </div>
        <div className={styles.subscription_benefit_list}>
          <div className={styles.monthly_plan}>{MONTHLY_PLAN}</div>
          {SUBSCRIPTION_BENEFITS.map((data, i) => {
            return (
              <li className={styles.list_item} key={i}>
                {data}
              </li>
            )
          })}
        </div>
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
