import React from 'react'

import styles from './TwitterCard.module.scss'

import TWITTER_LOGO from '../../images/twitter.svg'

export default function TwitterCard({
  profileImage,
  twitterHandle,
  twitterName,
  tweet,
  tweetId,
}) {
  const tweetLink = `https://twitter.com/${twitterHandle}/status/${tweetId}`
  return (
    <a
      className={styles.twitter_card}
      href={tweetLink}
      target="_blank"
      rel="noopener noreferrer"
    >
      <div className={styles.twitter_profile}>
        <div className={styles.twitter_profile_info}>
          <img className={styles.profile} src={profileImage} alt="" />
          <div>
            <span className={styles.twitter_name}>{twitterName}</span>
            <p className={styles.p}>@{twitterHandle}</p>
          </div>
        </div>
        <img
          className={styles.twitter_logo}
          src={TWITTER_LOGO}
          alt="Twitter Logo"
        />
      </div>
      <p className={styles.tweet}>{tweet}</p>
    </a>
  )
}
