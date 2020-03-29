import React from 'react'

import SubscriptionCard from './SubscriptionCard'

import {SUBSCRIPTION_BENEFITS} from './subscription-data'

import styles from './Subscription.module.css'

export default function Subscription() {
  return (
    <div className={styles.bg_color}>
      <section>
        <div className={styles.header_container}>
          <h2 className={styles.h2}>Subscribe Now!</h2>
          <h5 className={styles.h5}>
            Test out our Option Flow Unusual Activity for a week before you're
            charged{' '}
            <span className={styles.underline}>
              No commitment. Cancel at anytime!
            </span>
          </h5>
        </div>
        <SubscriptionCard />
      </section>
    </div>
  )
}
