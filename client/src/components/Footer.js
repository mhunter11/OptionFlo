import React from 'react'
import {Link} from 'react-router-dom'

import styles from './Footer.module.scss'

import NEW_LOGO from './images/OptionFlow_top_Logo.png'

import {SOCIAL_LINK} from './footer-data'

export default function Footer() {
  return (
    <div className={styles.bg_color}>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={NEW_LOGO} alt="OptionFlo Logo" />
        </Link>
        <div className={styles.social_link_container}>
          {SOCIAL_LINK.map(link => {
            if (link.trueLink) {
              return (
                <Link
                  className={styles.social_link}
                  to={link.url}
                  key={link.name}
                >
                  <img className={styles.image} src={link.image} alt="" />
                </Link>
              )
            }
            return (
              <a
                className={styles.social_link}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                key={link.name}
              >
                <img className={styles.image} src={link.image} alt="" />
              </a>
            )
          })}
        </div>
        <div>
          <p>Copyrights &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
