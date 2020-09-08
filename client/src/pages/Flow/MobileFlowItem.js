import React from 'react'
import cx from 'classnames'

import styles from './Flow.module.scss'

export default function MobileFlowItem({item, result}) {
  return (
    <div className={styles.mobile_flow_item_container}>
      <div className={styles.flow_item}>{item}</div>
      <div
        className={cx(styles.flow_result, {
          [styles.mobile_ticker_green_color]: result === 'CALL',
          [styles.mobile_ticker_red_color]: result === 'PUT',
        })}
      >
        {result}
      </div>
    </div>
  )
}
