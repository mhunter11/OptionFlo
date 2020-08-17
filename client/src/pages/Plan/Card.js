import React from 'react'
import {Link} from 'react-router-dom'

import {SUBSCRIPTION_BENEFITS} from './select-a-plan-data'

import CHECKMARK from './images/checkmark.svg'
import STOCK_ICON from './images/optionflow_stock_icon.png'
import OPTIONFLO_ICON from '../../images/optionflo-icon.png'

import styles from './Card.module.scss'

export default function Card(props) {
  const {name, price, frequency, url, billed} = props
  const OPTIONFLO = 'OptionFlo'
  const GET_STARTED = 'Get Started'
  return (
    <div className={styles.card}>
      <img className={styles.image} src={OPTIONFLO_ICON} alt="" />
      <h5 className={styles.h5}>
        {OPTIONFLO} / {name}
      </h5>
      <span className={styles.bill}>{billed}</span>
      <div>
        {SUBSCRIPTION_BENEFITS.map((feature, i) => {
          return (
            <div className={styles.feature_container} key={i}>
              <img src={CHECKMARK} alt="" />
              <span className={styles.span}>{feature}</span>
            </div>
          )
        })}
      </div>
      <div className={styles.price_container}>
        <span className={styles.price_text}>{price}</span>
        <Link to="/subscription" className={styles.buy_now}>
          {GET_STARTED} / {frequency}
        </Link>
      </div>
    </div>
  )
}
