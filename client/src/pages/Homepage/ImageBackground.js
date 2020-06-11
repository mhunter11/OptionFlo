import React from 'react'
import {Link} from 'react-router-dom'
import Typed from 'react-typed'

import {
  TYPING_ANIMATION_ARRAY,
  CANCEL_ANYTIME,
  START_TRIAL,
} from './landingpage-data'

import styles from './LandingPage.module.scss'

export default function ImageBackground() {
  return (
    <div className={styles.image_background}>
      <div className={styles.container}>
        <div className={styles.inner_image_background}>
          <h3 className={styles.h3}>
            Most Affordable Real Time{' '}
            <Typed
              className={styles.h3}
              strings={TYPING_ANIMATION_ARRAY}
              typeSpeed={60}
              backSpeed={50}
              loop
            ></Typed>
          </h3>
          <h4 className={styles.h4}>Track & monitor Activity in Real Time</h4>
        </div>
        <div className={styles.header_h5}>
          <h5 className={styles.h5}>{CANCEL_ANYTIME}</h5>
        </div>
        <Link className={styles.btn} to="/subscription">
          {START_TRIAL}
        </Link>
      </div>
    </div>
  )
}
