import React from 'react'
import {Link} from 'react-router-dom'
import Typed from 'react-typed'

import ImageBackground from './ImageBackground'
import Benefit from './Benefit'
import Affordable from './Affordable'

import {
  TYPING_ANIMATION_ARRAY,
  CANCEL_ANYTIME,
  START_TRIAL,
} from './landingpage-data'

import styles from './LandingPage.module.scss'

export default function LandingPage() {
  return (
    <>
      <ImageBackground />
      <Benefit />
      <Affordable />
    </>
  )
}
