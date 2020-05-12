import React from 'react'

import styles from './Menu.module.scss'

export default function Page({children}) {
  return <div className={styles.page_container}>{children}</div>
}
