import React from 'react'

import TwitterCard from './TwitterCard'

import styles from './Community.module.scss'

import {OUR_COMMUNITY, TWITTER_LIST} from './community-data'

export default function Community() {
  return (
    <div className={styles.bg_color}>
      <h2 className={styles.h2}>{OUR_COMMUNITY}</h2>
      <div className={styles.twitter_list}>
        {TWITTER_LIST.map((data, i) => {
          return (
            <TwitterCard
              key={i}
              profileImage={data.image}
              twitterName={data.name}
              tweet={data.tweet}
              twitterHandle={data.twitterHandle}
              tweetId={data.tweetId}
            />
          )
        })}
      </div>
    </div>
  )
}
