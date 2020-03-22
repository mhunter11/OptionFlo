import React from 'react'

import styles from './Footer.module.css'

import LOGO from '../images/logo-02.png'
import TWITTER from '../images/twitter.svg'
import DISCORD from '../images/discord.svg'

export default function Footer() {
  return (
    <div className={styles.bg_color}>
      <div className={styles.container}>
        <img className={styles.logo} src={LOGO} />
        <ul className={styles.list}>
          <li className={styles.list_item}>Privacy Policy</li>
          <li className={styles.list_item}>Terms of Service</li>
          <li className={styles.list_item}>Subscription</li>
        </ul>
        <div>
          <a href="#">
            <img src={TWITTER} className={styles.icon} />
          </a>
          <a href="#">
            <img src={DISCORD} className={styles.icon} />
          </a>
        </div>
        <div>
          <p>Copyrights &copy; 2020</p>
        </div>
      </div>
    </div>
  )
}
