import React from 'react'
import cx from 'classnames'

import {
  formatTime,
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
    cost_basis,
    onClick,
    updated,
    date,
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
  const bidOrAsk = getBidOrAskOrder(description)
  const contract = `${getContractAndPrice(
    CONTRACT_AND_PRICE
  ).trim()}${bidOrAsk}`

  const isGoldenSweep = GOLDEN_SWEEP && (bidOrAsk === 'A' || bidOrAsk === 'AA')
  return (
    <div
      className={cx(styles.flow_list, {
        [styles.golden_sweep]: isGoldenSweep,
        [styles.big_buy]: BIG_BUY,
      })}
    >
      {updated && (
        <div className={styles.desktop_row_name}>{formatTime(updated)}</div>
      )}
      {date && <div className={styles.desktop_row_name}>{date}</div>}
      <div className={styles.desktop_row_name} onClick={onClick}>
        <div
          className={cx(styles.desktop_call_put, {
            [styles.mobile_ticker_call]: put_call === 'CALL',
            [styles.mobile_ticker_put]: put_call === 'PUT',
          })}
        >
          {ticker}
        </div>
      </div>
      <div className={styles.desktop_row_name}>{date_expiration}</div>
      <div className={styles.desktop_row_name}>{strike_price}</div>
      <div
        className={cx(styles.desktop_row_name, {
          [styles.call_green]: put_call === 'CALL',
          [styles.put_red]: put_call === 'PUT',
        })}
      >
        {put_call}
      </div>
      <div className={styles.desktop_row_name}>
        {option_activity_type === 'SWEEP' ? 'SWEEP' : 'BLOCK'}
      </div>
      <div className={styles.desktop_row_name}>{contract}</div>
      <div className={styles.desktop_row_name}>${OPTION_COST}</div>
      <div className={styles.desktop_row_name}>{OI}</div>
      <div className={styles.desktop_row_name}>{REF}</div>
    </div>
  )
}
