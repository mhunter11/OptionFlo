import React from 'react'

import styles from './Loading.module.scss'

export default function Loading() {
  return (
    <div className={styles.loading_screen}>
      <div className={styles.pacman}></div>
      <div className={styles.dot}></div>
    </div>
  )
}
