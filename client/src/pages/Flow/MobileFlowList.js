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
  getFormattedExpirationDate,
  getContractAndPrice,
  getTickerOnMobile,
  getBidOrAskOrder,
} from './FlowListFunction'

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
    volume,
  } = props

  let OPTION_COST = parseInt(cost_basis).toLocaleString('en')
  const REF = getRef(description)
  const OI = getOI(description)
  const BUY = getBuy(description)
  const CONTRACT_AND_PRICE = getContractPrice(description)
  const BIG_BUY = getBigBuy(BUY)
  const GOLDEN_SWEEP = getGoldenSweep(cost_basis, option_activity_type, BUY, OI)
  if (OPTION_COST.length <= 2) {
    OPTION_COST = Number.parseFloat(cost_basis).toFixed(2)
    OPTION_COST = parseInt(OPTION_COST).toLocaleString('en')
  }

  const isGoldenSweep = GOLDEN_SWEEP && (bidOrAsk === 'A' || bidOrAsk === 'AA')

  const contract = `${getContractAndPrice(
    CONTRACT_AND_PRICE
  ).trim()}${getBidOrAskOrder(description)}`
  const bidOrAsk = getBidOrAskOrder(description)

  const MobileOptionDataFirstRow = [
    {item: 'Strike', result: strike_price},
    {item: 'C/P', result: getTickerOnMobile(put_call)},
    {item: 'Spot', result: REF},
    // {item: 'Type', result: option_activity_type === 'SWEEP' ? 'S' : 'B'},
    // {item: 'price', result: `${REF}`},
  ]
  const MobileOptionDataSecondRow = [
    {
      item: 'Type',
      result: option_activity_type === 'SWEEP' ? 'Sweep' : 'Block',
    },
    {item: ' Contact', result: contract},
    {item: 'OI', result: OI},
  ]

  return (
    <div
      className={cx(styles.mobile_flow_list, {
        [styles.golden_sweep]: isGoldenSweep,
        [styles.big_buy]: BIG_BUY,
      })}
    >
      <div className={styles.space_between}>
        <div className={styles.mobile_time}>{formatTime(updated)}</div>
        <div
          className={cx(styles.mobile_ticker, {
            [styles.mobile_ticker_call]: put_call === 'CALL',
            [styles.mobile_ticker_put]: put_call === 'PUT',
          })}
        >
          {ticker}
        </div>
        <div className={styles.mobile_time}>
          {getFormattedExpirationDate(date_expiration)}
        </div>
      </div>
      <div className={styles.d_flex_space_between}>
        {MobileOptionDataFirstRow.map((data, i) => {
          return <MobileFlowItem {...data} key={i} />
        })}
      </div>
      <div className={styles.d_flex_space_between}>
        {MobileOptionDataSecondRow.map((data, i) => {
          return <MobileFlowItem {...data} key={i} />
        })}
      </div>
    </div>
  )
}

{
  /* <div className={styles.mobile_right_side}>
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
            return <MobileFlowItem {...data} key={i} />
          })}
        </div>
      </div> */
}
