import React from 'react'
import {Link} from 'react-router-dom'

import {HOW_WILL_YOU_BENEFIT, BENEFITS_DATA} from './landingpage-data'

import styles from './LandingPage.module.scss'

export default function Benefit() {
  return (
    <div className={styles.benefit_inner_container}>
      <h3 className={styles.h3}>{HOW_WILL_YOU_BENEFIT}</h3>
      <div className={styles.benefit_container}>
        {BENEFITS_DATA.map((data, index) => {
          return (
            <div className={styles.individual_container} key={index}>
              {!data.trueLink && (
                <a href={data.url}>
                  <img
                    className={styles.benefit_image}
                    src={data.imgSrc}
                    alt=""
                  />
                </a>
              )}
              {data.trueLink && (
                <Link to={data.url}>
                  <img
                    className={styles.benefit_image}
                    src={data.imgSrc}
                    alt=""
                  />
                </Link>
              )}
              <h5 className={styles.h5}>{data.header}</h5>
              <p className={styles.text_p}>{data.text}</p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
