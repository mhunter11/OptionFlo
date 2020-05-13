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

function AffordableCard({...props}) {
  return (
    <div className={styles.affordable_card_container}>
      <div className={styles.card_name}>{props.name}</div>
      <div className={styles.card_price}>{props.price}</div>
      <div className={styles.card_discord}>{props.discord}</div>
    </div>
  )
}
