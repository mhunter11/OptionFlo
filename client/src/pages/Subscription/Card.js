import React from 'react'
import {Link} from 'react-router-dom'

import styles from './Subscription.module.scss'

export default function Card({header, paragraph, buttonChildren, url}) {
  return (
    <div className={styles.card_subscription_container}>
      <h3 className={styles.h3}>{header}</h3>
      <p className={styles.p}>{paragraph}</p>
      {buttonChildren && (
        <Link className={styles.btn} to={url}>
          {buttonChildren}
        </Link>
      )}
    </div>
  )
}
