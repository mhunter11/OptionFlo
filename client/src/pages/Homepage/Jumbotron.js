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
      <div>
        <h1 className={styles.h1}>{AFFORDABLE_HEADER}</h1>
        <h5 className={styles.h5}>{OPTIONFLO_DESCRIPTION}</h5>
        <Link className={styles.btn} to="/subscription">
          {START_TRIAL}
        </Link>
      </div>
      <div>
        <img src={IMAGE} alt="" />
      </div>
    </div>
  )
}
