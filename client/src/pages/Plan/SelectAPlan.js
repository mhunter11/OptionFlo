import React from 'react'

import WhatWeProvide from '../Homepage/WhatWeProvide'
import FAQ from '../Homepage/FAQ'
import PlanCard from './PlanCard'

import styles from './SelectAPlan.module.scss'

export default function SelectAPlan() {
  return (
    <div>
      <div className={styles.bg_color}>
        <WhatWeProvide />
      </div>
      <PlanCard />
      <div className={styles.bg_color}>
        <FAQ />
      </div>
    </div>
  )
}
