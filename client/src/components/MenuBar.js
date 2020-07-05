import React, {useContext, useState} from 'react'
import {Menu} from 'semantic-ui-react'
import {Link} from 'react-router-dom'
import Logo from '../logo-02.png'

import {FirebaseContext} from '../context/auth'
import MobileMenu from './MobileMenu'

import styles from './Menu.module.scss'

export default function MenuBar() {
<<<<<<< HEAD
  const {firebase} = useContext(FirebaseContext)
=======
  const {firebase, currentUser} = useContext(FirebaseContext)
>>>>>>> 688306920d184ef922357f06153120849bf8cace
  const pathname = window.location.pathname

  const path = pathname === '/' ? 'home' : pathname.substr(1)
  const [activeItem, setActiveItem] = useState(path)

  const handleItemClick = (e, {name}) => setActiveItem(name)
  const MENU_BAR_DATA = [
    {name: 'Flow', url: '/flow'},
    {name: 'Account', url: '/account'},
    {name: 'Logout', onClick: firebase.auth.signOut},
  ]

  function performSignout(e) {
    firebase.auth.signOut();
  }

<<<<<<< HEAD
  const menuBar = firebase.user ? (
=======
  const menuBar = currentUser ? (
>>>>>>> 688306920d184ef922357f06153120849bf8cace
    <div>
      <div className={styles.mobile_view}>
        <MobileMenu data={MENU_BAR_DATA} />
      </div>
      <div className={styles.desktop_view}>
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
            <Link className="item" to="historical-flow">
              Historical Flow
            </Link>
            <Link className="item" to="/account">
              Account
            </Link>
            <Menu.Item name="logout" onClick={performSignout} />
          </Menu.Menu>
        </Menu>
      </div>
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
