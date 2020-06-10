import React, {useState} from 'react'
import {Link} from 'react-router-dom'
import cx from 'classnames'
import Logo from '../logo-02.png'

import styles from './Menu.module.scss'

export default function MobileMenu(props) {
  const [openMenu, setOpenMenu] = useState(false)
  return (
    <div className={cx(styles.container_menu)}>
      <div className={styles.mobile_menu}>
        <div>
          <Link to="/">
            <img className={styles.logo} src={Logo} alt="logo" />
          </Link>
        </div>
        <div>
          <button
            className={cx(styles.hamburger_button, styles.js_menu, {
              [styles.active]: openMenu === true,
            })}
            type="button"
            onClick={() => setOpenMenu(!openMenu)}
          >
            <span className={styles.bar}></span>
          </button>
        </div>
      </div>
      {openMenu && (
        <ul className={styles.list}>
          {props.data.map(item => {
            if (item.url) {
              return (
                <li
                  key={item.name}
                  className={styles.list_item}
                  onClick={() => setOpenMenu(false)}
                >
                  <Link className={styles.menu_link} to={item.url}>
                    {item.name}
                  </Link>
                </li>
              )
            }

            return (
              <li
                key={item.name}
                onClick={item.onClick}
                className={styles.list_item}
              >
                {item.name}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
