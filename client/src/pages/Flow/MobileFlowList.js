import React from 'react'
import cx from 'classnames'

import {formatTime, formatSentiment} from './FlowListFunction'

import styles from './Flow.module.scss'

import MobileFlowItem from './MobileFlowItem'

export default function MobileFlowList(props) {
  const {
    ticker,
    strike_price,
    date_expiration,
    put_call,
    option_activity_type,
    description,
    cost_basis,
    updated,
  } = props

  let OPTION_COST = parseInt(cost_basis).toLocaleString('en')
  const REF = Number.parseFloat(description.split('Ref=$')[1]).toFixed(2)
  const OI = description.split('vs')[1].split('OI')[0].trim()
  const BUY = description.split('@')[0].split(':')[2]
  const CONTRACT_AND_PRICE = description.split(':')[2].split('vs')[0]
  const GOLDEN_SWEEP =
    parseInt(cost_basis) >= 1000000 &&
    option_activity_type === 'SWEEP' &&
    BUY >= OI
  if (OPTION_COST.length <= 2) {
    OPTION_COST = Number.parseFloat(cost_basis).toFixed(2)
    OPTION_COST = parseInt(OPTION_COST).toLocaleString('en')
  }

  const MobileOptionData = [
    {item: 'Expiration', result: date_expiration},
    {item: 'Strike', result: strike_price},
    {item: 'C/P', result: put_call},
    {item: 'Contact', result: CONTRACT_AND_PRICE},
    {item: 'type', result: option_activity_type === 'SWEEP' ? 'S' : 'B'},
    {item: 'price', result: `$${REF}`},
  ]

  return (
    <div
      className={cx(styles.mobile_flow_list, {
        [styles.golden_sweep]: GOLDEN_SWEEP,
      })}
    >
      <div className={styles.space_between}>
        <div
          className={cx(styles.mobile_ticker, {
            [styles.mobile_ticker_call]: put_call === 'CALL',
            [styles.mobile_ticker_put]: put_call === 'PUT',
          })}
        >
          {ticker}
        </div>
        <div className={styles.mobile_time}>{formatTime(updated)}</div>
      </div>
      <div className={styles.mobile_right_side}>
        <div className={styles.mobile_cost_basis_container}>
          <div
            className={cx(styles.mobile_cost_basis, {
              [styles.mobile_cost_call]: put_call === 'CALL',
              [styles.mobile_cost_put]: put_call === 'PUT',
            })}
          >
            ${OPTION_COST}
          </div>
        </div>
        <div
          className={cx(
            styles.display_flex,
            styles.mobile_option_data_container
          )}
        >
          {MobileOptionData.map((data, i) => {
            return <MobileFlowItem {...data} key={i} />;
          })}
        </div>
      </div>
    </div>
  )
}
