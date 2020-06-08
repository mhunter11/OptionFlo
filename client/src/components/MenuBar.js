import React, {useContext, useState} from 'react'
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

  const handleItemClick = (e, {name}) => setActiveItem(name)
  const menuBar = user ? (
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
        <Link className="item" to="/flow">
          Flow
        </Link>
        <Link className="item" to="/account">
          {user.username}
        </Link>
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
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
  )

  return menuBar
}
