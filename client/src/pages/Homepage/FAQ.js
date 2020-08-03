import React from 'react'

import {FAQ_TITLE, FAQ_ITEMS} from './faq-data'

import FaqCard from './FaqCard'

import styles from './FAQ.module.scss'

export default function FAQ() {
  return (
    <div className={styles.container}>
      <h2 className={styles.h2}>{FAQ_TITLE}</h2>
      <div className={styles.faq_container}>
        {FAQ_ITEMS.map(item => {
          return <FaqCard answer={item.answer} question={item.question} />
        })}
      </div>
    </div>
  )
}
