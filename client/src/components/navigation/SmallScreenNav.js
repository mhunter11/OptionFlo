import React from 'react'
import {Link} from 'react-router-dom'
import cx from 'classnames'

import {LOGO_ALT, LOGGED_IN, NOT_LOGGED_IN, SIGN_UP} from './nav-data'

import OPTION_FLO_LOGO from '../images/OptionFlow_top_Logo.png'

import styles from './SmallScreenNav.module.scss'

export default function SmallScreenNav({user, logout}) {
  const [active, setActive] = React.useState(null)
  return (
    <nav className={styles.nav_container}>
      <div className={styles.container}>
        <Link to="/">
          <img className={styles.logo} src={OPTION_FLO_LOGO} alt={LOGO_ALT} />
        </Link>
        <div className={styles.hamburger} onClick={() => setActive(!active)}>
          <label htmlFor="b">
            <div
              className={cx(styles.bar__element, {[styles.one]: active})}
            ></div>
            <div
              className={cx(styles.bar__element, {[styles.two]: active})}
            ></div>
            <div
              className={cx(styles.bar__element, {[styles.three]: active})}
            ></div>
          </label>
        </div>
      </div>
      {user ? (
        <div>
          {active && (
            <ul className={styles.list}>
              {LOGGED_IN.map(data => {
                return (
                  <li
                    className={styles.logged_in_name}
                    key={data.name}
                    onClick={() => setActive(false)}
                  >
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
          )}
        </div>
      ) : (
        <div>
          {active && (
            <ul className={styles.list}>
              {NOT_LOGGED_IN.map(data => {
                return (
                  <li
                    className={cx(styles.logged_out_name, {
                      [styles.sign_up]: data.name === SIGN_UP,
                    })}
                    key={data.name}
                    onClick={() => setActive(false)}
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
      )}
    </nav>
  )
}
