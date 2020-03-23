import React from 'react'

import styles from './Flow.module.css'

export default function FlowList(props) {
  const {
    time,
    ticker,
    strike_price,
    date_expiration,
    put_call,
    option_activity_type,
    description,
    sentiment,
    cost_basis,
  } = props

  const OPTION_COST = parseInt(cost_basis).toLocaleString('en')
  console.log(cost_basis)
  return (
    <div className={styles.flow_list}>
      <div className={styles.time}>{time}</div>
      <div className={styles.ticker}>{ticker}</div>
      <div className={styles.date_expiration}>{date_expiration}</div>
      <div className={styles.strike_price}>{strike_price}</div>
      <div className={styles.put_call}>{put_call}</div>
      <div className={styles.option_activity_type}>{option_activity_type}</div>
      <div className={styles.description}>{description}</div>
      <div className={styles.sentiment}>{sentiment}</div>
      <div className={styles.cost_basis}>${OPTION_COST}</div>
    </div>
  )
}
