import React from 'react'
import {Link} from 'react-router-dom'

import {
  PROVIDE_HEADER,
  PROVIDE_DESCRIPTION,
  OPTION_FEATURES,
  OPTIONFLO,
  PRICE_TEXT,
  BUY_NOW,
} from './whatweprovide-data'

import CHECKMARK from './images/checkmark.svg'
import STOCK_ICON from './images/optionflow_stock_icon.png'

import styles from './WhatWeProvide.module.scss'

export default function WhatWeProvide() {
  return (
    <div className={styles.container}>
      <div>
        <h2 className={styles.h2}>{PROVIDE_HEADER}</h2>
        <p className={styles.p}>{PROVIDE_DESCRIPTION}</p>
      </div>
      <div className={styles.card}>
        <img className={styles.image} src={STOCK_ICON} alt="" />
        <h5 className={styles.h5}>{OPTIONFLO}</h5>
        <div>
          {OPTION_FEATURES.map((feature, i) => {
            return (
              <div className={styles.feature_container} key={i}>
                <img src={CHECKMARK} alt="" />
                <span className={styles.span}>{feature}</span>
              </div>
            )
          })}
        </div>
        <div className={styles.price_container}>
          <span className={styles.price_text}>{PRICE_TEXT}</span>
          <Link to="/subscription" className={styles.buy_now}>
            {BUY_NOW}
          </Link>
        </div>
      </div>
    </div>
  )
}
