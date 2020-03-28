import React, {useContext, useState} from 'react'
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Logo from '../logo-02.png'

import {AuthContext} from '../context/auth'

import styles from './Menu.module.css'

export default function MenuBar() {
  const {user, logout} = useContext(AuthContext)
  const pathname = window.location.pathname

  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (e, {name}) => setActiveItem(name)

  const menuBar = user ? (
    <Menu pointing secondary size="massive" color="teal">
      <Link to="/">
        <img className={styles.logo} src={Logo} alt="logo" />
      </Link>
      <Menu.Menu position="right">
        <Menu.Item name="Flow" as={Link} to="/flow" />
        <Menu.Item name={user.username} as={Link} to="/account" />
        <Menu.Item name="logout" onClick={logout} />
      </Menu.Menu>
    </Menu>
  ) : (
    <Menu pointing secondary size="massive" color="teal">
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
