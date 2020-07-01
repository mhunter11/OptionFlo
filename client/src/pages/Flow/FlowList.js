import React from 'react'
import cx from 'classnames'

import {
  formatTime,
  formatSentiment,
  getRef,
  getOI,
  getContractPrice,
  getGoldenSweep,
  getBuy,
  getBigBuy,
  getBidOrAskOrder,
  getContractAndPrice,
} from './FlowListFunction'

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
  const REF = getRef(description)
  const OI = getOI(description)
  const BUY = getBuy(description)
  const CONTRACT_AND_PRICE = getContractPrice(description)
  const GOLDEN_SWEEP = getGoldenSweep(cost_basis, option_activity_type, BUY, OI)
  if (OPTION_COST.length <= 2) {
    OPTION_COST = Number.parseFloat(cost_basis).toFixed(2)
    OPTION_COST = parseInt(OPTION_COST).toLocaleString('en')
  }
  const BIG_BUY = getBigBuy(BUY)
  const contract = `${getContractAndPrice(
    CONTRACT_AND_PRICE
  ).trim()}${getBidOrAskOrder(description)}`
  return (
    <div
      className={cx(styles.flow_list, {
        [styles.golden_sweep]: GOLDEN_SWEEP,
        [styles.big_buy]: BIG_BUY,
      })}
    >
      <div className={styles.time}>{formatTime(updated)}</div>
      <div
        className={cx(styles.desktop_ticker, {
          [styles.mobile_ticker_call]: put_call === 'CALL',
          [styles.mobile_ticker_put]: put_call === 'PUT',
        })}
        onClick={onClick}
      >
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
      <div className={styles.description}>{contract}</div>
      <div className={styles.cost_basis}>${OPTION_COST}</div>
      <div className={styles.OI}>{OI}</div>
      <div>{REF}</div>
    </div>
  )
}
