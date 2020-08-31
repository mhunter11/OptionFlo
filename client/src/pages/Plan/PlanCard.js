import React from 'react'

import {SELECT_A_PLAN, OPTIONFLO_PLANS} from './select-a-plan-data'

import Card from './Card'

import styles from './PlanCard.module.scss'

export default function PlanCard() {
  return (
    <div className={styles.bg_color}>
      <div className={styles.container}>
        <h3 className={styles.h3}>{SELECT_A_PLAN}</h3>
        <h5 className={styles.h5}></h5>
        <div className={styles.plan_container}>
          {OPTIONFLO_PLANS.map((data, i) => {
            return <Card key={i} {...data} />
          })}
        </div>
      </div>
    </div>
  )
}
