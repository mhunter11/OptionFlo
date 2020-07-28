import React from 'react'

import styles from './FAQ.module.scss'

export default function FaqCard({answer, question}) {
  const [isOpen, setIsOpen] = React.useState(false)
  return (
    <div className={styles.faq_card}>
      <div className={styles.question} onClick={() => setIsOpen(!isOpen)}>
        <h5 className={styles.h5}>{question}</h5>
      </div>
      <div>
        <p className={isOpen ? styles.answer_open : styles.answer}>{answer}</p>
      </div>
    </div>
  )
}
