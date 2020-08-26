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

import {
  FLOW_ROW_NAME,
  HEIGHT,
  WIDTH,
  ITEM_SIZE,
  MOBILE_WIDTH,
  MOBILE_HEIGHT,
  MOBILE_ITEM_SIZE,
  CLASSNAME,
} from './flow-data'

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
    <tr
      className={cx(styles.flow_list, {
        [styles.golden_sweep]: isGoldenSweep,
        [styles.big_buy]: BIG_BUY,
      })}
    >
      {updated && <td className={styles.time}>{formatTime(updated)}</td>}
      {date && <td className={styles.time}>{date}</td>}
      <td onClick={onClick}>
        <div className={cx(styles.desktop_ticker, {
          [styles.mobile_ticker_call]: put_call === 'CALL',
          [styles.mobile_ticker_put]: put_call === 'PUT',
        })}>{ticker}</div>
        
      </td>
      <td className={styles.date_expiration}>{date_expiration}</td>
      <td className={styles.strike_price}>{strike_price}</td>
      <td
        className={cx(styles.put_call, {
          [styles.call_green]: put_call === 'CALL',
          [styles.put_red]: put_call === 'PUT',
        })}
      >
        {put_call}
      </td>
      <td className={styles.option_activity_type}>
        {option_activity_type === 'SWEEP' ? 'SWEEP' : 'BLOCK'}
      </td>
      <td className={styles.description}>{contract}</td>
      <td className={styles.cost_basis}>${OPTION_COST}</td>
      <td className={styles.OI}>{OI}</td>
      <td>{REF}</td>
    </tr>
  )
}
