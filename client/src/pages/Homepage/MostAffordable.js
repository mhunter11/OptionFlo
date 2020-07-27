import React from 'react'

import {Link} from 'react-router-dom'

import {AFFORDABLE_HEADER, START_TRIAL} from './landingpage-data'

import styles from './MostAffordable.module.scss'

export default function MostAffordable() {
  return (
    <div>
      <div>{AFFORDABLE_HEADER}</div>
      <span>
        Amet minim mollit non deserunt ullamco est sit aliqua dolor do amet
        sint. Velit officia consequat duis enim velit mollit. Exercitation
        veniam consequat sunt nostrud amet. duis enim velit mollit. Exercitation
        veniam consequat sunt nostrud amet.
      </span>
      <Link className={styles.btn}>{START_TRIAL}</Link>
    </div>
  )
}
