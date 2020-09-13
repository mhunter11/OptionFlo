import React, {useState} from 'react'

import styles from './Flow.module.scss'

export default function InputField(props) {
  const {
    onClick,
    onKeyPress,
    onChange,
    searchInput,
    filterButtonClick,
    clearFilter,
    searchTicker,
  } = props
  const SEARCH = 'Search'
  const OPTION_FLOW = 'Option Flow'
  const FILTERS = 'Filters'
  return (
    <div className={styles.input_field_background}>
      <div className={styles.space_between}>
        <div>
          <h5 className={styles.option_flow_h5}>{OPTION_FLOW}</h5>
        </div>
        <div className={styles.desktop_input_button}>
          <div className={styles.filter_section}>
            <button className={styles.filter_button} onClick={filterButtonClick}>{FILTERS}</button>
          </div>
          <input
            className={styles.desktop_input_search}
            type="text"
            value={searchInput}
            onChange={onChange}
            onKeyPress={onKeyPress}
            placeholder="SPY"
          />
          {searchTicker && (
            <button
              className={styles.desktop_close_icon}
              type="reset"
              onClick={clearFilter}
            />
          )}
          <button className={styles.button} onClick={onClick}>
            {SEARCH}
          </button>
        </div>
      </div>
    </div>
  )
}
