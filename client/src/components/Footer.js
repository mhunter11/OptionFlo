import React from 'react'
import {Link} from 'react-router-dom'

import styles from './Footer.module.css'

import LOGO from '../images/logo-02.png'
import TWITTER from '../images/twitter.svg'
import DISCORD from '../images/discord.svg'

export default function Footer() {
  return (
    <div className={styles.bg_color}>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={LOGO} alt="OptionFlo Logo" />
        </Link>
        <ul className={styles.list}>
          <li className={styles.list_item}>Privacy Policy</li>
          <li className={styles.list_item}>Terms of Service</li>
          <li className={styles.list_item}>
            <Link to="/subscription">Subscription</Link>
          </li>
        </ul>
        <div className={styles.logo_container}>
          <a className={styles.icon_link} href="https://twitter.com/OptionFlo">
            <img src={TWITTER} className={styles.icon} alt="Twitter Logo" />
          </a>
          <a href="https://discord.gg/RBVCtV2">
            <img src={DISCORD} className={styles.icon} alt="Discord Logo" />
          </a>
        </div>
        <div>
          <p>Copyrights &copy; 2020</p>
        </div>
      </div>
    </div>
  )
}
