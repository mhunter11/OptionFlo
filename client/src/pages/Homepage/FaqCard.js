import React from 'react'

import {PLUS_IMAGE_ALT} from './faq-data'

import PLUS_IMAGE from './images/plus.svg'

import styles from './FAQ.module.scss'

export default function FaqCard({answer, question}) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className={styles.faq_card}>
      <div className={styles.question} onClick={() => setIsOpen(!isOpen)}>
        <h5 className={styles.h5}>{question}</h5>
        <img src={PLUS_IMAGE} alt={PLUS_IMAGE_ALT} loading="lazy" />
      </div>
      <div>
        <p className={isOpen ? styles.answer_open : styles.answer}>{answer}</p>
      </div>
    </div>
  )
}
