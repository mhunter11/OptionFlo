import React from 'react'
import {Link} from 'react-router-dom'
import cx from 'classnames'

import {LOGO_ALT, LOGGED_IN, NOT_LOGGED_IN, SIGN_UP} from './nav-data'

import OPTION_FLO_LOGO from '../images/OptionFlow_top_Logo.png'

import styles from './LargeScreenNav.module.scss'

export default function LargeScreenNav({user, logout}) {
  return (
    <nav className={styles.nav_container}>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={OPTION_FLO_LOGO} alt={LOGO_ALT} />
        </Link>
        {user ? (
          <ul className={styles.nav}>
            {LOGGED_IN.map(data => {
              return (
                <li className={styles.logged_in_name} key={data.name}>
                  <Link className={styles.link_white} to={data.url}>
                    {data.name}
                  </Link>
                </li>
              )
            })}
            <li
              className={cx(styles.logged_in_name, styles.link_white)}
              onClick={logout}
            >
              Logout
            </li>
          </ul>
        ) : (
          <ul className={styles.nav}>
            {NOT_LOGGED_IN.map(data => {
              return (
                <li
                  className={cx(styles.logged_out_name, {
                    [styles.sign_up]: data.name === SIGN_UP,
                  })}
                  key={data.name}
                >
                  <Link className={styles.link_white} to={data.url}>
                    {data.name}
                  </Link>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </nav>
  )
}
