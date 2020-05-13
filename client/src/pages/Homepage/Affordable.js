import React from 'react'

import {AFFORDABLE_HEADER} from './landingpage-data'

import styles from './Affordable.module.scss'

export default function Affordable() {
  return (
    <div className={styles.affordable_container}>
      <h3 className={styles.h3}>{AFFORDABLE_HEADER}</h3>
    </div>
  )
}
