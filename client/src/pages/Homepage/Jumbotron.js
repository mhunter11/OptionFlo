import React from 'react'
import {Link} from 'react-router-dom'

import {
  AFFORDABLE_HEADER,
  OPTIONFLO_DESCRIPTION,
  START_TRIAL,
} from './landingpage-data'

import IMAGE from './images/Group.svg'

import styles from './Jumbotron.module.scss'

export default function Jumbotron() {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.h1}>{AFFORDABLE_HEADER}</h1>
        <p className={styles.p}>{OPTIONFLO_DESCRIPTION}</p>
        <Link className={styles.btn} to="/subscription">
          {START_TRIAL}
        </Link>
      </div>
      <div>
        <img className={styles.image} src={IMAGE} alt="" />
      </div>
    </div>
  )
}
