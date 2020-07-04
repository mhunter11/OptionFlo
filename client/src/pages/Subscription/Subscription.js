import React from 'react'
import swal from 'sweetalert'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import OPTIONFLO_ICON from '../../images/optionflo-icon.png'
import {ENVIRONMENT} from '../../env'

import Card from './Card'

import {SUBSCRIPTION_BENEFITS, SubscriptionCardData} from './subscription-data'

import styles from './Subscription.module.scss'

export default function Subscription(props) {
  const [createSub] = useMutation(CREATE_SUBSCRIPTION, {
    update(_, result) {
      props.history.push('/flow')
    },
    onError(err) {
      swal(
        `Something went wrong`,
        `Message Mel on discord with the following error, ${JSON.stringify(
          err
        )}`,
        'error'
      )
    },
  })
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
                  variables: {source: token.id, ccLast4: token.card.last4},
                })
                swal(
                  `Welcome to the team`,
                  `Check out 'flow' and 'Historical Flow on the top nav`,
                  'success'
                )
                console.log(response)
              }}
              stripeKey={ENVIRONMENT.STRIPE_PUBLISHABLE}
              amount={3000}
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
  mutation createSubscription($source: String!, $ccLast4: String!) {
    createSubscription(source: $source, ccLast4: $ccLast4) {
      id
      email
      type
      ccLast4
    }
  }
`
