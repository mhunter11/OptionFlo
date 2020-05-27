import React from 'react'
import cx from 'classnames'

import {formatTime, formatSentiment} from './FlowListFunction'

import styles from './Flow.module.scss'

export default function MobileFlowList(props) {
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
    volume,
  } = props

  let OPTION_COST = parseInt(cost_basis).toLocaleString('en')
  const REF = description.split('Ref')[1]
  const OI = description.split('vs')[1].split(';')[0].split('OI')[0].trim()
  const CONTRACT_AND_PRICE = description.split(':')[2].split('vs')[0]
  const GOLDEN_SWEEP =
    parseInt(cost_basis) >= 1000000 &&
    option_activity_type === 'SWEEP' &&
    volume > OI
  if (OPTION_COST.length <= 2) {
    OPTION_COST = Number.parseFloat(cost_basis).toFixed(2)
    OPTION_COST = parseInt(OPTION_COST).toLocaleString('en')
  }

  return (
    <div
      className={cx(styles.mobile_flow_list, {
        [styles.golden_sweep]: GOLDEN_SWEEP,
      })}
    >
      <div className={styles.display_flex}>
        <div className={styles.mobile_time}>{formatTime(updated)}</div>
      </div>
      <div className={styles.display_flex}>
        <div
          className={cx(styles.mobile_ticker, {
            [styles.mobile_ticker_call]: put_call === 'CALL',
            [styles.mobile_ticker_put]: put_call === 'PUT',
          })}
          onClick={onClick}
        >
          {ticker}
        </div>
        <div className={styles.mobile_cost_basis}>${OPTION_COST}</div>
      </div>
      <div className={cx(styles.display_flex, styles.mobile_lower_section)}>
        <div className={styles.mobile_date_expiration}>{date_expiration}</div>
        <div className={styles.mobile_strike_price}>{strike_price}</div>
        <div
          className={cx(styles.mobile_put_call, {
            [styles.call_green]: put_call === 'CALL',
            [styles.put_red]: put_call === 'PUT',
          })}
        >
          {put_call}
        </div>
        <div className={styles.mobile_option_activity_type}>
          {option_activity_type === 'SWEEP' ? 'S' : 'B'}
        </div>
        <div className={styles.mobile_description}>{CONTRACT_AND_PRICE}</div>
        <div className={styles.mobile_sentiment}>
          {formatSentiment(sentiment)}
        </div>
        <div>Ref {REF}</div>
      </div>
    </div>
  )
}
