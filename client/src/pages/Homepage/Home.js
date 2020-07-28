import React from 'react'

import Jumbotron from './Jumbotron'
import Advantage from './Advantage'
import WhatWeProvide from './WhatWeProvide'

import styles from './Home.module.scss'

export default function Home() {
  return (
    <div className={styles.bg_color}>
      <Jumbotron />
      <Advantage />
      <WhatWeProvide />
    </div>
  )
}
