import React from 'react'
import swal from 'sweetalert'
import {Link} from 'react-router-dom'
import StripeCheckout from 'react-stripe-checkout'
import {useMutation} from '@apollo/react-hooks'
import gql from 'graphql-tag'

import {SUBSCRIPTION_BENEFITS, SubscriptionCardData} from './select-a-plan-data'
import {ENVIRONMENT} from '../../env'

import CHECKMARK from './images/checkmark.svg'
import STOCK_ICON from './images/optionflow_stock_icon.png'
import OPTIONFLO_ICON from '../../images/optionflo-icon.png'

import styles from './Card.module.scss'

export default function Card(props) {
  const {name, price, frequency, url, billed, intPrice} = props
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
  const OPTIONFLO = 'OptionFlo'
  const GET_STARTED = 'Get Started'
  return (
    <div className={styles.card}>
      <img className={styles.image} src={OPTIONFLO_ICON} alt="" />
      <h5 className={styles.h5}>
        {OPTIONFLO} / {name}
      </h5>
      <span className={styles.bill}>{billed}</span>
      <div>
        {SUBSCRIPTION_BENEFITS.map((feature, i) => {
          return (
            <div className={styles.feature_container} key={i}>
              <img src={CHECKMARK} alt="" />
              <span className={styles.span}>{feature}</span>
            </div>
          )
        })}
      </div>
      <div className={styles.price_container}>
        <span className={styles.price_text}>{price}</span>
        <StripeCheckout
          name={OPTIONFLO}
          currency="USD"
          image={OPTIONFLO_ICON}
          token={async token => {
            const response = await createSub({
              variables: {
                source: token.id,
                ccLast4: token.card.last4,
                subPlan: name,
              },
            })
            const type = response.data.createSubscription.type
            if (type === '') {
              swal(
                `Something went wrong with your payment`,
                `Please try again or contact us at optionflo@gmail.com`,
                'error'
              )
            } else {
              swal(
                `Welcome to the team`,
                `Check out 'flow' and 'Historical Flow on the top nav`,
                'success'
              )
            }
          }}
          stripeKey={ENVIRONMENT.STRIPE_PUBLISHABLE}
          amount={intPrice}
        >
          <button className={styles.stripe_checkout_button}>
            Pay with Card
          </button>
        </StripeCheckout>
        {/* <Link to="/subscription" className={styles.buy_now}>
          {GET_STARTED} / {frequency}
        </Link> */}
      </div>
    </div>
  )
}

const CREATE_SUBSCRIPTION = gql`
  mutation createSubscription(
    $source: String!
    $ccLast4: String!
    $subPlan: String!
  ) {
    createSubscription(source: $source, ccLast4: $ccLast4, subPlan: $subPlan) {
      id
      email
      type
      ccLast4
    }
  }
`
