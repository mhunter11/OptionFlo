import React, { useState } from 'react'
import cx from 'classnames'

import WhatWeProvide from '../Homepage/WhatWeProvide'
import FAQ from '../Homepage/FAQ'
import Card from './Card'
import useProtectedRoute from '../../util/useProtectedRoute'

import {DISCOUNT_MONTHLY_PLAN} from './select-a-plan-data'

import styles from './SelectAPlan.module.scss'

import styles_2 from './PlanCard.module.scss'


export default function SalePlan() {
  useProtectedRoute()

  return (
    <div className={styles.bg_color}>
      <div className={styles_2.sale_container}>
        <Card {...DISCOUNT_MONTHLY_PLAN} />
      </div>
      <div className={styles.bg_color}>
        <FAQ />
      </div>
    </div>
  )
}
