import React, {useContext, useState} from 'react'
import cx from 'classnames'
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Logo from '../logo-02.png'

import {AuthContext} from '../context/auth'

import styles from './Menu.module.scss'

export default function MenuBar() {
  const {user, logout} = useContext(AuthContext)
  const pathname = window.location.pathname

  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const [activeItem, setActiveItem] = useState(path)
  const [openMenu, setOpenMenu] = useState(false)

  const handleItemClick = (e, {name}) => setActiveItem(name)
  const MENU_BAR_DATA = [
    {name: 'Flow', url: '/flow'},
    {name: 'Account', url: '/account'},
    {name: 'Logout', onClick: logout},
  ]
  const menuBar = user ? (
    <div className={styles.container_menu}>
      <div className={styles.menu}>
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
          {MENU_BAR_DATA.map(item => {
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
  ) : (
    <>
      <Menu
        pointing
        secondary
        size="massive"
        color="teal"
        className={styles.menu_bar}
      >
        <Link to="/">
          <img className={styles.logo} src={Logo} alt="logo" />
        </Link>
        <Menu.Menu position="right">
          <Menu.Item
            name="login"
            active={activeItem === 'login'}
            onClick={handleItemClick}
            as={Link}
            to="/login"
          />
          <Menu.Item
            name="register"
            active={activeItem === 'register'}
            onClick={handleItemClick}
            as={Link}
            to="/register"
          />
        </Menu.Menu>
      </Menu>
    </>
  )

  return menuBar
}
