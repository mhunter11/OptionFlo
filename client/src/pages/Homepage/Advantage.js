import React from 'react'

import {ADVANTAGE_LIST, OPTIONFLO_ADVANTAGE} from './advantage-data'

import styles from './Advantage.module.scss'

var divStyle = {
  marginBottom: '5rem',
}

export default function Advantage() {
  return (
    <div className={styles.bg_color}>
      <div className={styles.container}>
        <h2 className={styles.h5} style={divStyle}>
          {OPTIONFLO_ADVANTAGE}
        </h2>
        <div className={styles.card_container}>
          {ADVANTAGE_LIST.map(data => {
            return (
              <a
                key={data.name}
                className={styles.card}
                href={data.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <img src={data.image} alt={data.name} />
                </div>
                <h5 className={styles.h5}>{data.name}</h5>
                <p className={styles.p}>{data.description}</p>
              </a>
            )
          })}
        </div>
      </div>
    </div>
  )
}
