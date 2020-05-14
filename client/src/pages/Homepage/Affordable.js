import React from 'react'

import {AFFORDABLE_HEADER, COMPETITION_DATA} from './landingpage-data'

import styles from './Affordable.module.scss'

export default function Affordable() {
  return (
    <div className={styles.affordable_container}>
      <h3 className={styles.h3}>{AFFORDABLE_HEADER}</h3>
      <div className={styles.affordable_card}>
        {COMPETITION_DATA.map((data, i) => {
          return <AffordableCard key={i} {...data} />
        })}
      </div>
    </div>
  )
}

function AffordableCard({
  name,
  price,
  discord,
  topTraders,
  optionAlerts,
  orderFlow,
  darkPool,
}) {
  return (
    <div className={styles.affordable_card_container}>
      <div className={styles.card_name}>{name}</div>
      <div className={styles.card_info}>Price: {price}</div>
      <div className={styles.card_info}>{orderFlow}</div>
      <div className={styles.card_info}>{darkPool}</div>
      <div className={styles.card_info}>{discord}</div>
      <div className={styles.card_info}>{topTraders}</div>
      <div className={styles.card_info}>{optionAlerts}</div>
    </div>
  )
}
