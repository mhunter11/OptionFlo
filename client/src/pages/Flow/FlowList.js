import React from 'react'
import cx from 'classnames'

import {formatTime, formatSentiment} from './FlowListFunction'

import styles from './Flow.module.scss'

export default function FlowList(props) {
  const {
    ticker,
    strike_price,
    date_expiration,
    put_call,
    option_activity_type,
    description,
    sentiment,
    cost_basis,
    onClick,
    updated,
  } = props

  let OPTION_COST = parseInt(cost_basis).toLocaleString('en')
  const REF = description.split('Ref')[1]
  const OI = description.split('vs')[1].split('OI')[0].trim()
  const BUY = description.split('@')[0].split(':')[2]
  const CONTRACT_AND_PRICE = description.split(':')[2].split('vs')[0]
  // const PURPLE_SWEEP =
  //   parseInt(cost_basis) >= 250000 &&
  //   option_activity_type === 'SWEEP' &&
  //   BUY > OI
  const GOLDEN_SWEEP =
    parseInt(cost_basis) >= 1000000 &&
    option_activity_type === 'SWEEP' &&
    BUY > OI
  if (OPTION_COST.length <= 2) {
    OPTION_COST = Number.parseFloat(cost_basis).toFixed(2)
    OPTION_COST = parseInt(OPTION_COST).toLocaleString('en')
  }

  return (
    <div
      className={cx(styles.flow_list, {
        [styles.golden_sweep]: GOLDEN_SWEEP,
        [styles.purple_sweep]: PURPLE_SWEEP,
      })}
    >
      <div className={styles.time}>{formatTime(updated)}</div>
      <div className={styles.ticker} onClick={onClick}>
        {ticker}
      </div>
      <div className={styles.date_expiration}>{date_expiration}</div>
      <div className={styles.strike_price}>{strike_price}</div>
      <div
        className={cx(styles.put_call, {
          [styles.call_green]: put_call === 'CALL',
          [styles.put_red]: put_call === 'PUT',
        })}
      >
        {put_call}
      </div>
      <div className={styles.option_activity_type}>
        {option_activity_type === 'SWEEP' ? 'SWEEP' : 'BLOCK'}
      </div>
      <div className={styles.description}>{CONTRACT_AND_PRICE}</div>
      <div className={styles.sentiment}>{formatSentiment(sentiment)}</div>
      <div className={styles.cost_basis}>${OPTION_COST}</div>
      <div className={styles.OI}>Open Interest: {OI}</div>
      <div>Ref {REF}</div>
    </div>
  )
}
